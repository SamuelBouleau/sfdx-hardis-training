/*
 * The runner the runner worlds share (0, 6, 7, 8): a track high in a
 * Salesforce sky, three lanes, the guinea pig running down it.
 *
 * A world describes its track as data and the runner plays it:
 * - sections: the parts of the track, each with a name (shown as a Path),
 *   a colour, a length, and the obstacles, metadata and power-ups it brings
 * - obstacles: what each kind is called, what beats it (change lane, jump,
 *   duck, jump a gap) and the lab's fix for it
 * - items and powers: what can be picked up
 * - gates(index): what stands at the end of a section, if anything: three
 *   doors (some open, some closed, or a quiz), or a manual stop
 * - script: moments set at a distance, for the bosses and the twists
 *
 * The guinea pig stays at z = 0 and the world comes to it: an object placed at
 * distance `at` is drawn at z = -(at - distance).
 *
 * update() returns what happened as events, and handle() turns the common ones
 * into points, lost attempts and power-up effects. A world calls handle() for
 * the events it does not treat itself.
 */
import { SLDS, pictureBox } from "../core/painter.js";

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

const THEMES = {
  error: { color: SLDS.error, glyph: "error" },
  warning: { color: SLDS.warningDark, glyph: "warning" },
  lock: { color: SLDS.grey, glyph: "lock" },
  info: { color: SLDS.brand, glyph: "gear" },
  purple: { color: SLDS.purple, glyph: "bolt" }
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
  const speedConfig = Object.assign({ start: 9, step: 1.6, ramp: 1.4 }, config.speed);
  const spacing = (config.spacing || [10, 17]).map((gap) => gap + 2);

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
  const script = (config.script || []).slice().sort((a, b) => a.at - b.at);
  while (scriptIndex < script.length && script[scriptIndex].at < distance) {
    scriptIndex += 1;
  }

  const player = { lane: 1, x: 0, y: 0, vy: 0, duck: 0, invulnerable: 0, quick: 0, hit: 0, buffer: [] };

  /* ---------- Scenery ---------- */

  const scenery = buildScenery();

  function buildScenery() {
    const trackTexture = paint.texture("track", 128, 128, (c, w, h) => {
      c.fillStyle = "#E5E8EC";
      c.fillRect(0, 0, w, h);
      c.fillStyle = "#F3F5F7";
      c.fillRect(10, 0, w - 20, h);
      c.fillStyle = SLDS.white;
      for (const x of [42, 84]) {
        c.fillRect(x - 2, 0, 4, h / 2);
      }
    });
    trackTexture.wrapS = THREE.RepeatWrapping;
    trackTexture.wrapT = THREE.RepeatWrapping;
    trackTexture.repeat.set(1, 4);
    const top = paint.plain(0xffffff, { map: trackTexture, roughness: 0.85 });
    const edge = new THREE.MeshStandardMaterial({ color: sections[0].color, roughness: 0.5 });
    const under = paint.plain(0xdfe6ee, { roughness: 0.9 });
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
    const nodes = new THREE.InstancedMesh(
      paint.geometry("node", () => new THREE.SphereGeometry(0.2, 12, 8)),
      new THREE.MeshStandardMaterial({ color: sections[0].color, roughness: 0.3 }),
      32
    );
    root.add(nodes);
    // Clouds all around and below: one mesh for every puff
    const cloudRandom = (() => {
      let s = 7;
      return () => {
        s = (s * 16807) % 2147483647;
        return s / 2147483647;
      };
    })();
    const puffs = [];
    for (let i = 0; i < 18; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const below = i % 3 === 0;
      const cx = side * (below ? 4 + cloudRandom() * 10 : 9 + cloudRandom() * 22);
      const cy = below ? -7 - cloudRandom() * 6 : -3 + cloudRandom() * 9;
      const offset = (i / 18) * 220;
      const count = 5 + Math.floor(cloudRandom() * 3);
      for (let p = 0; p < count; p++) {
        const r = 1.2 + cloudRandom() * 1.6;
        puffs.push({ x: cx + (p - count / 2) * 1.4 + cloudRandom(), y: cy + cloudRandom() * 0.8, dz: (cloudRandom() - 0.5) * 2, offset, sx: r * 1.3, sy: r * 0.8, sz: r });
      }
    }
    const clouds = new THREE.InstancedMesh(
      paint.geometry("cloud", () => new THREE.SphereGeometry(1, 14, 10)),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 }),
      puffs.length
    );
    root.add(clouds);
    return { segments, edge, rail, nodes, clouds, puffs, disposables: [edge, rail, nodes.material, clouds.material] };
  }

  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  const position = new THREE.Vector3();

  function placeScenery() {
    const offset = distance % SEGMENT_LENGTH;
    scenery.segments.forEach((slab, i) => {
      slab.position.z = 10 - i * SEGMENT_LENGTH + offset;
    });
    const loop = 160;
    for (let i = 0; i < 16; i++) {
      for (const [j, side] of [-1, 1].entries()) {
        const z = 10 - ((i * 10 + loop - (distance % loop)) % loop);
        matrix.makeTranslation(side * 3.55, 0.12, z);
        scenery.nodes.setMatrixAt(i * 2 + j, matrix);
      }
    }
    scenery.nodes.instanceMatrix.needsUpdate = true;
    scenery.puffs.forEach((p, i) => {
      const z = 30 - ((p.offset + 220 - ((distance * 0.6) % 220)) % 220) + p.dz;
      position.set(p.x, p.y, z);
      scale.set(p.sx, p.sy, p.sz);
      matrix.compose(position, quaternion, scale);
      scenery.clouds.setMatrixAt(i, matrix);
    });
    scenery.clouds.instanceMatrix.needsUpdate = true;
    const color = new THREE.Color(sections[sectionIndex].color);
    scenery.edge.color.lerp(color, 0.05);
    scenery.rail.color.lerp(color, 0.05);
    scenery.nodes.material.color.lerp(color, 0.05);
  }

  /* ---------- Objects of the track ---------- */

  const shapes = {
    wall: paint.geometry("wall", () => new THREE.BoxGeometry(1.9, 1.75, 0.16)),
    low: paint.geometry("low", () => new THREE.BoxGeometry(1.9, 0.55, 0.22)),
    bar: paint.geometry("bar", () => new THREE.BoxGeometry(2.05, 0.46, 0.08)),
    post: paint.geometry("post", () => new THREE.BoxGeometry(0.1, 1.3, 0.1)),
    hole: paint.geometry("hole", () => new THREE.BoxGeometry(1.75, 0.06, 2.2)),
    stripe: paint.geometry("stripe", () => new THREE.BoxGeometry(1.95, 0.06, 0.18)),
    sign: paint.geometry("sign", () => new THREE.PlaneGeometry(1.8, 0.52)),
    tile: paint.geometry("tile", () => new THREE.BoxGeometry(0.56, 0.56, 0.1)),
    coin: paint.geometry("coin", () => new THREE.CylinderGeometry(0.44, 0.44, 0.09, 36)),
    ring: paint.geometry("ring", () => new THREE.TorusGeometry(0.5, 0.035, 8, 36)),
    door: paint.geometry("door", () => new THREE.BoxGeometry(1.95, 2.5, 0.12)),
    gatePost: paint.geometry("gate-post", () => new THREE.BoxGeometry(0.24, 3.3, 0.3)),
    lintel: paint.geometry("lintel", () => new THREE.BoxGeometry(7.1, 0.34, 0.34)),
    banner: paint.geometry("banner", () => new THREE.PlaneGeometry(6.8, 0.85)),
    plaque: paint.geometry("plaque", () => new THREE.PlaneGeometry(1.9, 0.92)),
    toast: paint.geometry("toast", () => new THREE.PlaneGeometry(1.9, 0.56)),
    arrow: paint.geometry("arrow", () => new THREE.PlaneGeometry(1.4, 2.6)),
    billboard: paint.geometry("billboard", () => new THREE.PlaneGeometry(3.2, 0.9))
  };
  const white = paint.plain(0xffffff, { roughness: 0.5 });
  const postMaterial = paint.plain(0xc9c9c9, { roughness: 0.5 });
  const brand = paint.plain(0x0176d3, { roughness: 0.45 });
  const doorFace = paint.plain(0xf3f3f3, { roughness: 0.7 });
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

  function obstacleMesh(kind) {
    const def = config.obstacles[kind];
    const theme = THEMES[def.theme || "error"];
    const title = t(def.title);
    const detail = def.detail || "";
    const group = new THREE.Group();
    switch (def.move) {
      case "jump": {
        const toast = pictureBox(THREE, shapes.low, paint.toast(kind, theme.color, theme.glyph, title, detail), paint.plain(new THREE.Color(theme.color).getHex()));
        toast.position.y = 0.28;
        group.add(toast);
        break;
      }
      case "duck": {
        const bar = pictureBox(
          THREE,
          shapes.bar,
          paint.material("bar:" + kind, 512, 116, (c, w, h) => {
            c.fillStyle = SLDS.white;
            c.fillRect(0, 0, w, h);
            c.fillStyle = theme.color;
            c.fillRect(0, 0, 14, h);
            c.fillStyle = SLDS.text;
            c.textAlign = "left";
            c.textBaseline = "middle";
            c.font = "700 30px 'Open Sans', Arial, sans-serif";
            fit(c, title, 30, detail ? 36 : h / 2, w - 50, 30, "700");
            if (detail) {
              c.fillStyle = theme.color;
              fit(c, detail, 30, 80, w - 50, 24, "700", true);
            }
          }),
          white
        );
        bar.position.y = 1.0;
        group.add(bar);
        for (const x of [-0.98, 0.98]) {
          const post = new THREE.Mesh(shapes.post, postMaterial);
          post.position.set(x, 0.6, 0);
          group.add(post);
        }
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
        const sign = new THREE.Mesh(shapes.sign, paint.toast("gap:" + kind, theme.color, theme.glyph, title, detail));
        sign.position.set(0, 0.42, 1.25);
        sign.rotation.x = -0.5;
        group.add(sign);
        break;
      }
      default: {
        const lines = (def.lines || (detail ? [detail] : [])).map((text) => ({ text, color: SLDS.text, weight: "700" }));
        const card = pictureBox(THREE, shapes.wall, paint.card("wall:" + kind, theme.color, theme.glyph, title, lines, Boolean(def.mono)), white);
        card.position.y = 0.95;
        group.add(card);
      }
    }
    return shadows(group);
  }

  function itemMesh(kind) {
    const def = config.items[kind];
    const tile = pictureBox(THREE, shapes.tile, paint.tile(kind, def.color, def.glyph), paint.plain(new THREE.Color(def.color).getHex(), { roughness: 0.35 }));
    tile.castShadow = engine.settings.shadows;
    if (def.label) {
      const group = new THREE.Group();
      group.add(tile);
      const label = new THREE.Mesh(shapes.sign, paint.label("item:" + kind, def.label, { size: 52, fg: SLDS.navy, bg: "rgba(255,255,255,0.85)" }));
      label.scale.set(0.5, 0.5, 0.5);
      label.position.y = 0.5;
      group.add(label);
      return group;
    }
    return tile;
  }

  function powerMesh(kind) {
    const def = config.powers[kind];
    const group = new THREE.Group();
    const face = paint.coin(kind, def.color, def.glyph, def.label);
    const disc = new THREE.Mesh(shapes.coin, [paint.plain(0xffb020, { metalness: 0.6, roughness: 0.3, emissive: 0x3a2400 }), face, face]);
    disc.rotation.x = Math.PI / 2;
    group.add(disc);
    const ring = new THREE.Mesh(shapes.ring, paint.plain(new THREE.Color(def.color).getHex(), { emissive: new THREE.Color(def.color).getHex(), emissiveIntensity: 0.8 }));
    group.add(ring);
    return shadows(group);
  }

  /** A gate: three doors, a banner, the Cloudity plaque. spec.doors[lane] = { text, ok, look } */
  function gateMesh(spec) {
    const group = new THREE.Group();
    spec.doors.forEach((door, lane) => {
      const x = LANES[lane];
      const look = door.look || (door.ok ? "open" : "closed");
      if (look === "open") {
        const sign = new THREE.Mesh(shapes.toast, paint.toast("open" + door.text, SLDS.success, "check", door.text));
        sign.position.set(x, 2.6, 0.05);
        group.add(sign);
        const arrow = new THREE.Mesh(shapes.arrow, arrowMaterial);
        arrow.rotation.x = -Math.PI / 2;
        arrow.position.set(x, 0.02, 3);
        group.add(arrow);
      } else {
        const panel = new THREE.Mesh(shapes.door, [white, white, white, white, doorFace, doorFace]);
        panel.position.set(x, 1.25, 0);
        group.add(panel);
        const color = look === "quiz" ? SLDS.brand : look === "trap" ? SLDS.purple : SLDS.error;
        const icon = look === "quiz" ? "branch" : look === "trap" ? "loop" : "error";
        const sign = new THREE.Mesh(shapes.toast, paint.toast(look + door.text, color, icon, door.text));
        sign.position.set(x, 1.5, 0.08);
        group.add(sign);
      }
    });
    for (const x of [-3.35, -1.1, 1.1, 3.35]) {
      const post = new THREE.Mesh(shapes.gatePost, x === -3.35 || x === 3.35 ? brand : white);
      post.position.set(x, 1.65, 0);
      group.add(post);
    }
    const lintel = new THREE.Mesh(shapes.lintel, brand);
    lintel.position.set(0, 3.4, 0);
    group.add(lintel);
    if (spec.banner) {
      const material = Array.isArray(spec.banner)
        ? paint.path("gate", spec.banner, spec.bannerIndex || 0)
        : paint.label("banner", spec.banner, { width: 1024, height: 128, size: 52, bg: SLDS.navy, fg: SLDS.white });
      const banner = new THREE.Mesh(shapes.banner, material);
      banner.position.set(0, 4.05, 0);
      group.add(banner);
    }
    const logo = new THREE.Mesh(shapes.plaque, paint.plaque());
    logo.position.set(0, 5.05, 0);
    group.add(logo);
    return shadows(group);
  }

  /** A manual stop: a big sign across the track, waiting for "Mark as done". */
  function stopMesh(spec) {
    const group = new THREE.Group();
    for (const x of [-3.35, 3.35]) {
      const post = new THREE.Mesh(shapes.gatePost, brand);
      post.position.set(x, 1.65, 0);
      group.add(post);
    }
    const board = new THREE.Mesh(
      paint.geometry("stop-board", () => new THREE.PlaneGeometry(6.4, 2.2)),
      paint.material("stop:" + spec.title, 1024, 352, (c, w, h) => {
        c.fillStyle = SLDS.white;
        c.fillRect(0, 0, w, h);
        c.fillStyle = SLDS.warningDark;
        c.fillRect(0, 0, w, 90);
        c.fillStyle = SLDS.white;
        c.textAlign = "left";
        c.textBaseline = "middle";
        fit(c, spec.header, 30, 46, w - 60, 44, "800");
        c.fillStyle = SLDS.text;
        fit(c, spec.title, 30, 150, w - 60, 46, "700");
        c.fillStyle = SLDS.weak;
        fit(c, spec.hint, 30, 230, w - 60, 34, "400");
        c.fillStyle = SLDS.brand;
        c.fillRect(30, 270, 360, 64);
        c.fillStyle = SLDS.white;
        c.textAlign = "center";
        fit(c, spec.button, 210, 302, 340, 32, "800");
      }, { side: THREE.DoubleSide, emissive: 0x222222 })
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
    spawnItem(kind, lane, at, y) {
      const mesh = itemMesh(kind);
      const height = y === undefined ? 0.85 : y;
      mesh.position.y = height;
      return add({ type: "item", kind, def: config.items[kind], lane, x: LANES[lane], at, y: height, mesh, depth: 1 });
    },
    spawnPower(kind, lane, at) {
      const mesh = powerMesh(kind);
      mesh.position.y = 1;
      return add({ type: "power", kind, def: config.powers[kind], lane, x: LANES[lane], at, y: 1, mesh, depth: 1 });
    },
    /** spec: { doors: [3 x { text, ok, look }], banner, bannerIndex, id } */
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
        stopped = null;
      }
    },
    shake(amount) {
      shake = engine.motion ? amount : 0;
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
      placeScenery();
      collide(events, time);
      objects = objects.filter((object) => !object.removed);
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
            ctx.sound.play("gate");
            ctx.points(100);
          } else {
            player.invulnerable = HIT_INVULNERABLE;
            player.hit = 0.6;
            runner.shake(0.35);
            ctx.loseAttempt(event.door.text, event.door.tip || (event.gate.spec.tip ? event.gate.spec.tip : ""));
          }
          break;
        default:
          break;
      }
    },

    dispose() {
      for (const object of objects) {
        root.remove(object.mesh);
      }
      objects = [];
      for (const thing of scenery.disposables) {
        thing.dispose();
      }
      scenery.nodes.dispose();
      scenery.clouds.dispose();
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
        ctx.loseAttempt(t(def.toast || "") || label, def.tip ? t(def.tip) : "");
        break;
      case "empty":
        ctx.hud.toast(t(def.toast || "") || label, "bad");
        break;
      default:
        ctx.collect(def.points || 30, label);
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
        for (let i = 0; i < 4; i++) {
          runner.spawnItem(pick(items), lanes[0], at + i * 2.2);
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
      runner.spawnItem(pick(items), lanes[0], at, 2);
    } else if (!doubles || random() < 0.5) {
      const lane = doubles ? lanes[2] : lanes[1];
      for (let i = 0; i < 3; i++) {
        runner.spawnItem(pick(items), lane, at - 4 + i * 2.2);
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

  function collide(events, time) {
    for (const object of objects) {
      const dz = object.at - distance;
      object.mesh.position.z = -dz;
      if (object.type === "item" || object.type === "power") {
        object.mesh.rotation.y = time * 2.2 + object.at;
        object.mesh.position.y = object.y + Math.sin(time * 4 + object.at) * 0.08;
      }
      if (object.done) {
        if (dz < -12) {
          remove(object);
        }
        continue;
      }
      if (object.type === "stop") {
        if (dz <= STOP_DISTANCE && !stopped) {
          stopped = object;
          events.push({ type: "stop", stop: object });
        }
        continue;
      }
      if (object.type === "gate") {
        if (dz <= 0) {
          object.done = true;
          const lane = nearestLane();
          const door = object.spec.doors[lane];
          const ok = Boolean(door.ok) || (player.quick > 0 && !object.spec.quiz);
          events.push({ type: "gate", gate: object, door, lane, ok });
        }
        continue;
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
          } else {
            events.push({ type: "hit", kind: object.kind, def: object.def, object });
          }
        }
      } else if (Math.abs(object.x - player.x) < 1.1 && Math.abs(object.y - (player.y + 0.5)) < 1.15) {
        object.done = true;
        object.mesh.visible = false;
        events.push({ type: object.type, kind: object.kind, def: object.def, object });
      }
    }
  }

  const eye = new THREE.Vector3(0, 3.7, 6.2);
  const focus = new THREE.Vector3(0, 0.6, -8);
  const wantedEye = new THREE.Vector3();
  const wantedFocus = new THREE.Vector3();

  function placeCamera(dt) {
    const portrait = engine.portrait;
    const follow = player.x * 0.55;
    wantedEye.set(follow, portrait ? 4.6 : 3.7, portrait ? 7.4 : 6.2);
    wantedFocus.set(follow * 0.6, 0.6, -8);
    const ease = Math.min(1, dt * 5);
    eye.lerp(wantedEye, ease);
    focus.lerp(wantedFocus, ease);
    shake = Math.max(0, shake - dt);
    const jitter = shake > 0 ? (Math.random() - 0.5) * shake : 0;
    camera.fov = portrait ? 74 : 60;
    camera.updateProjectionMatrix();
    camera.position.set(eye.x + jitter, eye.y, eye.z);
    camera.lookAt(focus);
    engine.aimSun(focus.x, 0);
  }

  // Ready for the intro card: the track is drawn before the first step
  spawnAhead();
  placeScenery();
  updatePath();
  pig.object.position.set(0, 0, 0);
  return runner;
}

function fit(c, text, x, y, maxWidth, size, weight, mono) {
  let s = size;
  const face = mono ? "'JetBrains Mono', Consolas, monospace" : "'Open Sans', Arial, sans-serif";
  c.font = (weight || "700") + " " + s + "px " + face;
  while (c.measureText(text).width > maxWidth && s > 10) {
    s -= 2;
    c.font = (weight || "700") + " " + s + "px " + face;
  }
  c.fillText(text, x, y);
}
