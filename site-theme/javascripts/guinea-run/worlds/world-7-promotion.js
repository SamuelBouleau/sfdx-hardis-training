/*
 * World 7, Promote to uat and preprod (Labs 3.5 and 3.10): a runner up the
 * pipeline, carrying the release.
 *
 * In uat (Lab 3.5): the merge method doors, where squash empties the release
 * notes; the package-no-overwrite shield that keeps UAT's warehouse endpoint;
 * the Pull Requests and tickets of the release notes to collect.
 * In preprod (Lab 3.10): five stories in uat, three approved. The guinea pig
 * builds a promotion branch with the three approved ones only, carried as
 * wagons behind it, then meets the cherry-pick of US-059 that conflicts,
 * because it was written on top of US-058, which preprod never saw.
 *
 * The goal line always says what is next: the notes to fill, the door to
 * pick, the manual step to mark as done, the stories to carry.
 */
import { createRunner, RUNNER_TEXTS, RUNNER_CSS } from "./runner.js";

export const PADS = ["left", "right", "jump", "duck", "confirm"];
// The Kenney packs the runner draws the track with
export const MODELS = ["platform", "nature"];

const UAT_LENGTH = 400;
const PREPROD_LENGTH = 420;
const NOTES_FULL = 20;
const APPROVED = ["us057", "us059", "us061"];
const NOT_APPROVED = ["us058", "us060"];
const STORY_LABELS = { us057: "US-057", us058: "US-058", us059: "US-059", us060: "US-060", us061: "US-061" };
// Where the stories come down the track, and where they are all behind
const STORIES_AT = UAT_LENGTH + 30;
const STORIES_END = STORIES_AT + 70 + 20 + 4 * 22 + 6;

