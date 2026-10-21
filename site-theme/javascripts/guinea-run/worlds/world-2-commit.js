/*
 * World 2, Retrieve and commit (Labs 1.5 and 2.8): a sorting belt. The
 * Metadata Retriever's Recent Changes come down three lanes as crates, every
 * one of them carrying your name, and the guinea pig at the end of the belt
 * jumps to stage the crate of its lane into Staged Changes. A crate let by is
 * a crate left unstaged, which is right for nearly all of them.
 *
 * US-014 is four components: the field, the layout and the two permission
 * sets. Staging anything else costs an attempt, with the lab's reason. A story
 * crate let by comes round again later, for a few points less.
 *
 * The twist is Lab 2.8: the tick box in the table header, every row at once.
 * The belt floods with eighty crates that stage themselves, and the way out is
 * the real command, Reset selected list of items to merge, riding the belt as a
 * power-up. Like the real one it also undoes what you had staged: your story
 * comes back in front of you, uncommitted, and you stage it again.
 *
 * Once the four are staged: Commit, Save / Publish, its first question, the
 * Git Delta package.xml report, push.
 */
import { SLDS, rounded, font, fitText, glyph } from "../core/painter.js";

export const PADS = ["left", "right", "jump", "confirm"];
export const MODELS = ["platform", "office"];

const LANES = [-1.7, 0, 1.7];
const BELT_Y = 0.42;
const SPAWN_Z = -26;
// A crate whose centre passes TIP_Z falls into the trench: left unstaged
const TIP_Z = -1.0;
// A jump stages the crate of its lane while its centre is between these two
const WINDOW_FAR = -4.0;
const PIG_Z = 0.75;
const BASKET_X = 3.5;
const BASKET_Z = 0.45;
const CRATE = { w: 1.45, h: 0.8, d: 0.9 };
const POOL = 60;
const FLOOD = 80;
const JUMP_SPEED = 6.2;
const GRAVITY = 20;
const FLIGHT_S = 0.55;
const SORT_S = 14;
const PILE_MAX = 96;

// The four components of US-014, in Lab 1.5's words
const STORY = [
  { id: "field", type: "CustomField", name: "Installation__c.Panels_Required__c", min: 7 },
  { id: "layout", type: "Layout", name: "Installation__c-Installation Layout", min: 6 },
  { id: "crew", type: "PermissionSet", name: "Helios_Delivery_Crew", min: 5 },
  { id: "manager", type: "PermissionSet", name: "Helios_Delivery_Manager", min: 5 }
];

// Everything else in Recent Changes: the Helios app Lab 1.2 deployed under
// your user, and what changed around your field without you meaning it to.
// `min` is a recent change (minutes ago), the others are dated Lab 1.2.
const NOISE = [
  { id: "admin", type: "Profile", name: "Admin", min: 7, why: "admin" },
  { id: "object", type: "CustomObject", name: "Installation__c", min: 7, why: "object" },
  { id: "agent", type: "GenOpAgentConfig", name: "Installation_Assign_Crew", min: 6, why: "agent" },
  { id: "listview", type: "ListView", name: "Installation__c.All_Installations", min: 9, why: "listview" },
  { id: "crewsize", type: "CustomField", name: "Installation__c.Crew_Size__c", why: "apos" },
  { id: "installdate", type: "CustomField", name: "Installation__c.Install_Date__c" },
  { id: "roof", type: "CustomField", name: "Installation__c.Roof_Type__c" },
  { id: "status", type: "CustomField", name: "Installation__c.Status__c" },
  { id: "kw", type: "CustomField", name: "Installation__c.Total_Capacity_kW__c" },
  { id: "qty", type: "CustomField", name: "Panel_Batch__c.Quantity__c" },
  { id: "arrival", type: "CustomField", name: "Panel_Batch__c.Arrival_Date__c" },
  { id: "pblayout", type: "Layout", name: "Panel_Batch__c-Panel Batch Layout" },
  { id: "crewprofile", type: "Profile", name: "Helios Crew", why: "admin" },
  { id: "assign", type: "Flow", name: "Installation_Assign_Crew" },
  { id: "close", type: "Flow", name: "Installation_Close_Check" },
  { id: "warn", type: "Flow", name: "Installation_Crew_Warning" },
  { id: "apex", type: "ApexClass", name: "InstallationScheduler", why: "eol" },
  { id: "apextest", type: "ApexClass", name: "InstallationSchedulerTest", why: "eol" },
  { id: "lwc", type: "LightningComponentBundle", name: "installationTimeline", why: "eol" },
  { id: "app", type: "CustomApplication", name: "Helios_Delivery" },
  { id: "page", type: "FlexiPage", name: "Installation_Record_Page" },
  { id: "tab", type: "CustomTab", name: "Panel_Batch__c" }
];

const TYPES = {
  CustomField: { glyph: "log", color: "#06A59A", abbr: "F" },
  Layout: { glyph: "puzzle", color: "#3296ED", abbr: "L" },
  PermissionSet: { glyph: "permset", color: "#DD7A01", abbr: "PS" },
  Profile: { glyph: "profile", color: "#0176D3", abbr: "P" },
  CustomObject: { glyph: "box", color: "#C23934", abbr: "O" },
  GenOpAgentConfig: { glyph: "bolt", color: "#9050E9", abbr: "A" },
  ListView: { glyph: "log", color: "#2E844A", abbr: "LV" },
  Flow: { glyph: "flow", color: "#032D60", abbr: "FL" },
  ApexClass: { glyph: "apex", color: "#1B5297", abbr: "AX" },
  LightningComponentBundle: { glyph: "code", color: "#9050E9", abbr: "LW" },
  CustomApplication: { glyph: "cloud", color: "#0B5CAB", abbr: "AP" },
  FlexiPage: { glyph: "puzzle", color: "#BA0517", abbr: "FP" },
  CustomTab: { glyph: "puzzle", color: "#706E6B", abbr: "T" }
};

