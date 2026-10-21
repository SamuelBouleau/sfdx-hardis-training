/*
 * World 3, Open the Pull Request (Labs 1.6, 2.2, 2.3, 2.4): a puzzle at the
 * desk. The guinea pig sits in front of its Pull Request and gets it green:
 * 1. pick the right base, or the check waits forever on "Expected"
 * 2. answer the deployment check: three real failures and their fixes
 * 3. declare the deployment actions the release needs, before or after the
 *    metadata deployment, in order, and leave out what is not an action
 *
 * The plan is saved as it is committed, right or wrong: worlds 6 to 8 build
 * their gates from it, so a misplaced action comes back as a closed door.
 */
import { DEPLOYMENT_ACTIONS } from "../core/story.js";
import { SLDS, fitText, glyph } from "../core/painter.js";

export const PADS = ["left", "right", "jump", "duck", "confirm"];

/** The Kenney office pack (desk, chair, plant, rug, bookcase); the Salesforce items always load. */
export const MODELS = ["office"];

export const TEXTS = {
  en: {
    intro: "US-014 is committed and published. Open its Pull Request and get it ready to merge.",
    how1: "Pick the right base for the Pull Request",
    how2: "The check is red: pick the fix for each error",
    how3: "Sort the deployment actions: Before, After, or bin",
    goal1: "Pick the base of your Pull Request",
    goal2: "The deployment check is red: pick the fix ({{n}} of 3)",
    goal3: "Sort the 5 cards: Before, After, or not an action",
    coach1: "Which base? Read it carefully!",
    coach2: "Red check! Read the error, pick the fix",
    coach3: "Now sort the deployment actions",
    wrongShort: "Not this one",
    monitorWait: "Waiting for a base",
    monitorFail: "Check failed",
    monitorGreen: "All checks passed",
    monitorDone: "Ready to merge",
    note: "A PR template is a reminder of what to write, not something to hand in as it came. Nobody reads mine either. - V.",
    prTitle: "US-014 Show the crew how many panels a job needs",
    step1: "1. Base",
    step2: "2. Deployment check",
    step3: "3. Deployment actions",
    baseQuestion: "Open the Pull Request: which base?",
    baseUpstream: "base: hardisgroupcom/sfdx-hardis-training : integration",
    baseMain: "base: your fork : main",
    baseFork: "base: your fork : integration",
    baseUpstreamTip: "The base is the original repository: the check stays on Expected forever. Check base and compare before clicking, every single time.",
    baseMainTip: "A User Story goes to integration first. main is production.",
    baseOk: "Base: your fork, integration. The check starts.",
    checkFailed: "Simulate Deployment failed",
    checkGreen: "All checks have passed",
    q1: "The check fails on the permission set:",
    q1a: "Add Installation__c.Panels_Required__c to the Pull Request, next to the permission set",
    q1b: "Create the field by hand in helios-integration",
    q1c: "Remove Helios_Delivery_Crew from the Pull Request",
    q1bTip: "Anything you do by hand in one org, you will have to do in every org. The field must travel with the permission set.",
    q1cTip: "Without its permission set, the field deploys green and nobody can see it.",
    q1Ok: "A permission set grants a field: they travel together.",
    q2: "A teammate's flow, on the same Pull Request now, fails with:",
    q2a: "Is it in the package? Retrieve Crew_Warning_Sent__c with the Metadata Retriever, commit, publish again",
    q2b: "Is it in the org? Open Setup and check the field exists",
    q2c: "Re-run all jobs until it passes",
    q2bTip: "The field does exist in the org. A pipeline never reads a developer's org: what is not committed does not exist. Ask is it in the package before is it in the org.",
    q2cTip: "Nothing changes between two runs: the field is still not in the package.",
    q2Ok: "Ask 'is it in the package' before 'is it in the org'.",
    q3: "Mega-Linter is still running. The merge box says:",
    q3a: "Wait for the required checks, or fix and push again",
    q3b: "Ask an admin to bypass the branch protection",
    q3c: "Close the Pull Request and open a new one",
    q3bTip: "There is no way around it, and there is not meant to be: a robot checks your work before a human does.",
    q3cTip: "A new Pull Request runs the same checks from the start. Wait for them, or fix and push.",
    q3Ok: "There is no way around it, and there is not meant to be.",
    actionsTitle: "Deployment Actions",
    actionsHint: "Place each action before or after the metadata deployment, in the order it must run. One card is not a deployment action: throw it away.",
    actionsKeys: "Keys: left / right pick a card, up = Before, down = After, Enter = not an action. Touch: tap a card, then a column.",
    before: "Before Metadata Deployment",
    after: "After Metadata Deployment",
    bin: "Not a deployment action",
    deployment: "Metadata deployment",
    reset: "Start the board again",
    commit: "Commit and push the actions",
    planMissing: "Place every card first",
    decoy: "Write the manual steps in a Confluence page",
    decoyTip: "A manual step that gets done, versus one that lives in a Confluence page nobody opens: declare it as a manual action.",
    wrongPre: "{{label}} cannot run before the deployment: what it needs only exists once the metadata is deployed.",
    wrongPost: "{{label}} must happen with the org as it was, before anything is deployed.",
    wrongOrder: "The reference data must be loaded before the batch that reads it is scheduled.",
    wrongDecoy: "{{label}} is not a deployment action.",
    wrongDeclared: "{{label}} is a deployment action: undeclared, it happens once in your org and nowhere else, forever.",
    planSaved: "Actions committed: the next deployments run them",
    planWrong: "Committed with mistakes: the deployments will stop on them",
    planKept: "Your plan was committed with mistakes ({{mistakes}}). World 6 runs it exactly as you declared it: watch the pre-deployment part.",
    templateShow: "Show the rest of the Pull Request template",
    templateLine: "<!-- Victor: ...",
    mariiaPlan: "Deployment actions are defined with the Pull Request, and run during the deployment. Same file for everyone.",
    mariiaBase: "Check base and compare before clicking, every single time.",
    selected: "Selected: {{label}}"
  },
  fr: {
    intro: "US-014 est commitée et publiée. Ouvrez sa Pull Request et préparez-la pour le merge.",
    how1: "Choisissez la bonne base pour la Pull Request",
    how2: "Le contrôle est rouge : choisissez le correctif de chaque erreur",
    how3: "Rangez les actions de déploiement : Avant, Après, ou poubelle",
    goal1: "Choisissez la base de votre Pull Request",
    goal2: "Le contrôle de déploiement est rouge : choisissez le correctif ({{n}} sur 3)",
    goal3: "Rangez les 5 cartes : Avant, Après, ou pas une action",
    coach1: "Quelle base ? Lisez bien !",
    coach2: "Contrôle rouge ! Lisez l'erreur, choisissez le correctif",
    coach3: "Maintenant, rangez les actions de déploiement",
    wrongShort: "Pas celle-ci",
    monitorWait: "En attente d'une base",
    monitorFail: "Contrôle en échec",
    monitorGreen: "Tous les contrôles passent",
    monitorDone: "Prête pour le merge",
    note: "Un template de PR rappelle quoi écrire, ce n'est pas un formulaire à rendre tel quel. Personne ne lit le mien non plus. - V.",
    prTitle: "US-014 Show the crew how many panels a job needs",
    step1: "1. Base",
    step2: "2. Contrôle de déploiement",
    step3: "3. Actions de déploiement",
    baseQuestion: "Ouvrir la Pull Request : quelle base ?",
    baseUpstream: "base: hardisgroupcom/sfdx-hardis-training : integration",
    baseMain: "base: votre fork : main",
    baseFork: "base: votre fork : integration",
    baseUpstreamTip: "La base est le repository d'origine : le contrôle reste sur Expected pour toujours. Vérifiez base et compare avant de cliquer, à chaque fois.",
    baseMainTip: "Une User Story va d'abord en integration. main, c'est la production.",
    baseOk: "Base : votre fork, integration. Le contrôle démarre.",
    checkFailed: "Simulate Deployment en échec",
    checkGreen: "Tous les contrôles sont passés",
    q1: "Le contrôle échoue sur le permission set :",
    q1a: "Ajouter Installation__c.Panels_Required__c à la Pull Request, à côté du permission set",
    q1b: "Créer le champ à la main dans helios-integration",
    q1c: "Retirer Helios_Delivery_Crew de la Pull Request",
    q1bTip: "Tout ce que vous faites à la main dans une org, vous devrez le faire dans chaque org. Le champ doit voyager avec le permission set.",
    q1cTip: "Sans son permission set, le champ se déploie au vert et personne ne le voit.",
    q1Ok: "Un permission set accorde un champ : ils voyagent ensemble.",
    q2: "Le flow d'une collègue, sur la même Pull Request maintenant, échoue avec :",
    q2a: "Est-ce dans le package ? Récupérer Crew_Warning_Sent__c avec le Metadata Retriever, commiter, republier",
    q2b: "Est-ce dans l'org ? Ouvrir Setup et vérifier que le champ existe",
    q2c: "Relancer tous les jobs jusqu'à ce que ça passe",
    q2bTip: "Le champ existe bien dans l'org. Un pipeline ne lit jamais l'org d'un développeur : ce qui n'est pas commité n'existe pas. Demandez-vous s'il est dans le package avant de vous demander s'il est dans l'org.",
    q2cTip: "Rien ne change entre deux exécutions : le champ n'est toujours pas dans le package.",
    q2Ok: "Demandez-vous « est-ce dans le package » avant « est-ce dans l'org ».",
    q3: "Mega-Linter tourne encore. La zone de merge dit :",
    q3a: "Attendre les contrôles obligatoires, ou corriger et pousser à nouveau",
    q3b: "Demander à un admin de contourner la protection de branch",
    q3c: "Fermer la Pull Request et en ouvrir une nouvelle",
    q3bTip: "Il n'y a pas de contournement, et il n'est pas censé y en avoir : un robot vérifie votre travail avant un humain.",
    q3cTip: "Une nouvelle Pull Request relance les mêmes contrôles depuis le début. Attendez-les, ou corrigez et poussez.",
    q3Ok: "Il n'y a pas de contournement, et il n'est pas censé y en avoir.",
    actionsTitle: "Deployment Actions",
    actionsHint: "Placez chaque action avant ou après le déploiement des metadata, dans l'ordre où elle doit s'exécuter. Une carte n'est pas une action de déploiement : jetez-la.",
    actionsKeys: "Clavier : gauche / droite choisissent une carte, haut = Before, bas = After, Entrée = pas une action. Tactile : touchez une carte, puis une colonne.",
    before: "Before Metadata Deployment",
    after: "After Metadata Deployment",
    bin: "Pas une action de déploiement",
    deployment: "Déploiement des metadata",
    reset: "Recommencer le tableau",
    commit: "Commiter et pousser les actions",
    planMissing: "Placez d'abord toutes les cartes",
    decoy: "Écrire les étapes manuelles dans une page Confluence",
    decoyTip: "Une étape manuelle qui se fait, contre une étape qui vit dans une page Confluence que personne n'ouvre : déclarez-la comme action manuelle.",
    wrongPre: "{{label}} ne peut pas s'exécuter avant le déploiement : ce dont elle a besoin n'existe qu'une fois les metadata déployées.",
    wrongPost: "{{label}} doit se faire avec l'org telle qu'elle était, avant tout déploiement.",
    wrongOrder: "Les données de référence doivent être chargées avant de planifier le batch qui les lit.",
    wrongDecoy: "{{label}} n'est pas une action de déploiement.",
    wrongDeclared: "{{label}} est une action de déploiement : non déclarée, elle se fait une fois dans votre org et nulle part ailleurs, pour toujours.",
    planSaved: "Actions commitées : les prochains déploiements les exécutent",
    planWrong: "Commitées avec des erreurs : les déploiements s'arrêteront dessus",
    planKept: "Votre plan a été commité avec des erreurs ({{mistakes}}). Le monde 6 l'exécute exactement comme vous l'avez déclaré : surveillez la partie pré-déploiement.",
    templateShow: "Afficher la suite du template de Pull Request",
    templateLine: "<!-- Victor: ...",
    mariiaPlan: "Les actions de déploiement se définissent avec la Pull Request, et s'exécutent pendant le déploiement. Le même fichier pour tout le monde.",
    mariiaBase: "Vérifiez base et compare avant de cliquer, à chaque fois.",
    selected: "Sélectionnée : {{label}}"
  }
};

