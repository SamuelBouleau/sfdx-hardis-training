/*
 * The runner the runner worlds share: a track high in a sunny Salesforce sky,
 * three coloured lanes, the guinea pig running down it.
 *
 * A world describes its track as data and the runner plays it:
 * - sections: the parts of the track, each with a name (shown as a Path),
 *   a colour, a length, and the obstacles, metadata and power-ups it brings
 * - obstacles: what each kind is called, what beats it (change lane, jump,
 *   duck, jump a gap), a short name for its face and the lab's fix for it
 * - items and powers: what can be picked up
 * - gates(index): what stands at the end of a section, if anything: three
 *   doors (some open, some closed, or a quiz), or a manual stop
 * - script: moments set at a distance, for the bosses and the twists
 *
 * Readability rule: what is drawn in 3D carries a glyph and one to three
 * words. The full error goes in the toast when it is hit, the tip in the
 * "Why?" box, and the doors of a gate are repeated as big chips in the HUD
 * while the gate comes closer, with the question above them.
 *
 * The guinea pig stays at z = 0 and the world comes to it: an object placed at
 * distance `at` is drawn at z = -(at - distance).
 *
 * update() returns what happened as events, and handle() turns the common ones
 * into points, lost attempts and power-up effects. A world calls handle() for
 * the events it does not treat itself.
 */
import { SLDS, rounded, fitText, font, wrapLines, glyph } from "../core/painter.js";

export const LANES = [-2.2, 0, 2.2];

const JUMP_SPEED = 7.5;
const GRAVITY = 22;
const FAST_FALL_SPEED = -12;
const DUCK_TIME = 0.75;
const LANE_SPEED = 14;
const HIT_INVULNERABLE = 2;
// Every runner world goes this much slower than its sections say: they are
// there to teach, a player who is not a gamer must finish them
const EASY_SPEED = 0.85;
const QUICK_BOOST = 1.35;
const INPUT_BUFFER_S = 0.15;
const SEGMENT_LENGTH = 20;
const STOP_DISTANCE = 3.5;
// How far ahead a gate shows its doors in the HUD, and an obstacle is taught
const GATE_PANEL_AT = 60;
const TEACH_AT = 30;
const STREAK_STEP = 10;

const THEMES = {
  error: { color: SLDS.error, dark: 0xba0517, glyph: "error" },
  warning: { color: SLDS.warningDark, dark: 0xb35c00, glyph: "warning" },
  lock: { color: "#5867E8", dark: 0x3a49da, glyph: "lock" },
  info: { color: SLDS.brand, dark: 0x014486, glyph: "gear" },
  purple: { color: SLDS.purple, dark: 0x7526e3, glyph: "bolt" }
};
// The doors of a quiz, one colour per lane, the same in 3D and in the HUD
const DOOR_COLORS = ["#0176D3", "#9050E9", "#06A59A"];
const HAPPY = [0xffb400, 0x1b96ff, 0x2e844a, 0xe3066a, 0x9050e9, 0xff5d2d, 0x06a59a];
const MOVE_COLORS = { jump: "#2E844A", gap: "#2E844A", duck: "#DD7A01", lane: "#EA001E" };

/** The runner's own words, merged into the TEXTS of each runner world. */
export const RUNNER_TEXTS = {
  en: {
    r_teach_jump: "Jump over it: Up arrow or Space!",
    r_teach_jump_touch: "Jump over it: swipe up!",
    r_teach_duck: "Duck under it: Down arrow!",
    r_teach_duck_touch: "Duck under it: swipe down!",
    r_teach_lane: "It blocks the lane: move with Left and Right!",
    r_teach_lane_touch: "It blocks the lane: swipe left or right!",
    r_teach_gap: "A hole in the track: jump!",
    r_teach_gap_touch: "A hole in the track: swipe up!",
    r_teach_door: "Steer into the lane of your answer!",
    r_right: "Right door!",
    r_streak: "{{n}} in a row!",
    r_youHere: "you"
  },
  fr: {
    r_teach_jump: "Sautez par-dessus : flèche Haut ou Espace !",
    r_teach_jump_touch: "Sautez par-dessus : swipe vers le haut !",
    r_teach_duck: "Baissez-vous : flèche Bas !",
    r_teach_duck_touch: "Baissez-vous : swipe vers le bas !",
    r_teach_lane: "Il bloque la voie : changez avec Gauche et Droite !",
    r_teach_lane_touch: "Il bloque la voie : swipe à gauche ou à droite !",
    r_teach_gap: "Un trou dans la piste : sautez !",
    r_teach_gap_touch: "Un trou dans la piste : swipe vers le haut !",
    r_teach_door: "Prenez la voie de votre réponse !",
    r_right: "Bonne porte !",
    r_streak: "{{n}} d'affilée !",
    r_youHere: "vous"
  }
};

/**
 * config: { sections, obstacles, items, powers, gates(index), script, speed,
 * spacing, firstRowAt }. See the header of this file.
 */