export const TEXTS = {
  en: {
    intro: "Recent Changes lists everything in helios-dev that carries your name. US-014 is only four of them: the field, the layout and the two permission sets.",
    how1: "Change lane with the left and right arrows, or swipe",
    how2: "Jump with Up or a tap to stage your 4 files",
    how3: "Let everything else go by, then Commit and Save / Publish",
    goalStage: "Stage the 4 files of US-014: {{n}} / 4",
    goalFlood: "Catch the purple Reset coin",
    goalEnd: "Commit, then Save / Publish",
    coachStart: "Jump when one of your 4 files reaches you!",
    coachNoise: "Let that one go by: it is not US-014",
    coachFlood: "Catch the purple Reset coin!",
    coachBack: "Your files are back: stage them again",
    lensHint: "In your lane",
    selectAllShort: "Select all",
    note: "Recent Changes is a list of suspects, not of culprits. Tick by name, never by position. - V.",
    stagedTitle: "Staged Changes",
    howto: "Jump: stage the crate in your lane",
    byYou: "you",
    ago: "{{n}} min ago",
    lab12: "Lab 1.2",
    pRecent: "Recent Changes",
    pCommit: "Commit",
    pPublish: "Save / Publish",
    go: "Metadata Retriever, helios-dev: Recent Changes",
    staged: "Staged: {{name}}",
    missed: "{{name}} went by unstaged: it comes round once more",
    leftOut: "{{name}} went by twice: it stays out of this commit",
    retrieved: "{{n}} of 4 retrieved",
    reportShort: "Your story as the pipeline sees it: {{n}} of its 4 components.",
    infoSkipped: "You did not commit {{names}}: in the lab, a component missing from the Git Delta package.xml report is missing in integration too, and the deployment fails or does half of what you meant.",
    sortOn: "Sorted by Last Updated Date: the newest are lit. Now read the names.",
    selectAll: "Tick the header box: every row at once",
    floodWarn: "It is late. The tick box in the header selects every row in one click.",
    floodOn: "Every row ticked: eighty things you never looked at",
    resetComing: "On the belt: Reset selected list of items to merge",
    resetDone: "the over-wide commit is gone, your changes are back in front of you",
    eightyTitle: "80 files staged",
    eightyTip: "Eighty is never right. Run Reset selected list of items to merge, stage only your own files, discard the rest, and publish again.",
    m_admin: "{{name}} Profile: not your story",
    m_admin_tip: "The Metadata Retriever retrieves a Profile whole, every permission, tab and page layout. If you did not mean to change it, it does not belong in your story.",
    m_object: "A whole object, for one field",
    m_object_tip: "Your story is the field Installation__c.Panels_Required__c, not the object around it. Tick by name, not by date.",
    m_agent: "GenOpAgentConfig: untick it",
    m_agent_tip: "Untick it before you retrieve: the Salesforce CLI does not know that type yet.",
    m_listview: "An old list view",
    m_listview_tip: "None of it is your story. If you are not sure, leave it out: nothing is lost, it is still in your org.",
    m_apos: "Only &apos; changed",
    m_apos_tip: "The same text, spelled differently, and none of it is your story. Leave it unstaged.",
    m_eol: "{{name}}: only a line break",
    m_eol_tip: "Salesforce drops the last line break, the repository keeps it. Not your story: leave it unstaged.",
    m_generic: "{{name}}: not US-014",
    m_generic_tip: "It came with the Helios app in Lab 1.2. Count the files in the Source Control panel: a one-field story is two to four files. If you did not mean to change it, it does not belong in your story.",
    scTitle: "Source Control",
    scMessage: "Message",
    commitDone: "Committed: US-014 Panels Required on Installation",
    pipeTitle: "DevOps Pipeline",
    saveHint: "Prepares your commits for the team, then pushes the branch",
    qText: "Is your metadata already committed?",
    qPull: "No, retrieve the org changes for me",
    qWhat: "What is a commit?",
    qPullTitle: "Commit first, every time",
    qPullTip: "Commit first, every time: you retrieved, staged and committed, so the answer is Yes, my commit(s) are ready!",
    qWhatAnswer: "A commit is what you just did: your staged files, saved on your branch with a message for the reviewer.",
    reportHint: "Your story as the pipeline sees it: four components, nothing you did not touch.",
    pushQ: "Push the branch to your fork?",
    pushYes: "Yes",
    pushed: "Branch pushed to your fork",
    keyOne: "Enter or OK",
    keyChoose: "Left / right to choose, Enter or OK to answer"
  },
  fr: {
    intro: "Recent Changes liste tout ce qui, dans helios-dev, porte votre nom. US-014 n'en compte que quatre : le champ, le layout et les deux permission sets.",
    how1: "Changez de couloir avec les flèches gauche et droite, ou un swipe",
    how2: "Sautez avec Haut ou un tap pour stager vos 4 fichiers",
    how3: "Laissez passer le reste, puis Commit et Save / Publish",
    goalStage: "Stagez les 4 fichiers de US-014 : {{n}} / 4",
    goalFlood: "Attrapez la pièce violette Reset",
    goalEnd: "Commit, puis Save / Publish",
    coachStart: "Sautez quand un de vos 4 fichiers arrive !",
    coachNoise: "Laissez passer celui-là : ce n'est pas US-014",
    coachFlood: "Attrapez la pièce violette Reset !",
    coachBack: "Vos fichiers reviennent : stagez-les à nouveau",
    lensHint: "Dans votre couloir",
    selectAllShort: "Tout sélectionner",
    note: "Recent Changes est une liste de suspects, pas de coupables. Cochez par nom, jamais par position. - V.",
    stagedTitle: "Staged Changes",
    howto: "Sauter : stager la caisse de votre couloir",
    byYou: "vous",
    ago: "il y a {{n}} min",
    lab12: "Lab 1.2",
    pRecent: "Recent Changes",
    pCommit: "Commit",
    pPublish: "Save / Publish",
    go: "Metadata Retriever, helios-dev : Recent Changes",
    staged: "Stagé : {{name}}",
    missed: "{{name}} est passé sans être stagé : il repasse une fois",
    leftOut: "{{name}} est passé deux fois : il reste hors de ce commit",
    retrieved: "{{n}} sur 4 récupérés",
    reportShort: "Votre story telle que le pipeline la voit : {{n}} de ses 4 composants.",
    infoSkipped: "Vous n'avez pas commité {{names}} : dans le lab, un composant absent du rapport Git Delta package.xml manque aussi en integration, et le déploiement échoue ou ne fait que la moitié de ce que vous vouliez.",
    sortOn: "Trié par Last Updated Date : les plus récents s'allument. Maintenant, lisez les noms.",
    selectAll: "Cocher la case de l'en-tête : toutes les lignes d'un coup",
    floodWarn: "Il est tard. La case de l'en-tête sélectionne toutes les lignes d'un clic.",
    floodOn: "Toutes les lignes cochées : quatre-vingts choses que vous n'avez jamais regardées",
    resetComing: "Sur le tapis : Reset selected list of items to merge",
    resetDone: "le commit trop large a disparu, vos modifications sont de nouveau devant vous",
    eightyTitle: "80 fichiers stagés",
    eightyTip: "Quatre-vingts, jamais. Lancez Reset selected list of items to merge, ne stagez que vos propres fichiers, jetez le reste, et publiez à nouveau.",
    m_admin: "Profile {{name}} : pas votre story",
    m_admin_tip: "Le Metadata Retriever récupère un Profile entier, chaque permission, onglet et page layout. Si vous ne vouliez pas le modifier, il n'a rien à faire dans votre story.",
    m_object: "Tout un objet, pour un champ",
    m_object_tip: "Votre story, c'est le champ Installation__c.Panels_Required__c, pas l'objet autour. Cochez par nom, pas par date.",
    m_agent: "GenOpAgentConfig : décochez-le",
    m_agent_tip: "Décochez-le avant de récupérer : la Salesforce CLI ne connaît pas encore ce type.",
    m_listview: "Une vieille list view",
    m_listview_tip: "Rien de cela n'est votre story. Dans le doute, laissez-la de côté : rien n'est perdu, elle est toujours dans votre org.",
    m_apos: "Seul &apos; a changé",
    m_apos_tip: "Le même texte, écrit autrement, et rien de cela n'est votre story. Laissez-le hors du staging.",
    m_eol: "{{name}} : un saut de ligne",
    m_eol_tip: "Salesforce supprime le dernier saut de ligne, le repository le garde. Pas votre story : laissez-le hors du staging.",
    m_generic: "{{name}} : pas US-014",
    m_generic_tip: "Il est arrivé avec l'app Helios au Lab 1.2. Comptez les fichiers dans le panneau Source Control : une story d'un champ, c'est deux à quatre fichiers. Si vous ne vouliez pas le modifier, il n'a rien à faire dans votre story.",
    scTitle: "Source Control",
    scMessage: "Message",
    commitDone: "Commité : US-014 Panels Required on Installation",
    pipeTitle: "DevOps Pipeline",
    saveHint: "Prépare vos commits pour l'équipe, puis pousse la branche",
    qText: "Vos métadonnées sont-elles déjà commitées ?",
    qPull: "Non, récupérez les modifications de l'org pour moi",
    qWhat: "Qu'est-ce qu'un commit ?",
    qPullTitle: "Commitez d'abord, à chaque fois",
    qPullTip: "Commitez d'abord, à chaque fois : vous avez récupéré, stagé et commité, donc la réponse est Yes, my commit(s) are ready!",
    qWhatAnswer: "Un commit, c'est ce que vous venez de faire : vos fichiers stagés, enregistrés sur votre branche avec un message pour le relecteur.",
    reportHint: "Votre story telle que le pipeline la voit : quatre composants, rien que vous n'ayez pas touché.",
    pushQ: "Pousser la branche sur votre fork ?",
    pushYes: "Yes",
    pushed: "Branche poussée sur votre fork",
    keyOne: "Entrée ou OK",
    keyChoose: "Gauche / droite pour choisir, Entrée ou OK pour répondre"
  }
};

/** The strings taken word for word from the labs, checked by scripts/verify/check-easter-egg.mjs. */
export const QUOTES = [
  { lab: "1.5", text: "Metadata Retriever" },
  { lab: "1.5", text: "Recent Changes" },
  { lab: "1.5", text: "Last Updated Date" },
  { lab: "1.5", text: "Retrieve 4 selected" },
  { lab: "1.5", text: "Staged Changes" },
  { lab: "1.5", text: "Source Control" },
  { lab: "1.5", text: "Commit" },
  { lab: "1.5", text: "Save / Publish" },
  { lab: "1.5", text: "Yes, my commit(s) are ready!" },
  { lab: "1.5", text: "Git Delta package.xml" },
  { lab: "1.5", text: "Installation__c.Panels_Required__c" },
  { lab: "1.5", text: "Installation__c-Installation Layout" },
  { lab: "1.5", text: "Helios_Delivery_Crew" },
  { lab: "1.5", text: "Helios_Delivery_Manager" },
  { lab: "1.5", text: "US-014 Panels Required on Installation" },
  { lab: "1.5", text: "Adds Panels_Required__c on Installation__c so the crew knows how many panels to load." },
  { lab: "1.5", text: "features/US-014-panels-required" },
  { lab: "1.5", text: "helios-dev" },
  { lab: "1.5", text: "hardis:work:save" },
  { lab: "2.8", text: "Reset selected list of items to merge" },
  { lab: "2.8", text: "sf hardis:work:resetselection" },
  { lab: "2.8", text: "GenOpAgentConfig" },
  { lab: "2.8", text: "&apos;" },
  { lab: "2.8", text: "Admin" }
];

const BRANCH = "features/US-014-panels-required";