/** The strings taken word for word from the labs, checked by scripts/verify/check-easter-egg.mjs. */
export const QUOTES = [
  { lab: "1.6", text: "INVALID_CROSS_REFERENCE_KEY" },
  { lab: "1.6", text: "hardisgroupcom/sfdx-hardis-training" },
  { lab: "2.2", text: "Crew_Warning_Sent__c" },
  { lab: "2.2", text: "Metadata Retriever" },
  { lab: "2.3", text: "After Metadata Deployment" },
  { lab: "2.3", text: "Backfill Crew Size on existing installations" },
  { lab: "2.4", text: "Before Metadata Deployment" },
  { lab: "2.4", text: "Set Email Deliverability to All Email" },
  { lab: "2.4", text: "Load crew capacity reference data" },
  { lab: "2.4", text: "Schedule the nightly crew capacity recalculation" }
];

// The failing checks: the exact errors of the labs, and the answers
const QUESTIONS = [
  {
    id: "q1",
    error: "Helios_Delivery_Crew: INVALID_CROSS_REFERENCE_KEY: In field: field - no CustomField named Installation__c.Panels_Required__c found",
    answers: [
      { key: "q1a", ok: true },
      { key: "q1b", tip: "q1bTip" },
      { key: "q1c", tip: "q1cTip" }
    ],
    lesson: "q1Ok"
  },
  {
    id: "q2",
    error: 'The field "Crew_Warning_Sent__c" for the object "Installation__c" doesn\'t exist.',
    answers: [
      { key: "q2a", ok: true },
      { key: "q2b", tip: "q2bTip" },
      { key: "q2c", tip: "q2cTip" }
    ],
    lesson: "q2Ok"
  },
  {
    id: "q3",
    error: "Merging is blocked",
    answers: [
      { key: "q3a", ok: true },
      { key: "q3b", tip: "q3bTip" },
      { key: "q3c", tip: "q3cTip" }
    ],
    lesson: "q3Ok"
  }
];