export const TEXTS = {
  en: {
    ...RUNNER_TEXTS.en,
    intro: "Integration is green: now the release climbs to uat, then to preprod. The release is Thursday and the date does not move.",
    how1: "Collect Pull Requests and tickets: they fill the release notes",
    how2: "Arrows or swipe to pick a door: read the question first",
    how3: "In preprod, carry only the 3 approved stories, the green ones",
    note: "Preview Upcoming Promotion Notes: the one to use on a Wednesday, when somebody asks what Thursday's release will contain. I never found it. - V.",
    s0: "uat",
    s1: "preprod",
    notes: "Promotion Notes - uat: Pull Requests {{prs}}, Tickets {{tickets}}",
    goalNotes: "Fill the Promotion Notes: {{n}} / 20",
    goalNotesFull: "Promotion Notes full: keep running to preprod",
    goalDoor: "Read the question, steer into the right door",
    goalStop: "Press Enter: mark the manual step as done",
    goalStopTouch: "Tap the screen: mark the manual step as done",
    goalStories: "Carry the 3 approved stories (green): {{n}} / 3",
    goalEnd: "Run to preprod: Thursday's release",
    coachStart: "Collect Pull Requests and tickets!",
    coachStories: "Green stories only: dodge the grey ones!",
    coachFull: "Promotion Notes full!",
    coachWagon: "{{id}} hooked on!",
    mergeQ: "Merge the promotion into uat. Which merge method?",
    promoQ: "Five stories in uat, three approved, release Thursday. How do you promote?",
    pickQ: "The cherry-pick of US-059 conflicts in the Panel Batch layout. What do you keep?",
    mergeBanner: "Merge the promotion into uat:",
    doorSquash: "Squash and merge",
    doorMergeCommit: "Create a merge commit",
    doorRebase: "Rebase and merge",
    doorSquash_s: "Squash",
    doorMergeCommit_s: "Merge commit",
    doorRebase_s: "Rebase",
    squashTip: "Use the arrow beside the green button and pick Create a merge commit: the release notes, the retrofit and the next promotion need every commit.",
    notesEmptied: "Squashed: the release notes are empty",
    o_warehouse: "Helios_Warehouse would point UAT at production",
    o_warehouse_tip: "Add RemoteSiteSetting Helios_Warehouse to manifest/package-no-overwrite.xml: present means protected.",
    o_warehouse_s: "Prod URL",
    o_token: "Release notes: no git provider token",
    o_token_tip: "Without a token the release notes do not stop: they warn, collect zero Pull Requests, and write a perfectly formatted empty document.",
    o_token_s: "No token",
    o_markers: "Cannot merge into preprod: Git conflict markers in the promotion branch",
    o_markers_tip: "Nothing was deployed. Solve the markers on the promotion branch, commit, push.",
    o_markers_s: "Conflict markers",
    o_lateuat: "In uat: 1 to do by hand",
    o_lateuat_tip: "The manual step runs once in every org: do it in helios-uat, mark it as done, then re-run the jobs.",
    o_lateuat_s: "Manual step",
    p_shield: "package-no-overwrite: Helios_Warehouse skipped, protected",
    p_shield_s: "No Overwrite",
    p_preview: "Preview Upcoming Promotion Notes",
    p_preview_s: "Preview",
    p_retry: "Re-run all jobs: one more attempt",
    p_retry_s: "Re-run jobs",
    item_pr: "Pull Request",
    item_ticket: "Ticket",
    item_us: "{{id}} approved",
    stopTitle: "Set Email Deliverability to All Email",
    stopHeader: "In uat: 1 to do by hand",
    stopHint: "The manual action runs in every org: do it in helios-uat too.",
    stopButton: "Mark as done (Enter)",
    stopButtonTouch: "Mark as done (tap)",
    stopDone: "Done in uat too: the promotion goes on",
    promoBanner: "Five stories in uat, three approved. Release Thursday.",
    doorAll: "Promote everything to preprod",
    doorAllTip: "The ordinary promotion is all or nothing: it would take US-058 and US-060, which nobody approved.",
    doorBranch: "Create a promotion branch: US-057, US-059, US-061",
    doorWait: "Wait until every story is approved",
    doorWaitTip: "The release is Thursday and the date does not move: the warehouse cutover depends on it.",
    doorAll_s: "Promote all",
    doorBranch_s: "Promotion branch",
    doorWait_s: "Wait",
    notApproved: "{{id}} is not approved: it stays in uat",
    notApprovedTip: "Only the approved stories go into the promotion branch. The others wait in uat for the next one.",
    carried: "{{id}} on the promotion branch",
    pickBanner: "Cherry-pick of US-059: conflict in the Panel Batch layout and Helios_Delivery_Manager",
    doorKeep: "Keep the Supplier entry, leave Warranty Years out",
    doorTake: "Take Warranty_Years__c in too",
    doorTakeTip: "preprod has no Warranty_Years__c field: a layout or permission set naming it fails to deploy. It came from US-058, which preprod never saw.",
    doorDrop: "Leave US-059 out of the promotion",
    doorDropTip: "US-059 is approved: dropping it makes the promotion lie about the week. The conflict is git being exact, not git being difficult.",
    doorKeep_s: "Keep Supplier",
    doorTake_s: "Add Warranty",
    doorDrop_s: "Drop US-059",
    mariiaSquash: "GitHub remembers the last merge method. Look at the arrow before you click.",
    romainWarehouse: "package-no-overwrite: present means protected. UAT keeps pointing at warehouse-test.helios.invalid.",
    us061Line: "US-061, approved: the gate code on the installation, so that I get in without phoning the customer at seven in the morning.",
    arrived: "preprod is ready for Thursday: three stories, and notes that say why.",
    shortNotes: "Release notes thin: collect the Pull Requests and tickets",
    shortNotesInfo: "The Promotion Notes listed {{n}} Pull Requests and tickets out of 20 or more. A release manager reads them before every promotion: what is missing there is what nobody checks.",
    missedStories: "The promotion branch carried {{n}} of the 3 approved stories: the others wait in uat for the next promotion, and Thursday's release is short of them."
  },
  fr: {
    ...RUNNER_TEXTS.fr,
    intro: "Integration est au vert : la release monte en uat, puis en preprod. La release est jeudi et la date ne bouge pas.",
    how1: "Récupérez les Pull Requests et tickets : ils remplissent les notes",
    how2: "Flèches ou swipe pour choisir une porte : lisez d'abord la question",
    how3: "En preprod, ne prenez que les 3 stories approuvées, les vertes",
    note: "Preview Upcoming Promotion Notes : celle à utiliser le mercredi, quand quelqu'un demande ce que contiendra la release du jeudi. Je ne l'ai jamais trouvée. - V.",
    s0: "uat",
    s1: "preprod",
    notes: "Promotion Notes - uat : Pull Requests {{prs}}, Tickets {{tickets}}",
    goalNotes: "Remplissez les Promotion Notes : {{n}} / 20",
    goalNotesFull: "Promotion Notes pleines : continuez vers preprod",
    goalDoor: "Lisez la question, prenez la bonne porte",
    goalStop: "Appuyez sur Entrée : marquez l'étape manuelle comme faite",
    goalStopTouch: "Touchez l'écran : marquez l'étape manuelle comme faite",
    goalStories: "Prenez les 3 stories approuvées (vertes) : {{n}} / 3",
    goalEnd: "Filez vers preprod : la release du jeudi",
    coachStart: "Récupérez les Pull Requests et les tickets !",
    coachStories: "Seulement les stories vertes : évitez les grises !",
    coachFull: "Promotion Notes pleines !",
    coachWagon: "{{id}} accrochée !",
    mergeQ: "Merger la promotion dans uat. Quelle méthode de merge ?",
    promoQ: "Cinq stories en uat, trois approuvées, release jeudi. Comment promouvoir ?",
    pickQ: "Le cherry-pick de US-059 est en conflit dans le layout Panel Batch. Que gardez-vous ?",
    mergeBanner: "Merger la promotion dans uat :",
    doorSquash: "Squash and merge",
    doorMergeCommit: "Create a merge commit",
    doorRebase: "Rebase and merge",
    doorSquash_s: "Squash",
    doorMergeCommit_s: "Merge commit",
    doorRebase_s: "Rebase",
    squashTip: "Utilisez la flèche à côté du bouton vert et choisissez Create a merge commit : les notes de release, le retrofit et la promotion suivante ont besoin de chaque commit.",
    notesEmptied: "Squashée : les notes de release sont vides",
    o_warehouse: "Helios_Warehouse pointerait UAT vers la production",
    o_warehouse_tip: "Ajoutez RemoteSiteSetting Helios_Warehouse à manifest/package-no-overwrite.xml : présent veut dire protégé.",
    o_warehouse_s: "URL de prod",
    o_token: "Notes de release : pas de token du git provider",
    o_token_tip: "Sans token, les notes de release ne s'arrêtent pas : elles avertissent, ne récupèrent aucune Pull Request, et écrivent un document vide parfaitement formaté.",
    o_token_s: "Pas de token",
    o_markers: "Cannot merge into preprod : marqueurs de conflit Git dans la branch de promotion",
    o_markers_tip: "Rien n'a été déployé. Résolvez les marqueurs sur la branch de promotion, commitez, poussez.",
    o_markers_s: "Marqueurs de conflit",
    o_lateuat: "In uat: 1 to do by hand",
    o_lateuat_tip: "L'étape manuelle s'exécute une fois dans chaque org : faites-la dans helios-uat, marquez-la comme faite, puis relancez les jobs.",
    o_lateuat_s: "Étape manuelle",
    p_shield: "package-no-overwrite : Helios_Warehouse ignoré, protégé",
    p_shield_s: "No Overwrite",
    p_preview: "Preview Upcoming Promotion Notes",
    p_preview_s: "Preview",
    p_retry: "Re-run all jobs : un essai de plus",
    p_retry_s: "Re-run jobs",
    item_pr: "Pull Request",
    item_ticket: "Ticket",
    item_us: "{{id}} approuvée",
    stopTitle: "Set Email Deliverability to All Email",
    stopHeader: "In uat: 1 to do by hand",
    stopHint: "L'action manuelle s'exécute dans chaque org : faites-la aussi dans helios-uat.",
    stopButton: "Mark as done (Entrée)",
    stopButtonTouch: "Mark as done (toucher)",
    stopDone: "Faite en uat aussi : la promotion continue",
    promoBanner: "Cinq stories en uat, trois approuvées. Release jeudi.",
    doorAll: "Tout promouvoir en preprod",
    doorAllTip: "La promotion ordinaire, c'est tout ou rien : elle prendrait US-058 et US-060, que personne n'a approuvées.",
    doorBranch: "Créer une branch de promotion : US-057, US-059, US-061",
    doorWait: "Attendre que toutes les stories soient approuvées",
    doorWaitTip: "La release est jeudi et la date ne bouge pas : la bascule de l'entrepôt en dépend.",
    doorAll_s: "Tout promouvoir",
    doorBranch_s: "Branch de promotion",
    doorWait_s: "Attendre",
    notApproved: "{{id}} n'est pas approuvée : elle reste en uat",
    notApprovedTip: "Seules les stories approuvées vont dans la branch de promotion. Les autres attendent la suivante en uat.",
    carried: "{{id}} sur la branch de promotion",
    pickBanner: "Cherry-pick de US-059 : conflit dans le layout Panel Batch et Helios_Delivery_Manager",
    doorKeep: "Garder l'entrée Supplier, laisser Warranty Years de côté",
    doorTake: "Prendre aussi Warranty_Years__c",
    doorTakeTip: "preprod n'a pas de champ Warranty_Years__c : un layout ou un permission set qui le nomme échoue au déploiement. Il venait de US-058, que preprod n'a jamais vue.",
    doorDrop: "Laisser US-059 hors de la promotion",
    doorDropTip: "US-059 est approuvée : l'écarter fait mentir la promotion sur la semaine. Le conflit, c'est git qui est exact, pas git qui est difficile.",
    doorKeep_s: "Garder Supplier",
    doorTake_s: "Ajouter Warranty",
    doorDrop_s: "Écarter US-059",
    mariiaSquash: "GitHub retient la dernière méthode de merge. Regardez la flèche avant de cliquer.",
    romainWarehouse: "package-no-overwrite : présent veut dire protégé. UAT continue de pointer vers warehouse-test.helios.invalid.",
    us061Line: "US-061, approuvée : le code du portail sur l'installation, pour entrer sans appeler le client à sept heures du matin.",
    arrived: "preprod est prête pour jeudi : trois stories, et des notes qui disent pourquoi.",
    shortNotes: "Notes de release maigres : récupérez les Pull Requests et les tickets",
    shortNotesInfo: "Les Promotion Notes listaient {{n}} Pull Requests et tickets sur 20 ou plus. Un release manager les lit avant chaque promotion : ce qui y manque, personne ne le vérifie.",
    missedStories: "La branch de promotion a pris {{n}} des 3 stories approuvées : les autres attendent la prochaine promotion en uat, et la release du jeudi s'en passe."
  }
};