export function createWorld(ctx) {
  const { THREE, root, pig, paint, t, hud, random } = ctx;
  const engine = ctx.engine;
  const camera = ctx.camera;
  const disposables = [];

  /* ---------- The hall: floor, belt, gantry, trench, deck, basket ---------- */

  const floorTexture = paint.texture("w2-floor", 256, 256, (c, w, h) => {
    c.fillStyle = "#E8F4FF";
    c.fillRect(0, 0, w, h);
    c.fillStyle = "#D6EBFF";
    c.fillRect(0, 0, w / 2, h / 2);
    c.fillRect(w / 2, h / 2, w / 2, h / 2);
    c.strokeStyle = "#B9DCFC";
    c.lineWidth = 4;
    c.strokeRect(0, 0, w, h);
  });
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(8, 22);
  const floor = new THREE.Mesh(paint.geometry("w2-floor", () => new THREE.BoxGeometry(16, 0.4, 44)), paint.plain(0xffffff, { map: floorTexture, roughness: 0.9 }));
  floor.position.set(0, -0.8, -10);
  floor.receiveShadow = true;
  root.add(floor);
  const floorEdge = new THREE.Mesh(paint.geometry("w2-floor-edge", () => new THREE.BoxGeometry(16.2, 0.12, 44.2)), paint.plain(0x0176d3, { roughness: 0.5 }));
  floorEdge.position.set(0, -1.02, -10);
  root.add(floorEdge);

  // The belt surface: dark slats that scroll toward the guinea pig
  const beltTexture = paint.texture("w2-belt", 64, 64, (c, w, h) => {
    c.fillStyle = "#2B3A4A";
    c.fillRect(0, 0, w, h);
    c.fillStyle = "#3E5266";
    c.fillRect(0, 0, w, h * 0.72);
    c.fillStyle = "#1B2632";
    c.fillRect(0, h * 0.72, w, h * 0.06);
  });
  beltTexture.wrapS = THREE.RepeatWrapping;
  beltTexture.wrapT = THREE.RepeatWrapping;
  const beltLength = -TIP_Z + 27;
  beltTexture.repeat.set(1, beltLength * 2.2);
  const beltTop = paint.plain(0xffffff, { map: beltTexture, roughness: 0.7 });
  const frame = paint.plain(0xc9d3dd, { roughness: 0.45, metalness: 0.3 });
  const brand = paint.plain(0x0176d3, { roughness: 0.45 });
  const navy = paint.plain(0x032d60, { roughness: 0.7 });
  const white = paint.plain(0xffffff, { roughness: 0.5 });
  const beltGeometry = paint.geometry("w2-belt", () => new THREE.BoxGeometry(1.6, 0.16, beltLength));
  const beltCenter = TIP_Z - beltLength / 2;
  for (const x of LANES) {
    const belt = new THREE.Mesh(beltGeometry, [frame, frame, beltTop, frame, frame, frame]);
    belt.position.set(x, BELT_Y - 0.08, beltCenter);
    belt.receiveShadow = true;
    root.add(belt);
  }
  // The frame: four rails between and beside the lanes, with roller caps
  const railGeometry = paint.geometry("w2-rail", () => new THREE.BoxGeometry(0.12, 0.26, beltLength));
  const railXs = [-2.55, -0.85, 0.85, 2.55];
  for (const x of railXs) {
    const rail = new THREE.Mesh(railGeometry, x === -2.55 || x === 2.55 ? brand : paint.plain(0xfe9339, { roughness: 0.45 }));
    rail.position.set(x, BELT_Y - 0.06, beltCenter);
    root.add(rail);
  }
  const capCount = railXs.length * 26;
  const caps = new THREE.InstancedMesh(
    paint.geometry("w2-cap", () => new THREE.CylinderGeometry(0.1, 0.1, 0.14, 12)),
    paint.plain(0x8a99a8, { roughness: 0.3, metalness: 0.6 }),
    capCount
  );
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const scaleVector = new THREE.Vector3(1, 1, 1);
  const position = new THREE.Vector3();
  const sideways = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
  caps.frustumCulled = false;
  root.add(caps);
  // Legs under the belt
  const legs = new THREE.InstancedMesh(paint.geometry("w2-leg", () => new THREE.BoxGeometry(0.16, 1.1, 0.16)), frame, 2 * 7);
  for (let i = 0; i < 7; i++) {
    for (const [j, x] of [-2.4, 2.4].entries()) {
      matrix.makeTranslation(x, BELT_Y - 0.75, TIP_Z - 1.5 - i * 4);
      legs.setMatrixAt(i * 2 + j, matrix);
    }
  }
  legs.frustumCulled = false;
  root.add(legs);
  // Drums at the end of each belt: they turn as the belt runs
  const drums = LANES.map((x) => {
    const drum = new THREE.Mesh(paint.geometry("w2-drum", () => new THREE.CylinderGeometry(0.16, 0.16, 1.58, 16)), paint.plain(0x5b6b7b, { roughness: 0.3, metalness: 0.6 }));
    drum.rotation.z = Math.PI / 2;
    drum.position.set(x, BELT_Y - 0.16, TIP_Z);
    root.add(drum);
    return drum;
  });

  // The trench: what falls in stays in Changes, unstaged
  const trench = new THREE.Mesh(paint.geometry("w2-trench", () => new THREE.PlaneGeometry(5.3, 1.1)), paint.label("w2-trench", "Changes", { bg: "#16324F", fg: "#9FB8D0", width: 1024, height: 212, size: 96 }));
  trench.rotation.x = -Math.PI / 2;
  trench.position.set(0, -0.55, TIP_Z + 0.55);
  root.add(trench);

  // The deck the guinea pig stands on, level with the belt
  const deck = new THREE.Mesh(paint.geometry("w2-deck", () => new THREE.BoxGeometry(8, 0.3, 2.9)), [frame, frame, paint.plain(0xf3f5f7, { roughness: 0.8 }), frame, brand, frame]);
  deck.position.set(1.35, BELT_Y - 0.15, TIP_Z + 1.1 + 1.45);
  deck.receiveShadow = true;
  root.add(deck);
  const deckLegs = new THREE.InstancedMesh(paint.geometry("w2-leg", () => new THREE.BoxGeometry(0.16, 1.1, 0.16)), frame, 4);
  [
    [-2.4, TIP_Z + 1.3],
    [5.1, TIP_Z + 1.3],
    [-2.4, TIP_Z + 3.8],
    [5.1, TIP_Z + 3.8]
  ].forEach(([x, z], i) => {
    matrix.makeTranslation(x, BELT_Y - 0.75, z);
    deckLegs.setMatrixAt(i, matrix);
  });
  deckLegs.frustumCulled = false;
  root.add(deckLegs);

  // The gantry where the crates come out: the Metadata Retriever
  const gantry = new THREE.Group();
  gantry.position.set(0, 0, SPAWN_Z + 1.2);
  const postGeometry = paint.geometry("w2-post", () => new THREE.BoxGeometry(0.3, 3.4, 0.3));
  for (const x of [-2.85, 2.85]) {
    const post = new THREE.Mesh(postGeometry, brand);
    post.position.set(x, 1.3, 0);
    gantry.add(post);
  }
  const doorway = new THREE.Mesh(paint.geometry("w2-doorway", () => new THREE.PlaneGeometry(5.4, 1.35)), navy);
  doorway.position.set(0, BELT_Y + 0.66, -0.4);
  gantry.add(doorway);
  const banner = new THREE.Mesh(
    paint.geometry("w2-banner", () => new THREE.PlaneGeometry(6, 1.2)),
    paint.material(
      "w2-banner",
      1024,
      204,
      (c, w, h) => {
        rounded(c, 4, 4, w - 8, h - 8, 18);
        c.fillStyle = SLDS.white;
        c.fill();
        c.lineWidth = 6;
        c.strokeStyle = SLDS.border;
        c.stroke();
        rounded(c, 26, 30, 144, 144, 18);
        c.fillStyle = SLDS.brand;
        c.fill();
        glyph(c, "cloud", 98, 102, 130);
        c.textAlign = "left";
        c.textBaseline = "middle";
        c.fillStyle = SLDS.navy;
        fitText(c, "Metadata Retriever", 196, 72, w - 230, 64, "800");
        c.fillStyle = SLDS.weak;
        fitText(c, "Recent Changes · helios-dev", 196, 146, w - 230, 46, "700");
      },
      { side: THREE.DoubleSide, emissive: 0x222222 }
    )
  );
  banner.position.set(0, 2.7, 0);
  gantry.add(banner);
  const plaque = new THREE.Mesh(paint.geometry("w2-plaque", () => new THREE.PlaneGeometry(1.8, 0.87)), paint.plaque());
  plaque.position.set(0, 3.85, 0);
  gantry.add(plaque);
  root.add(gantry);

  // The basket behind the guinea pig: Staged Changes, with its pile
  const basket = new THREE.Group();
  basket.position.set(BASKET_X, BELT_Y, BASKET_Z);
  const wallMaterial = paint.plain(0xf3f3f3, { roughness: 0.6 });
  const bottom = new THREE.Mesh(paint.geometry("w2-basket-bottom", () => new THREE.BoxGeometry(1.9, 0.08, 1.1)), wallMaterial);
  bottom.position.y = 0.04;
  basket.add(bottom);
  const sideWall = paint.geometry("w2-basket-side", () => new THREE.BoxGeometry(0.08, 0.5, 1.1));
  for (const x of [-0.95, 0.95]) {
    const wall = new THREE.Mesh(sideWall, brand);
    wall.position.set(x, 0.25, 0);
    basket.add(wall);
  }
  const backWall = new THREE.Mesh(paint.geometry("w2-basket-back", () => new THREE.BoxGeometry(1.9, 0.5, 0.08)), wallMaterial);
  backWall.position.set(0, 0.25, -0.55);
  basket.add(backWall);
  // The front wall carries the count: its own canvas, drawn again on change
  const basketCanvas = document.createElement("canvas");
  basketCanvas.width = 512;
  basketCanvas.height = 96;
  const basketTexture = new THREE.CanvasTexture(basketCanvas);
  basketTexture.colorSpace = THREE.SRGBColorSpace;
  const basketFace = new THREE.MeshStandardMaterial({ map: basketTexture, roughness: 0.6, emissive: 0x222222 });
  disposables.push(basketTexture, basketFace);
  const frontWall = new THREE.Mesh(paint.geometry("w2-basket-front", () => new THREE.BoxGeometry(1.9, 0.5, 0.08)), [brand, brand, brand, brand, basketFace, brand]);
  frontWall.position.set(0, 0.25, 0.55);
  basket.add(frontWall);
  const pile = new THREE.InstancedMesh(paint.geometry("w2-mini", () => new THREE.BoxGeometry(0.3, 0.22, 0.26)), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }), PILE_MAX);
  disposables.push(pile.material);
  pile.count = 0;
  // Its instances move: a bounding sphere computed once would hide them
  pile.frustumCulled = false;
  basket.add(pile);
  root.add(basket);
  const pileColors = { story: new THREE.Color(0x2e844a), flood: new THREE.Color(0x1b96ff) };

  function drawBasket(count) {
    const c = basketCanvas.getContext("2d");
    const w = basketCanvas.width;
    const h = basketCanvas.height;
    c.fillStyle = count > 4 ? SLDS.error : SLDS.brand;
    c.fillRect(0, 0, w, h);
    c.fillStyle = SLDS.white;
    c.textAlign = "left";
    c.textBaseline = "middle";
    fitText(c, "Staged Changes", 22, h / 2 + 2, w - 150, 44, "800");
    rounded(c, w - 118, 16, 96, h - 32, 30);
    c.fill();
    c.fillStyle = count > 4 ? SLDS.error : SLDS.brand;
    c.textAlign = "center";
    fitText(c, String(count), w - 70, h / 2 + 2, 84, 46, "800");
    basketTexture.needsUpdate = true;
  }

  function setPile(list) {
    pile.count = Math.min(list.length, PILE_MAX);
    for (let i = 0; i < pile.count; i++) {
      const layer = Math.floor(i / 15);
      const k = i % 15;
      position.set(-0.7 + (k % 5) * 0.35 + (layer % 2) * 0.08, 0.19 + layer * 0.22, -0.32 + Math.floor(k / 5) * 0.32);
      matrix.compose(position, quaternion, scaleVector);
      pile.setMatrixAt(i, matrix);
      pile.setColorAt(i, pileColors[list[i]] || pileColors.flood);
    }
    pile.instanceMatrix.needsUpdate = true;
    if (pile.instanceColor) {
      pile.instanceColor.needsUpdate = true;
    }
    drawBasket(list.length);
    // The story it has staged rides on its back
    pig.setRiders(STORY.filter((def) => staged.includes(def.id)).map((def) => paint.tile("w2-rider-" + def.type, TYPES[def.type].color, TYPES[def.type].glyph)));
  }

  /* ---------- The crates ---------- */

  const crateGeometry = paint.geometry("w2-crate", () => new THREE.BoxGeometry(CRATE.w, CRATE.h, CRATE.d));
  const crateSide = paint.plain(0xe5e8ec, { roughness: 0.55 });
  const crateBottom = paint.plain(0xb0bcc8);
  const tickGeometry = paint.geometry("w2-tick", () => new THREE.PlaneGeometry(0.42, 0.42));
  const tickMaterial = paint.tile("w2-tick", SLDS.brand, "check");
  const noteMaterial = paint.tile("w2-note", "#F2C94C", "note");
  const noteGeometry = paint.geometry("w2-note", () => new THREE.BoxGeometry(0.75, 0.75, 0.75));
  const coinGeometry = paint.geometry("w2-coin", () => new THREE.CylinderGeometry(0.42, 0.42, 0.09, 32));
  const ringGeometry = paint.geometry("w2-ring", () => new THREE.TorusGeometry(0.48, 0.035, 8, 32));
  const coinRim = paint.plain(0xffb020, { metalness: 0.6, roughness: 0.3, emissive: 0x3a2400 });
  const signGeometry = paint.geometry("w2-sign", () => new THREE.PlaneGeometry(2.4, 0.4));
  const owner = t("byYou");

  // One material per component, cached: the dim and lit effects change it
  const cardMaterials = new Map();
  function cardMaterial(def) {
    if (!cardMaterials.has(def.id)) {
      const when = def.min ? t("ago", { n: def.min }) : t("lab12");
      const material = paint.material("w2-card:" + def.id, 512, 288, (c, w, h) => drawCrateCard(c, w, h, def, owner + " · " + when, Boolean(def.min)), { emissive: 0x1a1a1a });
      cardMaterials.set(def.id, material);
    }
    return cardMaterials.get(def.id);
  }

  // The sides of a crate take the colour of its type: a belt of colours, not of grey boxes
  const typeSides = {};
  for (const [name, type] of Object.entries(TYPES)) {
    typeSides[name] = paint.plain(new THREE.Color(type.color).getHex(), { roughness: 0.5 });
  }

  // The crate body is the Kenney crate, one instanced mesh per part of it for
  // the whole pool; each crate keeps its own label (front and top) on it.
  // Without the model pack, the plain coloured box stays.
  const crateParts = [];
  const crateModel = ctx.models && ctx.models.get("crate", { shadows: false });
  if (crateModel) {
    const size = new THREE.Box3().setFromObject(crateModel).getSize(new THREE.Vector3());
    crateModel.scale.multiply(new THREE.Vector3(CRATE.w / size.x, CRATE.h / size.y, CRATE.d / size.z));
    crateModel.position.y = -CRATE.h / 2;
    crateModel.updateMatrixWorld(true);
    crateModel.traverse((child) => {
      if (child.isMesh) {
        const mesh = new THREE.InstancedMesh(child.geometry, child.material, POOL);
        mesh.frustumCulled = false;
        mesh.castShadow = engine.settings.shadows;
        root.add(mesh);
        crateParts.push({ mesh, local: child.matrixWorld.clone() });
      }
    });
  }
  const labelGeometry = paint.geometry("w2-crate-label", () => crateLabelGeometry(THREE));
  const hidden = new THREE.Matrix4().makeScale(0, 0, 0);

  function syncCrates() {
    if (!crateParts.length) {
      return;
    }
    for (let i = 0; i < POOL; i++) {
      const group = pool[i].group;
      if (group.visible) {
        group.updateMatrix();
      }
      for (const part of crateParts) {
        if (group.visible) {
          matrix.multiplyMatrices(group.matrix, part.local);
          part.mesh.setMatrixAt(i, matrix);
        } else {
          part.mesh.setMatrixAt(i, hidden);
        }
      }
    }
    for (const part of crateParts) {
      part.mesh.instanceMatrix.needsUpdate = true;
    }
  }

  const pool = [];
  for (let i = 0; i < POOL; i++) {
    const group = new THREE.Group();
    const box = crateParts.length
      ? new THREE.Mesh(labelGeometry, crateSide)
      : new THREE.Mesh(crateGeometry, [crateSide, crateSide, crateSide, crateBottom, crateSide, crateSide]);
    box.castShadow = engine.settings.shadows;
    group.add(box);
    const tick = new THREE.Mesh(tickGeometry, tickMaterial);
    tick.rotation.x = -Math.PI / 2;
    tick.position.set(-CRATE.w / 2 + 0.3, CRATE.h / 2 + 0.04, -CRATE.d / 2 + 0.28);
    group.add(tick);
    group.visible = false;
    root.add(group);
    pool.push({ group, box, tick, state: "free" });
  }

  // The special ones, built once each: the note, two power-ups, the header row
  function coin(kind, color, glyphName, label, sign) {
    const group = new THREE.Group();
    const model = ctx.models && ctx.models.get(kind === "reset" ? "coin-silver" : "coin-gold", { height: 0.86, shadows: false });
    let disc;
    if (model) {
      model.position.y = -0.43;
      disc = new THREE.Group();
      disc.add(model);
    } else {
      const face = paint.coin("w2-" + kind, color, glyphName, label);
      disc = new THREE.Mesh(coinGeometry, [coinRim, face, face]);
      disc.rotation.x = Math.PI / 2;
    }
    group.add(disc);
    // The ring glows (bloom on the high tier): it says "take me"
    group.add(new THREE.Mesh(ringGeometry, paint.plain(new THREE.Color(color).getHex(), { emissive: new THREE.Color(color).getHex(), emissiveIntensity: 1.8 })));
    const board = paint.sign("w2-sign-" + kind, sign, { color, glyph: glyphName, height: 0.42 });
    board.position.y = 0.85;
    group.add(board);
    group.visible = false;
    root.add(group);
    return { group, spin: disc, board, state: "free" };
  }
  const specials = {
    sort: coin("sort", SLDS.success, "loop", "Sort", "Last Updated Date"),
    reset: coin("reset", SLDS.purple, "loop", "Reset", "Reset"),
    note: (() => {
      const group = new THREE.Group();
      const box = new THREE.Mesh(noteGeometry, noteMaterial);
      box.castShadow = engine.settings.shadows;
      group.add(box);
      group.visible = false;
      root.add(group);
      return { group, spin: box, state: "free" };
    })(),
    header: (() => {
      const group = new THREE.Group();
      const slab = new THREE.Mesh(paint.geometry("w2-header-slab", () => new THREE.BoxGeometry(5.0, 0.22, 0.7)), [frame, frame, white, frame, brand, frame]);
      slab.position.y = 0.11;
      group.add(slab);
      const board = new THREE.Mesh(
        paint.geometry("w2-header-board", () => new THREE.PlaneGeometry(5.0, 1.15)),
        paint.material("w2-header", 1024, 236, (c, w, h) => drawHeaderRow(c, w, h, t("selectAllShort")), { side: THREE.DoubleSide, emissive: 0x222222 })
      );
      board.position.set(0, 0.8, 0);
      group.add(board);
      group.visible = false;
      root.add(group);
      return { group, spin: null, state: "free" };
    })()
  };

  /* ---------- The state of the run ---------- */

  let lane = 1;
  let pigX = 0;
  let pigY = 0;
  let pigVy = 0;
  let scurry = 0;
  let elapsed = 0;
  let speed = 3.3;
  let rowTimer = 1.2;
  let storyTimer = 2.2;
  const storyQueue = STORY.slice().sort(() => random() - 0.5);
  let storyOnBelt = false;
  let committed = 0;
  let noise = 0;
  let staged = [];
  let flood = "none";
  let floodLeft = 0;
  let floodTimer = 0;
  let resetTimer = 0;
  let eightyDone = false;
  let resetMisses = 0;
  // A story crate comes by twice at most: then it is left out, and the end says so
  const passes = {};
  const skipped = [];
  // A noise crate staged a second time costs points, not another attempt
  const noiseSeen = new Set();
  let sortAt = 10;
  let sortUntil = -1;
  let noteAt = 24;
  let noteChances = 2;
  let noteFound = false;
  let phase = "sort";
  let endTimer = 0;
  let shake = 0;
  let hit = 0;
  let pop = 0;
  let turn = 0;
  let crates = [];
  // On the belt or in the air: pool entries and specials
  let flights = [];

  function setData() {
    ctx.setData("committed", committed);
    ctx.setData("noise", noise);
    ctx.setData("staged", staged.length);
    ctx.setData("flood", flood);
    ctx.setData("phase", phase);
  }

  /* ---------- HTML: the Staged Changes panel and the end cards ---------- */

  const panel = document.createElement("div");
  panel.className = "gr-w2-staged";
  const head = document.createElement("div");
  head.className = "gr-w2-head";
  const headTitle = document.createElement("strong");
  headTitle.textContent = t("stagedTitle");
  const headCount = document.createElement("span");
  headCount.className = "gr-w2-count";
  const headHow = document.createElement("span");
  headHow.className = "gr-w2-how";
  headHow.textContent = t("howto");
  head.append(headTitle, headCount);
  const list = document.createElement("ul");
  const rows = {};
  for (const def of STORY) {
    const li = document.createElement("li");
    const icon = document.createElement("i");
    icon.textContent = TYPES[def.type].abbr;
    icon.style.background = TYPES[def.type].color;
    const name = document.createElement("span");
    name.textContent = def.name;
    li.append(icon, name);
    list.appendChild(li);
    rows[def.id] = li;
  }
  panel.append(head, list);
  hud.layer.appendChild(panel);

  const card = document.createElement("div");
  card.className = "gr-w2-card";
  card.hidden = true;
  hud.layer.appendChild(card);

  // The lens: the crate in the guinea pig's lane, in letters big enough to read
  const lens = document.createElement("div");
  lens.className = "gr-w2-lens";
  lens.hidden = true;
  const lensHint = el("small", "", lens, t("lensHint"));
  const lensIcon = el("i", "", lens);
  const lensBody = el("div", "", lens);
  const lensType = el("b", "", lensBody);
  const lensName = el("span", "gr-w2-lens-name", lensBody);
  const lensWhen = el("em", "", lensBody);
  lensHint.setAttribute("aria-hidden", "true");
  hud.layer.appendChild(lens);
  let lensFor = null;

  // Where a jump stages: a bright zone at the end of the guinea pig's lane
  const zone = new THREE.Mesh(
    paint.geometry("w2-zone", () => new THREE.PlaneGeometry(1.5, -WINDOW_FAR + TIP_Z)),
    new THREE.MeshBasicMaterial({ color: 0xffd84d, transparent: true, opacity: 0.35, depthWrite: false })
  );
  disposables.push(zone.material);
  zone.rotation.x = -Math.PI / 2;
  zone.position.set(0, BELT_Y + 0.012, (WINDOW_FAR + TIP_Z) / 2);
  root.add(zone);

  function showLens(entry) {
    if (entry === lensFor) {
      return;
    }
    lensFor = entry;
    if (!entry) {
      lens.hidden = true;
      return;
    }
    const type = TYPES[entry.def.type];
    lensIcon.textContent = type.abbr;
    lensIcon.style.background = type.color;
    lensType.textContent = entry.def.type;
    lensName.textContent = entry.def.name;
    lensWhen.textContent = owner + " · " + (entry.def.min ? t("ago", { n: entry.def.min }) : t("lab12"));
    lensWhen.classList.toggle("is-recent", Boolean(entry.def.min));
    // On a phone it sits under the goal line, clear of the guinea pig
    const goalLine = hud.layer.parentElement && hud.layer.parentElement.querySelector(".gr-goal");
    const top = window.innerWidth <= 600 && goalLine && !goalLine.hidden ? goalLine.getBoundingClientRect().bottom + 14 : 0;
    lens.style.top = top ? top + "px" : "";
    lens.style.bottom = top ? "auto" : "";
    lens.hidden = false;
  }
  let cardStep = null;
  let choices = [];
  let choice = 0;

  /** A mistake. On the last attempt the result card comes up: the world's own cards step aside. */
  function lose(title, tip) {
    if (ctx.loseAttempt(title, tip) <= 0) {
      card.hidden = true;
      panel.hidden = true;
    }
  }

  function renderPanel() {
    headCount.textContent = String(staged.length);
    headCount.classList.toggle("is-over", staged.length > 4);
    for (const def of STORY) {
      rows[def.id].classList.toggle("is-on", staged.includes(def.id));
    }
    if (phase === "sort") {
      hud.goal(flood === "on" ? t("goalFlood") : t("goalStage", { n: committed }));
    }
  }

  /* ---------- Spawning ---------- */

  function laneFree(l, gap) {
    return !crates.some((c) => c.lane === l && c.state === "belt" && c.z < SPAWN_Z + gap);
  }

  function freeLanes(gap) {
    return [0, 1, 2].filter((l) => laneFree(l, gap)).sort(() => random() - 0.5);
  }

  function spawnCrate(def, role, l, extra) {
    const entry = pool.find((p) => p.state === "free");
    if (!entry) {
      return null;
    }
    const face = cardMaterial(def);
    const side = typeSides[def.type] || crateSide;
    entry.box.material = crateParts.length ? face : [side, side, face, crateBottom, face, side];
    entry.tick.visible = role === "flood";
    entry.group.visible = true;
    entry.group.scale.setScalar(1);
    entry.group.rotation.set(0, 0, 0);
    Object.assign(entry, { state: "belt", def, role, lane: l, x: LANES[l], z: SPAWN_Z, y: BELT_Y + CRATE.h / 2, mul: 1, recent: Boolean(def.min), age: 0 }, extra);
    placeEntry(entry);
    if (!crates.includes(entry)) {
      crates.push(entry);
    }
    return entry;
  }

  function spawnSpecial(kind, l, z, mul) {
    const entry = specials[kind];
    if (entry.state !== "free") {
      return null;
    }
    entry.group.visible = true;
    entry.group.scale.setScalar(1);
    const y = kind === "header" ? BELT_Y : kind === "note" ? BELT_Y + 0.4 : BELT_Y + 0.75;
    Object.assign(entry, { state: "belt", role: kind, lane: kind === "header" ? -1 : l, x: kind === "header" ? 0 : LANES[l], z: z || SPAWN_Z, y, mul: mul || 1, age: 0 });
    placeEntry(entry);
    if (!crates.includes(entry)) {
      crates.push(entry);
    }
    return entry;
  }

  function placeEntry(entry) {
    entry.group.position.set(entry.x, entry.y, entry.z);
  }

  function release(entry) {
    entry.state = "free";
    entry.group.visible = false;
  }

  function pickNoise() {
    // The recent ones come more often: they are the ones that fool you
    const recent = NOISE.filter((n) => n.min);
    return random() < 0.4 ? recent[Math.floor(random() * recent.length)] : NOISE[Math.floor(random() * NOISE.length)];
  }

  function spawnRow() {
    const lanes = freeLanes(1.7);
    if (!lanes.length) {
      return;
    }
    const story = !storyOnBelt && storyTimer <= 0 && storyQueue.length && flood !== "header" && flood !== "on";
    if (story) {
      spawnCrate(storyQueue.shift(), "story", lanes.shift());
      storyOnBelt = true;
    }
    const count = elapsed > 15 && random() < 0.35 ? 2 : 1;
    for (let i = 0; i < count - (story ? 1 : 0) && lanes.length; i++) {
      spawnCrate(pickNoise(), "noise", lanes.shift());
    }
  }

  /* ---------- Staging ---------- */

  function grab() {
    if (pigY <= 0.001) {
      pigVy = JUMP_SPEED;
    }
    const near = crates.filter((c) => c.state === "belt" && (c.lane === lane || c.role === "header") && c.z > WINDOW_FAR && c.z <= TIP_Z + 0.45);
    if (!near.length) {
      return;
    }
    // The power-ups and the note before a crate in front of them
    const special = near.filter((c) => !c.def).sort((a, b) => b.z - a.z)[0];
    const target = special || near.sort((a, b) => b.z - a.z)[0];
    switch (target.role) {
      case "header":
        startFlood(target);
        return;
      case "sort":
        release(target);
        sortUntil = elapsed + SORT_S;
        ctx.sound.play("power");
        ctx.collect(30, null);
        hud.toast(t("sortOn"), "power");
        return;
      case "reset":
        release(target);
        applyReset();
        return;
      case "note":
        release(target);
        noteFound = true;
        ctx.sound.play("wheek");
        ctx.foundNote();
        return;
      default:
        fly(target);
    }
  }

  function fly(entry) {
    entry.state = "fly";
    entry.flight = { t: 0, from: entry.group.position.clone() };
    flights.push(entry);
    if (entry.role === "story") {
      storyOnBelt = false;
      ctx.sound.play("wheek");
    }
  }

  function landed(entry) {
    release(entry);
    if (entry.role === "story") {
      staged.push(entry.def.id);
      committed += 1;
      setPile(staged.map((id) => (STORY.some((s) => s.id === id) ? "story" : "flood")));
      ctx.collect(100, t("staged", { name: entry.def.name }));
      if (pig.hop) {
        pig.hop();
      }
      ctx.fx.burst(BASKET_X, BELT_Y + 0.9, BASKET_Z, { count: 28, colors: [0x2e844a, 0x0176d3, 0xfe9339, 0xff538a, 0x9050e9], speed: 3, up: 4, life: 1 });
      pop = 0.35;
      storyTimer = 3 + random() * 2;
    } else if (entry.role === "flood") {
      staged.push("flood");
      setPile(staged.map((id) => (id === "flood" ? "flood" : "story")));
    } else {
      // Noise: it pops back out, and costs an attempt with the lab's reason
      noise += 1;
      shake = 0.35;
      hit = 0.6;
      const why = entry.def.why || "generic";
      if (noiseSeen.has(entry.def.id)) {
        ctx.points(-30);
        hud.toast(t("m_" + why, { name: entry.def.name }), "bad");
        hud.tip(t("m_" + why + "_tip"));
      } else {
        noiseSeen.add(entry.def.id);
        lose(t("m_" + why, { name: entry.def.name }), t("m_" + why + "_tip"));
        hud.coach(t("coachNoise"), 2600);
      }
    }
    renderPanel();
    setData();
  }

  function missed(entry) {
    if (entry.role === "story") {
      storyOnBelt = false;
      passes[entry.def.id] = (passes[entry.def.id] || 0) + 1;
      ctx.points(-50);
      if (passes[entry.def.id] >= 2) {
        skipped.push(entry.def);
        hud.toast(t("leftOut", { name: entry.def.name }), "bad");
      } else {
        storyQueue.push(entry.def);
        storyTimer = 3.5;
        hud.toast(t("missed", { name: entry.def.name }), "bad");
      }
    } else if (entry.role === "noise") {
      // Left unstaged, as it should be: it keeps the streak going
      ctx.collect(10, null);
    } else if (entry.role === "flood") {
      fly(entry);
      return true;
    } else if (entry.role === "header") {
      startFlood(entry);
      return true;
    } else if (entry.role === "reset" && eightyDone) {
      resetMisses += 1;
      if (resetMisses >= 2) {
        // Nobody stays stuck under eighty files: the reset runs, for fewer points
        ctx.points(-150);
        applyReset(true);
      }
    }
    return false;
  }

  /* ---------- The twist: every row at once ---------- */

  function spawnHeader() {
    if (spawnSpecial("header", 1, SPAWN_Z)) {
      flood = "header";
      rowTimer = 2.2;
      hud.toast(t("floodWarn"), "bad");
    hud.coach(t("selectAll"), 2400);
      setData();
    }
  }

  function startFlood(entry) {
    release(entry);
    flood = "on";
    floodLeft = FLOOD;
    floodTimer = 0.4;
    resetTimer = 1.0;
    shake = 0.5;
    ctx.sound.play("hit");
    hud.toast(t("floodOn"), "bad");
    hud.coach(t("coachFlood"), 2800);
    hud.goal(t("goalFlood"));
    setData();
  }

  function stepFlood(dt) {
    floodTimer -= dt;
    while (floodLeft > 0 && floodTimer <= 0) {
      const lanes = freeLanes(1.0);
      if (!lanes.length || !spawnCrate(NOISE[Math.floor(random() * NOISE.length)], "flood", lanes[0], { mul: 1.4 })) {
        floodTimer = 0.05;
        break;
      }
      floodLeft -= 1;
      floodTimer += 0.11;
    }
    resetTimer -= dt;
    if (resetTimer <= 0 && specials.reset.state === "free") {
      // After the eighty, the rescue comes straight to the guinea pig
      // Half the time in the guinea pig's lane, and always after the eighty
      const target = eightyDone || random() < 0.5 ? lane : [0, 1, 2][Math.floor(random() * 3)];
      if (spawnSpecial("reset", target, eightyDone ? -13 : SPAWN_Z + 8, 1.1)) {
        hud.toast(t("resetComing"), "power");
      }
      resetTimer = 2.4;
    }
    const floodOnBelt = crates.some((c) => c.role === "flood");
    if (!eightyDone && floodLeft === 0 && !floodOnBelt && !flights.length) {
      eightyDone = true;
      lose(t("eightyTitle"), t("eightyTip"));
      resetTimer = 0.6;
    }
  }

  function applyReset(auto) {
    ctx.sound.play("power");
    for (const entry of crates) {
      if (entry.role === "flood" && entry.state === "belt") {
        release(entry);
      }
    }
    for (const entry of flights) {
      if (entry.role === "flood") {
        release(entry);
      }
    }
    flights = flights.filter((e) => e.state === "fly");
    // The commits go, the changes stay: the story comes round again, uncommitted
    const back = STORY.filter((s) => staged.includes(s.id));
    for (const def of back) {
      passes[def.id] = 0;
    }
    storyQueue.unshift(...back);
    staged = [];
    committed = 0;
    flood = "done";
    floodLeft = 0;
    storyTimer = 1.2;
    sortAt = elapsed + 3;
    if (!noteFound && noteChances > 0) {
      noteAt = elapsed + 10;
    }
    setPile([]);
    renderPanel();
    if (!auto) {
      ctx.collect(150, null);
    }
    hud.toast("sf hardis:work:resetselection: " + t("resetDone"), "power");
    ctx.sound.play("happy");
    ctx.fx.burst(pigX, BELT_Y + 1.2, PIG_Z - 1.5, { count: 60, colors: [0x9050e9, 0xff538a, 0x1b96ff, 0xffd84d], speed: 5, up: 5, life: 1.4 });
    if (back.length) {
      window.setTimeout(() => ctx.playing && hud.coach(t("coachBack"), 2400), 2000);
    }
    setData();
  }

  /* ---------- The end: Commit, Save / Publish, push ---------- */

  function startEnd() {
    hud.goal(t("goalEnd"));
    showLens(null);
    zone.visible = false;
    phase = "end";
    endTimer = 1.0;
    lane = 1;
    scurry = 0.4;
    panel.classList.add("is-done");
    hud.setPath([t("pRecent"), t("pCommit"), t("pPublish")], 1);
    setData();
  }

  function showStep(step) {
    cardStep = step;
    card.hidden = false;
    card.replaceChildren();
    choices = [];
    choice = 0;
    const header = el("div", "gr-w2-card-head", card);
    const body = el("div", "gr-w2-card-body", card);
    const hint = el("p", "gr-w2-card-hint", null);
    switch (step) {
      case "commit": {
        el("strong", "", header, t("scTitle"));
        el("span", "gr-w2-branch", header, BRANCH);
        el("div", "gr-w2-done", body, committed === 4 ? "✓ Retrieve 4 selected" : "✓ " + t("retrieved", { n: committed }));
        el("div", "gr-w2-group", body, "Staged Changes  " + committed);
        const files = el("ul", "gr-w2-files", body);
        for (const def of STORY.filter((d) => staged.includes(d.id))) {
          const li = el("li", "", files);
          const icon = el("i", "", li, TYPES[def.type].abbr);
          icon.style.background = TYPES[def.type].color;
          el("span", "", li, def.name);
        }
        el("div", "gr-w2-label", body, t("scMessage"));
        const message = el("div", "gr-w2-message", body);
        el("strong", "", message, "US-014 Panels Required on Installation");
        el("span", "", message, "Adds Panels_Required__c on Installation__c so the crew knows how many panels to load.");
        addChoice(body, "Commit", "commit", true);
        hint.textContent = t("keyOne");
        break;
      }
      case "publish": {
        el("strong", "", header, t("pipeTitle"));
        el("span", "gr-w2-branch", header, BRANCH);
        el("div", "gr-w2-done", body, "✓ " + t("commitDone"));
        addChoice(body, "Save / Publish", "publish", true, t("saveHint"));
        hint.textContent = t("keyOne");
        break;
      }
      case "question": {
        el("strong", "", header, "hardis:work:save");
        el("span", "gr-w2-branch", header, BRANCH);
        el("p", "gr-w2-question", body, t("qText"));
        addChoice(body, "Yes, my commit(s) are ready!", "yes", true);
        addChoice(body, t("qPull"), "pull", false);
        addChoice(body, t("qWhat"), "what", false);
        hint.textContent = t("keyChoose");
        break;
      }
      default: {
        el("strong", "", header, "Git Delta package.xml");
        el("span", "gr-w2-badge", header, String(committed));
        el("p", "gr-w2-question", body, committed === 4 ? t("reportHint") : t("reportShort", { n: committed }));
        const xml = el("div", "gr-w2-xml", body);
        for (const [type, all] of [
          ["CustomField", ["Installation__c.Panels_Required__c"]],
          ["Layout", ["Installation__c-Installation Layout"]],
          ["PermissionSet", ["Helios_Delivery_Crew", "Helios_Delivery_Manager"]]
        ]) {
          const names = all.filter((name) => STORY.some((d) => d.name === name && staged.includes(d.id)));
          if (!names.length) {
            continue;
          }
          const block = el("div", "", xml);
          el("b", "", block, type);
          for (const name of names) {
            el("span", "", block, name);
          }
        }
        el("p", "gr-w2-question", body, t("pushQ"));
        addChoice(body, t("pushYes"), "push", true);
        hint.textContent = t("keyOne");
      }
    }
    card.appendChild(hint);
    highlight();
  }

  function addChoice(parent, text, id, primary, detail) {
    const button = el("button", "gr-button gr-w2-choice" + (primary ? " gr-primary" : ""), parent);
    button.type = "button";
    el("span", "", button, text);
    if (detail) {
      el("small", "", button, detail);
    }
    const index = choices.length;
    button.addEventListener("click", () => {
      choice = index;
      answer();
    });
    choices.push({ id, button });
  }

  function highlight() {
    choices.forEach((c, i) => c.button.classList.toggle("is-selected", i === choice));
  }

  function answer() {
    if (!ctx.playing || !choices[choice] || choices[choice].off) {
      return;
    }
    const id = choices[choice].id;
    switch (id) {
      case "commit":
        ctx.collect(100, "Commit");
        showStep("publish");
        return;
      case "publish":
        ctx.sound.play("gate");
        hud.setPath([t("pRecent"), t("pCommit"), t("pPublish")], 2);
        showStep("question");
        return;
      case "pull":
        lose(t("qPullTitle"), t("qPullTip"));
        // Once is enough: the wrong answer cannot be picked again
        choices[choice].button.disabled = true;
        choices[choice].off = true;
        choice = 0;
        highlight();
        return;
      case "what":
        hud.toast(t("qWhatAnswer"), "power");
        return;
      case "yes":
        ctx.collect(100, "Yes, my commit(s) are ready!");
        showStep("report");
        return;
      default:
        hud.toast(t("pushed"), "good");
        card.hidden = true;
        hud.goal("");
        phase = "done";
        setData();
        const info = skipped.length ? t("infoSkipped", { names: skipped.map((d) => d.name).join(", ") }) : "";
        ctx.points(-100 * skipped.length);
        ctx.finish(noise === 0 && !skipped.length ? 200 : 0, info);
    }
  }

  /* ---------- The frame ---------- */

  function update(dt, time) {
    if (phase === "done") {
      return;
    }
    if (phase !== "end") {
      elapsed += dt;
      speed = Math.min(2.7 + elapsed * 0.022, 4.8);
    } else {
      speed = Math.max(0, speed - dt * 5);
      endTimer -= dt;
      if (endTimer <= 0 && !cardStep) {
        showStep("commit");
      }
    }

    if (phase === "sort") {
      storyTimer -= dt;
      if (flood !== "on") {
        rowTimer -= dt;
        if (rowTimer <= 0) {
          spawnRow();
          rowTimer = Math.max(0.95, 1.7 - elapsed * 0.008);
        }
      } else {
        stepFlood(dt);
      }
      if (flood === "none" && !storyOnBelt && (committed >= 2 || elapsed > 50 || !storyQueue.length)) {
        spawnHeader();
      }
      if (sortAt > 0 && elapsed >= sortAt && flood !== "on") {
        const lanes = freeLanes(2);
        if (lanes.length && spawnSpecial("sort", lanes[0])) {
          sortAt = -1;
        }
      }
      if (noteAt > 0 && elapsed >= noteAt && !noteFound && flood !== "on") {
        // Victor's note shows briefly: late, fast, in the lane furthest away
        const far = lane === 0 ? 2 : lane === 2 ? 0 : random() < 0.5 ? 0 : 2;
        const clear = !crates.some((c) => c.state === "belt" && c.lane === far && Math.abs(c.z + 10) < 1.6);
        if (clear && spawnSpecial("note", far, -10, 1.7)) {
          noteChances -= 1;
          noteAt = -1;
        }
      }
      if (flood === "done" && !storyOnBelt && !storyQueue.length && !flights.some((f) => f.role === "story")) {
        startEnd();
      }
    }

    // The belt
    const step = speed * dt;
    beltTexture.offset.y = (beltTexture.offset.y + step * 2.2) % 1;
    for (const drum of drums) {
      drum.rotation.x -= step / 0.16;
    }
    const lit = sortUntil > elapsed;
    for (const entry of crates) {
      if (entry.state !== "belt") {
        continue;
      }
      entry.age += dt;
      entry.z += step * entry.mul;
      if (entry.spin) {
        entry.spin.rotation.y = entry.role === "note" ? time * 3 : 0;
        if (entry.role !== "note" && entry.role !== "header") {
          entry.group.rotation.y = time * 2.2;
          // The sign keeps facing the guinea pig while the coin turns
          entry.board.rotation.y = -entry.group.rotation.y;
        }
      }
      if (entry.role === "note") {
        entry.y = BELT_Y + 0.45 + Math.sin(time * 9) * 0.08;
      }
      placeEntry(entry);
      if (entry.z > TIP_Z) {
        if (!missed(entry)) {
          entry.state = "fall";
          entry.vy = 0;
        }
      }
    }
    for (const entry of crates) {
      if (entry.state !== "fall") {
        continue;
      }
      entry.vy -= GRAVITY * dt;
      entry.y += entry.vy * dt;
      entry.z += step * 0.4;
      entry.group.rotation.x += dt * 3;
      placeEntry(entry);
      if (entry.y < -1.4) {
        release(entry);
      }
    }
    for (const entry of flights) {
      const f = entry.flight;
      f.t += dt / FLIGHT_S;
      const k = Math.min(f.t, 1);
      const slot = Math.min(staged.length, PILE_MAX - 1);
      const tx = BASKET_X - 0.7 + (slot % 5) * 0.35;
      const ty = BELT_Y + 0.3 + Math.floor(slot / 15) * 0.22;
      const tz = BASKET_Z - 0.32 + (Math.floor(slot / 5) % 3) * 0.32;
      entry.group.position.set(f.from.x + (tx - f.from.x) * k, f.from.y + (ty - f.from.y) * k + Math.sin(Math.PI * k) * 1.5, f.from.z + (tz - f.from.z) * k);
      entry.group.scale.setScalar(1 - 0.75 * k);
      entry.group.rotation.y = k * Math.PI;
      if (f.t >= 1) {
        entry.state = "landed";
        landed(entry);
      }
    }
    flights = flights.filter((e) => e.state === "fly");
    crates = crates.filter((e) => e.state === "belt" || e.state === "fall");
    syncCrates();

    // Sorted by Last Updated Date: the recent ones glow, the Lab 1.2 ones fade
    const pulse = 0.5 + 0.5 * Math.sin(time * 6);
    for (const [id, material] of cardMaterials) {
      const def = STORY.find((s) => s.id === id) || NOISE.find((n) => n.id === id);
      if (lit && def.min) {
        material.emissive.setRGB(0.02, 0.1 + 0.1 * pulse, 0.03);
        material.color.setRGB(1, 1, 1);
      } else if (lit) {
        material.emissive.setRGB(0, 0, 0);
        material.color.setRGB(0.45, 0.45, 0.48);
      } else {
        material.emissive.setRGB(0.1, 0.1, 0.1);
        material.color.setRGB(1, 1, 1);
      }
    }

    // Roller caps along the rails, turning with the belt
    const roll = (elapsed * speed) % 1;
    for (let r = 0; r < railXs.length; r++) {
      for (let i = 0; i < 26; i++) {
        position.set(railXs[r], BELT_Y - 0.06, TIP_Z - 0.4 - i + roll);
        matrix.compose(position, sideways, scaleVector);
        caps.setMatrixAt(r * 26 + i, matrix);
      }
    }
    caps.instanceMatrix.needsUpdate = true;

    // The guinea pig
    const targetX = LANES[lane];
    const dx = targetX - pigX;
    pigX += Math.sign(dx) * Math.min(Math.abs(dx), 12 * dt);
    if (pigY > 0 || pigVy > 0) {
      pigVy -= GRAVITY * dt;
      pigY = Math.max(0, pigY + pigVy * dt);
      if (pigY === 0) {
        pigVy = 0;
      }
    }
    scurry = Math.max(0, scurry - dt);
    pig.object.position.set(pigX, BELT_Y + pigY, PIG_Z);
    turn = phase === "sort" ? 0 : Math.min(Math.PI, turn + dt * 4);
    pig.object.rotation.set(0, turn, 0);
    pig.shadow.position.set(pigX, BELT_Y + 0.012, PIG_Z + 0.05);
    pig.state = { running: scurry > 0, airborne: pigY > 0.01, ducking: false, speed: 4, height: pigY };
    hit = Math.max(0, hit - dt);
    pig.hitWobble(hit);
    shake = Math.max(0, shake - dt);
    placeCamera(dt);
    ctx.setData("lane", lane);
    debugData();
    updateLens(time);
    if (panel.isConnected) {
      const overlay = hud.layer.parentElement;
      panel.classList.toggle("gr-w2-padded", Boolean(overlay && overlay.classList.contains("gr-show-buttons")));
      card.classList.toggle("gr-w2-padded", Boolean(overlay && overlay.classList.contains("gr-show-buttons")));
    }
  }

  // What a check (or a curious tester) can read: where the next thing worth a
  // jump is, and whether it is in reach now
  function updateLens(time) {
    zone.position.x = LANES[lane];
    zone.material.opacity = 0.28 + 0.12 * Math.sin(time * 5);
    if (phase !== "sort") {
      return;
    }
    const near = crates.filter((c) => c.state === "belt" && c.lane === lane && c.def && c.z > -9).sort((a, b) => b.z - a.z)[0];
    showLens(near || null);
    pop = Math.max(0, pop - 0.016);
    basket.scale.set(1 + pop * 0.4, 1 - pop * 0.3, 1 + pop * 0.4);
  }

  /** The office around the belts: Kenney furniture, crates and barrels, nothing in the way. */
  function placeProps() {
    const FLOOR = -0.6;
    const props = [
      ["desk", { height: 0.85 }, -5.1, -6, Math.PI / 2],
      ["computerScreen", { height: 0.5 }, -5.1, -6, Math.PI / 2, 0.85],
      ["chairDesk", { height: 1.0 }, -5.9, -6.2, -Math.PI / 2],
      ["kitchenCoffeeMachine", { height: 0.9 }, -4.4, -9.5, Math.PI / 2],
      ["pottedPlant", { height: 1.3 }, -4.3, -3.2, 0],
      ["pottedPlant", { height: 1.4 }, 6.2, -7.5, 0.5],
      ["plantSmall2", { height: 0.7 }, -4.4, -12, 0],
      ["cardboardBoxClosed", { height: 0.8 }, 5.0, -11.5, 0.3],
      ["cardboardBoxClosed", { height: 0.6 }, 5.0, -11.5, 0.9, 0.8],
      ["cardboardBoxOpen", { height: 0.7 }, 5.8, -12.8, -0.4],
      ["barrel", { height: 0.95 }, -4.6, -15, 0],
      ["barrel", { height: 0.95 }, -5.5, -15.6, 0.6],
      ["crate-strong", { height: 1.0 }, 5.2, -18.5, 0.2],
      ["crate-strong", { height: 0.8 }, 5.25, -18.5, 0.7, 1.0],
      ["crate", { height: 0.9 }, -4.6, -20.5, 0.4],
      ["conveyor-belt", { width: 1.8 }, 5.4, -23, Math.PI / 2],
      ["chest", { height: 0.7 }, -3.6, 1.2, 0.3],
      ["trashcan", { height: 0.7 }, 6.3, -3.5, 0]
    ];
    for (const [name, size, x, z, turn, lift] of props) {
      const prop = ctx.models && ctx.models.get(name, Object.assign({ shadows: false }, size));
      if (!prop) {
        continue;
      }
      prop.position.set(x, FLOOR + (lift || 0), z);
      prop.rotation.y = turn;
      root.add(prop);
    }
  }

  function debugData() {
    const wanted = crates.filter((c) => c.state === "belt" && c.role !== "noise" && c.role !== "flood" && c.role !== "header").sort((a, b) => b.z - a.z)[0];
    ctx.setData("target", wanted ? wanted.lane + ":" + wanted.role : "");
    ctx.setData("reach", wanted && wanted.z > WINDOW_FAR + 0.6 && wanted.z <= TIP_Z ? "1" : "0");
    const front = crates.filter((c) => c.state === "belt" && c.lane === lane && c.def).sort((a, b) => b.z - a.z)[0];
    ctx.setData("front", front && front.z > WINDOW_FAR + 0.6 ? front.role : "");
  }

  const eye = new THREE.Vector3(0, 3.4, 6);
  const focus = new THREE.Vector3(0, 0.6, -6);
  const wantedEye = new THREE.Vector3();
  const wantedFocus = new THREE.Vector3();

  function placeCamera(dt) {
    const portrait = engine.portrait;
    if (phase === "end" || phase === "done") {
      // The guinea pig turned round, above the card
      wantedEye.set(0.4, portrait ? 2.8 : 2.2, portrait ? 6.2 : 4.8);
      wantedFocus.set(0.3, portrait ? -1.6 : -0.5, -1);
    } else {
      if (portrait) {
        // A narrow screen follows the guinea pig, and looks down on the end of the belt
        wantedEye.set(0.3 + pigX * 0.55, 7.4, 5.4);
        wantedFocus.set(0.3 + pigX * 0.4, -1.2, -3.6);
      } else {
        wantedEye.set(0.6 + pigX * 0.2, 5.0, 4.9);
        wantedFocus.set(0.6 + pigX * 0.1, -0.3, -6);
      }
    }
    const ease = Math.min(1, dt * 4);
    eye.lerp(wantedEye, ease);
    focus.lerp(wantedFocus, ease);
    const jitter = shake > 0 && engine.motion ? (Math.random() - 0.5) * shake : 0;
    camera.fov = portrait ? 70 : 58;
    camera.updateProjectionMatrix();
    camera.position.set(eye.x + jitter, eye.y, eye.z);
    camera.lookAt(focus);
    engine.aimSun(0, -3);
  }

  // Ready for the intro card: a few crates already on the belt
  for (let i = 0; i < 5; i++) {
    const entry = spawnCrate(NOISE[(i * 5) % NOISE.length], "noise", i % 3);
    if (entry) {
      entry.z = -6 - i * 3.6;
      placeEntry(entry);
    }
  }
  setPile([]);
  renderPanel();
  setData();
  placeProps();
  syncCrates();
  pig.object.position.set(0, BELT_Y, PIG_Z);
  pig.shadow.position.set(0, BELT_Y + 0.012, PIG_Z + 0.05);

  return {
    start() {
      hud.setPath([t("pRecent"), t("pCommit"), t("pPublish")], 0);
      hud.toast(t("go"), "good");
      hud.goal(t("goalStage", { n: 0 }));
      hud.coach(t("coachStart"), 2800);
    },
    update,
    action(name) {
      if (phase === "end") {
        if (!cardStep) {
          return;
        }
        if (name === "left" || name === "right") {
          do {
            choice = (choice + (name === "left" ? choices.length - 1 : 1)) % choices.length;
          } while (choices[choice].off);
          highlight();
        } else if (name === "confirm" || name === "jump" || name === "tap") {
          answer();
        }
        return;
      }
      if (phase !== "sort") {
        return;
      }
      if (name === "left" || name === "right") {
        const next = Math.max(0, Math.min(2, lane + (name === "left" ? -1 : 1)));
        if (next !== lane) {
          lane = next;
          scurry = 0.25;
        }
      } else if (name === "jump" || name === "tap" || name === "confirm") {
        grab();
      }
    },
    idleCamera(time) {
      const portrait = engine.portrait;
      const sway = Math.sin(time * 0.3) * 1.6;
      camera.fov = portrait ? 70 : 58;
      camera.updateProjectionMatrix();
      camera.position.set(4.2 + sway, portrait ? 4.6 : 3.4, portrait ? 7.5 : 5.2);
      camera.lookAt(0, 0.6, -6);
      engine.aimSun(0, -3);
    },
    dispose() {
      panel.remove();
      card.remove();
      lens.remove();
      hud.goal("");
      caps.dispose();
      legs.dispose();
      deckLegs.dispose();
      pile.dispose();
      for (const part of crateParts) {
        part.mesh.dispose();
      }
      for (const thing of disposables) {
        thing.dispose();
      }
      hud.setPath([], 0);
    }
  };
}