const TYPE_COLORS = { manual: SLDS.warningDark, apex: SLDS.purple, data: SLDS.teal, "schedule-batch": SLDS.brand, decoy: SLDS.grey };

function el(tag, className, parent, text) {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  if (text !== undefined) {
    node.textContent = text;
  }
  if (parent) {
    parent.appendChild(node);
  }
  return node;
}

export function createWorld(ctx) {
  const { THREE, t, hud, pig, root, paint } = ctx;
  let phase = "base";
  let choice = 0;
  let bounce = 0;
  let wobble = 0;
  let finished = false;
  // A second wrong plan is committed as it is: world 6 then runs it, mistakes included
  let planTries = 0;
  let questionStart = 0;
  let elapsed = 0;

  /* ---------- The desk, in 3D ---------- */

  /**
   * A model of the office pack at a spot, or null if the pack did not load:
   * each caller keeps its own shape for that case.
   */
  function model(name, options, x, y, z, turn) {
    const thing = ctx.models && ctx.models.get(name, options);
    if (!thing) {
      return null;
    }
    thing.position.set(x, y, z);
    thing.rotation.y = turn || 0;
    thing.userData.size = thing.scale.x;
    root.add(thing);
    return thing;
  }

  /** Stretches a model to a footprint, for furniture the scene was laid out around. */
  function fit(thing, width, depth) {
    const size = new THREE.Box3().setFromObject(thing).getSize(new THREE.Vector3());
    thing.scale.x *= width / Math.max(size.x, 1e-3);
    thing.scale.z *= depth / Math.max(size.z, 1e-3);
  }

  const floor = new THREE.Mesh(paint.geometry("floor", () => new THREE.CylinderGeometry(3.4, 3.5, 0.2, 48)), paint.plain(0xbfe9f5, { roughness: 0.8 }));
  // A round rug under the chair, a wall with the Cloudity plaque, a plant
  if (!model("rugRound", { width: 2.3, shadows: false }, 0, 0.005, 0.15)) {
    const rug = new THREE.Mesh(paint.geometry("rug", () => new THREE.CylinderGeometry(1.15, 1.15, 0.03, 40)), paint.plain(0xff9e2c, { roughness: 0.9 }));
    rug.position.set(0, 0.015, 0.15);
    root.add(rug);
  }
  const wall = new THREE.Mesh(paint.geometry("wall", () => new THREE.BoxGeometry(5.2, 2.8, 0.12)), paint.plain(0xfde7f0, { roughness: 0.9 }));
  wall.position.set(0, 1.4, -2.1);
  root.add(wall);
  // The Cloudity logo on the wall, in 3D; the flat plaque if the items did not load
  if (!model("cloudity-logo", { width: 1.1 }, -1.75, 2.15, -2.0)) {
    const plaque = new THREE.Mesh(paint.geometry("plaque", () => new THREE.PlaneGeometry(1.3, 0.63)), paint.plaque());
    plaque.position.set(-1.45, 2.1, -2.03);
    root.add(plaque);
  }
  // What the Pull Request carries: the package of the delta, on the desk
  model("package-xml", { height: 0.3 }, 0.62, 0.8, -1.05, -0.4);
  if (!model("pottedPlant", { height: 1.1 }, 1.75, 0, -1.3)) {
    const pot = new THREE.Mesh(paint.geometry("pot", () => new THREE.CylinderGeometry(0.2, 0.15, 0.36, 18)), paint.plain(0x0176d3));
    pot.position.set(1.7, 0.18, -1.3);
    root.add(pot);
    const leaves = paint.plain(0x2e844a, { roughness: 0.7 });
    [[1.7, 0.6, -1.3, 0.3], [1.55, 0.82, -1.25, 0.22], [1.86, 0.78, -1.36, 0.2]].forEach(([x, y, z, r]) => {
      const leaf = new THREE.Mesh(paint.geometry("leaf", () => new THREE.SphereGeometry(1, 14, 10)), leaves);
      leaf.scale.setScalar(r);
      leaf.position.set(x, y, z);
      root.add(leaf);
    });
  }
  // A bookcase, a bin and a small plant: an office someone works in
  model("bookcaseOpen", { height: 1.7 }, -2.15, 0, -1.65);
  model("books", { height: 0.25, shadows: false }, -0.95, 0.8, -1.2, 0.3);
  model("trashcan", { height: 0.42 }, 1.25, 0, 0.45);
  model("plantSmall2", { height: 0.32, shadows: false }, 0.95, 0.8, -1.2);
  floor.position.y = -0.1;
  floor.receiveShadow = true;
  root.add(floor);
  // The desk top stays at 0.8, where the monitor, the mug and the paws are
  const deskModel = model("desk", { height: 0.8 }, 0, 0, -0.9);
  if (deskModel) {
    fit(deskModel, 2.4, 1.1);
  } else {
    const desk = new THREE.Mesh(paint.geometry("desk", () => new THREE.BoxGeometry(2.4, 0.1, 1.1)), paint.plain(0xc8a27a, { roughness: 0.7 }));
    desk.position.set(0, 0.75, -0.9);
    root.add(desk);
    for (const x of [-1.1, 1.1]) {
      const leg = new THREE.Mesh(paint.geometry("leg", () => new THREE.BoxGeometry(0.08, 0.75, 0.9)), paint.plain(0x8a6a4a));
      leg.position.set(x, 0.37, -0.9);
      root.add(leg);
    }
  }
  // The monitor shows one big status, readable from the camera
  const MONITOR = {
    wait: { color: SLDS.warningDark, glyph: "warning", key: "monitorWait" },
    fail: { color: SLDS.error, glyph: "error", key: "monitorFail" },
    green: { color: SLDS.success, glyph: "check", key: "monitorGreen" },
    done: { color: SLDS.brand, glyph: "star", key: "monitorDone" }
  };
  const screens = {};
  for (const [name, look] of Object.entries(MONITOR)) {
    screens[name] = paint.texture("monitor-" + name + ctx.lang, 512, 320, (c, w, h) => {
      c.fillStyle = look.color;
      c.fillRect(0, 0, w, h);
      c.fillStyle = "rgba(255,255,255,0.16)";
      c.fillRect(0, 0, w, 64);
      c.fillStyle = "#ffffff";
      c.textAlign = "left";
      c.textBaseline = "middle";
      fitText(c, "#14 US-014", 24, 34, w - 48, 34, "700");
      glyph(c, look.glyph, w / 2, 150, 110, "#ffffff");
      c.textAlign = "center";
      fitText(c, t(look.key), w / 2, 262, w - 40, 50, "800");
    });
  }
  const screenTexture = screens.wait;
  const monitor = new THREE.Mesh(paint.geometry("monitor", () => new THREE.BoxGeometry(1.3, 0.82, 0.06)), [
    paint.plain(0x222222),
    paint.plain(0x222222),
    paint.plain(0x222222),
    paint.plain(0x222222),
    paint.plain(0xffffff, { map: screenTexture, emissive: 0xffffff, emissiveMap: screenTexture, emissiveIntensity: 0.6 }),
    paint.plain(0x222222)
  ]);
  const screenMaterial = monitor.material[4];
  // Above the monitor, the status of the check in 3D: it follows the screen
  const STATUS = { wait: "check-warn", fail: "check-fail", green: "check-pass", done: "pull-request" };
  const statusItems = {};
  for (const [state, item] of Object.entries(STATUS)) {
    const thing = model(item, { height: 0.42, shadows: false }, 0.35, 1.98, -1.25);
    if (thing) {
      thing.visible = false;
      statusItems[state] = thing;
    }
  }
  let statusShown = null;
  let statusPop = 0;
  function setMonitor(name) {
    screenMaterial.map = screens[name];
    screenMaterial.emissiveMap = screens[name];
    screenMaterial.needsUpdate = true;
    if (statusShown) {
      statusShown.visible = false;
    }
    statusShown = statusItems[name] || null;
    if (statusShown) {
      statusShown.visible = true;
      statusPop = 0;
    }
  }
  monitor.position.set(0, 1.32, -1.25);
  monitor.rotation.y = 0;
  root.add(monitor);
  const stand = new THREE.Mesh(paint.geometry("stand", () => new THREE.BoxGeometry(0.1, 0.3, 0.1)), paint.plain(0x333333));
  stand.position.set(0, 0.95, -1.27);
  root.add(stand);
  const mug = new THREE.Mesh(paint.geometry("mug", () => new THREE.CylinderGeometry(0.08, 0.07, 0.16, 16)), paint.plain(0x0176d3));
  mug.position.set(0.85, 0.88, -0.75);
  root.add(mug);
  // The guinea pig on a chair, at the desk
  // Its back behind the guinea pig, which faces the desk (-Z)
  if (!model("chairDesk", { height: 1.15 }, 0, 0, 0.2, Math.PI)) {
    const chair = new THREE.Mesh(paint.geometry("chair", () => new THREE.CylinderGeometry(0.45, 0.45, 0.12, 24)), paint.plain(0x032d60));
    chair.position.set(0, 0.45, 0.1);
    root.add(chair);
  }
  pig.setSitting(true);
  // On the seat of the chair: lower for the Blender model, whose sit pose already lifts it
  const SEAT = ctx.models && ctx.models.has("chairDesk") ? 0.3 : 0.5;
  pig.object.position.set(0, SEAT, 0.1);
  pig.object.rotation.y = 0;
  pig.shadow.visible = false;

  /**
   * The desk seen from the side, the guinea pig in profile facing its monitor.
   * The view is shifted so the scene sits beside the Pull Request panel: on
   * its left on a wide screen, above it on a phone.
   */
  function placeCamera(time) {
    const camera = ctx.camera;
    const portrait = ctx.engine.portrait;
    const sway = Math.sin(time * 0.3) * 0.12;
    if (portrait) {
      camera.position.set(4.2 + sway, 2.6, 2.4);
    } else {
      camera.position.set(4.8 + sway, 2.4, 1.8);
    }
    camera.lookAt(0, 0.85, -0.55);
    camera.fov = portrait ? 56 : 42;
    const canvas = ctx.engine.renderer.domElement;
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    const wide = w > 700;
    camera.setViewOffset(w, h, wide ? w * 0.22 : 0, wide ? 0 : h * 0.24, w, h);
    camera.updateProjectionMatrix();
    ctx.engine.aimSun(0, 0);
  }

  /* ---------- The Pull Request page, in HTML ---------- */

  const page = el("div", "gr-w3 gr-scroll", hud.layer);
  const header = el("div", "gr-w3-head", page);
  el("span", "gr-w3-pr", header, "#14");
  el("strong", "", header, t("prTitle"));
  const steps = el("ol", "gr-w3-steps", page);
  const stepNodes = ["step1", "step2", "step3"].map((key) => el("li", "", steps, t(key)));
  const body = el("div", "gr-w3-body", page);
  // Victor's note hides at the end of the Pull Request template
  const template = el("details", "gr-w3-template", page);
  const summary = el("summary", "", template, t("templateShow"));
  summary.setAttribute("data-w3", "template");
  el("pre", "", template, "## What this changes\n\n## How to test\n\n" + t("templateLine"));
  template.addEventListener("toggle", () => {
    if (template.open && ctx.playing) {
      ctx.foundNote();
    }
  });

  let coached = -1;
  function setStep(index, n) {
    stepNodes.forEach((node, i) => {
      node.className = i < index ? "is-done" : i === index ? "is-current" : "";
    });
    ctx.setData("phase", phase);
    hud.goal(t("goal" + (index + 1), { n: (n || 0) + 1 }));
    if (coached !== index) {
      coached = index;
      hud.coach(t("coach" + (index + 1)));
    }
    setMonitor(index === 0 ? "wait" : index === 1 ? "fail" : "green");
  }

  function happy() {
    bounce = 0.5;
    ctx.sound.play("wheek");
    ctx.fx.burst(0, 1.6, -0.6, { count: 26, speed: 3, up: 4 });
  }

  function sad() {
    wobble = 0.6;
  }

  /** A question with its answers as buttons. onAnswer(answer) decides. */
  function renderChoices(question, error, answers, onAnswer) {
    body.replaceChildren();
    el("p", "gr-w3-question", body, question);
    if (error) {
      const box = el("div", "gr-w3-error", body);
      el("strong", "", box, t("checkFailed"));
      el("code", "", box, error);
    }
    const list = el("div", "gr-w3-answers", body);
    const buttons = answers.map((answer, i) => {
      const button = el("button", "gr-w3-answer", list, answer.text);
      button.type = "button";
      button.addEventListener("click", () => {
        choice = i;
        highlight();
        onAnswer(answer, button);
      });
      return button;
    });
    choice = 0;
    function highlight() {
      buttons.forEach((b, i) => b.classList.toggle("is-chosen", i === choice));
    }
    highlight();
    current = {
      move(step) {
        choice = (choice + step + buttons.length) % buttons.length;
        highlight();
      },
      confirm() {
        buttons[choice].click();
      }
    };
  }

  let current = null;

  /* ---------- Step 1: the base ---------- */

  function showBase() {
    phase = "base";
    setStep(0);
    const answers = [
      { text: t("baseUpstream"), tip: t("baseUpstreamTip") },
      { text: t("baseFork"), ok: true },
      { text: t("baseMain"), tip: t("baseMainTip") }
    ];
    renderChoices(t("baseQuestion"), null, answers, (answer, button) => {
      if (answer.ok) {
        happy();
        ctx.collect(100, t("baseOk"));
        showQuestion(0);
      } else {
        sad();
        button.disabled = true;
        button.classList.add("is-wrong");
        ctx.loseAttempt(t("wrongShort"), answer.tip);
        if (ctx.playing) {
          hud.chat("mariia", t("mariiaBase"));
        }
      }
    });
  }

  /* ---------- Step 2: the deployment check ---------- */

  function showQuestion(index) {
    phase = "check";
    setStep(1, index);
    questionStart = elapsed;
    ctx.setData("fixed", index);
    const q = QUESTIONS[index];
    // The right answer is never in the same place twice
    const answers = q.answers.map((a) => ({ text: t(a.key), ok: a.ok, tip: a.tip ? t(a.tip) : "" })).sort(() => ctx.random() - 0.5);
    renderChoices(t(q.id), q.error, answers, (answer, button) => {
      if (answer.ok) {
        happy();
        // Faster is worth more: up to 3 times the points
        const fast = Math.max(0, 1 - (elapsed - questionStart) / 20);
        ctx.collect(Math.round(100 + 200 * fast), t(q.lesson));
        if (index + 1 < QUESTIONS.length) {
          showQuestion(index + 1);
        } else {
          ctx.setData("fixed", QUESTIONS.length);
          hud.toast(t("checkGreen"), "good");
          showActions();
        }
      } else {
        sad();
        button.disabled = true;
        button.classList.add("is-wrong");
        ctx.loseAttempt(t("wrongShort"), answer.tip);
      }
    });
  }

  /* ---------- Step 3: the deployment actions ---------- */

  const decoy = { id: "decoy", type: "decoy", label: "" };
  let hand = [];
  let before = [];
  let after = [];
  let binned = [];
  let selected = 0;

  function showActions() {
    phase = "actions";
    setStep(2);
    hud.chat("mariia", t("mariiaPlan"), 6000);
    decoy.label = t("decoy");
    hand = DEPLOYMENT_ACTIONS.concat([decoy]).sort(() => ctx.random() - 0.5);
    before = [];
    after = [];
    binned = [];
    selected = 0;
    renderBoard();
  }

  function cardNode(action, parent, index, where) {
    const card = el("button", "gr-w3-card", parent);
    card.type = "button";
    card.style.setProperty("--gr-w3-type", TYPE_COLORS[action.type]);
    el("span", "gr-w3-type", card, action.type === "decoy" ? "?" : action.type);
    el("span", "gr-w3-label", card, action.label);
    if (where === "hand") {
      card.classList.toggle("is-chosen", index === selected);
      card.addEventListener("click", () => {
        selected = index;
        renderBoard();
        hud.toast(t("selected", { label: action.label }), "power");
      });
    } else {
      // A placed card goes back to the hand when tapped
      card.addEventListener("click", () => {
        before = before.filter((a) => a !== action);
        after = after.filter((a) => a !== action);
        binned = binned.filter((a) => a !== action);
        hand.push(action);
        selected = hand.length - 1;
        renderBoard();
      });
    }
    return card;
  }

  function renderBoard() {
    body.replaceChildren();
    el("p", "gr-w3-question", body, t("actionsTitle"));
    el("p", "gr-w3-hint", body, t("actionsHint"));
    el("p", "gr-w3-keys", body, t("actionsKeys"));
    const handRow = el("div", "gr-w3-hand", body);
    hand.forEach((action, i) => cardNode(action, handRow, i, "hand"));
    const board = el("div", "gr-w3-board", body);
    const column = (title, list, where) => {
      const col = el("div", "gr-w3-col gr-w3-col--" + where, board);
      const head = el("button", "gr-w3-col-head", col, title);
      head.type = "button";
      head.addEventListener("click", () => place(where));
      list.forEach((action, i) => {
        const row = el("div", "gr-w3-slot", col);
        el("span", "gr-w3-order", row, String(i + 1));
        cardNode(action, row, i, where);
      });
      return col;
    };
    column(t("before"), before, "before");
    el("div", "gr-w3-deploy", board, t("deployment"));
    column(t("after"), after, "after");
    column(t("bin"), binned, "bin");
    const actions = el("div", "gr-w3-buttons", body);
    const reset = el("button", "gr-button", actions, t("reset"));
    reset.type = "button";
    reset.addEventListener("click", showActions);
    const commit = el("button", "gr-button gr-primary", actions, t("commit"));
    commit.type = "button";
    commit.setAttribute("data-w3", "commit");
    commit.disabled = hand.length > 0;
    commit.addEventListener("click", commitPlan);
    ctx.setData("plan", "pre:" + before.map((a) => a.id).join(",") + "|post:" + after.map((a) => a.id).join(",") + "|bin:" + binned.map((a) => a.id).join(","));
    current = {
      move(step) {
        if (hand.length) {
          selected = (selected + step + hand.length) % hand.length;
          renderBoard();
        }
      },
      confirm() {
        if (hand.length) {
          place("bin");
        } else {
          commitPlan();
        }
      }
    };
  }

  function place(where) {
    if (!hand.length) {
      return;
    }
    const action = hand.splice(Math.min(selected, hand.length - 1), 1)[0];
    (where === "before" ? before : where === "after" ? after : binned).push(action);
    selected = Math.min(selected, Math.max(0, hand.length - 1));
    ctx.sound.play("click");
    renderBoard();
  }

  function commitPlan() {
    if (hand.length) {
      hud.toast(t("planMissing"), "bad");
      return;
    }
    const plan = { pre: before.filter((a) => a.id !== "decoy").map((a) => a.id), post: after.filter((a) => a.id !== "decoy").map((a) => a.id) };
    ctx.savePlan(plan);
    const verdict = ctx.judgePlan();
    const mistakes = [];
    for (const action of DEPLOYMENT_ACTIONS) {
      const v = verdict[action.id];
      if (binned.includes(action)) {
        mistakes.push({ action, text: t("wrongDeclared", { label: action.label }) });
      } else if (!v.ok) {
        if (action.when === "post" && before.includes(action)) {
          mistakes.push({ action, text: t("wrongPre", { label: action.label }) });
        } else if (action.when === "pre" && after.includes(action)) {
          mistakes.push({ action, text: t("wrongPost", { label: action.label }) });
        } else {
          mistakes.push({ action, text: t("wrongOrder") });
        }
      }
    }
    if (!binned.includes(decoy)) {
      mistakes.push({ action: decoy, text: t("wrongDecoy", { label: decoy.label }) + " " + t("decoyTip") });
    }
    if (!mistakes.length) {
      happy();
      hud.toast(t("planSaved"), "good");
      ctx.collect(300, t("planSaved"));
      finished = true;
      ctx.setData("phase", "done");
      setMonitor("done");
      ctx.finish(200);
      return;
    }
    sad();
    // Show which cards are wrong, and let the player fix them
    for (const node of body.querySelectorAll(".gr-w3-card")) {
      const label = node.querySelector(".gr-w3-label").textContent;
      if (mistakes.some((m) => m.action.label === label)) {
        node.classList.add("is-wrong");
      }
    }
    hud.toast(t("planWrong"), "bad");
    planTries += 1;
    if (planTries >= 2) {
      finished = true;
      ctx.setData("phase", "done");
      ctx.finish(0, t("planKept", { mistakes: mistakes.map((m) => m.action.label).join(", ") }));
      return;
    }
    ctx.loseAttempt(mistakes[0].text, mistakes[0].text);
  }

  showBase();
  placeCamera(0);

  return {
    start() {},
    update(dt, time) {
      elapsed += dt;
      placeCamera(time);
      bounce = Math.max(0, bounce - dt);
      wobble = Math.max(0, wobble - dt);
      pig.object.position.y = SEAT + Math.sin(bounce * Math.PI * 2) * 0.12 * (bounce > 0 ? 1 : 0);
      pig.hitWobble(wobble);
      pig.state = { running: false };
      if (statusShown) {
        // It pops in, then turns slowly over the monitor
        statusPop = Math.min(1, statusPop + dt * 3);
        const pop = 1 - Math.pow(1 - statusPop, 3);
        statusShown.scale.setScalar(statusShown.userData.size * (0.4 + 0.6 * pop));
        statusShown.rotation.y = Math.sin(time * 1.3) * 0.5;
        statusShown.position.y = 1.98 + Math.sin(time * 2) * 0.03;
      }
    },
    idleCamera(time) {
      placeCamera(time);
    },
    action(name) {
      if (finished || !current) {
        return;
      }
      if (phase === "actions") {
        if (name === "left") {
          current.move(-1);
        } else if (name === "right") {
          current.move(1);
        } else if (name === "jump") {
          place("before");
        } else if (name === "duck") {
          place("after");
        } else if (name === "confirm") {
          current.confirm();
        }
        return;
      }
      if (name === "jump" || name === "left") {
        current.move(-1);
      } else if (name === "duck" || name === "right") {
        current.move(1);
      } else if (name === "confirm") {
        current.confirm();
      }
    },
    dispose() {
      page.remove();
      pig.setSitting(false);
      pig.shadow.visible = true;
      ctx.camera.clearViewOffset();
    }
  };
}