/** The strings taken word for word from the labs, checked by scripts/verify/check-easter-egg.mjs. */
export const QUOTES = [
  { lab: "3.5", text: "warehouse-test.helios.invalid" },
  { lab: "3.5", text: "Helios_Warehouse" },
  { lab: "3.5", text: "Squash and merge" },
  { lab: "3.5", text: "Preview Upcoming Promotion Notes" },
  { lab: "3.10", text: "Create a merge commit" },
  { lab: "3.10", text: "Warranty_Years__c" },
  { lab: "3.10", text: "US-057" },
  { lab: "3.10", text: "US-059" },
  { lab: "3.10", text: "US-061" }
];

export function createWorld(ctx) {
  const { t, hud, THREE } = ctx;
  const verdict = ctx.judgePlan();
  let finished = false;
  let prs = 0;
  let tickets = 0;
  let notesCheered = false;
  const carried = [];
  // What the goal line is about: notes, a door, the manual stop, the stories
  let nearGate = null;
  let stoppedNow = false;

  const ob = (move, key, theme, detail) => ({ move, title: "o_" + key, tip: "o_" + key + "_tip", short: "o_" + key + "_s", theme: theme || "error", detail });
  const storyItem = (id) =>
    APPROVED.includes(id)
      ? { glyph: "check", color: "#2E844A", label: STORY_LABELS[id], signGlyph: "check", points: 0, big: true }
      : { glyph: "lock", color: "#706E6B", label: STORY_LABELS[id], signGlyph: "lock", points: 0, bad: true };

  const config = {
    sections: [
      { name: t("s0"), color: 0x9050e9, length: UAT_LENGTH, speed: 11, obstacles: ["warehouse", "token"], items: ["pr", "ticket"], powers: ["shield", "retry"], doubles: 0.25 },
      { name: t("s1"), color: 0xdd7a01, length: PREPROD_LENGTH, speed: 12.5, obstacles: ["markers", "token", "warehouse"], items: ["pr", "ticket"], powers: ["shield", "retry"], doubles: 0.35 }
    ],
    spacing: [11, 18],
    obstacles: {
      warehouse: ob("lane", "warehouse", "warning", "warehouse-test.helios.invalid"),
      token: ob("duck", "token", "warning", "0 Pull Requests"),
      markers: ob("lane", "markers", "error", "<<<<<<< HEAD"),
      lateuat: ob("lane", "lateuat", "warning", "manual")
    },
    items: {
      pr: { glyph: "branch", color: "#0176D3", label: t("item_pr"), points: 10 },
      ticket: { glyph: "note", color: "#06A59A", label: t("item_ticket"), points: 10 },
      us057: storyItem("us057"),
      us058: storyItem("us058"),
      us059: storyItem("us059"),
      us060: storyItem("us060"),
      us061: storyItem("us061"),
      note: { glyph: "note", color: "#F2C94C", label: "?", points: 0 }
    },
    powers: {
      shield: { glyph: "shield", color: "#032D60", label: "no-overwrite", short: "p_shield_s", effect: "shield", seconds: 6, toast: "p_shield" },
      preview: { glyph: "eye", color: "#9050E9", label: "Preview", short: "p_preview_s", effect: "custom" },
      retry: { glyph: "loop", color: "#2E844A", label: "Re-run all jobs", short: "p_retry_s", effect: "attempt", toast: "p_retry" }
    },
    gates(index) {
      if (index === 0) {
        if (!promoSpec) {
          promoSpec = quiz(t("promoQ"), "preprod", [
            { text: t("doorBranch"), short: t("doorBranch_s"), ok: true },
            { text: t("doorAll"), short: t("doorAll_s"), tip: t("doorAllTip") },
            { text: t("doorWait"), short: t("doorWait_s"), tip: t("doorWaitTip") }
          ]);
        }
        return promoSpec;
      }
      return null;
    },
    script: [
      { at: 10, mergeDoors: true },
      { at: 120, manual: true },
      { at: 200, preview: true },
      { at: STORIES_AT, stories: true },
      { at: UAT_LENGTH + 230, cherryPick: true },
      { at: UAT_LENGTH + 300, note: true }
    ]
  };
  // The runner asks for the gate again each time it lays a row: build it once
  let promoSpec = null;

  function quiz(question, sign, answers) {
    const lanes = [0, 1, 2].sort(() => ctx.random() - 0.5);
    const doors = [];
    answers.forEach((answer, i) => {
      doors[lanes[i]] = Object.assign({ look: "quiz", ok: Boolean(answer.ok) }, answer);
    });
    return { doors, question, sign, quiz: true };
  }

  const runner = createRunner(ctx, config);

  /* ---------- The release notes counter, under the top bar ---------- */

  const counter = document.createElement("div");
  counter.className = "gr-w7-notes";
  const counterText = document.createElement("span");
  const bar = document.createElement("i");
  const fill = document.createElement("b");
  bar.appendChild(fill);
  counter.append(counterText, bar);
  hud.extra.appendChild(counter);
  function renderNotes() {
    const n = prs + tickets;
    counterText.textContent = t("notes", { prs, tickets });
    fill.style.width = Math.min(100, (n / NOTES_FULL) * 100) + "%";
    counter.classList.toggle("is-full", n >= NOTES_FULL);
    ctx.setData("notes", n);
    ctx.setData("carried", carried.length);
  }
  renderNotes();

  /** The goal line: always the next thing to do. */
  function updateGoal() {
    if (finished) {
      hud.goal("");
      return;
    }
    if (stoppedNow) {
      hud.goal(t(hud.touch ? "goalStopTouch" : "goalStop"));
      return;
    }
    if (nearGate) {
      hud.goal(t("goalDoor"));
      return;
    }
    const d = runner.distance;
    if (d >= STORIES_AT && d < STORIES_END) {
      hud.goal(t("goalStories", { n: carried.length }));
      return;
    }
    const n = prs + tickets;
    if (d < STORIES_AT) {
      hud.goal(n >= NOTES_FULL ? t("goalNotesFull") : t("goalNotes", { n }));
      return;
    }
    hud.goal(t("goalEnd"));
  }

  /* ---------- The story wagons behind the guinea pig ---------- */

  // Each approved story carried is a small green wagon that follows the
  // guinea pig, each one following the one before
  const wagonBody = ctx.paint.geometry("w7-wagon", () => new THREE.BoxGeometry(0.5, 0.3, 0.5));
  const wagonMaterial = ctx.paint.plain(0x2e844a, { roughness: 0.4, emissive: 0x0d3a1c, emissiveIntensity: 0.4 });
  const wagons = [];

  function addWagon(id) {
    const group = new THREE.Group();
    // A small crate when the platform pack is there, a green box otherwise
    const crate = runner.model("crate", { w: 0.5, h: 0.45, d: 0.5 });
    const body = crate || new THREE.Mesh(wagonBody, wagonMaterial);
    body.position.y = crate ? 0 : 0.2;
    group.add(body);
    const sign = ctx.paint.sign("wagon", STORY_LABELS[id], { color: "#2E844A", glyph: "check", height: 0.24 });
    sign.position.y = 0.52;
    group.add(sign);
    const pig = ctx.pig.object.position;
    group.position.set(pig.x, 0, 1.25 + 0.85 * wagons.length);
    ctx.root.add(group);
    wagons.push(group);
    ctx.fx.burst(pig.x, 0.8, group.position.z, { count: 24, colors: [0x2e844a, 0x45c65a, 0xffb400], speed: 3, up: 4 });
  }

  function moveWagons(dt, time) {
    let leadX = ctx.pig.object.position.x;
    const ease = Math.min(1, dt * 9);
    wagons.forEach((wagon, i) => {
      wagon.position.x += (leadX - wagon.position.x) * ease;
      wagon.position.y = Math.abs(Math.sin(time * 9 + i)) * 0.05;
      leadX = wagon.position.x;
    });
  }

  function onScript(step) {
    const ahead = 70;
    if (step.mergeDoors) {
      hud.chat("mariia", t("mariiaSquash"), 5000);
      const spec = quiz(t("mergeQ"), "uat", [
        { text: t("doorMergeCommit"), short: t("doorMergeCommit_s"), ok: true, mergeCommit: true },
        { text: t("doorSquash"), short: t("doorSquash_s"), tip: t("squashTip"), squash: true },
        { text: t("doorRebase"), short: t("doorRebase_s"), tip: t("squashTip"), squash: true }
      ]);
      runner.spawnGate(spec, step.at + ahead + 20);
    }
    if (step.manual) {
      // The manual action runs once in every org: uat too
      if (verdict.deliverability.ok) {
        runner.spawnStop({ header: t("stopHeader"), title: t("stopTitle"), hint: t("stopHint"), button: t(hud.touch ? "stopButtonTouch" : "stopButton") }, step.at + ahead);
      } else {
        runner.spawnObstacle("lateuat", 1, step.at + ahead);
      }
      hud.chat("romain", t("romainWarehouse"), 5000);
    }
    if (step.preview) {
      runner.spawnPower("preview", Math.floor(ctx.random() * 3), step.at + ahead);
    }
    if (step.stories) {
      // The five stories of uat come down the track: carry only the approved ones
      const order = APPROVED.concat(NOT_APPROVED).sort(() => ctx.random() - 0.5);
      order.forEach((id, i) => {
        runner.spawnItem(id, i % 3, step.at + ahead + 20 + i * 22, 0.85);
      });
      hud.chat("mariia", t("us061Line"), 6000);
      runner.coach(t("coachStories"), 2800, true);
      updateGoal();
    }
    if (step.cherryPick) {
      const spec = quiz(t("pickQ"), "US-059", [
        { text: t("doorKeep"), short: t("doorKeep_s"), ok: true },
        { text: t("doorTake"), short: t("doorTake_s"), tip: t("doorTakeTip") },
        { text: t("doorDrop"), short: t("doorDrop_s"), tip: t("doorDropTip") }
      ]);
      runner.spawnGate(spec, step.at + ahead);
    }
    if (step.note) {
      // Victor's note: high in the air, in the right lane, for a jump
      runner.calm(step.at + ahead);
      runner.spawnItem("note", 2, step.at + ahead, 1.7, { label: false });
    }
  }

  function onEvent(event) {
    switch (event.type) {
      case "script":
        onScript(event.step);
        return;
      case "section":
        updateGoal();
        return;
      case "gateNear":
        nearGate = event.gate;
        updateGoal();
        return;
      case "stop":
        ctx.sound.play("gate");
        stoppedNow = true;
        updateGoal();
        return;
      case "item":
        if (event.kind === "note") {
          ctx.foundNote();
          return;
        }
        if (event.kind === "pr" || event.kind === "ticket") {
          if (event.kind === "pr") {
            prs = Math.min(prs + 1, 22);
          } else {
            tickets = Math.min(tickets + 1, 17);
          }
          renderNotes();
          runner.handle(event);
          if (prs + tickets >= NOTES_FULL && !notesCheered) {
            notesCheered = true;
            ctx.fx.burst(0, 2, -1, { count: 50, speed: 6, up: 6 });
            ctx.sound.play("happy");
            runner.coach(t("coachFull"), 1800, true);
          }
          updateGoal();
          return;
        }
        if (APPROVED.includes(event.kind)) {
          carried.push(event.kind);
          addWagon(event.kind);
          ctx.collect(100, t("carried", { id: STORY_LABELS[event.kind] }));
          runner.hop();
          runner.coach(t("coachWagon", { id: STORY_LABELS[event.kind] }), 1400, true);
          renderNotes();
          updateGoal();
          return;
        }
        if (NOT_APPROVED.includes(event.kind)) {
          runner.breakStreak();
          ctx.loseAttempt(t("notApproved", { id: STORY_LABELS[event.kind] }), t("notApprovedTip"));
          return;
        }
        runner.handle(event);
        return;
      case "power":
        if (event.kind === "preview") {
          ctx.sound.play("power");
          hud.toast(t("p_preview") + ": " + t("notes", { prs: 22, tickets: 17 }), "power");
          runner.magnet(120, ["pr", "ticket"]);
          ctx.fx.burst(event.object.x, 1.2, 0, { count: 30, speed: 4, up: 5 });
          return;
        }
        runner.handle(event);
        return;
      case "gate":
        nearGate = null;
        if (!event.ok && event.door.squash) {
          // Squash takes the history away: the release notes have nothing to read
          prs = 0;
          tickets = 0;
          notesCheered = false;
          renderNotes();
          hud.toast(t("notesEmptied"), "bad");
        }
        runner.handle(event);
        updateGoal();
        return;
      case "end": {
        finished = true;
        hud.goal("");
        const full = prs + tickets;
        hud.toast(full >= NOTES_FULL ? t("arrived") : t("shortNotes"), full >= NOTES_FULL ? "good" : "bad");
        const info = [full >= NOTES_FULL ? "" : t("shortNotesInfo", { n: full }), carried.length < APPROVED.length ? t("missedStories", { n: carried.length }) : ""].filter(Boolean).join(" ");
        // Full notes and every approved story are worth a bonus
        ctx.finish(full * 5 + carried.length * 50, info);
        return;
      }
      default:
        runner.handle(event);
    }
  }

  // The goal follows the track: refreshed when the stretch of the stories
  // starts and ends, not every frame
  let stretch = -1;
  let greeted = false;

  return {
    start() {
      updateGoal();
    },
    update(dt, time) {
      if (finished) {
        return;
      }
      // The first instruction, once the world is really playing
      if (!greeted) {
        greeted = true;
        runner.coach(t("coachStart"), 2600, true);
      }
      const events = runner.update(dt, time);
      for (const event of events) {
        onEvent(event);
        if (!ctx.playing) {
          return;
        }
      }
      moveWagons(dt, time);
      const d = runner.distance;
      const now = d < STORIES_AT ? 0 : d < STORIES_END ? 1 : 2;
      if (now !== stretch) {
        stretch = now;
        updateGoal();
      }
    },
    action(name) {
      if (runner.action(name) === "release") {
        runner.release();
        stoppedNow = false;
        ctx.collect(150, t("stopDone"));
        runner.hop();
        updateGoal();
      }
    },
    dispose() {
      runner.dispose();
      counter.remove();
      for (const wagon of wagons) {
        ctx.root.remove(wagon);
      }
      ctx.pig.setRiders([]);
    }
  };
}

export const CSS =
  RUNNER_CSS +
  `
.guinea-run .gr-w7-notes {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 12px;
  border: 2px solid #ffffff;
  border-left: 6px solid #9050e9;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 3px 0 rgba(3, 45, 96, 0.25);
  color: #032d60;
  font-size: 13px;
  font-weight: 700;
  pointer-events: none;
}
.guinea-run .gr-w7-notes i {
  display: block;
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: #e8edf3;
}
.guinea-run .gr-w7-notes b {
  display: block;
  width: 0;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #9050e9, #e3066a);
  transition: width 0.25s;
}
.guinea-run .gr-w7-notes.is-full b {
  background: linear-gradient(90deg, #2e844a, #45c65a);
}
@media (max-width: 600px) {
  .guinea-run .gr-w7-notes {
    padding: 4px 8px;
    font-size: 11px;
  }
}
`;