/* ---------- Drawing ---------- */

/** A crate's label: a coloured band with the type, the API name big, who changed it and when. */
function drawCrateCard(c, w, h, def, footer, recent) {
  const type = TYPES[def.type];
  rounded(c, 4, 4, w - 8, h - 8, 22);
  c.fillStyle = SLDS.white;
  c.fill();
  c.save();
  rounded(c, 4, 4, w - 8, h - 8, 22);
  c.clip();
  c.fillStyle = type.color;
  c.fillRect(0, 0, w, 92);
  c.restore();
  glyph(c, type.glyph, 54, 48, 74, SLDS.white);
  c.textAlign = "left";
  c.textBaseline = "middle";
  c.fillStyle = SLDS.white;
  fitText(c, def.type, 100, 50, w - 124, 44, "800");
  const main = splitName(def.name)[1];
  c.fillStyle = SLDS.navy;
  c.textAlign = "center";
  fitText(c, main, w / 2, 160, w - 40, 64, "800");
  c.fillStyle = recent ? SLDS.success : "#5C5C5C";
  fitText(c, footer, w / 2, h - 42, w - 40, 38, "800");
  c.lineWidth = 8;
  c.strokeStyle = type.color;
  rounded(c, 4, 4, w - 8, h - 8, 22);
  c.stroke();
}