export function createRunner(ctx, config) {
  const { THREE, root, pig, paint, t, random } = ctx;
  const engine = ctx.engine;
  const camera = ctx.camera;
  const sections = config.sections;
  let total = sections.reduce((sum, s) => sum + s.length, 0);
  const starts = [];
  sections.reduce((sum, s, i) => {
    starts[i] = sum;
    return sum + s.length;
  }, 0);
  const sectionColors = sections.map((s) => new THREE.Color(s.color));
  const speedConfig = Object.assign({ start: 9, step: 1.6, ramp: 1.4 }, config.speed);
  const spacing = (config.spacing || [10, 17]).map((gap) => gap + 2);
  const touch = Boolean(ctx.hud.touch);

  let distance = Math.max(0, Math.min(ctx.params.startAt || 0, total - 30));
  let sectionIndex = sectionAt(distance);
  let nextRowAt = Math.max(distance + (config.firstRowAt || 30), 0);
  let gatesSpawned = sectionIndex;
  let noObstacleUntil = 0;
  let objects = [];
  let scriptIndex = 0;
  let fog = false;
  let stopped = null;
  // Inputs are stamped with the game clock, not the frame clock: a slow frame
  // must not age a key press out of the buffer before the next update sees it
  let clock = 0;
  let ended = false;
  let shake = 0;
  let speedFactor = 1;
  let coachUntil = -10;
  let streak = 0;
  const taught = new Set();
  const script = (config.script || []).slice().sort((a, b) => a.at - b.at);
  while (scriptIndex < script.length && script[scriptIndex].at < distance) {
    scriptIndex += 1;
  }

  const player = { lane: 1, x: 0, y: 0, vy: 0, duck: 0, invulnerable: 0, quick: 0, hit: 0, buffer: [] };
  // Materials the runner makes itself (the painter frees its own)
  const own = [];

  /* ---------- Scenery ---------- */

  const scenery = buildScenery();

  function buildScenery() {
    // Three pastel lanes with white dashes and soft chevrons pointing ahead
    const trackTexture = paint.texture("track-lanes", 256, 128, (c, w, h) => {
      const lanes = ["#8ECBFF", "#94E6B4", "#FFB3D1"];
      for (let i = 0; i < 3; i++) {
        c.fillStyle = lanes[i];
        c.fillRect((i * w) / 3, 0, w / 3 + 1, h);
      }
      c.fillStyle = "rgba(255,255,255,0.75)";
      for (let i = 0; i < 3; i++) {
        const x = ((i + 0.5) * w) / 3;
        c.beginPath();
        c.moveTo(x - 18, 84);
        c.lineTo(x, 66);
        c.lineTo(x + 18, 84);
        c.lineTo(x + 18, 96);
        c.lineTo(x, 78);
        c.lineTo(x - 18, 96);
        c.closePath();
        c.fill();
      }
      c.fillStyle = SLDS.white;
      for (const x of [w / 3, (2 * w) / 3]) {
        c.fillRect(x - 3, 0, 6, h / 2);
      }
      c.fillRect(0, 0, 6, h);
      c.fillRect(w - 6, 0, 6, h);
    });
    trackTexture.wrapS = THREE.RepeatWrapping;
    trackTexture.wrapT = THREE.RepeatWrapping;
    trackTexture.repeat.set(1, 4);
    const top = paint.plain(0xffffff, { map: trackTexture, roughness: 0.8 });
    const edge = new THREE.MeshStandardMaterial({ color: sections[0].color, roughness: 0.5 });
    const under = paint.plain(0xffe9c7, { roughness: 0.9 });
    const slabGeometry = paint.geometry("slab", () => new THREE.BoxGeometry(6.6, 0.4, SEGMENT_LENGTH));
    const segments = [];
    for (let i = 0; i < Math.ceil(140 / SEGMENT_LENGTH) + 1; i++) {
      const slab = new THREE.Mesh(slabGeometry, [edge, edge, top, under, edge, edge]);
      slab.position.y = -0.2;
      slab.receiveShadow = true;
      root.add(slab);
      segments.push(slab);
    }
    // The two branch lines along the track, and a commit every ten metres
    const rail = new THREE.MeshStandardMaterial({ color: sections[0].color, roughness: 0.4 });
    const railGeometry = paint.geometry("rail", () => new THREE.CylinderGeometry(0.07, 0.07, 200, 8));
    for (const side of [-1, 1]) {
      const line = new THREE.Mesh(railGeometry, rail);
      line.rotation.x = Math.PI / 2;
      line.position.set(side * 3.55, 0.12, -60);
      root.add(line);
    }
    const nodeMaterial = new THREE.MeshStandardMaterial({ color: sections[0].color, roughness: 0.3 });
    const nodes = new THREE.InstancedMesh(
      paint.geometry("node", () => new THREE.SphereGeometry(0.2, 12, 8)),
      nodeMaterial,
      32
    );
    root.add(nodes);
    // A pennant on a white pole at every commit: one mesh for all the poles,
    // one for all the flags
    const poles = new THREE.InstancedMesh(
      paint.geometry("pole", () => new THREE.CylinderGeometry(0.035, 0.035, 1.3, 6).translate(0, 0.65, 0)),
      paint.plain(0xffffff, { roughness: 0.5 }),
      32
    );
    root.add(poles);
    const flagMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, side: THREE.DoubleSide });
    const flags = new THREE.InstancedMesh(
      paint.geometry("pennant", () => {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(0.55, -0.17);
        shape.lineTo(0, -0.36);
        shape.closePath();
        return new THREE.ShapeGeometry(shape);
      }),
      flagMaterial,
      32
    );
    const color = new THREE.Color();
    for (let i = 0; i < 32; i++) {
      flags.setColorAt(i, color.setHex(HAPPY[i % HAPPY.length]));
    }
    root.add(flags);

    // A seeded random, so the sky is the same on every attempt
    const sceneRandom = (() => {
      let s = 7;
      return () => {
        s = (s * 16807) % 2147483647;
        return s / 2147483647;
      };
    })();
    // Clouds all around and below: one mesh for every puff
    const puffs = [];
    for (let i = 0; i < 18; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const below = i % 3 === 0;
      const cx = side * (below ? 4 + sceneRandom() * 10 : 9 + sceneRandom() * 22);
      const cy = below ? -7 - sceneRandom() * 6 : -3 + sceneRandom() * 9;
      const offset = (i / 18) * 220;
      const count = 5 + Math.floor(sceneRandom() * 3);
      for (let p = 0; p < count; p++) {
        const r = 1.2 + sceneRandom() * 1.6;
        puffs.push({ x: cx + (p - count / 2) * 1.4 + sceneRandom(), y: cy + sceneRandom() * 0.8, dz: (sceneRandom() - 0.5) * 2, offset, sx: r * 1.3, sy: r * 0.8, sz: r });
      }
    }
    const clouds = new THREE.InstancedMesh(
      paint.geometry("cloud", () => new THREE.SphereGeometry(1, 14, 10)),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 }),
      puffs.length
    );
    root.add(clouds);
    // Floating islands with a lawn and round trees, far on both sides
    const islands = [];
    for (let i = 0; i < 10; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      islands.push({ x: side * (13 + sceneRandom() * 14), y: -3 + sceneRandom() * 5, offset: (i / 10) * 240, s: 1.6 + sceneRandom() * 1.8 });
    }
    const rocks = new THREE.InstancedMesh(
      paint.geometry("island-rock", () => new THREE.ConeGeometry(1, 1.6, 7).rotateX(Math.PI).translate(0, -0.8, 0)),
      paint.plain(0xd99a6c, { roughness: 0.9, flatShading: true }),
      islands.length
    );
    const lawns = new THREE.InstancedMesh(
      paint.geometry("island-lawn", () => new THREE.CylinderGeometry(1.08, 1.0, 0.3, 10).translate(0, 0.12, 0)),
      paint.plain(0x7ed957, { roughness: 0.8 }),
      islands.length
    );
    const treeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7, flatShading: true });
    const trees = new THREE.InstancedMesh(
      paint.geometry("island-tree", () => new THREE.IcosahedronGeometry(0.42, 0).translate(0, 0.62, 0)),
      treeMaterial,
      islands.length * 2
    );
    const treeColors = [0x2e844a, 0x06a59a, 0xff7eb6, 0xffb400, 0x45c65a];
    for (let i = 0; i < islands.length * 2; i++) {
      trees.setColorAt(i, color.setHex(treeColors[i % treeColors.length]));
    }
    root.add(rocks, lawns, trees);
    // Balloons drifting up beside the track
    const balloonList = [];
    for (let i = 0; i < 14; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      balloonList.push({ x: side * (8 + sceneRandom() * 5), y: 2.5 + sceneRandom() * 5, offset: (i / 14) * 160, phase: sceneRandom() * 6 });
    }
    const balloonMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.05 });
    const balloons = new THREE.InstancedMesh(
      paint.geometry("balloon", () => new THREE.SphereGeometry(0.45, 14, 10).scale(1, 1.18, 1)),
      balloonMaterial,
      balloonList.length
    );
    for (let i = 0; i < balloonList.length; i++) {
      balloons.setColorAt(i, color.setHex(HAPPY[(i * 3) % HAPPY.length]));
    }
    root.add(balloons);
    const instanced = [nodes, poles, flags, clouds, rocks, lawns, trees, balloons];
    return {
      segments,
      edge,
      rail,
      nodes,
      poles,
      flags,
      clouds,
      puffs,
      islands,
      rocks,
      lawns,
      trees,
      balloons,
      balloonList,
      instanced,
      disposables: [edge, rail, nodeMaterial, flagMaterial, clouds.material, treeMaterial, balloonMaterial]
    };
  }

  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const identity = new THREE.Quaternion();
  const euler = new THREE.Euler();
  const scale = new THREE.Vector3();
  const position = new THREE.Vector3();

  function placeScenery(time) {
    const offset = distance % SEGMENT_LENGTH;
    scenery.segments.forEach((slab, i) => {
      slab.position.z = 10 - i * SEGMENT_LENGTH + offset;
    });
    const loop = 160;
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 2; j++) {
        const side = j === 0 ? -1 : 1;
        const z = 10 - ((i * 10 + loop - (distance % loop)) % loop);
        const n = i * 2 + j;
        matrix.makeTranslation(side * 3.55, 0.12, z);
        scenery.nodes.setMatrixAt(n, matrix);
        matrix.makeTranslation(side * 3.55, 0.2, z);
        scenery.poles.setMatrixAt(n, matrix);
        // The flags point out of the track and flap a little
        euler.set(0, (side < 0 ? Math.PI : 0) + Math.sin(time * 5 + n) * 0.35, 0);
        quaternion.setFromEuler(euler);
        position.set(side * 3.55, 1.5, z);
        scale.set(1, 1, 1);
        matrix.compose(position, quaternion, scale);
        scenery.flags.setMatrixAt(n, matrix);
      }
    }
    scenery.nodes.instanceMatrix.needsUpdate = true;
    scenery.poles.instanceMatrix.needsUpdate = true;
    scenery.flags.instanceMatrix.needsUpdate = true;
    scenery.puffs.forEach((p, i) => {
      const z = 30 - ((p.offset + 220 - ((distance * 0.6) % 220)) % 220) + p.dz;
      position.set(p.x, p.y, z);
      scale.set(p.sx, p.sy, p.sz);
      matrix.compose(position, identity, scale);
      scenery.clouds.setMatrixAt(i, matrix);
    });
    scenery.clouds.instanceMatrix.needsUpdate = true;
    scenery.islands.forEach((island, i) => {
      const z = -4 - ((island.offset + 240 - ((distance * 0.5) % 240)) % 240);
      const bob = Math.sin(time * 0.8 + i) * 0.25;
      position.set(island.x, island.y + bob, z);
      scale.set(island.s, island.s, island.s);
      matrix.compose(position, identity, scale);
      scenery.rocks.setMatrixAt(i, matrix);
      scenery.lawns.setMatrixAt(i, matrix);
      for (let k = 0; k < 2; k++) {
        position.set(island.x + (k === 0 ? -0.35 : 0.4) * island.s, island.y + bob + 0.1 * island.s, z + (k === 0 ? 0.2 : -0.3) * island.s);
        const s = island.s * (k === 0 ? 1 : 0.75);
        scale.set(s, s, s);
        matrix.compose(position, identity, scale);
        scenery.trees.setMatrixAt(i * 2 + k, matrix);
      }
    });
    scenery.rocks.instanceMatrix.needsUpdate = true;
    scenery.lawns.instanceMatrix.needsUpdate = true;
    scenery.trees.instanceMatrix.needsUpdate = true;
    scenery.balloonList.forEach((b, i) => {
      const z = 10 - ((b.offset + 160 - (distance % 160)) % 160);
      position.set(b.x + Math.sin(time * 0.7 + b.phase) * 0.3, b.y + Math.sin(time * 1.3 + b.phase) * 0.35, z);
      scale.set(1, 1, 1);
      matrix.compose(position, identity, scale);
      scenery.balloons.setMatrixAt(i, matrix);
    });
    scenery.balloons.instanceMatrix.needsUpdate = true;
    const target = sectionColors[sectionIndex];
    scenery.edge.color.lerp(target, 0.05);
    scenery.rail.color.lerp(target, 0.05);
    scenery.nodes.material.color.lerp(target, 0.05);
  }

  /* ---------- Objects of the track ---------- */

  const shapes = {
    wall: paint.geometry("r-wall", () => new THREE.BoxGeometry(1.9, 1.6, 0.4)),
    wallFace: paint.geometry("r-wall-face", () => new THREE.PlaneGeometry(1.8, 1.5)),
    low: paint.geometry("r-low", () => new THREE.BoxGeometry(1.9, 0.55, 0.3)),
    lowFace: paint.geometry("r-low-face", () => new THREE.PlaneGeometry(1.84, 0.5)),
    bar: paint.geometry("r-bar", () => new THREE.BoxGeometry(2.05, 0.5, 0.14)),
    barFace: paint.geometry("r-bar-face", () => new THREE.PlaneGeometry(2.0, 0.46)),
    post: paint.geometry("post", () => new THREE.BoxGeometry(0.12, 1.3, 0.12)),
    hole: paint.geometry("hole", () => new THREE.BoxGeometry(1.75, 0.06, 2.2)),
    stripe: paint.geometry("stripe", () => new THREE.BoxGeometry(1.95, 0.06, 0.18)),
    // A thin box: its sides in one material, its two faces in the other
    tile: paint.geometry("r-tile", () => twoSided(new THREE.BoxGeometry(0.7, 0.7, 0.12))),
    bigTile: paint.geometry("r-tile-big", () => twoSided(new THREE.BoxGeometry(0.92, 0.92, 0.14))),
    halo: paint.geometry("r-halo", () => new THREE.TorusGeometry(0.66, 0.05, 8, 32)),
    coin: paint.geometry("coin", () => new THREE.CylinderGeometry(0.44, 0.44, 0.09, 36)),
    ring: paint.geometry("ring", () => new THREE.TorusGeometry(0.5, 0.035, 8, 36)),
    door: paint.geometry("r-door", () => new THREE.BoxGeometry(1.95, 2.5, 0.12)),
    doorFace: paint.geometry("r-door-face", () => new THREE.PlaneGeometry(1.85, 2.4)),
    gatePost: paint.geometry("gate-post", () => new THREE.BoxGeometry(0.26, 3.3, 0.3)),
    ball: paint.geometry("gate-ball", () => new THREE.SphereGeometry(0.26, 12, 8)),
    lintel: paint.geometry("lintel", () => new THREE.BoxGeometry(7.1, 0.34, 0.34)),
    banner: paint.geometry("banner", () => new THREE.PlaneGeometry(6.8, 0.85)),
    plaque: paint.geometry("plaque", () => new THREE.PlaneGeometry(1.9, 0.92)),
    arrow: paint.geometry("arrow", () => new THREE.PlaneGeometry(1.4, 2.6)),
    billboard: paint.geometry("billboard", () => new THREE.PlaneGeometry(3.2, 0.9))
  };
  const white = paint.plain(0xffffff, { roughness: 0.5 });
  const postMaterial = paint.plain(0xffffff, { roughness: 0.5 });
  const gateYellow = paint.plain(0xffb400, { roughness: 0.45 });
  const brand = paint.plain(0x0176d3, { roughness: 0.45 });
  const holeMaterial = paint.plain(0x0a1a33, { roughness: 1 });
  const stripes = paint.material("stripes", 256, 32, (c, w, h) => {
    c.fillStyle = SLDS.warning;
    c.fillRect(0, 0, w, h);
    c.fillStyle = SLDS.navy;
    for (let x = -h; x < w; x += 32) {
      c.beginPath();
      c.moveTo(x, h);
      c.lineTo(x + 16, h);
      c.lineTo(x + 16 + h, 0);
      c.lineTo(x + h, 0);
      c.fill();
    }
  });
  const arrowMaterial = paint.material(
    "arrow",
    128,
    256,
    (c, w) => {
      c.fillStyle = "rgba(46, 132, 74, 0.85)";
      for (let i = 0; i < 3; i++) {
        const y = 30 + i * 80;
        c.beginPath();
        c.moveTo(w / 2, y);
        c.lineTo(w - 12, y + 50);
        c.lineTo(w - 40, y + 50);
        c.lineTo(w / 2, y + 22);
        c.lineTo(40, y + 50);
        c.lineTo(12, y + 50);
        c.closePath();
        c.fill();
      }
    },
    { transparent: true, depthWrite: false }
  );

  /** A BoxGeometry drawn in two groups: the four sides (0), front and back (1). */
  function twoSided(geometry) {
    geometry.clearGroups();
    geometry.addGroup(0, 24, 0);
    geometry.addGroup(24, 12, 1);
    return geometry;
  }

  /** An unlit picture, so a face reads the same in any light: crisp text. */
  function flat(name, width, height, draw, extra) {
    const key = "flat:" + name;
    let found = own.find((m) => m.userData.key === key);
    if (!found) {
      found = new THREE.MeshBasicMaterial(Object.assign({ map: paint.texture(key, width, height, draw), toneMapped: false }, extra));
      found.userData.key = key;
      own.push(found);
    }
    return found;
  }

  /** The round badge over an obstacle that says what beats it: an arrow, no words. */
  function badge(move) {
    const key = "badge:" + move;
    let found = own.find((m) => m.userData.key === key);
    if (!found) {
      const map = paint.texture(key, 128, 128, (c, w, h) => {
        c.beginPath();
        c.arc(w / 2, h / 2, w / 2 - 6, 0, Math.PI * 2);
        c.fillStyle = MOVE_COLORS[move] || SLDS.brand;
        c.fill();
        c.lineWidth = 8;
        c.strokeStyle = SLDS.white;
        c.stroke();
        c.fillStyle = SLDS.white;
        c.save();
        c.translate(w / 2, h / 2);
        if (move === "lane") {
          // Left and right: change lane
          for (const side of [-1, 1]) {
            c.beginPath();
            c.moveTo(side * 40, 0);
            c.lineTo(side * 14, -22);
            c.lineTo(side * 14, 22);
            c.closePath();
            c.fill();
          }
          c.fillRect(-16, -7, 32, 14);
        } else {
          if (move === "duck") {
            c.rotate(Math.PI);
          }
          c.beginPath();
          c.moveTo(0, -40);
          c.lineTo(30, -6);
          c.lineTo(11, -6);
          c.lineTo(11, 36);
          c.lineTo(-11, 36);
          c.lineTo(-11, -6);
          c.lineTo(-30, -6);
          c.closePath();
          c.fill();
        }
        c.restore();
      });
      found = new THREE.SpriteMaterial({ map, transparent: true, depthWrite: false, toneMapped: false });
      found.userData.key = key;
      own.push(found);
    }
    const sprite = new THREE.Sprite(found);
    sprite.scale.set(0.62, 0.62, 1);
    sprite.renderOrder = 2;
    return sprite;
  }

  /** The face of an obstacle: its colour, a glyph and one to three big words. */
  function obstacleFace(kind, theme, text, shape) {
    const sizes = { wall: [512, 428], low: [512, 140], bar: [512, 118] };
    const [W, H] = sizes[shape];
    return flat("face:" + shape + kind + text, W, H, (c, w, h) => {
      rounded(c, 3, 3, w - 6, h - 6, Math.min(36, h / 4));
      c.fillStyle = theme.color;
      c.fill();
      c.lineWidth = 10;
      c.strokeStyle = SLDS.white;
      c.stroke();
      c.fillStyle = SLDS.white;
      c.textBaseline = "middle";
      if (shape === "wall") {
        c.beginPath();
        c.arc(w / 2, 118, 78, 0, Math.PI * 2);
        c.fill();
        glyph(c, theme.glyph, w / 2, 118, 96, theme.color);
        c.fillStyle = SLDS.white;
        c.textAlign = "center";
        font(c, 76, "800");
        const lines = wrapLines(c, text, w - 60).slice(0, 2);
        lines.forEach((line, i) => fitText(c, line, w / 2, (lines.length === 1 ? 300 : 262) + i * 82, w - 50, 76, "800"));
      } else {
        const r = h * 0.34;
        c.beginPath();
        c.arc(h * 0.5, h / 2, r, 0, Math.PI * 2);
        c.fill();
        glyph(c, theme.glyph, h * 0.5, h / 2, r * 1.25, theme.color);
        c.fillStyle = SLDS.white;
        c.textAlign = "center";
        const left = h * 0.95;
        fitText(c, text, left + (w - left - 16) / 2, h / 2 + 3, w - left - 24, h * 0.6, "800");
      }
    });
  }

  function shadows(group) {
    if (engine.settings.shadows) {
      group.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
    }
    return group;
  }

  /** The words on an obstacle: its short name, never the whole error. */
  function shortText(def) {
    if (def.short) {
      return t(def.short);
    }
    return def.detail || t(def.title);
  }

  function obstacleMesh(kind) {
    const def = config.obstacles[kind];
    const theme = THEMES[def.theme || "error"];
    const text = shortText(def);
    const body = paint.plain(theme.dark, { roughness: 0.45 });
    const group = new THREE.Group();
    switch (def.move) {
      case "jump": {
        const block = new THREE.Mesh(shapes.low, body);
        block.position.y = 0.28;
        const face = new THREE.Mesh(shapes.lowFace, obstacleFace(kind, theme, text, "low"));
        face.position.set(0, 0.28, 0.152);
        const hint = badge("jump");
        hint.position.y = 0.98;
        group.add(block, face, hint);
        break;
      }
      case "duck": {
        const bar = new THREE.Mesh(shapes.bar, body);
        bar.position.y = 1.0;
        const face = new THREE.Mesh(shapes.barFace, obstacleFace(kind, theme, text, "bar"));
        face.position.set(0, 1.0, 0.072);
        group.add(bar, face);
        for (const x of [-0.98, 0.98]) {
          const post = new THREE.Mesh(shapes.post, postMaterial);
          post.position.set(x, 0.6, 0);
          group.add(post);
        }
        const hint = badge("duck");
        hint.position.y = 1.62;
        group.add(hint);
        break;
      }
      case "gap": {
        const hole = new THREE.Mesh(shapes.hole, holeMaterial);
        hole.position.y = 0.01;
        group.add(hole);
        for (const z of [-1.1, 1.1]) {
          const edge = new THREE.Mesh(shapes.stripe, stripes);
          edge.position.set(0, 0.04, z);
          group.add(edge);
        }
        const sign = paint.sign("gap", text, { color: theme.color, glyph: theme.glyph, height: 0.42 });
        sign.position.set(0, 1.45, 0);
        const hint = badge("gap");
        hint.position.set(0, 0.75, 0);
        group.add(sign, hint);
        break;
      }
      default: {
        const block = new THREE.Mesh(shapes.wall, body);
        block.position.y = 0.82;
        const face = new THREE.Mesh(shapes.wallFace, obstacleFace(kind, theme, text, "wall"));
        face.position.set(0, 0.82, 0.202);
        const hint = badge("lane");
        hint.position.y = 2.02;
        group.add(block, face, hint);
      }
    }
    return shadows(group);
  }

  function itemMesh(kind, withLabel) {
    const def = config.items[kind];
    const group = new THREE.Group();
    const side = paint.plain(new THREE.Color(def.color).getHex(), { roughness: 0.35, emissive: new THREE.Color(def.color).getHex(), emissiveIntensity: 0.25 });
    const face = paint.tile(kind, def.color, def.glyph);
    const tile = new THREE.Mesh(def.big ? shapes.bigTile : shapes.tile, [side, face]);
    tile.castShadow = engine.settings.shadows;
    group.add(tile);
    if (def.big) {
      const halo = new THREE.Mesh(shapes.halo, paint.plain(0xffd84d, { emissive: 0xffb400, emissiveIntensity: 0.9 }));
      group.add(halo);
    }
    if (def.label && withLabel !== false) {
      const sign = paint.sign("item", def.label, { color: def.color, height: def.big ? 0.5 : 0.36, glyph: def.signGlyph || null });
      sign.position.y = def.big ? 0.95 : 0.7;
      group.add(sign);
    }
    return group;
  }

  function powerMesh(kind) {
    const def = config.powers[kind];
    const group = new THREE.Group();
    const face = paint.coin(kind, def.color, def.glyph, "");
    const disc = new THREE.Mesh(shapes.coin, [paint.plain(0xffb020, { metalness: 0.6, roughness: 0.3, emissive: 0x3a2400 }), face, face]);
    disc.rotation.x = Math.PI / 2;
    const ring = new THREE.Mesh(shapes.ring, paint.plain(new THREE.Color(def.color).getHex(), { emissive: new THREE.Color(def.color).getHex(), emissiveIntensity: 0.8 }));
    // The coin and its ring turn together; the sign stays still
    const spin = new THREE.Group();
    spin.add(disc, ring);
    group.add(spin);
    const label = def.short ? t(def.short) : def.label;
    if (label) {
      const sign = paint.sign("power", label, { color: def.color, glyph: "star", height: 0.42 });
      sign.position.y = 0.85;
      group.add(sign);
    }
    return shadows(group);
  }

  /** The face of a door: a colour, a glyph and its short answer, in big letters. */
  function doorFace(text, color, icon) {
    return flat("door:" + color + icon + text, 384, 498, (c, w, h) => {
      rounded(c, 4, 4, w - 8, h - 8, 34);
      c.fillStyle = color;
      c.fill();
      c.lineWidth = 12;
      c.strokeStyle = SLDS.white;
      c.stroke();
      c.fillStyle = SLDS.white;
      c.beginPath();
      c.arc(w / 2, 96, 58, 0, Math.PI * 2);
      c.fill();
      glyph(c, icon, w / 2, 96, 72, color);
      c.fillStyle = SLDS.white;
      c.textAlign = "center";
      c.textBaseline = "middle";
      font(c, 66, "800");
      const lines = wrapLines(c, text, w - 44).slice(0, 4);
      const lineHeight = 72;
      const top = 300 - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((line, i) => fitText(c, line, w / 2, top + i * lineHeight, w - 36, 66, "800"));
    });
  }

  function doorLook(door) {
    return door.look || (door.ok ? "open" : "closed");
  }

  function doorColor(door, lane) {
    const look = doorLook(door);
    if (look === "open") {
      return SLDS.success;
    }
    if (look === "quiz") {
      return DOOR_COLORS[lane];
    }
    return look === "trap" ? SLDS.purple : SLDS.error;
  }

  /** A gate: three doors, two yellow posts, a banner, the Cloudity plaque. spec.doors[lane] = { text, short, ok, look } */
  function gateMesh(spec) {
    const group = new THREE.Group();
    const panels = [];
    spec.doors.forEach((door, lane) => {
      const x = LANES[lane];
      const look = doorLook(door);
      const words = door.short || door.text;
      if (look === "open") {
        const sign = paint.sign("door-open", words, { color: SLDS.success, glyph: "check", height: 0.55 });
        sign.position.set(x, 2.55, 0.1);
        group.add(sign);
        const arrow = new THREE.Mesh(shapes.arrow, arrowMaterial);
        arrow.rotation.x = -Math.PI / 2;
        arrow.position.set(x, 0.02, 3);
        group.add(arrow);
        panels.push(null);
      } else {
        const icon = look === "quiz" ? "branch" : look === "trap" ? "loop" : "error";
        const panel = new THREE.Group();
        const slab = new THREE.Mesh(shapes.door, white);
        const face = new THREE.Mesh(shapes.doorFace, doorFace(words, doorColor(door, lane), icon));
        face.position.z = 0.065;
        panel.add(slab, face);
        panel.position.set(x, 1.25, 0);
        group.add(panel);
        panels.push(panel);
      }
    });
    for (const x of [-3.35, -1.1, 1.1, 3.35]) {
      const post = new THREE.Mesh(shapes.gatePost, x === -3.35 || x === 3.35 ? gateYellow : white);
      post.position.set(x, 1.65, 0);
      group.add(post);
      if (x === -3.35 || x === 3.35) {
        const ball = new THREE.Mesh(shapes.ball, brand);
        ball.position.set(x, 3.55, 0);
        group.add(ball);
      }
    }
    const lintel = new THREE.Mesh(shapes.lintel, brand);
    lintel.position.set(0, 3.4, 0);
    group.add(lintel);
    const bannerText = spec.sign || null;
    if (Array.isArray(spec.banner)) {
      const banner = new THREE.Mesh(shapes.banner, paint.path("gate", spec.banner, spec.bannerIndex || 0));
      banner.position.set(0, 4.05, 0);
      group.add(banner);
    } else if (bannerText) {
      const banner = new THREE.Mesh(shapes.banner, paint.label("banner", bannerText, { width: 1024, height: 128, size: 72, bg: SLDS.navy, fg: SLDS.white }));
      banner.position.set(0, 4.05, 0);
      group.add(banner);
    }
    const logo = new THREE.Mesh(shapes.plaque, paint.plaque());
    logo.position.set(0, bannerText || Array.isArray(spec.banner) ? 5.05 : 4.2, 0);
    group.add(logo);
    group.userData.panels = panels;
    return shadows(group);
  }

  /** A manual stop: a big sign across the track, waiting for "Mark as done". */
  function stopMesh(spec) {
    const group = new THREE.Group();
    for (const x of [-3.35, 3.35]) {
      const post = new THREE.Mesh(shapes.gatePost, gateYellow);
      post.position.set(x, 1.65, 0);
      group.add(post);
    }
    const board = new THREE.Mesh(
      paint.geometry("stop-board", () => new THREE.PlaneGeometry(6.4, 2.2)),
      flat(
        "stop:" + spec.title + spec.button,
        1024,
        352,
        (c, w, h) => {
          rounded(c, 4, 4, w - 8, h - 8, 30);
          c.fillStyle = SLDS.white;
          c.fill();
          rounded(c, 4, 4, w - 8, 100, 30);
          c.fillStyle = SLDS.warningDark;
          c.fill();
          c.fillRect(4, 60, w - 8, 44);
          c.lineWidth = 8;
          c.strokeStyle = SLDS.warningDark;
          rounded(c, 4, 4, w - 8, h - 8, 30);
          c.stroke();
          glyph(c, "warning", 70, 54, 62, SLDS.white);
          c.fillStyle = SLDS.white;
          c.textAlign = "left";
          c.textBaseline = "middle";
          fitText(c, spec.header, 120, 56, w - 150, 54, "800");
          c.fillStyle = SLDS.navy;
          c.textAlign = "center";
          fitText(c, spec.title, w / 2, 170, w - 60, 56, "800");
          rounded(c, w / 2 - 250, 232, 500, 92, 46);
          c.fillStyle = SLDS.brand;
          c.fill();
          c.fillStyle = SLDS.white;
          fitText(c, spec.button, w / 2, 280, 460, 50, "800");
        },
        { side: THREE.DoubleSide }
      )
    );
    board.position.set(0, 2.0, 0);
    group.add(board);
    return shadows(group);
  }

  /** A sign by the side of the track, never in the way. */
  function signMesh(text, look) {
    const group = new THREE.Group();
    const style = look === "log" ? { bg: SLDS.navy, fg: "#7CFC9A", mono: true, size: 40 } : look === "warning" ? { bg: SLDS.warningDark, fg: SLDS.white, size: 46 } : { bg: SLDS.white, fg: SLDS.navy, size: 46 };
    const board = new THREE.Mesh(shapes.billboard, paint.label("side", text, Object.assign({ width: 1024, height: 288 }, style)));
    board.position.y = 1.8;
    group.add(board);
    const post = new THREE.Mesh(shapes.post, postMaterial);
    post.scale.y = 1.1;
    post.position.y = 0.7;
    group.add(post);
    return group;
  }

  function add(object) {
    object.mesh.position.x = object.x;
    object.mesh.position.z = -(object.at - distance);
    root.add(object.mesh);
    objects.push(object);
    return object;
  }

  /* ---------- The doors in the HUD ---------- */

  // While a gate comes closer, its question and its three answers are shown
  // as big chips, one per lane, in the colour of their door
  let doorsPanel = null;
  let doorsGate = null;
  let doorsLane = -1;

  function showDoors(gate) {
    if (!doorsPanel) {
      doorsPanel = document.createElement("div");
      doorsPanel.className = "gr-run-doors";
      ctx.hud.layer.appendChild(doorsPanel);
    }
    doorsPanel.textContent = "";
    // An older spec gives its question as a text banner
    const question = gate.spec.question || (typeof gate.spec.banner === "string" ? gate.spec.banner : "");
    if (question) {
      const q = document.createElement("div");
      q.className = "gr-run-q";
      q.textContent = question;
      doorsPanel.appendChild(q);
    }
    const row = document.createElement("div");
    row.className = "gr-run-row";
    gate.spec.doors.forEach((door, lane) => {
      const chip = document.createElement("div");
      chip.className = "gr-run-door";
      chip.style.setProperty("--door", doorColor(door, lane));
      const strong = document.createElement("b");
      strong.textContent = door.short || door.text;
      chip.appendChild(strong);
      if (door.short && door.text && door.short !== door.text) {
        const span = document.createElement("span");
        span.textContent = door.text;
        chip.appendChild(span);
      }
      row.appendChild(chip);
    });
    doorsPanel.appendChild(row);
    doorsPanel.hidden = false;
    doorsGate = gate;
    doorsLane = -1;
  }

  function hideDoors() {
    if (doorsPanel) {
      doorsPanel.hidden = true;
    }
    doorsGate = null;
  }

  function markDoorLane() {
    if (!doorsGate || !doorsPanel) {
      return;
    }
    const lane = nearestLane();
    if (lane === doorsLane) {
      return;
    }
    doorsLane = lane;
    const chips = doorsPanel.querySelectorAll(".gr-run-door");
    chips.forEach((chip, i) => chip.classList.toggle("is-here", i === lane));
  }

  const runner = {
    LANES,
    get distance() {
      return distance;
    },
    get total() {
      return total;
    },
    get sectionIndex() {
      return sectionIndex;
    },
    get lane() {
      return player.lane;
    },
    get speed() {
      return currentSpeed();
    },
    get stopped() {
      return Boolean(stopped);
    },
    player,

    spawnObstacle(kind, lane, at) {
      const def = config.obstacles[kind];
      const object = add({ type: "obstacle", kind, def, lane, x: LANES[lane], at, mesh: obstacleMesh(kind), depth: def.move === "gap" ? 2.2 : 0.6 });
      if (def.hidden && fog) {
        object.mesh.visible = false;
      }
      return object;
    },
    /** options: { label: false } leaves the name off (rows of the same item). */
    spawnItem(kind, lane, at, y, options) {
      const mesh = itemMesh(kind, options && options.label);
      const height = y === undefined ? 0.85 : y;
      mesh.position.y = height;
      return add({ type: "item", kind, def: config.items[kind], lane, x: LANES[lane], at, y: height, mesh, depth: 1 });
    },
    spawnPower(kind, lane, at) {
      const mesh = powerMesh(kind);
      mesh.position.y = 1;
      return add({ type: "power", kind, def: config.powers[kind], lane, x: LANES[lane], at, y: 1, mesh, depth: 1 });
    },
    /** spec: { doors: [3 x { text, short, ok, look, tip }], question, sign, coach, id } */
    spawnGate(spec, at) {
      return add({ type: "gate", kind: "gate", spec, x: 0, at, mesh: gateMesh(spec), depth: 0.4 });
    },
    /** spec: { header, title, hint, button, id } */
    spawnStop(spec, at) {
      return add({ type: "stop", kind: "stop", spec, x: 0, at, mesh: stopMesh(spec), depth: 0.4 });
    },
    spawnSign(text, at, side, look) {
      return add({ type: "sign", kind: "sign", x: side < 0 ? -5.2 : 5.2, at, mesh: signMesh(text, look), depth: 0, done: true });
    },
    /** The obstacles of the next metres vanish: delta deployment, a fresh session. */
    clearAhead(metres) {
      noObstacleUntil = distance + metres;
      for (const object of objects) {
        if (object.type === "obstacle" && object.at < noObstacleUntil && object.at > distance) {
          remove(object);
        }
      }
      objects = objects.filter((object) => !object.removed);
    },
    /** Pulls the next items to the guinea pig's lane. */
    magnet(metres, kinds) {
      for (const object of objects) {
        if (object.type === "item" && !object.done && object.at > distance && object.at < distance + metres && (!kinds || kinds.includes(object.kind))) {
          object.lane = player.lane;
          object.x = LANES[player.lane];
          object.mesh.position.x = object.x;
          object.y = 0.85;
        }
      }
    },
    setFog(on) {
      fog = on;
      for (const object of objects) {
        if (object.type === "obstacle" && object.def.hidden) {
          object.mesh.visible = !on;
        }
      }
      scene().fog.near = on ? 8 : 35;
      scene().fog.far = on ? 40 : engine.settings.drawDistance;
    },
    setQuick(seconds) {
      player.quick = seconds;
    },
    setInvulnerable(seconds) {
      player.invulnerable = Math.max(player.invulnerable, seconds);
    },
    setSpeedFactor(value) {
      speedFactor = value;
    },
    /** More track at the end: the last section goes on for `metres` more. */
    extend(metres) {
      sections[sections.length - 1].length += metres;
      total += metres;
      ended = false;
    },
    /** Lets the guinea pig go again after a manual stop. */
    release() {
      if (stopped) {
        stopped.done = true;
        stopped.mesh.visible = false;
        ctx.fx.burst(0, 2, -STOP_DISTANCE, { count: 40, speed: 5, up: 5 });
        stopped = null;
      }
    },
    shake(amount) {
      shake = engine.motion ? amount : 0;
    },
    /**
     * A big instruction in the middle of the screen, at most one at a time:
     * returns false when another is still showing (force shows it anyway).
     */
    coach(text, ms, force) {
      if (!text || (!force && clock < coachUntil)) {
        return false;
      }
      const length = ms || 2600;
      ctx.hud.coach(text, length);
      coachUntil = clock + length / 1000 + 0.6;
      return true;
    },
    /** A small happy hop, for a good move. */
    hop() {
      if (player.y <= 0.001) {
        player.vy = 4.6;
      }
    },
    /** Confetti at a door, a hop and a sound: a gate passed the right way. */
    celebrate(lane, points) {
      const x = LANES[lane === undefined ? player.lane : lane];
      ctx.fx.burst(x, 1.6, -0.5, { count: 46, speed: 5, up: 6, life: 1.4 });
      ctx.sound.play("gate");
      runner.hop();
      if (points) {
        ctx.points(points);
      }
      runner.coach(t("r_right"), 1600, true);
    },
    /** A bad pick: the streak of good moves starts again. */
    breakStreak() {
      streak = 0;
    },

    action(name) {
      if (stopped) {
        if (name === "confirm" || name === "jump" || name === "tap") {
          return "release";
        }
        return null;
      }
      player.buffer.push({ action: name === "tap" ? "jump" : name, time: clock });
      return null;
    },

    update(dt, time) {
      const events = [];
      if (ended) {
        return events;
      }
      applyBuffer();
      clock += dt;
      stepPlayer(dt);
      const moving = !stopped;
      if (moving) {
        distance += currentSpeed() * dt * (player.quick > 0 ? QUICK_BOOST : 1) * speedFactor;
      }
      const section = sectionAt(distance);
      if (section !== sectionIndex) {
        sectionIndex = section;
        updatePath();
        events.push({ type: "section", index: section });
      }
      while (scriptIndex < script.length && script[scriptIndex].at <= distance) {
        events.push({ type: "script", step: script[scriptIndex] });
        scriptIndex += 1;
      }
      spawnAhead();
      placeScenery(time);
      collide(events, time);
      objects = objects.filter((object) => !object.removed);
      markDoorLane();
      placeCamera(dt);
      pig.state = { running: moving, airborne: player.y > 0.01, ducking: player.duck > 0, speed: currentSpeed(), height: player.y };
      pig.object.position.set(player.x, player.y, 0);
      pig.shadow.position.set(player.x, 0.012, 0.05);
      pig.hitWobble(player.hit);
      // Blink while it cannot be hit after a hit
      pig.object.visible = !(player.invulnerable > 0 && player.quick === 0 && Math.floor(time * 12) % 2 === 0);
      ctx.setData("lane", player.lane);
      if (!ended && distance >= total) {
        ended = true;
        hideDoors();
        events.push({ type: "end" });
      }
      return events;
    },

    /** The common answers to events: points, attempts, power-ups. */
    handle(event) {
      switch (event.type) {
        case "hit":
          player.invulnerable = HIT_INVULNERABLE;
          player.hit = 0.6;
          runner.shake(0.35);
          ctx.loseAttempt(t(event.def.title), event.def.tip ? t(event.def.tip) : "");
          break;
        case "item":
          ctx.collect(event.def.points || 10, event.def.label || t(event.def.title || ""));
          break;
        case "power":
          ctx.sound.play("power");
          applyPower(event);
          break;
        case "gate":
          if (event.ok) {
            runner.celebrate(event.lane, 100);
          } else {
            runner.wrongDoor(event);
          }
          break;
        default:
          break;
      }
    },
    /** A wrong door: a red puff, a shake and one attempt. The tip says why. */
    wrongDoor(event) {
      player.invulnerable = HIT_INVULNERABLE;
      player.hit = 0.6;
      runner.shake(0.35);
      streak = 0;
      ctx.fx.burst(LANES[event.lane], 1.4, -0.5, { count: 24, colors: [0xea001e, 0xfe9339, 0x444444], speed: 3.5, up: 3 });
      ctx.loseAttempt(event.door.short || event.door.text, event.door.tip || (event.gate.spec.tip ? event.gate.spec.tip : ""));
    },

    dispose() {
      for (const object of objects) {
        root.remove(object.mesh);
      }
      objects = [];
      for (const thing of scenery.disposables) {
        thing.dispose();
      }
      for (const mesh of scenery.instanced) {
        mesh.dispose();
      }
      for (const material of own) {
        material.dispose();
      }
      if (doorsPanel) {
        doorsPanel.remove();
        doorsPanel = null;
      }
      ctx.hud.setPath([], 0);
    }
  };

  function scene() {
    return ctx.scene;
  }

  function applyPower(event) {
    const def = event.def;
    const label = def.label;
    switch (def.effect) {
      case "clear":
        runner.clearAhead(def.metres || 80);
        ctx.hud.toast(t(def.toast || "") || label, "power");
        break;
      case "attempt":
        if (!ctx.gainAttempt()) {
          ctx.points(50);
        }
        ctx.hud.toast(t(def.toast || "") || label, "power");
        break;
      case "quick":
        runner.setQuick(def.seconds || 4);
        ctx.hud.toast(t(def.toast || "") || label, "power");
        break;
      case "shield":
        runner.setInvulnerable(def.seconds || 6);
        ctx.hud.toast(t(def.toast || "") || label, "power");
        break;
      case "magnet":
        runner.magnet(def.metres || 120, def.kinds);
        ctx.hud.toast(t(def.toast || "") || label, "power");
        break;
      case "reveal":
        runner.setFog(false);
        ctx.hud.toast(t(def.toast || "") || label, "power");
        break;
      case "trap":
        player.hit = 0.6;
        streak = 0;
        ctx.loseAttempt(t(def.toast || "") || label, def.tip ? t(def.tip) : "");
        break;
      case "empty":
        ctx.hud.toast(t(def.toast || "") || label, "bad");
        break;
      default:
        ctx.collect(def.points || 30, label);
    }
    if (def.effect !== "trap" && def.effect !== "empty") {
      const at = pig.object.position;
      ctx.fx.burst(at.x, at.y + 1, at.z, { count: 26, colors: [0xffb400, 0xffd84d, new THREE.Color(def.color).getHex()], speed: 4, up: 4 });
    }
  }

  function currentSpeed() {
    const index = sectionIndex;
    const inSection = Math.min(Math.max(distance - starts[index], 0), sections[index].length) / sections[index].length;
    return ((sections[index].speed || speedConfig.start + speedConfig.step * index) + speedConfig.ramp * inSection) * EASY_SPEED;
  }

  function sectionAt(d) {
    for (let i = sections.length - 1; i >= 0; i--) {
      if (d >= starts[i]) {
        return i;
      }
    }
    return 0;
  }

  function updatePath() {
    if (config.path !== false) {
      ctx.hud.setPath(
        sections.map((s) => s.name),
        sectionIndex
      );
    }
  }

  function applyBuffer() {
    const now = clock;
    player.buffer = player.buffer.filter((entry) => now - entry.time < INPUT_BUFFER_S);
    const remaining = [];
    for (const entry of player.buffer) {
      const grounded = player.y <= 0.001;
      switch (entry.action) {
        case "left":
          player.lane = Math.max(0, player.lane - 1);
          break;
        case "right":
          player.lane = Math.min(LANES.length - 1, player.lane + 1);
          break;
        case "jump":
          if (grounded) {
            player.vy = JUMP_SPEED;
            player.duck = 0;
            ctx.sound.play("wheek");
          } else {
            remaining.push(entry);
          }
          break;
        case "duck":
          if (!grounded) {
            // Down in the air drops faster, and ducks on landing
            player.vy = Math.min(player.vy, FAST_FALL_SPEED);
          }
          player.duck = DUCK_TIME;
          break;
        default:
          break;
      }
    }
    player.buffer = remaining;
  }

  function stepPlayer(dt) {
    const targetX = LANES[player.lane];
    const dx = targetX - player.x;
    player.x += Math.sign(dx) * Math.min(Math.abs(dx), LANE_SPEED * dt);
    if (player.y > 0 || player.vy > 0) {
      player.vy -= GRAVITY * dt;
      player.y = Math.max(0, player.y + player.vy * dt);
      if (player.y === 0) {
        player.vy = 0;
      }
    }
    player.duck = Math.max(0, player.duck - dt);
    player.invulnerable = Math.max(0, player.invulnerable - dt);
    player.quick = Math.max(0, player.quick - dt);
    player.hit = Math.max(0, player.hit - dt);
  }

  /** One row of the track: what the guinea pig meets at that distance. */
  function addRow(at) {
    const index = sectionAt(at);
    const section = sections[index];
    const end = starts[index] + section.length;
    const hasGate = Boolean(config.gates && config.gates(index));
    const nearEdge = (hasGate && at > end - 32) || (index > 0 && at < starts[index] + 22);
    const pick = (list) => list[Math.floor(random() * list.length)];
    const lanes = [0, 1, 2].sort(() => random() - 0.5);
    const kinds = section.obstacles || [];
    const items = section.items || [];

    if (nearEdge || at < noObstacleUntil || !kinds.length) {
      if (items.length) {
        const kind = pick(items);
        for (let i = 0; i < 4; i++) {
          runner.spawnItem(kind, lanes[0], at + i * 2.2, undefined, { label: i === 0 });
        }
      }
      return;
    }
    if (section.powers && section.powers.length && random() < (section.powerChance || 0.08)) {
      runner.spawnPower(pick(section.powers), lanes[2], at);
    }
    const doubles = random() < (section.doubles || 0);
    const first = pick(kinds);
    runner.spawnObstacle(first, lanes[0], at);
    if (doubles) {
      // Two obstacles: at most one of them blocks the whole lane
      let second = pick(kinds);
      if (config.obstacles[first].move === "lane" && config.obstacles[second].move === "lane") {
        second = kinds.find((k) => config.obstacles[k].move !== "lane") || null;
      }
      if (second) {
        runner.spawnObstacle(second, lanes[1], at);
      }
    }
    if (!items.length) {
      return;
    }
    if (config.obstacles[first].move === "jump" && random() < 0.6) {
      // A reward over a hurdle, for the ones who jump
      runner.spawnItem(pick(items), lanes[0], at, 2, { label: false });
    } else if (!doubles || random() < 0.5) {
      const lane = doubles ? lanes[2] : lanes[1];
      const kind = pick(items);
      for (let i = 0; i < 3; i++) {
        runner.spawnItem(kind, lane, at - 4 + i * 2.2, undefined, { label: i === 0 });
      }
    }
  }

  function spawnAhead() {
    const horizon = distance + engine.settings.drawDistance;
    while (gatesSpawned < sections.length && starts[gatesSpawned] + sections[gatesSpawned].length < horizon) {
      const index = gatesSpawned;
      const spec = config.gates ? config.gates(index) : null;
      if (spec) {
        const at = starts[index] + sections[index].length;
        if (spec.type === "stop") {
          runner.spawnStop(spec, at);
        } else {
          runner.spawnGate(Object.assign({ index }, spec), at);
        }
      }
      gatesSpawned += 1;
    }
    while (nextRowAt < horizon && nextRowAt < total - 20) {
      addRow(nextRowAt);
      const index = sectionAt(nextRowAt);
      nextRowAt += Math.max(spacing[0], spacing[1] - index * 1.2 - random() * 4);
    }
  }

  function remove(object) {
    root.remove(object.mesh);
    object.removed = true;
  }

  function obstacleHits(object) {
    const move = object.def.move;
    if (Math.abs(object.x - player.x) >= (move === "gap" ? 0.6 : 1)) {
      return false;
    }
    switch (move) {
      case "jump":
        return player.y < 0.45;
      case "duck":
        return player.y + (player.duck > 0 ? 0.5 : 0.95) > 0.72;
      case "gap":
        return player.y < 0.05;
      default:
        return true;
    }
  }

  function nearestLane() {
    return LANES.reduce((best, x, i) => (Math.abs(x - player.x) < Math.abs(LANES[best] - player.x) ? i : best), 0);
  }

  /** The first time a kind of move comes up, the coach says which key beats it. */
  function teach(move) {
    if (taught.has(move)) {
      return;
    }
    const key = "r_teach_" + move + (touch ? "_touch" : "");
    if (runner.coach(t(key), 2400)) {
      taught.add(move);
    }
  }

  function collide(events, time) {
    for (const object of objects) {
      const dz = object.at - distance;
      object.mesh.position.z = -dz;
      if (object.type === "item" || object.type === "power") {
        // Only the tile turns: its name, a sprite, always faces the camera
        object.mesh.children[0].rotation.y = time * 2.2 + object.at;
        object.mesh.position.y = object.y + Math.sin(time * 4 + object.at) * 0.08;
      }
      if (object.done) {
        // A gate behind the guinea pig would fill the camera: it goes at once
        if (object.type === "gate" && dz < -0.4) {
          object.mesh.visible = false;
        }
        if (dz < -12) {
          remove(object);
        }
        continue;
      }
      if (object.type === "stop") {
        if (dz <= STOP_DISTANCE && !stopped) {
          stopped = object;
          if (object.spec.hint) {
            runner.coach(object.spec.hint, 3200, true);
          }
          events.push({ type: "stop", stop: object });
        }
        continue;
      }
      if (object.type === "gate") {
        if (dz < GATE_PANEL_AT && !object.shown && dz > 0) {
          object.shown = true;
          showDoors(object);
          events.push({ type: "gateNear", gate: object });
          if (object.spec.coach) {
            runner.coach(object.spec.coach, 2800, true);
          } else if (!taught.has("door")) {
            taught.add("door");
            runner.coach(t("r_teach_door"), 2600, true);
          }
        }
        if (dz <= 0) {
          object.done = true;
          const lane = nearestLane();
          const door = object.spec.doors[lane];
          const ok = Boolean(door.ok) || (player.quick > 0 && !object.spec.quiz);
          // The door the guinea pig goes through flies open
          const panel = object.mesh.userData.panels[lane];
          if (panel) {
            panel.visible = false;
          }
          if (doorsGate === object) {
            hideDoors();
          }
          events.push({ type: "gate", gate: object, door, lane, ok });
        }
        continue;
      }
      if (object.type === "obstacle" && dz < TEACH_AT && dz > 4 && object.mesh.visible) {
        teach(object.def.move);
      }
      const reach = object.depth / 2 + (object.type === "obstacle" ? 0.3 : 0.6);
      if (Math.abs(dz) > reach) {
        if (dz < -12) {
          remove(object);
        }
        continue;
      }
      if (object.type === "obstacle") {
        if (!object.mesh.visible && !object.def.hidden) {
          continue;
        }
        if (obstacleHits(object)) {
          object.done = true;
          if (player.invulnerable > 0 || player.quick > 0) {
            object.mesh.visible = false;
            ctx.fx.burst(object.x, 0.8, 0, { count: 14, speed: 3, up: 3 });
          } else {
            streak = 0;
            ctx.fx.burst(player.x, 0.9, 0, { count: 18, colors: [0xea001e, 0xfe9339, 0xffffff], speed: 3, up: 3 });
            events.push({ type: "hit", kind: object.kind, def: object.def, object });
          }
        }
      } else if (Math.abs(object.x - player.x) < 1.1 && Math.abs(object.y - (player.y + 0.5)) < 1.15) {
        object.done = true;
        object.mesh.visible = false;
        if (object.type === "item" && !object.def.bad) {
          streak += 1;
          if (streak % STREAK_STEP === 0) {
            // A streak: a bigger burst and a cheer
            ctx.fx.burst(player.x, 1.4, 0, { count: 50, speed: 5, up: 6, life: 1.4 });
            ctx.sound.play("combo");
            runner.coach(t("r_streak", { n: streak }), 1400);
          }
        }
        events.push({ type: object.type, kind: object.kind, def: object.def, object });
      }
    }
  }

  const eye = new THREE.Vector3(0, 4.1, 6.9);
  const focus = new THREE.Vector3(0, 0.5, -9);
  const wantedEye = new THREE.Vector3();
  const wantedFocus = new THREE.Vector3();

  function placeCamera(dt) {
    const portrait = engine.portrait;
    const follow = player.x * 0.55;
    // A little higher and further back than straight behind: the guinea pig
    // is seen whole, and the track ahead has room
    wantedEye.set(follow, portrait ? 5.0 : 4.1, portrait ? 8.2 : 6.9);
    wantedFocus.set(follow * 0.6, 0.5, -9);
    const ease = Math.min(1, dt * 5);
    eye.lerp(wantedEye, ease);
    focus.lerp(wantedFocus, ease);
    shake = Math.max(0, shake - dt);
    const jitter = shake > 0 ? (Math.random() - 0.5) * shake : 0;
    const fov = portrait ? 72 : 60;
    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    camera.position.set(eye.x + jitter, eye.y, eye.z);
    camera.lookAt(focus);
    engine.aimSun(focus.x, 0);
  }

  // Ready for the intro card: the track is drawn before the first step
  spawnAhead();
  placeScenery(0);
  updatePath();
  pig.object.position.set(0, 0, 0);
  return runner;
}

