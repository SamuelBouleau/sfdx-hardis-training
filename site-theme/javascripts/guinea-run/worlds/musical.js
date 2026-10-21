/*
 * The musical runs of Guinea Run (worlds 6 and 8), in the style of the
 * musical levels of a well-known platformer: the guinea pig runs on its own,
 * to the music, and the player only jumps. Everything is placed on the beat,
 * so jumping in time feels like playing the song, and every collectable sings
 * a note of the chord being played.
 *
 * The song is the clock. The guinea pig runs a fixed number of units per beat
 * (UNITS_PER_BEAT), so a run beat is a place on the track as much as a moment
 * of the song. A stop (a manual action, a choice) holds the guinea pig while
 * the song goes on, and the run starts again on the next bar; a hit sends it
 * back to its last checkpoint, also on a bar, so the level and the music never
 * drift apart.
 *
 * A level is a list of events placed in run beats, written with createLevel():
 * blocks to jump, gaps, coins on the ground or on the arc of a jump, power-ups,
 * springs, signs, arches, checkpoints, zones of colour, music sections, stops,
 * fog, soft zones (where a mistake costs nothing) and scripts. A jump lasts
 * exactly one beat: a block placed "at" a beat is jumped on that beat, and the
 * guinea pig lands on the next one.
 *
 *   const L = createLevel();
 *   L.riff(2, "x.x.", { block: look, coin });   // bar 2: jumps on beats 1 and 3
 *   const run = createMusicalRun(ctx, { song, level: L, callbacks });
 *   // in the world: run.update(dt, time), run.action(name), run.dispose()
 *
 * What it gives the player to see the beat: a ring that closes on the spot
 * to jump from, a glowing footprint there, a wood block on the beat of every
 * jump, and a world that bounces to the music.
 */
import { createMusic } from "../core/music.js";
import { SLDS, rounded, glyph } from "../core/painter.js";

export const UNITS_PER_BEAT = 3;
const JUMP_H = 2.3;
const COYOTE_S = 0.11;
const BUFFER_S = 0.17;
// Generous hit boxes: the guinea pig is 1.3 long, it collides as 0.6
const PIG_HALF = 0.3;
const PIG_TALL = 0.7;
const FOOT = 0.34;
const RING_BEATS = 2;
const BLOCK_W = 0.95;
const COACH_GAP_S = 3.2;
const PERFECT_BEAT = 0.1;
const GAP_FROM = 0.2;
const GAP_TO = 0.8;
const STREAK_STEP = 8;

export const MUSICAL_TEXTS = {
  en: {
    mu_start: "Jump on the beat, when the ring closes!",
    mu_startTouch: "Tap to jump, when the ring closes!",
    mu_hit: "Back to the checkpoint: jump when the ring closes",
    mu_manual: "Jump to press the button!",
    mu_choice: "Jump when the right answer lights up",
    mu_choiceTouch: "Jump when the right answer lights up, or tap it",
    mu_streak: "Streak x{{n}}",
    mu_perfect: "On the beat!",
    mu_soft: "In preprod, a mistake costs nothing",
    mu_checkpoint: "Checkpoint"
  },
  fr: {
    mu_start: "Sautez sur le temps, quand l'anneau se referme !",
    mu_startTouch: "Touchez pour sauter, quand l'anneau se referme !",
    mu_hit: "Retour au checkpoint : sautez quand l'anneau se referme",
    mu_manual: "Sautez pour appuyer sur le bouton !",
    mu_choice: "Sautez quand la bonne réponse s'allume",
    mu_choiceTouch: "Sautez quand la bonne réponse s'allume, ou touchez-la",
    mu_streak: "Série x{{n}}",
    mu_perfect: "Pile sur le temps !",
    mu_soft: "En preprod, une erreur ne coûte rien",
    mu_checkpoint: "Checkpoint"
  }
};

export const MUSICAL_CSS = `
.guinea-run .gr-mu-choice {
  position: absolute;
  top: 118px;
  left: 50%;
  width: min(640px, calc(100vw - 24px));
  transform: translateX(-50%);
  padding: 12px 14px 14px;
  border: 3px solid #fe9339;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 6px 24px rgba(3, 45, 96, 0.35);
  color: #032d60;
  pointer-events: auto;
  animation: gr-card-in 0.3s ease-out;
}
.guinea-run:not([data-state="playing"]) .gr-mu-choice {
  visibility: hidden;
}
.guinea-run .gr-mu-prompt {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.25;
}
.guinea-run .gr-mu-detail {
  margin: 0 0 10px;
  color: #444444;
  font-size: 15px;
}
.guinea-run .gr-mu-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 8px;
}
.guinea-run .gr-mu-option {
  min-height: 52px;
  padding: 8px 10px;
  border: 3px solid #c9c9c9;
  border-radius: 12px;
  background: #f3f3f3;
  color: #032d60;
  font: inherit;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  touch-action: manipulation;
  transition: transform 0.08s, background 0.08s;
}
.guinea-run .gr-mu-option.is-lit {
  border-color: #032d60;
  background: #ffd84d;
  transform: scale(1.06);
}
.guinea-run .gr-mu-option.is-off {
  opacity: 0.45;
  text-decoration: line-through;
  cursor: default;
}
.guinea-run .gr-mu-option.is-right {
  border-color: #2e844a;
  background: #2e844a;
  color: #ffffff;
}
.guinea-run .gr-mu-meter {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  margin: 6px auto 0;
  padding: 4px 12px;
  border-radius: 999px;
  background: #032d60;
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
}
@media (max-width: 600px) {
  .guinea-run .gr-mu-choice {
    top: 104px;
  }
  .guinea-run .gr-mu-prompt {
    font-size: 16px;
  }
}
`;

/* ---------- Writing a level ---------- */

/** The builder of a level: every method adds events placed in run beats (4 per bar). */
export function createLevel() {
  const events = [];
  const add = (event) => {
    events.push(event);
    return event;
  };
  const L = {
    events,
    /** A block to jump over, jumped on beat `at`. look: { id, color, glyph, sign, title, tip, group, hidden, h }. */
    block(at, look, extra) {
      return add(Object.assign({ type: "block", at, look }, extra));
    },
    /** A gap in the track, jumped on beat `at`. */
    gap(at, look) {
      return add({ type: "gap", at, look });
    },
    coin(beat, y, coin) {
      return add({ type: "coin", beat, y, coin });
    },
    /** Three coins on the arc of a jump taken on beat `at`. */
    arc(at, coin) {
      for (const p of [0.25, 0.5, 0.75]) {
        L.coin(at + p, jumpHeight(p) + 0.45, coin);
      }
      add({ type: "target", at, bonus: true });
    },
    /** A power-up at the top of a jump on beat `at` (or on the ground with ground: true). */
    power(at, power, ground) {
      add({ type: "power", beat: ground ? at : at + 0.5, y: ground ? 0.6 : JUMP_H + 0.45, power });
      if (!ground) {
        add({ type: "target", at, bonus: true });
      }
    },
    /** A spring: jump from it and the jump lasts two beats, twice as high. */
    spring(at) {
      return add({ type: "spring", at });
    },
    /** Victor's note, high up. */
    note(beat, y) {
      return add({ type: "note", beat, y });
    },
    sign(beat, text, options) {
      return add(Object.assign({ type: "sign", beat, text }, options));
    },
    /** An arch over the track with a big sign: the start of a part. */
    arch(beat, text, options) {
      return add(Object.assign({ type: "arch", beat, text }, options));
    },
    checkpoint(at) {
      return add({ type: "checkpoint", at });
    },
    zone(at, color) {
      return add({ type: "zone", at, color });
    },
    music(at, section) {
      return add({ type: "music", at, section });
    },
    /** A manual action: a button to bump before a barrier on beat `at` (a bar). */
    manual(at, def) {
      return add(Object.assign({ type: "manual", at }, def));
    },
    /** A choice at a barrier on beat `at` (a bar): rounds of options lit one per beat. */
    choice(at, def) {
      return add(Object.assign({ type: "choice", at }, def));
    },
    script(at, run) {
      return add({ type: "script", at, run });
    },
    fog(from, to) {
      return add({ type: "fog", from, to });
    },
    soft(from, to) {
      return add({ type: "soft", from, to });
    },
    end(at, def) {
      return add(Object.assign({ type: "end", at }, def));
    },
    /**
     * One bar, a character per beat: x a block, X a block with coins above,
     * g a gap, G a gap with coins above, o coins on an arc (a jump for fun),
     * - a coin on the ground, = two coins on the ground, s a spring, . nothing.
     */
    riff(bar, pattern, o) {
      [...pattern].forEach((ch, i) => {
        const at = bar * 4 + i;
        if (ch === "x" || ch === "X") {
          L.block(at, o.block);
        }
        if (ch === "g" || ch === "G") {
          L.gap(at, o.gap || o.block);
        }
        if (ch === "X" || ch === "G" || ch === "o") {
          L.arc(at, o.coin);
        }
        if (ch === "-" || ch === "=") {
          L.coin(at, 0.55, o.coin);
        }
        if (ch === "=") {
          L.coin(at + 0.5, 0.55, o.coin);
        }
        if (ch === "s") {
          L.spring(at);
        }
      });
    }
  };
  return L;
}