/** The header of the Recent Changes table, with its tick box. */
function drawHeaderRow(c, w, h, label) {
  rounded(c, 4, 4, w - 8, h - 8, 16);
  c.fillStyle = SLDS.white;
  c.fill();
  c.lineWidth = 6;
  c.strokeStyle = SLDS.border;
  c.stroke();
  c.fillStyle = "#F3F3F3";
  c.fillRect(10, 10, w - 20, 104);
  // The tick box, big and tempting
  rounded(c, 30, 28, 68, 68, 10);
  c.fillStyle = SLDS.white;
  c.fill();
  c.lineWidth = 7;
  c.strokeStyle = SLDS.brand;
  c.stroke();
  c.textAlign = "left";
  c.textBaseline = "middle";
  c.fillStyle = SLDS.weak;
  font(c, 40, "700");
  c.fillText("Type", 130, 62);
  c.fillText("Name", 380, 62);
  fitText(c, "Last Updated Date  ▼", 640, 62, 360, 40, "700");
  c.fillStyle = SLDS.brand;
  c.fillRect(10, 122, w - 20, 104);
  c.fillStyle = SLDS.white;
  c.textAlign = "center";
  fitText(c, label, w / 2, 176, w - 60, 46, "800");
}

/** The label of a crate: its front and its top as one mesh, so one draw call. */
function crateLabelGeometry(THREE) {
  const front = new THREE.PlaneGeometry(CRATE.w * 0.86, CRATE.h * 0.8);
  front.translate(0, 0, CRATE.d / 2 + 0.02);
  const top = new THREE.PlaneGeometry(CRATE.w * 0.86, CRATE.d * 0.8);
  top.rotateX(-Math.PI / 2);
  top.translate(0, CRATE.h / 2 + 0.02, 0);
  const geometry = new THREE.BufferGeometry();
  for (const name of ["position", "normal", "uv"]) {
    const a = front.getAttribute(name);
    const b = top.getAttribute(name);
    const array = new Float32Array(a.array.length + b.array.length);
    array.set(a.array, 0);
    array.set(b.array, a.array.length);
    geometry.setAttribute(name, new THREE.BufferAttribute(array, a.itemSize));
  }
  const count = front.getAttribute("position").count;
  const index = Array.from(front.index.array).concat(Array.from(top.index.array, (i) => i + count));
  geometry.setIndex(index);
  front.dispose();
  top.dispose();
  return geometry;
}