export const CSS = `
.guinea-run .gr-w3 {
  position: absolute;
  top: calc(env(safe-area-inset-top, 0px) + 96px);
  right: calc(env(safe-area-inset-right, 0px) + 16px);
  bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
  width: min(560px, calc(100vw - 32px));
  overflow-y: auto;
  overscroll-behavior: contain;
  border: 1px solid #c9c9c9;
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0 2px 20px rgba(3, 45, 96, 0.35);
  touch-action: pan-y;
}
.guinea-run[data-state="intro"] .gr-w3,
.guinea-run[data-state="paused"] .gr-w3,
.guinea-run[data-state="done"] .gr-w3,
.guinea-run[data-state="failed"] .gr-w3,
.guinea-run[data-state="celebrating"] .gr-w3 {
  visibility: hidden;
}
.guinea-run .gr-w3-head {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid #c9c9c9;
  font-size: 15px;
}
.guinea-run .gr-w3-pr {
  padding: 2px 8px;
  border-radius: 999px;
  background: #2e844a;
  color: #ffffff;
  font-size: 12px;
  font-weight: 800;
}
.guinea-run .gr-w3-steps {
  display: flex;
  margin: 0;
  padding: 8px 14px 0;
  list-style: none;
  gap: 4px;
}
.guinea-run .gr-w3-steps li {
  flex: 1 1 0;
  padding: 4px 6px;
  border-radius: 3px;
  background: #e5e5e5;
  color: #444444;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
}
.guinea-run .gr-w3-steps li.is-current {
  background: #0176d3;
  color: #ffffff;
}
.guinea-run .gr-w3-steps li.is-done {
  background: #2e844a;
  color: #ffffff;
}
.guinea-run .gr-w3-body {
  padding: 10px 14px;
}
.guinea-run .gr-w3-question {
  margin: 4px 0 8px;
  font-size: 16px;
  font-weight: 700;
}
.guinea-run .gr-w3-hint,
.guinea-run .gr-w3-keys {
  margin: 2px 0 6px;
  color: #444444;
  font-size: 13px;
}
.guinea-run .gr-w3-keys {
  font-size: 12px;
}
.guinea-run .gr-w3-error {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0 0 10px;
  padding: 8px 10px;
  border-left: 4px solid #ea001e;
  background: #fef1ee;
}
.guinea-run .gr-w3-error strong {
  color: #ba0517;
  font-size: 13px;
}
.guinea-run .gr-w3-error code {
  font-family: "JetBrains Mono", consolas, monospace;
  font-size: 12px;
  word-break: break-word;
  user-select: text;
}
.guinea-run .gr-w3-answers {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.guinea-run .gr-w3-answer {
  min-height: 44px;
  padding: 8px 12px;
  border: 1px solid #c9c9c9;
  border-radius: 4px;
  background: #ffffff;
  color: #181818;
  font: inherit;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  touch-action: manipulation;
}
.guinea-run .gr-w3-answer.is-chosen {
  border-color: #0176d3;
  box-shadow: 0 0 0 2px #0176d3;
}
.guinea-run .gr-w3-answer.is-wrong {
  border-color: #ea001e;
  background: #fef1ee;
  color: #ba0517;
  text-decoration: line-through;
}
.guinea-run .gr-w3-hand {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 52px;
  margin: 6px 0 10px;
  padding: 6px;
  border: 1px dashed #c9c9c9;
  border-radius: 4px;
  background: #f3f3f3;
}
.guinea-run .gr-w3-card {
  display: flex;
  flex: 1 1 150px;
  flex-direction: column;
  gap: 2px;
  min-height: 44px;
  padding: 6px 8px;
  border: 1px solid #c9c9c9;
  border-left: 5px solid var(--gr-w3-type);
  border-radius: 4px;
  background: #ffffff;
  color: #181818;
  font: inherit;
  text-align: left;
  cursor: pointer;
  touch-action: manipulation;
}
.guinea-run .gr-w3-card.is-chosen {
  box-shadow: 0 0 0 2px #0176d3;
}
.guinea-run .gr-w3-card.is-wrong {
  background: #fef1ee;
  border-color: #ea001e;
}
.guinea-run .gr-w3-type {
  color: var(--gr-w3-type);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}
.guinea-run .gr-w3-label {
  font-size: 13px;
  line-height: 1.3;
}
.guinea-run .gr-w3-board {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 6px;
  align-items: start;
}
.guinea-run .gr-w3-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 90px;
  padding: 6px;
  border: 1px solid #c9c9c9;
  border-radius: 4px;
  background: #fafaf9;
}
.guinea-run .gr-w3-col--bin {
  grid-column: 1 / -1;
  min-height: 56px;
  background: #f3f3f3;
}
.guinea-run .gr-w3-col-head {
  min-height: 40px;
  padding: 4px 6px;
  border: 1px solid #0176d3;
  border-radius: 4px;
  background: #eef4ff;
  color: #014486;
  font: inherit;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  touch-action: manipulation;
}
.guinea-run .gr-w3-col--bin .gr-w3-col-head {
  border-color: #706e6b;
  background: #ffffff;
  color: #444444;
}
.guinea-run .gr-w3-deploy {
  align-self: stretch;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  padding: 6px 4px;
  border-radius: 4px;
  background: #032d60;
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  text-align: center;
}
.guinea-run .gr-w3-slot {
  display: flex;
  gap: 4px;
  align-items: stretch;
}
.guinea-run .gr-w3-order {
  display: flex;
  align-items: center;
  padding: 0 4px;
  color: #706e6b;
  font-weight: 800;
}
.guinea-run .gr-w3-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 10px;
}
.guinea-run .gr-w3-template {
  margin: 0 14px 12px;
  color: #444444;
  font-size: 12px;
}
.guinea-run .gr-w3-template summary {
  min-height: 32px;
  padding: 6px 0;
  cursor: pointer;
}
.guinea-run .gr-w3-template pre {
  margin: 4px 0 0;
  padding: 6px;
  background: #f3f3f3;
  font-family: "JetBrains Mono", consolas, monospace;
  white-space: pre-wrap;
}
@media (max-width: 700px) {
  .guinea-run .gr-w3 {
    top: 42vh;
    right: calc(env(safe-area-inset-right, 0px) + 8px);
    left: calc(env(safe-area-inset-left, 0px) + 8px);
    width: auto;
    bottom: calc(env(safe-area-inset-bottom, 0px) + 8px);
  }
  .guinea-run.gr-show-buttons .gr-w3 {
    bottom: calc(env(safe-area-inset-bottom, 0px) + 88px);
  }
  .guinea-run .gr-w3-board {
    grid-template-columns: 1fr;
  }
  .guinea-run .gr-w3-deploy {
    writing-mode: horizontal-tb;
    transform: none;
  }
}
`;