/** Height of a normal jump, at a phase of it from 0 (take-off) to 1 (landing). */
export function jumpHeight(phase) {
  return 4 * JUMP_H * phase * (1 - phase);
}

function hexOf(css) {
  return parseInt(String(css).replace("#", ""), 16);
}

/* ---------- Playing it ---------- */

/**
 * def: { song, level (from createLevel), palette: [colours of the hills and
 * bars], callbacks: { onPower(power), onCoin(coin), onHit(look), onManual(stop,
 * landed), onChoice(stop, round, option, right), onEnd(), onEndAction(name),
 * onSoftHit(look) } }.
 */
export function createMusicalRun(ctx, def) {
  const { THREE, root, pig, paint, hud, engine, sound, t } = ctx;
  const camera = ctx.camera;
  const music = createMusic(sound, def.song);
  const spb = 60 / def.song.bpm;
  const U = UNITS_PER_BEAT;
  const G = (8 * JUMP_H) / (spb * spb);
  const V0 = (4 * JUMP_H) / spb;
  const calls = def.callbacks || {};
  const shadows = engine.settings.shadows;
  const own = [];
  const keep = (thing) => {
    own.push(thing);
    return thing;
  };
  const events = def.level.events.slice().sort((a, b) => key(a) - key(b));
  function key(e) {
    return e.at !== undefined ? e.at : e.beat !== undefined ? e.beat : e.from;
  }
  const endEvent = events.find((e) => e.type === "end");
  const endBeat = endEvent ? endEvent.at : 64;
  const X = (beat) => beat * U;

  /* ---------- Shared pieces ---------- */

  const box = paint.geometry("mu-box", () => new THREE.BoxGeometry(1, 1, 1));
  const coinGeometry = paint.geometry("mu-coin", () => new THREE.CylinderGeometry(0.34, 0.34, 0.08, 20));
  const markerGeometry = paint.geometry("mu-marker", () => new THREE.CircleGeometry(0.42, 24));
  const ringGeometry = paint.geometry("mu-ring", () => new THREE.TorusGeometry(1, 0.07, 8, 40));
  const postGeometry = paint.geometry("mu-post", () => new THREE.CylinderGeometry(0.12, 0.14, 1, 10));
  const springGeometry = paint.geometry("mu-spring", () => new THREE.CylinderGeometry(0.55, 0.65, 0.18, 20));
  const gold = paint.plain(0xffb400, { roughness: 0.3, metalness: 0.3, emissive: 0x402800 });

  /** The front of a block: its colour and a white glyph, square. */
  function faceMaterial(id, css, glyphName) {
    return paint.material("mu-face-" + id + css + glyphName, 128, 128, (c, w, h) => {
      c.fillStyle = css;
      c.fillRect(0, 0, w, h);
      rounded(c, 10, 10, w - 20, h - 20, 18);
      c.lineWidth = 6;
      c.strokeStyle = "rgba(255,255,255,0.85)";
      c.stroke();
      glyph(c, glyphName || "error", w / 2, h / 2, w * 0.62, SLDS.white);
    }, { emissive: 0x222222, roughness: 0.45 });
  }
  const ghostMaterial = keep(new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, depthWrite: false }));

  /* ---------- The track ---------- */

  const zones = events.filter((e) => e.type === "zone");
  const gaps = events.filter((e) => e.type === "gap").map((e) => ({ event: e, from: e.at + GAP_FROM, to: e.at + GAP_TO, look: e.look }));
  const softZones = events.filter((e) => e.type === "soft");
  const fogZones = events.filter((e) => e.type === "fog");
  const zoneColor = (beat) => {
    let color = 0x0176d3;
    for (const z of zones) {
      if (z.at <= beat) {
        color = z.color;
      }
    }
    return color;
  };
  const inGap = (beat) => gaps.some((g) => beat > g.from && beat < g.to);
  const isSoft = (beat) => softZones.some((z) => beat >= z.from && beat < z.to);

  const QUARTER = 0.25;
  const firstQuarter = -24 * 4;
  const lastQuarter = (endBeat + 16) * 4;
  const tiles = [];
  for (let q = firstQuarter; q < lastQuarter; q++) {
    const beat = q * QUARTER + QUARTER / 2;
    if (!inGap(beat)) {
      tiles.push(q);
    }
  }
  const trackMaterial = keep(new THREE.MeshStandardMaterial({ roughness: 0.55, emissive: 0xffffff, emissiveIntensity: 0 }));
  const track = keep(new THREE.InstancedMesh(box, trackMaterial, tiles.length));
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  const white = new THREE.Color(0xffffff);
  tiles.forEach((q, i) => {
    const beat = q * QUARTER;
    dummy.position.set(X(beat + QUARTER / 2), -0.5, 0);
    dummy.scale.set(U * QUARTER * 0.985, 1, 3.2);
    dummy.updateMatrix();
    track.setMatrixAt(i, dummy.matrix);
    color.setHex(zoneColor(beat));
    const inBeat = ((q % 4) + 4) % 4;
    const inBar = ((q % 16) + 16) % 16;
    // Light tiles with a stronger stripe on each beat, and white on each bar
    if (inBar === 0) {
      color.copy(white);
    } else if (inBeat === 0) {
      color.lerp(white, 0.15);
    } else {
      color.lerp(white, 0.62);
    }
    track.setColorAt(i, color);
  });
  track.receiveShadow = true;
  root.add(track);
  const base = new THREE.Mesh(box, paint.plain(0x0b5cab, { roughness: 0.8, emissive: 0x041a33 }));
  base.scale.set(X(lastQuarter * QUARTER - firstQuarter * QUARTER), 1.4, 3.4);
  base.position.set(X((lastQuarter * QUARTER + firstQuarter * QUARTER) / 2), -1.75, 0);
  root.add(base);

  /* ---------- The scenery: hills, clouds and an equalizer that dances ---------- */

  const palette = (def.palette || [0x06a59a, 0x9050e9, 0x2e844a, 0xfe9339, 0x1b96ff, 0xe3066a]).slice();
  const sphere = paint.geometry("mu-sphere", () => new THREE.SphereGeometry(1, 18, 12));
  const length = X(endBeat + 40) + 60;
  const hillCount = Math.ceil(length / 16);
  const hills = keep(new THREE.InstancedMesh(sphere, keep(new THREE.MeshStandardMaterial({ roughness: 0.9 })), hillCount * 2));
  for (let i = 0; i < hillCount * 2; i++) {
    const far = i % 2 === 1;
    const r = (far ? 14 : 8) + ((i * 37) % 7);
    dummy.position.set(-60 + Math.floor(i / 2) * 16 + (far ? 8 : 0), -3 - (far ? 2 : 0), far ? -46 : -26);
    dummy.scale.set(r * 1.3, r * (far ? 0.55 : 0.5), r * 0.6);
    dummy.updateMatrix();
    hills.setMatrixAt(i, dummy.matrix);
    color.setHex(palette[i % palette.length]).lerp(white, far ? 0.35 : 0.1);
    hills.setColorAt(i, color);
  }
  root.add(hills);
  const cloudCount = Math.ceil(length / 24);
  const clouds = keep(new THREE.InstancedMesh(sphere, keep(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, emissive: 0xffffff, emissiveIntensity: 0.35 })), cloudCount));
  for (let i = 0; i < cloudCount; i++) {
    dummy.position.set(-50 + i * 24 + ((i * 13) % 9), 10 + ((i * 7) % 5), -34);
    dummy.scale.set(4 + (i % 3), 1.3, 1.5);
    dummy.updateMatrix();
    clouds.setMatrixAt(i, dummy.matrix);
  }
  root.add(clouds);
  // The equalizer: groups of three bars behind the track, on the beat
  const EQ_GAP = 4.5;
  const eqGroups = Math.ceil(length / EQ_GAP);
  const eq = keep(new THREE.InstancedMesh(box, keep(new THREE.MeshStandardMaterial({ roughness: 0.4, emissive: 0xffffff, emissiveIntensity: 0.12 })), eqGroups * 3));
  eq.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  for (let i = 0; i < eqGroups * 3; i++) {
    color.setHex(palette[Math.floor(i / 3) % palette.length]);
    eq.setColorAt(i, color);
    const h = 1.6 + (i % 3) * 0.4;
    dummy.position.set(-60 + Math.floor(i / 3) * EQ_GAP + (i % 3) * 1.05, h / 2 - 0.2, -8);
    dummy.scale.set(0.85, h, 0.85);
    dummy.updateMatrix();
    eq.setMatrixAt(i, dummy.matrix);
  }
  root.add(eq);

  /* ---------- What is on the track ---------- */

  const blocks = [];
  const coins = [];
  const powers = [];
  const targets = [];
  const signs = [];
  const springs = [];
  const stops = [];
  const checkpoints = [{ at: 0, section: def.song.start || "intro" }];
  const triggers = [];
  const markerNeed = keep(new THREE.MeshBasicMaterial({ color: 0xffd84d, transparent: true, opacity: 0.9, toneMapped: false }));
  const markerBonus = keep(new THREE.MeshBasicMaterial({ color: 0xff7ad9, transparent: true, opacity: 0.75, toneMapped: false }));
  const signSeen = new Set();
  let coinOrder = 0;

  function addSign(text, x, y, options) {
    const o = Object.assign({ height: 0.55 }, options);
    const sprite = paint.sign(o.name || "mu-sign", text, { color: o.color || SLDS.brand, glyph: o.glyph || null, height: o.height });
    sprite.position.set(x, y, o.z === undefined ? 0.6 : o.z);
    const entry = { sprite, base: sprite.scale.clone(), x };
    signs.push(entry);
    root.add(sprite);
    return entry;
  }

  function addTarget(at, bonus, owner) {
    const marker = new THREE.Mesh(markerGeometry, bonus ? markerBonus : markerNeed);
    marker.rotation.x = -Math.PI / 2;
    marker.position.set(X(at), 0.015, 0.75);
    marker.scale.set(1, 0.6, 1);
    root.add(marker);
    const target = { at, bonus, owner, marker, cued: false };
    targets.push(target);
    return target;
  }

  function addCoin(beat, y, coin, hidden) {
    const face = paint.coin("mu-coin-" + coin.id, coin.color, coin.glyph || "star", "");
    const mesh = new THREE.Mesh(coinGeometry, [gold, face, face]);
    mesh.rotation.order = "YXZ";
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(X(beat), y, 0);
    mesh.visible = !hidden;
    root.add(mesh);
    const entry = { beat, y, x: X(beat), coin, mesh, got: false, missed: false, hidden: Boolean(hidden), order: coinOrder++ };
    coins.push(entry);
    return entry;
  }

  for (const e of events) {
    switch (e.type) {
      case "block": {
        const look = e.look;
        const h = look.h || 0.95;
        const side = paint.plain(hexOf(look.color), { roughness: 0.5 });
        const face = faceMaterial(look.id, look.color, look.glyph);
        const normal = [side, side, side, side, face, side];
        const mesh = new THREE.Mesh(box, look.hidden ? ghostMaterial : normal);
        mesh.scale.set(BLOCK_W, h, 1.1);
        mesh.position.set(X(e.at + 0.5), h / 2, 0);
        mesh.castShadow = shadows;
        root.add(mesh);
        const block = { event: e, look, h, x: X(e.at + 0.5), mesh, normal, dead: false, hidden: Boolean(look.hidden), squash: 0, sign: null, convert: null, popped: 0 };
        if (look.sign && (look.signEvery || !signSeen.has(look.id))) {
          signSeen.add(look.id);
          block.sign = addSign(look.sign, block.x, h + 0.55, { color: look.color, glyph: look.glyph, name: "mu-block" });
          block.sign.sprite.visible = !block.hidden;
        }
        if (e.convert) {
          block.convert = addCoin(e.at + 0.5, 0.55, e.convert, true);
        }
        block.target = addTarget(e.at, false, block);
        block.target.marker.visible = !block.hidden;
        blocks.push(block);
        break;
      }
      case "gap": {
        const gap = gaps.find((g) => g.event === e);
        gap.target = addTarget(e.at, false, gap);
        if (e.look && e.look.sign && !signSeen.has("gap-" + e.look.id)) {
          signSeen.add("gap-" + e.look.id);
          addSign(e.look.sign, X(e.at + 0.5), -0.55, { color: e.look.color, glyph: e.look.glyph, name: "mu-gap", z: 1.75 });
        }
        break;
      }
      case "target":
        if (!targets.some((x) => Math.abs(x.at - e.at) < 0.01)) {
          addTarget(e.at, e.bonus, null);
        }
        break;
      case "coin":
        addCoin(e.beat, e.y, e.coin, false);
        break;
      case "power": {
        const p = e.power;
        const face = paint.coin("mu-power-" + p.id, p.color, p.glyph || "bolt", "");
        const mesh = new THREE.Mesh(coinGeometry, [gold, face, face]);
        mesh.rotation.order = "YXZ";
        mesh.rotation.x = Math.PI / 2;
        mesh.scale.setScalar(1.7);
        mesh.position.set(X(e.beat), e.y, 0);
        root.add(mesh);
        const entry = { beat: e.beat, x: X(e.beat), y: e.y, power: p, mesh, got: false, sign: null };
        if (p.sign) {
          entry.sign = addSign(p.sign, X(e.beat), e.y + 1.05, { color: p.color, glyph: p.glyph, name: "mu-power" });
        }
        powers.push(entry);
        break;
      }
      case "note": {
        const mesh = new THREE.Mesh(box, [paint.plain(0xf2c94c), paint.plain(0xf2c94c), paint.plain(0xf2c94c), paint.plain(0xf2c94c), faceMaterial("note", "#F2C94C", "note"), paint.plain(0xf2c94c)]);
        mesh.scale.set(0.7, 0.7, 0.08);
        mesh.position.set(X(e.beat), e.y, 0);
        root.add(mesh);
        powers.push({ beat: e.beat, x: X(e.beat), y: e.y, power: { id: "note", note: true }, mesh, got: false, sign: null });
        break;
      }
      case "spring": {
        const mesh = new THREE.Mesh(springGeometry, paint.plain(0xe3066a, { roughness: 0.3, emissive: 0x330018 }));
        mesh.position.set(X(e.at), 0.09, 0);
        root.add(mesh);
        springs.push({ at: e.at, mesh });
        addTarget(e.at, true, null);
        break;
      }
      case "sign":
        addSign(e.text, X(e.beat), e.y || 2.2, { color: e.color, glyph: e.glyph, height: e.height || 0.6, z: e.z === undefined ? -1.2 : e.z, name: "mu-free" });
        break;
      case "arch": {
        const postMaterial = paint.plain(hexOf(e.color || SLDS.brand), { roughness: 0.4 });
        for (const z of [-1.55, 1.55]) {
          const post = new THREE.Mesh(postGeometry, postMaterial);
          post.scale.y = 3.6;
          post.position.set(X(e.beat), 1.8, z);
          root.add(post);
        }
        const bar = new THREE.Mesh(box, postMaterial);
        bar.scale.set(0.3, 0.3, 3.4);
        bar.position.set(X(e.beat), 3.6, 0);
        root.add(bar);
        addSign(e.text, X(e.beat), 4.25, { color: e.color, glyph: e.glyph, height: 0.75, z: 0, name: "mu-arch" });
        break;
      }
      case "checkpoint": {
        const flag = new THREE.Mesh(postGeometry, paint.plain(0xffffff));
        flag.scale.set(0.6, 1.6, 0.6);
        flag.position.set(X(e.at), 0.8, -1.3);
        root.add(flag);
        const cloth = new THREE.Mesh(box, paint.plain(0xc9c9c9, { emissive: 0x111111 }));
        cloth.scale.set(0.7, 0.42, 0.05);
        cloth.position.set(X(e.at) + 0.38, 1.4, -1.3);
        root.add(cloth);
        checkpoints.push({ at: e.at, cloth, passed: false });
        break;
      }
      case "manual":
      case "choice":
        stops.push(buildStop(e));
        break;
      case "music":
      case "script":
        triggers.push({ event: e, done: false });
        break;
      default:
        break;
    }
  }
  checkpoints.sort((a, b) => a.at - b.at);
  // The section each checkpoint starts with
  for (const cp of checkpoints) {
    let section = def.song.start || "intro";
    for (const e of events) {
      if (e.type === "music" && e.at <= cp.at) {
        section = e.section;
      }
    }
    cp.section = section;
  }
  targets.sort((a, b) => a.at - b.at);

  /** A barrier across the track, and what opens it. */
  function buildStop(e) {
    const isManual = e.type === "manual";
    const wallColor = isManual ? "#FE9339" : "#EA001E";
    const wall = new THREE.Mesh(box, [paint.plain(hexOf(wallColor)), paint.plain(hexOf(wallColor)), paint.plain(hexOf(wallColor)), paint.plain(hexOf(wallColor)), faceMaterial(isManual ? "wall-manual" : "wall-choice", wallColor, isManual ? "warning" : "error"), paint.plain(hexOf(wallColor))]);
    wall.scale.set(0.5, 2.6, 2.6);
    wall.position.set(X(e.at) + 0.9, 1.3, 0);
    wall.castShadow = shadows;
    root.add(wall);
    const stop = { event: e, at: e.at, type: e.type, wall, done: false, open: 0, sign: null, button: null, round: 0 };
    stop.sign = addSign(e.header, X(e.at) + 0.9, 3.25, { color: wallColor, glyph: isManual ? "warning" : "error", name: "mu-stop", height: 0.6, z: 1.5 });
    if (isManual) {
      // The button hangs over the track before the barrier: bump it on the way
      const bx = X(e.at - 1.5);
      const button = new THREE.Mesh(box, [paint.plain(0x014486), paint.plain(0x014486), paint.plain(0x1b96ff), paint.plain(0x014486), faceMaterial("button", "#0176D3", "check"), paint.plain(0x014486)]);
      button.scale.set(2.2, 0.55, 1.3);
      button.position.set(bx, 1.75, 0);
      button.castShadow = shadows;
      root.add(button);
      stop.button = { mesh: button, x: bx, y: 1.75, home: { x: bx, y: 1.75 }, squash: 0 };
      stop.buttonSign = addSign(e.button, bx, 2.65, { color: SLDS.brand, glyph: "check", name: "mu-button", height: 0.55, z: 0.9 });
      stop.target = addTarget(e.at - 2, false, stop);
    }
    return stop;
  }

  /* ---------- Rings, fog, the end ---------- */

  const rings = [0, 1, 2].map(() => {
    const material = keep(new THREE.MeshBasicMaterial({ color: 0xffd84d, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
    const mesh = new THREE.Mesh(ringGeometry, material);
    mesh.visible = false;
    mesh.renderOrder = 3;
    root.add(mesh);
    return { mesh, material };
  });

  const fogTexture = paint.texture("mu-fog", 256, 128, (c, w, h) => {
    for (let i = 0; i < 9; i++) {
      const x = (i * 71) % w;
      const y = h * 0.3 + ((i * 37) % (h * 0.5));
      const r = 40 + ((i * 23) % 40);
      const g = c.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, "rgba(236,228,255,0.95)");
      g.addColorStop(1, "rgba(236,228,255,0)");
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
    }
  });
  const fogMaterial = keep(new THREE.MeshBasicMaterial({ map: fogTexture, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
  const fogPlane = paint.geometry("mu-fog-plane", () => new THREE.PlaneGeometry(1, 1));
  const fogs = [0, 1, 2].map((i) => {
    const mesh = new THREE.Mesh(fogPlane, fogMaterial);
    mesh.scale.set(16, 5, 1);
    mesh.position.set(0, 1.2 + i * 0.9, 2.2 + i * 0.3);
    mesh.visible = false;
    mesh.renderOrder = 4;
    root.add(mesh);
    return mesh;
  });

  if (endEvent) {
    const home = new THREE.Mesh(box, [paint.plain(0xffffff), paint.plain(0xffffff), paint.plain(0x1b96ff), paint.plain(0xffffff), faceMaterial("end", endEvent.color || SLDS.brand, endEvent.glyph || "cloud"), paint.plain(0xffffff)]);
    home.scale.set(3.4, 3.4, 3);
    home.position.set(X(endEvent.at) + 3.2, 1.7, -0.4);
    home.castShadow = shadows;
    root.add(home);
    if (endEvent.text) {
      addSign(endEvent.text, X(endEvent.at) + 3.2, 4.2, { color: endEvent.color || SLDS.brand, glyph: endEvent.glyph || "cloud", height: 0.75, z: 1.4, name: "mu-end" });
    }
  }

  /* ---------- The run ---------- */

  const run = { mode: "ready", offset: 0, beat: 0, prev: 0, stop: null, resumeAt: 0, rewindUntil: 0, rewindFrom: 0, cp: checkpoints[0], inv: 0, section: def.song.start || "intro", choiceStart: 0, lit: -1 };
  const player = { y: 0, vy: 0, grounded: true, coyote: 0, buffer: 0, floaty: false, squash: 0, jumps: 0, wobble: 0, pressBeat: -10 };
  const stats = { coins: coins.filter((c) => !c.hidden).length, got: 0, hits: 0, perfect: 0, streak: 0, best: 0 };
  let camX = 0;
  let camY = 2;
  let shake = 0;
  let lastCoach = -10;
  let lastPortrait = null;
  let choiceUi = null;
  let hopBeat = -1;
  const data = {};

  function setData(name, value) {
    const v = String(value);
    if (data[name] !== v) {
      data[name] = v;
      ctx.setData(name, v);
    }
  }

  function coach(text, ms, force) {
    if (!text || (!force && engine.time - lastCoach < COACH_GAP_S)) {
      return;
    }
    lastCoach = engine.time;
    hud.coach(text, ms);
  }

  /** Where the guinea pig can stand at a run beat, from a height: the top, or null over a gap. */
  function surface(beat, fromY) {
    if (fromY < -0.3) {
      return null;
    }
    const foot = FOOT / U;
    if (inGap(beat) && inGap(beat - foot) && inGap(beat + foot)) {
      return null;
    }
    return 0;
  }

  function jump() {
    const onSpring = player.grounded && springs.some((s) => Math.abs(s.at - run.beat) < 0.38);
    player.vy = V0;
    player.floaty = onSpring;
    player.grounded = false;
    player.coyote = 0;
    player.buffer = 0;
    player.jumps += 1;
    setData("jumps", player.jumps);
    music.hop();
    if (onSpring) {
      sound.play("power");
      sound.play("wheek");
      ctx.fx.burst(pig.object.position.x, 0.3, 0, { count: 18, colors: [0xe3066a, 0xff7ad9, 0xffd84d], speed: 3, up: 4, life: 0.8 });
    } else if (player.jumps % 4 === 1) {
      sound.play("wheek");
    }
    // Right on the beat of a jump that mattered: a sparkle and a few points
    const target = targets.find((x) => !x.bonus && Math.abs(x.at - run.beat) < PERFECT_BEAT);
    if (target && run.mode === "run") {
      stats.perfect += 1;
      ctx.points(5);
      ctx.fx.burst(pig.object.position.x, 0.2, 0.3, { count: 6, colors: [0xffd84d, 0xffffff], speed: 1.6, up: 2, life: 0.5 });
    }
  }

  function stepPlayer(dt) {
    const canMove = run.mode === "run" || run.mode === "stop" || run.mode === "resume" || run.mode === "end";
    if (!canMove) {
      return;
    }
    if (player.grounded) {
      const top = run.mode === "run" ? surface(run.beat, player.y) : 0;
      if (top === null) {
        player.grounded = false;
        player.coyote = COYOTE_S;
        player.vy = 0;
      } else {
        player.y = top;
      }
    }
    if (player.buffer > 0 && (player.grounded || player.coyote > 0)) {
      jump();
    }
    if (!player.grounded) {
      const fromY = player.y;
      player.vy -= (player.floaty ? G / 2 : G) * dt;
      player.y += player.vy * dt;
      const top = run.mode === "run" ? surface(run.beat, fromY) : 0;
      if (player.vy <= 0 && top !== null && player.y <= top) {
        player.y = top;
        player.vy = 0;
        player.grounded = true;
        player.floaty = false;
        player.squash = 1;
      }
    }
    player.coyote = Math.max(0, player.coyote - dt);
    player.buffer = Math.max(0, player.buffer - dt);
  }

  /* ---------- Touching things ---------- */

  function collide() {
    const x = X(run.beat);
    const y = player.y;
    if (run.inv <= 0) {
      for (const b of blocks) {
        if (b.dead || Math.abs(b.x - x) > PIG_HALF + BLOCK_W * 0.4) {
          continue;
        }
        if (y < b.h && y + PIG_TALL > 0) {
          if (player.vy < 0 && y > b.h - 0.35) {
            // Landing on top of a block is not a mistake: a bounce
            player.vy = V0 * 0.55;
            player.y = b.h;
            b.squash = 1;
            ctx.points(5);
            ctx.fx.burst(b.x, b.h, 0, { count: 8, speed: 2, up: 2, life: 0.6 });
          } else {
            hit(b.look, b);
            return;
          }
        }
      }
      if (!player.grounded && y < -0.75 && inGap(run.beat)) {
        const gap = gaps.find((g) => run.beat > g.from - 0.2 && run.beat < g.to + 0.2);
        hit(gap ? gap.look : null, null);
        return;
      }
    }
    for (const c of coins) {
      if (c.got || c.hidden) {
        continue;
      }
      if (Math.abs(c.x - x) < 0.55 && Math.abs(c.y - (y + 0.45)) < 0.8) {
        collectCoin(c);
      } else if (!c.missed && c.x < x - 1.2) {
        c.missed = true;
        stats.streak = 0;
      }
    }
    for (const p of powers) {
      if (!p.got && Math.abs(p.x - x) < 0.8 && Math.abs(p.y - (y + 0.45)) < 1.0) {
        p.got = true;
        p.mesh.visible = false;
        if (p.sign) {
          p.sign.sprite.visible = false;
        }
        ctx.fx.burst(p.x, p.y, 0, { count: 26, speed: 4, up: 4, life: 1 });
        if (p.power.note) {
          ctx.foundNote();
        } else {
          sound.play("power");
          if (calls.onPower) {
            calls.onPower(p.power);
          }
        }
      }
    }
    // The button of a manual action, bumped from below or landed on
    for (const s of stops) {
      if (s.type !== "manual" || s.done || !s.button || run.mode !== "run") {
        continue;
      }
      const b = s.button;
      if (Math.abs(b.x - x) < 1.1 + PIG_HALF && y + PIG_TALL > b.y - 0.3 && y < b.y + 0.4) {
        if (player.vy > 0) {
          player.vy = -1;
        } else {
          player.vy = V0 * 0.5;
          player.y = b.y + 0.3;
        }
        pressManual(s, true);
      }
    }
  }

  function collectCoin(c) {
    c.got = true;
    c.mesh.visible = false;
    stats.got += 1;
    stats.streak += 1;
    stats.best = Math.max(stats.best, stats.streak);
    const multiplier = 1 + Math.min(3, Math.floor(stats.streak / STREAK_STEP));
    ctx.points(10 * multiplier);
    music.note(c.order);
    if (stats.streak % STREAK_STEP === 0) {
      ctx.fx.burst(c.x, c.y, 0, { count: 30, speed: 4.5, up: 5, life: 1.1 });
      hud.toast(t("mu_streak", { n: multiplier }), "good");
    }
    if (calls.onCoin) {
      calls.onCoin(c.coin, c);
    }
  }

  function hit(look, block) {
    if (isSoft(run.beat)) {
      // A rehearsal: the guinea pig bounces off and goes on
      player.vy = V0 * 0.75;
      player.grounded = false;
      player.y = Math.max(player.y, 0);
      run.inv = 0.6;
      player.wobble = 1;
      if (block) {
        block.dead = true;
        block.popped = 1;
      }
      ctx.points(-20);
      sound.play("wrong");
      coach(t("mu_soft"), 2400);
      if (calls.onSoftHit) {
        calls.onSoftHit(look);
      }
      return;
    }
    stats.hits += 1;
    player.wobble = 1;
    shake = engine.motion ? 0.35 : 0;
    ctx.loseAttempt(look ? look.title : "", look ? look.tip : "");
    if (!ctx.playing) {
      return;
    }
    if (calls.onHit) {
      calls.onHit(look);
    }
    coach(t("mu_hit"), 2600, true);
    rewind();
  }

  /** Back to the last checkpoint, on a bar of the song. */
  function rewind() {
    run.mode = "rewind";
    run.rewindFrom = X(run.beat);
    run.rewindFromY = player.y;
    run.rewindStart = music.beat;
    run.rewindUntil = Math.ceil((music.beat + 2) / 4) * 4;
    music.setSection("break", Math.floor(music.beat / 4));
    music.setSection(run.cp.section, run.rewindUntil / 4);
    music.fill(run.rewindUntil, 1);
    stats.streak = 0;
  }

  function respawn() {
    run.offset = run.rewindUntil - run.cp.at;
    run.beat = run.cp.at;
    run.prev = run.cp.at - 0.001;
    run.mode = "run";
    run.inv = 1.2;
    run.section = run.cp.section;
    player.y = 0;
    player.vy = 0;
    player.grounded = true;
    player.buffer = 0;
    for (const c of coins) {
      if (!c.got && c.beat >= run.cp.at) {
        c.missed = false;
      }
    }
    for (const target of targets) {
      if (target.at >= run.cp.at) {
        target.cued = false;
      }
    }
    for (const trigger of triggers) {
      if (trigger.event.type === "music" && trigger.event.at > run.cp.at) {
        trigger.done = false;
      }
    }
  }

  /* ---------- Stops ---------- */

  function enterStop(stop) {
    run.mode = "stop";
    run.stop = stop;
    run.beat = stop.at;
    music.setSection("break", Math.floor(music.beat / 4));
    if (stop.type === "manual") {
      coach(t("mu_manual"), 2600, true);
    } else {
      openChoice(stop);
    }
  }

  function pressManual(stop, onTheWay) {
    if (stop.done) {
      return;
    }
    stop.done = true;
    stop.button.squash = 1;
    sound.play("gate");
    ctx.fx.burst(stop.button.mesh.position.x, stop.button.mesh.position.y, 0, { count: 30, colors: [0x0176d3, 0x1b96ff, 0xffffff, 0x2e844a], speed: 4, up: 4, life: 1 });
    if (calls.onManual) {
      calls.onManual(stop, onTheWay);
    }
    if (run.mode === "stop" && run.stop === stop) {
      resume();
    }
  }

  function resume() {
    run.mode = "resume";
    run.resumeAt = Math.ceil((music.beat + 1) / 4) * 4;
    music.setSection(run.section, run.resumeAt / 4);
    music.fill(run.resumeAt, 1);
  }

  function openChoice(stop) {
    const e = stop.event;
    stop.round = 0;
    choiceUi = document.createElement("div");
    choiceUi.className = "gr-mu-choice";
    hud.layer.appendChild(choiceUi);
    showRound(stop);
    coach(t(hud.touch ? "mu_choiceTouch" : "mu_choice"), 2800, true);
    void e;
  }

  function showRound(stop) {
    const round = stop.event.rounds[stop.round];
    choiceUi.replaceChildren();
    const prompt = document.createElement("p");
    prompt.className = "gr-mu-prompt";
    prompt.textContent = round.prompt;
    choiceUi.appendChild(prompt);
    if (round.detail) {
      const detail = document.createElement("p");
      detail.className = "gr-mu-detail";
      detail.textContent = round.detail;
      choiceUi.appendChild(detail);
    }
    const row = document.createElement("div");
    row.className = "gr-mu-options";
    choiceUi.appendChild(row);
    round.buttons = round.options.map((option, i) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gr-mu-option";
      button.textContent = option.label;
      button.addEventListener("click", () => pick(stop, i));
      row.appendChild(button);
      option.off = false;
      return button;
    });
    run.choiceStart = Math.ceil(music.beat);
    run.lit = -1;
    setData("ok", round.options.findIndex((o) => o.ok));
  }

  /** Which option is lit at a beat of the song: one per beat, the disabled ones skipped. */
  function litAt(songBeat) {
    const round = run.stop.event.rounds[run.stop.round];
    const open = round.options.map((o, i) => (o.off ? -1 : i)).filter((i) => i >= 0);
    if (songBeat < run.choiceStart || !open.length) {
      return -1;
    }
    return open[Math.floor(songBeat - run.choiceStart) % open.length];
  }

  function pick(stop, index) {
    if (run.mode !== "stop" || run.stop !== stop || !ctx.playing || index < 0) {
      return;
    }
    const round = stop.event.rounds[stop.round];
    const option = round.options[index];
    if (!option || option.off) {
      return;
    }
    if (option.ok) {
      round.buttons[index].classList.add("is-right");
      ctx.collect(150, round.lesson || option.label);
      sound.play("wheek");
      if (calls.onChoice) {
        calls.onChoice(stop, round, option, true);
      }
      stop.round += 1;
      if (stop.round < stop.event.rounds.length) {
        const next = stop;
        run.lit = -2;
        window.setTimeout(() => {
          if (choiceUi && run.stop === next && run.mode === "stop") {
            showRound(next);
          }
        }, 700);
      } else {
        stop.done = true;
        window.setTimeout(() => {
          if (choiceUi) {
            choiceUi.remove();
            choiceUi = null;
          }
        }, 600);
        run.lit = -2;
        resume();
      }
    } else {
      option.off = true;
      round.buttons[index].classList.add("is-off");
      round.buttons[index].classList.remove("is-lit");
      round.buttons[index].disabled = true;
      player.wobble = 1;
      ctx.loseAttempt(option.title || option.label, option.tip);
      if (calls.onChoice) {
        calls.onChoice(stop, round, option, false);
      }
    }
  }

  function updateChoice() {
    if (run.mode !== "stop" || !run.stop || run.stop.type !== "choice" || !choiceUi || run.lit === -2) {
      return;
    }
    const lit = litAt(music.beat);
    if (lit !== run.lit) {
      run.lit = lit;
      const round = run.stop.event.rounds[run.stop.round];
      round.buttons.forEach((b, i) => b.classList.toggle("is-lit", i === lit));
      setData("lit", lit);
    }
  }

  /* ---------- Events on the way ---------- */

  function fireTriggers() {
    for (const trigger of triggers) {
      const e = trigger.event;
      if (trigger.done) {
        continue;
      }
      // A section starts on its bar: it is asked for one beat before
      const when = e.type === "music" ? e.at - 1 : e.at;
      if (run.beat >= when && run.prev < when + 8) {
        trigger.done = true;
        if (e.type === "music") {
          run.section = e.section;
          music.setSection(e.section, Math.round((e.at + run.offset) / 4));
        } else if (e.run) {
          e.run(api);
        }
      }
    }
    for (const cp of checkpoints) {
      if (!cp.passed && cp.at > 0 && run.beat >= cp.at) {
        cp.passed = true;
        run.cp = cp;
        if (cp.cloth) {
          cp.cloth.material = paint.plain(0x2e844a, { emissive: 0x0a2a12 });
        }
        sound.play("click");
      }
    }
  }

  function cueJumps() {
    if (run.mode !== "run") {
      return;
    }
    for (const target of targets) {
      if (target.cued || target.bonus) {
        continue;
      }
      const ahead = target.at - run.beat;
      if (ahead > 0 && ahead < 0.6) {
        target.cued = true;
        const owner = target.owner;
        if (owner && owner.dead) {
          continue;
        }
        music.cue(target.at + run.offset, Boolean(owner && owner.hidden));
      }
    }
  }

  /* ---------- What is seen ---------- */

  function placeRings() {
    let used = 0;
    const portrait = engine.portrait;
    for (const target of targets) {
      const ahead = target.at - run.beat;
      if (ahead < -0.2) {
        target.marker.visible = false;
        continue;
      }
      if (ahead > RING_BEATS + 0.5) {
        break;
      }
      const owner = target.owner;
      const gone = owner && owner.dead;
      const hiddenNow = owner && owner.hidden && ahead > 1.1;
      target.marker.visible = !gone && !hiddenNow;
      if (gone || hiddenNow || used >= rings.length || run.mode !== "run") {
        continue;
      }
      const ring = rings[used++];
      const k = Math.max(0, Math.min(1, ahead / RING_BEATS));
      ring.mesh.visible = true;
      ring.mesh.position.set(X(target.at), 0.5, 0.75);
      ring.mesh.scale.setScalar(0.3 + 1.5 * k);
      ring.material.color.setHex(target.bonus ? 0xff7ad9 : ahead < 0.14 ? 0xffffff : 0xffd84d);
      ring.material.opacity = Math.min(1, (1 - k) * 1.6 + 0.15);
      target.marker.scale.set(1 + (1 - k) * 0.4, 0.6 + (1 - k) * 0.25, 1);
    }
    for (; used < rings.length; used++) {
      rings[used].mesh.visible = false;
    }
    void portrait;
  }

  function placeWorld(dt, time) {
    const x = X(run.beat);
    const pulse = engine.motion ? music.pulse : 0;
    const near = (px) => Math.abs(px - camX) < 30;
    for (const b of blocks) {
      if (!near(b.x)) {
        b.mesh.visible = false;
        continue;
      }
      if (b.popped > 0) {
        b.popped = Math.max(0, b.popped - dt * 3);
        b.mesh.scale.set(BLOCK_W * (1 + (1 - b.popped) * 0.6), b.h * b.popped, 1.1);
        b.mesh.visible = b.popped > 0.02;
        continue;
      }
      if (b.dead) {
        b.mesh.visible = false;
        continue;
      }
      b.mesh.visible = true;
      b.squash = Math.max(0, b.squash - dt * 4);
      const s = 1 + pulse * 0.07 - b.squash * 0.25;
      b.mesh.scale.set(BLOCK_W * (1 + b.squash * 0.15), b.h * s, 1.1);
      b.mesh.position.y = (b.h * s) / 2;
      if (b.hidden && b.mesh.material === ghostMaterial) {
        // In the fog a wall shows itself late, unless the log revealed it
        const ahead = b.event.at - run.beat;
        if (ahead < 1.1) {
          b.mesh.material = b.normal;
          if (b.sign) {
            b.sign.sprite.visible = true;
          }
        }
      }
    }
    for (const c of coins) {
      if (c.got || c.hidden || !near(c.x)) {
        c.mesh.visible = false;
        continue;
      }
      c.mesh.visible = true;
      c.mesh.rotation.y = Math.sin(time * 3 + c.order) * 0.6;
      c.mesh.scale.setScalar(1 + pulse * 0.18);
    }
    for (const p of powers) {
      if (p.got) {
        continue;
      }
      p.mesh.rotation.y = time * 2;
      p.mesh.position.y = p.y + Math.sin(time * 3) * 0.1;
    }
    for (const s of springs) {
      s.mesh.scale.set(1 + pulse * 0.12, 1 - pulse * 0.3, 1 + pulse * 0.12);
    }
    for (const s of stops) {
      if (s.done && s.open < 1) {
        s.open = Math.min(1, s.open + dt * 2.5);
        s.wall.position.y = 1.3 - s.open * 2.8;
        if (s.sign) {
          s.sign.sprite.visible = s.open < 0.6;
        }
      }
      if (s.button) {
        const b = s.button;
        // While the guinea pig waits at the barrier, the button comes over it
        const waiting = run.mode === "stop" && run.stop === s && !s.done;
        const wantX = waiting ? x : b.home.x;
        const wantY = waiting ? 2.55 : b.home.y;
        b.x += (wantX - b.x) * Math.min(1, dt * 6);
        b.y += (wantY - b.y) * Math.min(1, dt * 6);
        b.squash = Math.max(0, b.squash - dt * 3);
        b.mesh.position.set(b.x, b.y + Math.sin(time * 4) * 0.04, 0);
        b.mesh.scale.set(2.2 * (1 + b.squash * 0.2), 0.55 * (1 - b.squash * 0.45), 1.3);
        b.mesh.material[4] = s.done ? faceMaterial("button-done", "#2E844A", "check") : b.mesh.material[4];
        s.buttonSign.sprite.position.set(b.x, b.y + 0.9, 0.9);
        s.buttonSign.sprite.visible = !s.done;
        if (waiting && player.y + PIG_TALL > b.y - 0.35 && player.vy > 0) {
          player.vy = -2;
          pressManual(s, false);
        }
      }
    }
    // The equalizer: only the bars near the camera move
    const firstGroup = Math.max(0, Math.floor((camX - 30 + 60) / EQ_GAP));
    const lastGroup = Math.min(eqGroups - 1, Math.ceil((camX + 30 + 60) / EQ_GAP));
    const beat = music.beat;
    for (let g = firstGroup; g <= lastGroup; g++) {
      for (let k = 0; k < 3; k++) {
        const i = g * 3 + k;
        const level = 0.5 + 0.5 * Math.sin(beat * Math.PI * (k === 1 ? 1 : 0.5) + g * 1.3 + k);
        const h = 1.2 + k * 0.4 + (engine.motion ? level * 1.6 + music.pulse * (k === 0 ? 1.4 : 0.6) : 0.8);
        dummy.position.set(-60 + g * EQ_GAP + k * 1.05, h / 2 - 0.2, -8);
        dummy.scale.set(0.85, h, 0.85);
        dummy.updateMatrix();
        eq.setMatrixAt(i, dummy.matrix);
      }
    }
    eq.instanceMatrix.needsUpdate = true;
    trackMaterial.emissiveIntensity = engine.motion ? music.pulse * 0.08 : 0;
    // The fog of a zone, around the guinea pig while it is in it
    let fog = 0;
    for (const z of fogZones) {
      const into = Math.min(run.beat - z.from, z.to - run.beat);
      fog = Math.max(fog, Math.max(0, Math.min(1, (into + 2) / 3)));
    }
    fogMaterial.opacity = fog * 0.45;
    fogs.forEach((mesh, i) => {
      mesh.visible = fog > 0.01;
      mesh.position.x = camX + Math.sin(time * 0.3 + i * 2) * 2 + (i - 1) * 6;
    });
    engine.hemi.intensity = 1.6 - fog * 0.5;
    // Signs grow on a portrait screen, so their words stay readable
    const portrait = engine.portrait;
    if (portrait !== lastPortrait) {
      lastPortrait = portrait;
      for (const s of signs) {
        s.sprite.scale.copy(s.base).multiplyScalar(portrait ? 1.5 : 1);
      }
    }
  }

  function placePig(dt, time) {
    let x = X(run.beat);
    let y = player.y;
    if (run.mode === "rewind") {
      // Flying back to the checkpoint, on an arc, with the song going on
      const k = Math.min(1, (music.beat - run.rewindStart) / Math.max(0.5, run.rewindUntil - run.rewindStart));
      const e = k * k * (3 - 2 * k);
      x = run.rewindFrom + (X(run.cp.at) - run.rewindFrom) * e;
      y = (run.rewindFromY || 0) * (1 - e) + Math.sin(Math.PI * e) * 2.5;
    }
    pig.object.position.set(x, y, 0);
    player.squash = Math.max(0, player.squash - dt * 5);
    const s = player.squash;
    const stretch = player.grounded ? 0 : Math.min(0.12, Math.abs(player.vy) * 0.008);
    pig.object.scale.set(1 + s * 0.12 - stretch * 0.5, 1 - s * 0.16 + stretch, 1 + s * 0.12 - stretch * 0.5);
    if (player.wobble > 0) {
      player.wobble = Math.max(0, player.wobble - dt * 1.6);
      pig.hitWobble(player.wobble);
    }
    const overGround = run.mode !== "rewind" && surface(run.beat, 0) !== null;
    pig.shadow.visible = overGround;
    pig.shadow.position.set(x, 0.012, 0.05);
    const running = run.mode === "run" && player.grounded;
    pig.state = { running, airborne: !player.grounded || run.mode === "rewind", ducking: false, speed: running ? U / spb : 0, height: Math.max(0, y) };
    // Blink while it cannot be hurt
    pig.object.visible = run.inv <= 0 || Math.floor(time * 12) % 2 === 0;
  }

  function placeCamera(dt) {
    const portrait = engine.portrait;
    const fov = portrait ? 62 : 44;
    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    const px = pig.object.position.x;
    const lead = portrait ? 3.1 : 5;
    const wantX = px + lead;
    camX = run.mode === "rewind" ? camX + (wantX - camX) * Math.min(1, dt * 5) : wantX;
    const wantY = 2 + Math.max(0, pig.object.position.y - 1.6) * 0.65;
    camY += (wantY - camY) * Math.min(1, dt * 4);
    shake = Math.max(0, shake - dt);
    const jitter = shake > 0 ? (Math.random() - 0.5) * shake : 0;
    const distance = portrait ? 17.5 : 12.5;
    camera.position.set(camX + jitter, camY + (portrait ? 1.2 : 0.9), distance);
    camera.lookAt(camX, camY + (portrait ? -0.4 : 0.75), 0);
    engine.aimSun(px, 0);
  }

  function writeData() {
    setData("mode", run.mode);
    setData("beat", run.beat.toFixed(2));
    setData("y", player.y.toFixed(1));
    const next = targets.find((x) => !x.bonus && x.at > run.beat - 0.05 && !(x.owner && x.owner.dead) && !(x.owner && x.owner.done));
    setData("jumpat", next ? next.at : "none");
    setData("stopped", run.mode === "stop" ? "yes" : "no");
    setData("stopkind", run.mode === "stop" && run.stop ? run.stop.type : "");
  }

  /* ---------- What a world can use ---------- */

  const api = {
    music,
    stats,
    get beat() {
      return run.beat;
    },
    get mode() {
      return run.mode;
    },
    get playing() {
      return ctx.playing;
    },
    coach,
    /** The walls of a group appear, before the guinea pig reaches them. */
    reveal(group) {
      for (const b of blocks) {
        if (b.look.group === group && b.hidden) {
          b.hidden = false;
          b.mesh.material = b.normal;
          if (b.sign) {
            b.sign.sprite.visible = true;
          }
          b.target.marker.visible = true;
        }
      }
    },
    /** The blocks of a group, still ahead, turn into coins. */
    convert(group) {
      let n = 0;
      for (const b of blocks) {
        if (b.look.group === group && !b.dead && b.x > X(run.beat) + 0.4) {
          b.dead = true;
          b.popped = 1;
          n += 1;
          ctx.fx.burst(b.x, b.h, 0, { count: 10, colors: [0x2e844a, 0x45c65a, 0xffffff], speed: 3, up: 4, life: 0.8 });
          if (b.convert) {
            b.convert.hidden = false;
            b.convert.mesh.visible = true;
            stats.coins += 1;
          }
        }
      }
      return n;
    },
    /** How many blocks of a group are still standing. */
    standing(group) {
      return blocks.filter((b) => b.look.group === group && !b.dead).length;
    },
    coinsOf(id) {
      const list = coins.filter((c) => c.coin.id === id && !c.hidden);
      return { total: list.length, got: list.filter((c) => c.got).length };
    },
    powerTaken(id) {
      return powers.some((p) => p.power.id === id && p.got);
    },
    x: X
  };

  // The intro card shows the start, the guinea pig facing the way to go
  pig.object.rotation.set(0, -Math.PI / 2, 0);
  pig.shadow.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
  placePig(0, 0);
  placeWorld(0, 0);
  placeRings();
  placeCamera(1);
  setData("jumps", 0);
  writeData();

  return Object.assign(api, {
    start() {
      music.start();
      music.setSection(def.song.start || "intro", 0);
      run.mode = "run";
      run.offset = 0;
      // guinea-at=N (for checks): start at the last checkpoint before run beat N
      const at = Number(ctx.params && ctx.params.startAt) || 0;
      if (at > 0) {
        const cp = checkpoints.filter((c) => c.at <= at).pop();
        run.cp = cp;
        run.offset = -cp.at;
        run.beat = cp.at;
        run.prev = cp.at;
        run.section = cp.section;
        music.setSection(cp.section, 0);
        for (const c of checkpoints) {
          c.passed = c.at <= cp.at;
        }
        for (const trigger of triggers) {
          if (trigger.event.at <= cp.at) {
            trigger.done = true;
            if (trigger.event.type === "script") {
              trigger.event.run(api);
            }
          }
        }
        for (const target of targets) {
          target.cued = target.at < cp.at;
        }
      }
      coach(t(hud.touch ? "mu_startTouch" : "mu_start"), 3000, true);
    },
    update(dt, time) {
      if (!ctx.playing) {
        return;
      }
      music.update(dt);
      run.prev = run.beat;
      run.inv = Math.max(0, run.inv - dt / spb);
      if (run.mode === "run") {
        run.beat = music.beat - run.offset;
        const stop = stops.find((s) => !s.done && run.prev <= s.at + 0.001 && run.beat >= s.at);
        if (stop) {
          enterStop(stop);
        } else if (run.beat >= endBeat) {
          run.beat = endBeat;
          run.mode = "end";
          music.setSection(def.song.end || "lounge", Math.floor(music.beat / 4) + 1);
          if (calls.onEnd) {
            calls.onEnd();
          }
          if (!ctx.playing) {
            return;
          }
        }
      } else if (run.mode === "resume" && music.beat >= run.resumeAt) {
        run.offset = run.resumeAt - run.stop.at;
        run.stop = null;
        run.mode = "run";
        run.beat = music.beat - run.offset;
      } else if (run.mode === "rewind" && music.beat >= run.rewindUntil) {
        respawn();
      }
      if (run.mode === "run") {
        fireTriggers();
        if (!ctx.playing) {
          return;
        }
        cueJumps();
      }
      if (run.mode === "end" && player.grounded && Math.floor(music.beat) !== hopBeat) {
        // At the end, a little happy hop on each beat
        hopBeat = Math.floor(music.beat);
        player.vy = V0 * 0.45;
        player.grounded = false;
      }
      stepPlayer(dt);
      if (run.mode === "run") {
        collide();
        if (!ctx.playing) {
          return;
        }
      }
      updateChoice();
      placeWorld(dt, time);
      placeRings();
      placePig(dt, time);
      placeCamera(dt);
      writeData();
    },
    action(name) {
      if (run.mode === "end") {
        if (calls.onEndAction) {
          calls.onEndAction(name);
        }
        return;
      }
      if (name !== "jump" && name !== "tap" && name !== "confirm") {
        return;
      }
      if (run.mode === "stop" && run.stop && run.stop.type === "choice") {
        // The press counts for what is lit: what the player sees
        pick(run.stop, litAt(music.beat));
      }
      if (run.mode === "run" || run.mode === "stop" || run.mode === "resume") {
        player.buffer = BUFFER_S;
        player.pressBeat = run.beat;
      }
    },
    /** The world is over: the last chord. */
    finale() {
      music.finale();
    },
    idleCamera(time) {
      const portrait = engine.portrait;
      camera.fov = portrait ? 62 : 44;
      camera.updateProjectionMatrix();
      const px = pig.object.position.x;
      const sway = Math.sin(time * 0.4) * 0.8;
      camera.position.set(px + 2.5 + sway, (portrait ? 3 : 2.6), portrait ? 15 : 10.5);
      camera.lookAt(px + 2.5, portrait ? 0.6 : 1.2, 0);
      engine.aimSun(px, 0);
    },
    dispose() {
      music.dispose();
      if (choiceUi) {
        choiceUi.remove();
        choiceUi = null;
      }
      pig.object.scale.set(1, 1, 1);
      pig.object.visible = true;
      pig.shadow.rotation.set(-Math.PI / 2, 0, 0);
      pig.shadow.visible = true;
      for (const thing of own) {
        thing.dispose();
      }
    }
  });
}