/** The styles of the door chips, added to the CSS of every runner world. */
export const RUNNER_CSS = `
.guinea-run .gr-run-doors {
  position: absolute;
  left: 50%;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 18px);
  z-index: 2;
  width: min(760px, calc(100vw - 20px));
  transform: translateX(-50%);
  pointer-events: none;
}
.guinea-run.gr-show-buttons .gr-run-doors {
  bottom: calc(env(safe-area-inset-bottom, 0px) + 92px);
}
.guinea-run .gr-run-doors[hidden] {
  display: none;
}
.guinea-run .gr-run-q {
  margin: 0 auto 8px;
  padding: 8px 16px;
  border-radius: 14px;
  background: #032d60;
  box-shadow: 0 4px 0 #001639;
  color: #ffffff;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.3;
  text-align: center;
}
.guinea-run .gr-run-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.guinea-run .gr-run-door {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
  border: 3px solid #ffffff;
  border-radius: 14px;
  background: var(--door);
  box-shadow: 0 4px 0 rgba(3, 45, 96, 0.45);
  color: #ffffff;
  text-align: center;
  transition: transform 0.15s;
}
.guinea-run .gr-run-door b {
  font-size: 18px;
  line-height: 1.2;
}
.guinea-run .gr-run-door span {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.25;
  opacity: 0.95;
}
.guinea-run .gr-run-door.is-here {
  border-color: #ffd84d;
  box-shadow: 0 0 0 3px #ffb400, 0 6px 0 rgba(3, 45, 96, 0.45);
  transform: translateY(-6px) scale(1.04);
}
@media (max-width: 600px) {
  .guinea-run .gr-run-q {
    padding: 6px 10px;
    font-size: 15px;
  }
  .guinea-run .gr-run-row {
    gap: 5px;
  }
  .guinea-run .gr-run-door {
    padding: 6px 5px;
  }
  .guinea-run .gr-run-door b {
    font-size: 15px;
  }
  .guinea-run .gr-run-door span {
    font-size: 11.5px;
  }
}
`;