/** "Installation__c.Panels_Required__c" reads best as its object, then its name. */
function splitName(name) {
  const dot = name.indexOf(".");
  if (dot > 0) {
    return [name.slice(0, dot + 1), name.slice(dot + 1)];
  }
  const dash = name.indexOf("__c-");
  if (dash > 0) {
    return [name.slice(0, dash + 4), name.slice(dash + 4)];
  }
  return [null, name];
}

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

export const CSS = `
.guinea-run .gr-w2-staged {
  position: absolute;
  left: calc(env(safe-area-inset-left, 0px) + 10px);
  bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
  width: min(390px, calc(100vw - 20px));
  padding: 8px 10px;
  border: 1px solid #c9c9c9;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 6px rgba(3, 45, 96, 0.2);
  color: #181818;
  font-size: 12px;
  pointer-events: none;
}
.guinea-run .gr-w2-staged.gr-w2-padded {
  bottom: calc(env(safe-area-inset-bottom, 0px) + 86px);
}
.guinea-run .gr-w2-staged.is-done {
  display: none;
}
.guinea-run .gr-w2-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}
.guinea-run .gr-w2-head strong {
  color: #032d60;
  font-size: 13px;
}
.guinea-run .gr-w2-count {
  min-width: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: #0176d3;
  color: #ffffff;
  font-weight: 700;
  text-align: center;
}
.guinea-run .gr-w2-count.is-over {
  background: #ea001e;
}
.guinea-run .gr-w2-how {
  margin-left: auto;
  color: #444444;
}
.guinea-run .gr-w2-staged ul,
.guinea-run .gr-w2-files {
  display: grid;
  gap: 3px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.guinea-run .gr-w2-staged li,
.guinea-run .gr-w2-files li {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  color: #032d60;
  font-family: "JetBrains Mono", Consolas, monospace;
}
.guinea-run .gr-w2-staged li span,
.guinea-run .gr-w2-files li span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.guinea-run .gr-w2-staged li i,
.guinea-run .gr-w2-files li i {
  flex: 0 0 auto;
  min-width: 22px;
  padding: 1px 3px;
  border-radius: 3px;
  color: #ffffff;
  font-family: "Open Sans", Arial, sans-serif;
  font-size: 11px;
  font-style: normal;
  font-weight: 800;
  text-align: center;
  opacity: 0.45;
}
.guinea-run .gr-w2-staged li {
  font-size: 14px;
  font-weight: 700;
}
.guinea-run .gr-w2-staged li.is-on {
  color: #2e844a;
  font-weight: 700;
}
.guinea-run .gr-w2-staged li.is-on i {
  opacity: 1;
}
.guinea-run .gr-w2-staged li.is-on span::before {
  content: "\\2713  ";
}
.guinea-run .gr-w2-lens {
  position: absolute;
  left: 50%;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: min(520px, calc(100vw - 32px));
  padding: 8px 16px 8px 10px;
  border: 3px solid #ffd84d;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 4px 0 #f0b400, 0 6px 16px rgba(3, 45, 96, 0.3);
  color: #032d60;
  transform: translateX(-50%);
  pointer-events: none;
}
.guinea-run .gr-w2-lens[hidden] {
  display: none;
}
.guinea-run .gr-w2-lens small {
  position: absolute;
  top: -11px;
  left: 14px;
  padding: 0 8px;
  border-radius: 999px;
  background: #ffd84d;
  color: #032d60;
  font-size: 12px;
  font-weight: 800;
}
.guinea-run .gr-w2-lens i {
  flex: 0 0 auto;
  min-width: 40px;
  padding: 8px 4px;
  border-radius: 8px;
  color: #ffffff;
  font-size: 15px;
  font-style: normal;
  font-weight: 800;
  text-align: center;
}
.guinea-run .gr-w2-lens div {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.guinea-run .gr-w2-lens b {
  color: #444444;
  font-size: 13px;
}
.guinea-run .gr-w2-lens-name {
  overflow-wrap: anywhere;
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.2;
}
.guinea-run .gr-w2-lens em {
  color: #5c5c5c;
  font-size: 13px;
  font-style: normal;
  font-weight: 700;
}
.guinea-run .gr-w2-lens em.is-recent {
  color: #2e844a;
}
.guinea-run .gr-w2-card {
  position: absolute;
  left: 50%;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
  width: min(440px, calc(100vw - 32px));
  max-height: calc(100dvh - 140px);
  overflow-y: auto;
  border: 1px solid #c9c9c9;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(3, 45, 96, 0.35);
  color: #181818;
  font-size: 13px;
  transform: translateX(-50%);
  animation: gr-w2-in 0.25s ease-out;
}
.guinea-run .gr-w2-card.gr-w2-padded {
  bottom: calc(env(safe-area-inset-bottom, 0px) + 86px);
  max-height: calc(100dvh - 210px);
}
.guinea-run .gr-w2-card[hidden] {
  display: none;
}
.guinea-run .gr-w2-card-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid #e5e5e5;
  background: #f3f3f3;
  border-radius: 8px 8px 0 0;
}
.guinea-run .gr-w2-card-head strong {
  color: #032d60;
  font-size: 15px;
}
.guinea-run .gr-w2-branch {
  color: #444444;
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 12px;
}
.guinea-run .gr-w2-badge {
  padding: 0 8px;
  border-radius: 999px;
  background: #0176d3;
  color: #ffffff;
  font-weight: 800;
}
.guinea-run .gr-w2-card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px 6px;
}
.guinea-run .gr-w2-done {
  color: #2e844a;
  font-weight: 700;
}
.guinea-run .gr-w2-group,
.guinea-run .gr-w2-label {
  color: #444444;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}
.guinea-run .gr-w2-files li {
  color: #181818;
  font-size: 12px;
}
.guinea-run .gr-w2-files li i {
  opacity: 1;
}
.guinea-run .gr-w2-message {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 10px;
  border: 1px solid #c9c9c9;
  border-radius: 4px;
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 12px;
}
.guinea-run .gr-w2-question {
  margin: 0;
  font-weight: 700;
}
.guinea-run .gr-w2-xml {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 4px;
  background: #032d60;
  color: #7cfc9a;
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 12px;
}
.guinea-run .gr-w2-xml div {
  display: flex;
  flex-direction: column;
}
.guinea-run .gr-w2-xml b {
  color: #ffffff;
}
.guinea-run .gr-w2-xml span {
  padding-left: 12px;
}
.guinea-run .gr-w2-choice {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-height: 44px;
  text-align: left;
}
.guinea-run .gr-w2-choice small {
  font-size: 12px;
  font-weight: 400;
  opacity: 0.9;
}
.guinea-run .gr-w2-choice:disabled {
  opacity: 0.45;
  text-decoration: line-through;
  cursor: not-allowed;
}
.guinea-run .gr-w2-choice.is-selected {
  outline: 3px solid #fe9339;
  outline-offset: 2px;
}
.guinea-run .gr-w2-card-hint {
  margin: 0;
  padding: 4px 14px 10px;
  color: #444444;
  font-size: 12px;
}
@keyframes gr-w2-in {
  from {
    opacity: 0;
    transform: translate(-50%, 12px);
  }
}
@media (min-width: 601px) {
  .guinea-run .gr-w2-lens {
    left: calc(50% + 150px);
  }
}
@media (max-width: 600px) {
  .guinea-run .gr-w2-lens {
    left: 16px;
    right: 16px;
    max-width: none;
    transform: none;
  }
  .guinea-run .gr-w2-lens-name {
    overflow-wrap: break-word;
    font-size: 16px;
  }
  .guinea-run .gr-w2-staged li {
    font-size: 13px;
  }
  .guinea-run .gr-w2-staged {
    left: 16px;
    right: 16px;
    width: auto;
  }
  .guinea-run .gr-w2-how {
    margin-left: 0;
    flex-basis: 100%;
  }
}
`;