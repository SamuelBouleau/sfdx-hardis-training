/*
 * World 1, Build it in the org (Labs 1.3 and 1.4): a side-on platformer
 * through what a contributor does, in the order of the labs.
 *
 * Lab 1.3 first: New User Story, the type, the name, the org, and the branch
 * it creates. Two answers of the command are traps that give way under the
 * guinea pig, the way the lab warns: Fix is for something already delivered,
 * and Create new scratch org fails after a long wait.
 *
 * Then Lab 1.4, one stop per metadata the story creates or updates: the
 * custom field Installation__c.Panels_Required__c, the page layout
 * Installation Layout, then the permission sets Helios_Delivery_Crew and
 * Helios_Delivery_Manager. Between the field and the layout, a trap: keeping
 * Visible ticked for the profiles, when access goes through a permission set.
 *
 * The twist is the lab's warning: after Save the guinea pig is a ghost, because
 * a field no permission grants is invisible to everybody, the admin who
 * created it included. Only Helios_Delivery_Manager, the permission set you
 * hold, makes it visible again. The crew gets Read Access only, as in the lab:
 * Edit Access floats above the crew's row as a temptation.
 *
 * Vegetables are bonus points all along, as in world 0. At the end the record
 * INST-00001 shows Panels Required: 39, the 23 + 16 of its timeline.
 */
import { SLDS, rounded, fitText, glyph, font, pictureBox } from "../core/painter.js";

export const PADS = ["left", "right", "jump"];
// The course's own items for the parts of the story; Kenney flags and far-away
// islands for the scenery; the vegetables for the bonus points
export const MODELS = ["salesforce", "platform", "nature", "vegetables"];

// The bonus vegetables, one kind per model of the vegetables pack (as in world 0)
const VEGETABLES = ["fennel", "carrot", "bellPepper", "cucumber", "romaine", "parsley"];
const VEGETABLE_MODELS = { fennel: "fennel", carrot: "carrot", bellPepper: "bell-pepper", cucumber: "cucumber", romaine: "romaine", parsley: "parsley" };
const VEGETABLE_COLORS = { fennel: "#7BC96F", carrot: "#FF8A3D", bellPepper: "#E8473B", cucumber: "#3E9B4F", romaine: "#8CD17D", parsley: "#2E844A" };
const VEGETABLE_POINTS = 15;

// Which item each part shows: what it means in the lab
function partItem(def) {
  const BY_LABEL = {
    "New User Story": "ticket",
    Feature: "ticket",
    "US-014-panels-required": "ticket",
    "Reuse scratch org helios-dev": "scratch-cloud",
    "features/US-014-panels-required": "branch",
    Open: "scratch-cloud"
  };
  return def.item || BY_LABEL[def.label] || "custom-field";
}

export const TEXTS = {
  en: {
    intro: "US-014, Show the crew how many panels a job needs. Start it on its own branch, then build it in Setup: one field, one layout, two permission sets.",
    how1: "Run with Left and Right, jump with Up or Space",
    how2: "Grab the glowing item: the next step of the lab",
    how3: "Eat vegetables for bonus points, reach INST-00001",
    goalNext: "Next: {{label}}",
    goalEnd: "Run to INST-00001",
    c_start: "Run right and jump the gaps!",
    faster: "Faster!",
    c_trap: "Wrong answer: jump back up!",
    c_hazard: "Wait for the red cross to move, then go",
    c_fall: "Back at the last flag: try again",
    c_ghost: "Invisible! Grab Helios_Delivery_Manager to be seen again",
    c_visible: "Visible again! Run to INST-00001",
    c_lift: "Ride the Edit button up",
    coachVeg: "Yum! Vegetables are bonus points",
    note: "Created a field and cannot see it? Nobody can. Grant it in a permission set, never a profile, then look at a real record before you call it done. - V.",
    path0: "New User Story",
    path1: "Field and layout",
    path2: "Permission sets",
    path3: "Record page",
    parts: "Parts",
    vegetablesCount: "Vegetables: {{n}}.",
    invisible: "Invisible",
    q_type: "What type of User Story do you want to create?",
    q_org: "Which Salesforce org do you want to work in?",
    o_fall: "Session expired or invalid",
    o_fall_tip: "Open the org again from Orgs Manager: the extension uses the credential it stored, no password, no login page.",
    o_fix: "Fix is for something already delivered",
    o_fix_tip: "US-014 adds something that was not there: answer Feature: a new capability or an improvement.",
    o_create: "The command fails after a long wait",
    o_create_tip: "Never take Create new scratch org here: a Developer Edition Dev Hub keeps only three alive. Take Reuse scratch org helios-dev.",
    o_profile: "The profiles would get the field",
    o_profile_tip: "Clear Visible for every profile on the field-level security screen: in this project access goes through a permission set, never a profile.",
    o_valid: "Save fails with a validation rule error",
    o_valid_tip: "The Helios org refuses an installation date in the past. If you changed the date by accident, put it back to a future date.",
    o_crewEdit: "Leave Edit Access unticked on the crew",
    o_crewEdit_tip: "A crew member reads how many panels to load, they do not decide the number.",
    v_hazard: "Validation rule",
    v_pit: "Session expired or invalid",
    v_ghostSign: "Panels Required: visible to nobody",
    v_orgAlias: "Org · ALIAS",
    v_profileKeep: "Keep Visible ticked for the profiles",
    v_profileClear: "Clear Visible for every profile",
    m_field: "Created: the Number field that tells the crew how many panels to load",
    m_layout: "Updated: puts Panels Required on the Installation record page",
    m_crew: "Updated: Read Access for the crew, who load the panels",
    m_manager: "Updated: Read and Edit Access for the planners, you included",
    branch: "git checkout -b features/US-014-panels-required",
    target: "Target branch: integration",
    fieldName: "Field Name: Panels_Required (Salesforce adds __c when it saves)",
    saved: "Panels_Required__c saved",
    ghost: "Panels Required is invisible to everybody, you included",
    ghostTick: "No profile, no permission set grants it yet",
    crewRead: "The crew can read it. You still cannot: you hold Helios Delivery Manager",
    mgrRead: "Visible again: Helios Delivery Manager grants it to you",
    refresh: "Refresh: one more attempt",
    info_ghost: "You reached INST-00001 still invisible: in the lab, without Read Access on Helios Delivery Manager the record shows you nothing.",
    info_field: "You skipped the custom field: in the lab, Panels_Required__c is what the whole story builds.",
    info_crew: "You skipped Helios_Delivery_Crew: in the lab, the crew could not see the field.",
    info_layout: "You skipped Installation Layout: in the lab, that is what puts the field on the record page.",
    info_other: "Also missed: {{list}}.",
    outOfOrder: "{{label}}, out of order: in the lab, {{first}} comes first",
    done: "Panels Required on INST-00001: {{n}}, the 23 + 16 of its timeline",
    doneGhost: "INST-00001 shows no Panels Required: nothing grants it to you",
    veg_fennel: "Fennel",
    veg_carrot: "Carrot",
    veg_bellPepper: "Bell pepper",
    veg_cucumber: "Cucumber",
    veg_romaine: "Romaine",
    veg_parsley: "Parsley"
  },
  fr: {
    intro: "US-014, Show the crew how many panels a job needs. Démarrez-la sur sa propre branch, puis construisez-la dans Setup : un champ, une présentation de page, deux permission sets.",
    how1: "Courez avec Gauche et Droite, sautez avec Haut ou Espace",
    how2: "Prenez l'élément qui brille : la prochaine étape du lab",
    how3: "Mangez des légumes pour des points bonus, atteignez INST-00001",
    goalNext: "Suivant : {{label}}",
    goalEnd: "Courez vers INST-00001",
    c_start: "Courez à droite et sautez les trous !",
    faster: "Plus vite !",
    c_trap: "Mauvaise réponse : remontez d'un saut !",
    c_hazard: "Attendez que la croix rouge bouge, puis passez",
    c_fall: "Retour au dernier drapeau : réessayez",
    c_ghost: "Invisible ! Prenez Helios_Delivery_Manager pour réapparaître",
    c_visible: "De nouveau visible ! Courez vers INST-00001",
    c_lift: "Montez sur le bouton Edit",
    coachVeg: "Miam ! Les légumes, ce sont des points bonus",
    note: "Vous avez créé un champ et vous ne le voyez pas ? Personne ne le voit. Accordez-le dans un permission set, jamais un profil, puis regardez un vrai enregistrement avant de dire que c'est fini. - V.",
    path0: "New User Story",
    path1: "Champ et présentation",
    path2: "Permission sets",
    path3: "Page d'enregistrement",
    parts: "Pièces",
    vegetablesCount: "Légumes : {{n}}.",
    invisible: "Invisible",
    q_type: "What type of User Story do you want to create?",
    q_org: "Which Salesforce org do you want to work in?",
    o_fall: "Session expired or invalid",
    o_fall_tip: "Rouvrez l'org depuis Orgs Manager : l'extension utilise l'identifiant qu'elle a gardé, pas de mot de passe, pas de page de connexion.",
    o_fix: "Fix, c'est pour quelque chose de déjà livré",
    o_fix_tip: "US-014 ajoute quelque chose qui n'existait pas : répondez Feature: a new capability or an improvement.",
    o_create: "La commande échoue après une longue attente",
    o_create_tip: "Ne prenez jamais Create new scratch org ici : un Dev Hub Developer Edition n'en garde que trois en vie. Prenez Reuse scratch org helios-dev.",
    o_profile: "Les profils auraient le champ",
    o_profile_tip: "Décochez Visible pour tous les profils sur l'écran de sécurité au niveau du champ : dans ce projet l'accès passe par un permission set, jamais par un profil.",
    o_valid: "L'enregistrement échoue avec une erreur de règle de validation",
    o_valid_tip: "L'org Helios refuse une date d'installation dans le passé. Si vous avez changé la date par erreur, remettez une date future.",
    o_crewEdit: "Laissez Edit Access décoché pour l'équipe",
    o_crewEdit_tip: "Un membre de l'équipe lit combien de panneaux charger, il ne décide pas du nombre.",
    v_hazard: "Validation rule",
    v_pit: "Session expired or invalid",
    v_ghostSign: "Panels Required : visible par personne",
    v_orgAlias: "Org · ALIAS",
    v_profileKeep: "Garder Visible coché pour les profils",
    v_profileClear: "Décocher Visible pour tous les profils",
    m_field: "Créé : le champ Number qui dit à l'équipe combien de panneaux charger",
    m_layout: "Mis à jour : met Panels Required sur la page d'enregistrement Installation",
    m_crew: "Mis à jour : Read Access pour l'équipe, qui charge les panneaux",
    m_manager: "Mis à jour : Read Access et Edit Access pour les planificateurs, vous compris",
    branch: "git checkout -b features/US-014-panels-required",
    target: "Branch cible : integration",
    fieldName: "Field Name : Panels_Required (Salesforce ajoute __c à l'enregistrement)",
    saved: "Panels_Required__c enregistré",
    ghost: "Panels Required est invisible pour tout le monde, vous compris",
    ghostTick: "Aucun profil, aucun permission set ne l'accorde encore",
    crewRead: "L'équipe peut le lire. Vous, toujours pas : vous avez Helios Delivery Manager",
    mgrRead: "De nouveau visible : Helios Delivery Manager vous l'accorde",
    refresh: "Refresh : un essai de plus",
    info_ghost: "Vous avez atteint INST-00001 encore invisible : dans le lab, sans Read Access sur Helios Delivery Manager, l'enregistrement ne vous montre rien.",
    info_field: "Vous avez sauté le champ personnalisé : dans le lab, Panels_Required__c est ce que toute la story construit.",
    info_crew: "Vous avez sauté Helios_Delivery_Crew : dans le lab, l'équipe ne voyait pas le champ.",
    info_layout: "Vous avez sauté Installation Layout : dans le lab, c'est ce qui met le champ sur la page d'enregistrement.",
    info_other: "Également manqué : {{list}}.",
    outOfOrder: "{{label}}, dans le désordre : dans le lab, {{first}} vient d'abord",
    done: "Panels Required sur INST-00001 : {{n}}, les 23 + 16 de sa timeline",
    doneGhost: "INST-00001 ne montre pas Panels Required : rien ne vous l'accorde",
    veg_fennel: "Fenouil",
    veg_carrot: "Carotte",
    veg_bellPepper: "Poivron",
    veg_cucumber: "Concombre",
    veg_romaine: "Romaine",
    veg_parsley: "Persil"
  }
};

/** The strings taken word for word from the labs, checked by scripts/verify/check-easter-egg.mjs. */
export const QUOTES = [
  { lab: "1.3", text: "New User Story" },
  { lab: "1.3", text: "DevOps Pipeline" },
  { lab: "1.3", text: "Automatically selected target branch is integration" },
  { lab: "1.3", text: "What type of User Story do you want to create?" },
  { lab: "1.3", text: "Feature: a new capability or an improvement" },
  { lab: "1.3", text: "Fix: correct something that is broken" },
  { lab: "1.3", text: "What is the name of your new User Story?" },
  { lab: "1.3", text: "US-014-panels-required" },
  { lab: "1.3", text: "Which Salesforce org do you want to work in?" },
  { lab: "1.3", text: "Reuse scratch org helios-dev" },
  { lab: "1.3", text: "Create new scratch org" },
  { lab: "1.3", text: "features/US-014-panels-required" },
  { lab: "1.4", text: "Orgs Manager" },
  { lab: "1.4", text: "helios-dev" },
  { lab: "1.4", text: "ALIAS" },
  { lab: "1.4", text: "Setup > Object Manager > Installation" },
  { lab: "1.4", text: "Fields & Relationships" },
  { lab: "1.4", text: "Panels Required" },
  { lab: "1.4", text: "Panels_Required" },
  { lab: "1.4", text: "Panels_Required__c" },
  { lab: "1.5", text: "Installation__c.Panels_Required__c" },
  { lab: "1.4", text: "Installation Layout" },
  { lab: "1.5", text: "Installation__c-Installation Layout" },
  { lab: "1.4", text: "Setup > Permission Sets > Helios Delivery Crew" },
  { lab: "1.4", text: "Helios_Delivery_Crew" },
  { lab: "1.4", text: "Helios Delivery Manager" },
  { lab: "1.5", text: "Helios_Delivery_Manager" },
  { lab: "1.4", text: "Field Permissions" },
  { lab: "1.4", text: "Read Access" },
  { lab: "1.4", text: "Edit Access" },
  { lab: "1.4", text: "App Launcher > Helios Delivery > Installations" },
  { lab: "1.4", text: "INST-00001" }
];

/* ---------- How it feels ---------- */

const RUN_SPEED = 6.5;
const GROUND_ACCEL = 60;
const AIR_ACCEL = 34;
const GRAVITY = 30;
const JUMP_SPEED = 12.2;
// Letting go of jump early cuts the rise: short hops and full jumps
const JUMP_CUT = 0.45;
const MAX_FALL = -20;
// Still allowed to jump just after running off an edge, and a press just
// before landing still counts
const COYOTE_S = 0.15;
const BUFFER_S = 0.2;
// A swipe has no release: it moves for this long
const NUDGE_S = 0.35;
// The shortest move of a key or a pad tapped and let go at once
const TAP_S = 0.12;
const FALL_Y = -7;
const HALF_W = 0.5;
const FOOT = 0.38;
const HEIGHT = 0.85;
const STEP_UP = 0.45;
const INVULNERABLE_S = 2;
const PART_RADIUS = 0.85;
const VEGETABLE_RADIUS = 0.75;
const VEGETABLE_HEIGHT = 0.6;
const DEPTH = 2.4;
const TRAP_S = 1.2;
// Edit Access, the temptation above the crew's row
const DECOY_X = 138.7;
const DECOY_Y = 7;
const END_X = 161.5;
// The pace: what moves on its own (validation rules, lifts, traps) speeds up
// with the parts taken, up to +35 % at the end, on an ease-in curve. The
// guinea pig's own top speed follows a little (a third of it). A lost attempt
// slows everything down by 15 % for a few seconds
const PACE_GAIN = 0.55;
const PACE_RUN_SHARE = 0.4;
// The share of the parts taken at the gentle pace: the New User Story stage
const PACE_CALM = 0.5;
const MERCY_S = 5;
const MERCY_FACTOR = 0.85;
// How fast the pace may change, per second: never a jump
const PACE_RATE = 0.08;

/* ---------- The level, left to right ---------- */

// Each platform: x0, x1, top, look, text, extra. Every one is a solid box.
function levelPlatforms(t) {
  return [
    // Lab 1.3, in the DevOps Pipeline panel
    { x0: -6, x1: 8, top: 0, h: 1.2, look: "vscode", text: "DevOps Pipeline", sub: "Project Contribution Workflow" },
    { x0: 9, x1: 16.5, top: -1, look: "answer", text: "Fix: correct something that is broken", trap: { title: "o_fix", tip: "o_fix_tip", delay: TRAP_S } },
    { x0: 10, x1: 15.5, top: 1.6, h: 0.6, look: "answer", text: "Feature: a new capability or an improvement" },
    { x0: 17.5, x1: 23.5, top: 2.2, look: "input", text: "US-014-panels-required", sub: "What is the name of your new User Story?" },
    { x0: 24.5, x1: 34, top: 1.2, look: "answer", text: "Create new scratch org", trap: { title: "o_create", tip: "o_create_tip", delay: 1.8 } },
    { x0: 25.5, x1: 30.5, top: 3.8, h: 0.6, look: "answer", text: "Reuse scratch org helios-dev" },
    { x0: 32.5, x1: 40, top: 3.4, look: "branch", text: "features/US-014-panels-required" },
    // Orgs Manager: read the ALIAS column, every row is an org
    { x0: 40, x1: 44, top: 2.6, look: "row", text: "helios-integration", sub: t("v_orgAlias") },
    { x0: 44, x1: 47.7, top: 1.8, look: "row", text: "helios-uat", sub: t("v_orgAlias") },
    { x0: 47.7, x1: 53.5, top: 1, look: "row", text: "helios-dev", sub: t("v_orgAlias"), hot: true },
    // Setup > Object Manager > Installation
    { x0: 55.5, x1: 59, top: 1, look: "card", text: "Setup" },
    { x0: 61.6, x1: 70, top: 1, look: "card", text: "Object Manager" },
    { x0: 70, x1: 74, top: 1.4, look: "card", text: "Installation" },
    // The custom field, created
    { x0: 75.5, x1: 84, top: 2.6, look: "meta", text: "Installation__c.Panels_Required__c", sub: "CustomField", line: "m_field" },
    // Field-level security: the profiles, a trap, or cleared, the way of the lab
    { x0: 85.5, x1: 92.5, top: 1.8, look: "answer", text: t("v_profileKeep"), trap: { title: "o_profile", tip: "o_profile_tip", delay: TRAP_S } },
    { x0: 86.5, x1: 91.5, top: 4, h: 0.6, look: "answer", text: t("v_profileClear") },
    // The page layout, updated, and Save
    { x0: 93.5, x1: 101, top: 3.6, h: 2, look: "meta", text: "Installation__c-Installation Layout", sub: "Layout", line: "m_layout" },
    { x0: 103.6, x1: 109, top: 3, look: "button", text: "Save", big: true, save: true },
    // After the twist: the permission sets
    { x0: 110.3, x1: 115.5, top: 2.6, look: "card", text: "Setup > Permission Sets", ghost: true },
    { x0: 115.5, x1: 124, top: 3.4, look: "meta", text: "Helios_Delivery_Crew", sub: "PermissionSet", line: "m_crew", ghost: true },
    { x0: 125.5, x1: 128.7, top: 2, look: "button", text: "Edit", ghost: true, move: { axis: "y", amp: 2.4, speed: 0.95, lift: true } },
    { x0: 129.8, x1: 138, top: 4.4, look: "fls", text: "Panels Required", sub: "Field Permissions", faint: true },
    { x0: 139.4, x1: 148, top: 4.4, look: "meta", text: "Helios_Delivery_Manager", sub: "PermissionSet", line: "m_manager", ghost: true },
    // The record
    { x0: 149.5, x1: 153, top: 2.8, look: "card", text: "App Launcher" },
    { x0: 154.5, x1: 167.5, top: 2, h: 2.6, look: "record", text: "INST-00001" }
  ];
}

// The parts, in the order they must be got. kind: answer (Lab 1.3), org, meta
// (one per metadata the story creates or updates, Lab 1.4)
function levelParts() {
  return [
    { x: 5.5, y: 1.1, label: "New User Story", glyph: "star", color: SLDS.brand, kind: "answer" },
    { x: 13.4, y: 2.6, label: "Feature", glyph: "bolt", color: SLDS.success, kind: "answer" },
    { x: 21, y: 3.2, label: "US-014-panels-required", sign: "US-014", glyph: "code", color: SLDS.navy, kind: "answer" },
    { x: 28.5, y: 4.8, label: "Reuse scratch org helios-dev", sign: "Reuse helios-dev", glyph: "org", color: SLDS.teal, kind: "answer" },
    { x: 35, y: 4.4, label: "features/US-014-panels-required", sign: "Branch", glyph: "branch", color: SLDS.success, kind: "answer", event: "branch" },
    { x: 52.4, y: 2, label: "Open", sign: "Open helios-dev", glyph: "cloud", color: SLDS.brand, kind: "org" },
    { x: 79.75, y: 3.6, label: "CustomField Installation__c.Panels_Required__c", sign: "Panels_Required__c", item: "custom-field", glyph: "code", color: SLDS.navy, kind: "meta", line: "m_field", event: "field" },
    { x: 97.25, y: 4.6, label: "Layout Installation__c-Installation Layout", sign: "Installation Layout", item: "record", glyph: "log", color: SLDS.success, kind: "meta", line: "m_layout", event: "layout" },
    { x: 119.75, y: 4.4, label: "PermissionSet Helios_Delivery_Crew", sign: "Helios_Delivery_Crew", item: "permission-set", glyph: "permset", color: SLDS.purple, kind: "meta", line: "m_crew", event: "crewRead" },
    { x: 143.7, y: 5.4, label: "PermissionSet Helios_Delivery_Manager", sign: "Helios_Delivery_Manager", item: "permission-set", glyph: "permset", color: SLDS.purple, kind: "meta", line: "m_manager", event: "mgrRead" }
  ];
}

// The validation rules: boxes that slide along an axis, slowly enough to time
const HAZARDS = [
  { x: 66.2, y: 1, w: 1.1, h: 1.1, axis: "y", amp: 2.6, speed: 1.6 },
  { x: 102.3, y: 1, w: 1, h: 1, axis: "y", amp: 4, speed: 1.7 },
  { x: 134, y: 4.4, w: 1.1, h: 1, axis: "x", amp: 1, speed: 1.4 },
  { x: 146.2, y: 4.4, w: 1.1, h: 1, axis: "x", amp: 0.8, speed: 1.3 }
];
// A hit counts only when the boxes really overlap: forgiving edges
const HAZARD_MARGIN = 0.15;

// x, y (top of the floor) and the step of the Path it belongs to
const CHECKPOINTS = [
  [0, 0, 0],
  [19.5, 2.2, 0],
  [36, 3.4, 1],
  [50.5, 1, 1],
  [63.5, 1, 1],
  [76.5, 2.6, 1],
  [94.5, 3.6, 1],
  [104.5, 3, 1],
  [111, 2.6, 2],
  [130.5, 4.4, 2],
  [140, 4.4, 2],
  [150, 2.8, 3]
];

// The bonus vegetables: x, y of their middle. Their kind follows VEGETABLES in turn
const VEGETABLE_SPOTS = [
  [1.5, 0.9], [2.5, 0.9], [3.5, 0.9], [16.6, 3.2], [17.3, 3.5], [22.5, 3], [24.5, 3.9], [31.5, 4.6],
  [36.5, 4.2], [37.5, 4.2], [38.5, 4.2], [42, 3.4], [46, 2.6], [50, 1.8], [54.5, 2.2], [57.3, 1.8],
  [60.2, 2.6], [60.9, 3], [61.6, 2.6], [64.5, 1.8], [72, 2.2], [74.8, 3.6], [77.4, 3.4], [82.4, 3.4],
  [85, 4.4], [89, 4.8], [92.4, 5], [95, 4.4], [99.6, 4.4], [106.3, 3.8], [110, 3.4], [117.4, 4.2],
  [131.6, 5.2], [137, 5.2], [141.4, 5.2], [146.4, 5.2], [151.2, 3.6], [157, 2.8], [159, 2.8]
];

// The screens behind the platforms: x0, x1, look, eyebrow, title
const SCREENS = [
  [-7, 24, "vscode", "DevOps Pipeline", "New User Story"],
  [24, 40, "vscode", "New User Story", "helios-dev"],
  [40, 55, "vscode", "sfdx-hardis", "Orgs Manager"],
  [55, 74.5, "setup", "Setup", "Object Manager"],
  [74.5, 92.8, "setup", "Setup > Object Manager > Installation", "Fields & Relationships"],
  [92.8, 110, "setup", "Installation", "Installation Layout"],
  [110, 139, "ghost", "Setup > Permission Sets > Helios Delivery Crew", "Helios_Delivery_Crew"],
  [139, 149, "ghost", "Setup > Permission Sets", "Helios_Delivery_Manager"],
  [149, 169, "record", "Helios Delivery · Installations", "INST-00001"]
];

export function createWorld(ctx) {
  const { THREE, root, pig, paint, t, hud, engine } = ctx;
  const camera = ctx.camera;
  const disposables = [];
  const keep = (thing) => {
    disposables.push(thing);
    return thing;
  };

  const unit = paint.geometry("w1-unit", () => new THREE.BoxGeometry(1, 1, 1));
  const plane = paint.geometry("w1-plane", () => new THREE.PlaneGeometry(1, 1));
  const tileGeometry = paint.geometry("w1-tile", () => new THREE.BoxGeometry(0.62, 0.62, 0.12));
  const shadows = engine.settings.shadows;

  /* ---------- Platforms ---------- */

  const tops = {
    vscode: paint.plain(0x3c3c3c, { roughness: 0.8 }),
    light: paint.plain(0xf3f3f3, { roughness: 0.8 }),
    brand: paint.plain(0x0b5cab, { roughness: 0.6 }),
    green: paint.plain(0x2e844a, { roughness: 0.6 })
  };
  const sides = {
    vscode: paint.plain(0x252526, { roughness: 0.8 }),
    light: paint.plain(0xc9c9c9, { roughness: 0.8 }),
    brand: paint.plain(0x014486, { roughness: 0.6 }),
    green: paint.plain(0x22683a, { roughness: 0.6 })
  };
  // Light platforms: white tops, a cheerful colour on their sides, in turn
  const HAPPY = [0x1b96ff, 0x06a59a, 0x9050e9, 0xfe9339, 0xe3478b, 0x2e844a];
  const happySides = HAPPY.map((c) => paint.plain(c, { roughness: 0.55 }));
  tops.light = paint.plain(0xfafbfd, { roughness: 0.7 });
  const faintSide = keep(new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.22, depthWrite: false }));

  const platforms = levelPlatforms(t).map((def, i) => buildPlatform(def, i));

  function buildPlatform(def, i) {
    const h = def.h || 0.8;
    const w = def.x1 - def.x0;
    const family = def.look === "vscode" ? "vscode" : def.look === "button" ? "brand" : def.look === "branch" ? "green" : "light";
    let front;
    let record = null;
    if (def.look === "record") {
      record = recordTexture(w, h);
      front = keep(new THREE.MeshStandardMaterial({ map: record.texture, roughness: 0.6, emissive: 0x111111 }));
    } else {
      front = paint.material("w1-plat-" + i, Math.min(2048, Math.round(w * 110)), Math.round(h * 110), (c, cw, ch) => drawFront(c, cw, ch, def), { emissive: 0x151515 });
    }
    const side = family === "light" ? happySides[i % happySides.length] : sides[family];
    const mesh = new THREE.Mesh(unit, [side, side, tops[family], side, front, side]);
    mesh.scale.set(w, h, DEPTH);
    mesh.position.set(def.x0 + w / 2, def.top - h / 2, 0);
    mesh.castShadow = shadows;
    mesh.receiveShadow = true;
    root.add(mesh);
    const p = Object.assign({}, def, { w, h, mesh, front, record, normal: mesh.material, bx0: def.x0, btop: def.top, dx: 0, dy: 0, gone: false, timer: 0, fallV: 0 });
    if (def.faint) {
      front.transparent = true;
      front.opacity = 0.3;
      front.depthWrite = false;
      mesh.material = [faintSide, faintSide, faintSide, faintSide, front, faintSide];
      mesh.castShadow = false;
    }
    return p;
  }

  function revealFaint() {
    for (const p of platforms) {
      if (p.faint) {
        p.front.transparent = false;
        p.front.opacity = 1;
        p.front.depthWrite = true;
        p.front.needsUpdate = true;
        const side = happySides[platforms.indexOf(p) % happySides.length];
        p.mesh.material = [side, side, tops.light, side, p.front, side];
        p.mesh.castShadow = shadows;
      }
    }
  }

  const lift = platforms.find((p) => p.move && p.move.lift);
  const recordPlatform = platforms.find((p) => p.record);
  const savePlatform = platforms.find((p) => p.save);

  /** An item of the course, centred on its middle, or the world's own shape if the pack did not load. */
  function itemOr(name, height, fallback) {
    const item = ctx.models.get(name, { height, shadows: false });
    if (!item) {
      return fallback();
    }
    item.position.y = -height / 2;
    const holder = new THREE.Group();
    holder.add(item);
    return holder;
  }

  // The finish: the Installation record, and the Cloudity mark over the end of the world
  {
    const record = ctx.models.get("record", { height: 1.3 });
    if (record) {
      record.position.set(160.1, recordPlatform.top, -0.9);
      root.add(record);
    }
    const logo = ctx.models.get("cloudity-logo", { height: 1.8 });
    if (logo) {
      logo.position.set(END_X + 3, recordPlatform.top, -0.6);
      root.add(logo);
    }
  }

  /* ---------- Parts, vegetables, hazards, checkpoints ---------- */

  const parts = levelParts().map((def, i) => {
    const group = new THREE.Group();
    group.position.set(def.x, def.y, 0.2);
    const tileMaterial = paint.material("w1-part-tile-" + i, 128, 128, (c, w, h) => {
      rounded(c, 2, 2, w - 4, h - 4, 22);
      c.fillStyle = def.color;
      c.fill();
      glyph(c, def.glyph, w / 2, h / 2, w * 0.9);
    }, { transparent: true, emissive: 0x202020, roughness: 0.35 });
    const edge = paint.plain(new THREE.Color(def.color).getHex(), { roughness: 0.35 });
    const meta = def.kind === "meta";
    const size = meta ? 0.85 : 0.7;
    let tile = ctx.models.get(partItem(def), { height: size, shadows: false });
    if (tile) {
      tile.position.y = -size / 2;
      const holder = new THREE.Group();
      holder.add(tile);
      tile = holder;
    } else {
      tile = pictureBox(THREE, tileGeometry, tileMaterial, edge);
    }
    group.add(tile);
    // A few words that face the camera; the whole label is in the goal line
    const label = paint.sign("w1-part-" + i, def.sign || def.label, { color: def.color, height: 0.6 });
    const labelMaterial = label.material;
    label.position.set(0, meta ? 0.95 : 0.8, 0.3);
    group.add(label);
    root.add(group);
    return Object.assign({}, def, { index: i, group, tile, tileMaterial, labelMaterial, done: false, flying: 0 });
  });
  const totalParts = parts.length;

  // The ring round the part to get next
  const halo = new THREE.Mesh(
    paint.geometry("w1-halo", () => new THREE.TorusGeometry(0.55, 0.06, 8, 40)),
    paint.plain(0xffd24a, { emissive: 0xffb020, emissiveIntensity: 2.2, roughness: 0.3 })
  );
  root.add(halo);

  // The bonus vegetables: one InstancedMesh per mesh of each kind's model, the
  // way the runner draws them in world 0. An eaten one shrinks to nothing
  const vegetables = VEGETABLE_SPOTS.map(([x, y], i) => ({ x, y, kind: VEGETABLES[i % VEGETABLES.length], slot: 0, done: false, label: null }));
  const vegetablePools = {};
  for (const kind of VEGETABLES) {
    const list = vegetables.filter((v) => v.kind === kind);
    list.forEach((v, i) => {
      v.slot = i;
    });
    const pool = [];
    const copy = ctx.models.get(VEGETABLE_MODELS[kind], { height: VEGETABLE_HEIGHT, shadows: false });
    if (copy) {
      copy.updateMatrixWorld(true);
      copy.traverse((child) => {
        if (child.isMesh) {
          const material = keep(child.material.clone());
          material.emissive = new THREE.Color(VEGETABLE_COLORS[kind]);
          material.emissiveIntensity = 0.3;
          const mesh = new THREE.InstancedMesh(child.geometry, material, list.length);
          // The instances move every frame: a bounding sphere computed once would cull them wrongly
          mesh.frustumCulled = false;
          root.add(mesh);
          pool.push({ mesh, local: child.matrixWorld.clone(), lift: 0 });
        }
      });
    } else {
      const mesh = new THREE.InstancedMesh(tileGeometry, paint.tile("w1-veg-" + kind, VEGETABLE_COLORS[kind], "star"), list.length);
      mesh.frustumCulled = false;
      root.add(mesh);
      // The tile is centred on its middle, a model stands on its base
      pool.push({ mesh, local: new THREE.Matrix4().makeTranslation(0, VEGETABLE_HEIGHT / 2, 0), lift: 0 });
    }
    vegetablePools[kind] = pool;
    // A vegetable's name shows on the first one of its kind only
    const first = list[0];
    if (first) {
      first.label = paint.sign("w1-veg-" + kind, t("veg_" + kind), { color: VEGETABLE_COLORS[kind], height: 0.42 });
      // One kind in two a little higher: the first vegetables come close together
      first.label.position.set(first.x, first.y + 0.62 + (VEGETABLES.indexOf(kind) % 2) * 0.5, 0.3);
      root.add(first.label);
    }
  }
  const eatenKinds = new Set();
  let eaten = 0;
  let vegTold = false;

  const hazardFront = paint.material("w1-hazard", 256, 256, (c, w, h) => {
    rounded(c, 4, 4, w - 8, h - 8, 26);
    c.fillStyle = SLDS.error;
    c.fill();
    c.beginPath();
    c.arc(w / 2, h / 2, w * 0.3, 0, Math.PI * 2);
    c.strokeStyle = SLDS.white;
    c.lineWidth = 9;
    c.stroke();
    glyph(c, "error", w / 2, h / 2, w * 0.55);
    c.fillStyle = SLDS.white;
    c.textAlign = "center";
    c.textBaseline = "middle";
  }, { emissive: 0x3a0008 });
  const hazardSide = paint.plain(0xba0517, { roughness: 0.5 });
  const hazards = HAZARDS.map((def) => {
    const mesh = new THREE.Group();
    let box = ctx.models.get("check-fail", { height: def.h });
    if (box) {
      box.position.y = -def.h / 2;
    } else {
      box = new THREE.Mesh(unit, [hazardSide, hazardSide, hazardSide, hazardSide, hazardFront, hazardSide]);
      box.scale.set(def.w, def.h, 1.2);
      box.castShadow = shadows;
    }
    const label = paint.sign("w1-hazard", t("v_hazard"), { color: SLDS.error, glyph: "error", height: 0.5 });
    label.position.y = def.h / 2 + 0.45;
    mesh.add(box, label);
    root.add(mesh);
    return Object.assign({}, def, { mesh, cx: def.x, bottom: def.y });
  });

  const flagGrey = paint.plain(0xc9c9c9);
  const flagGreen = paint.plain(0x2e844a, { emissive: 0x0b3a1a });
  const poleMaterial = paint.plain(0x706e6b);
  const poleGeometry = paint.geometry("w1-pole", () => new THREE.CylinderGeometry(0.05, 0.05, 1.6, 8));
  const checkpoints = CHECKPOINTS.map(([x, y, path], i) => {
    const group = new THREE.Group();
    group.position.set(x, y, -0.9);
    const flag = new THREE.Mesh(plane, i === 0 ? flagGreen : flagGrey);
    flag.scale.set(0.6, 0.38, 1);
    flag.position.set(0.32, 1.38, 0);
    let star = null;
    const model = i > 0 ? ctx.models.get("flag", { height: 1.7, shadows: false }) : null;
    if (model) {
      group.add(model);
      // Passed: a star turns above the flag
      star = ctx.models.get("check-pass", { height: 0.5, shadows: false });
      if (star) {
        star.position.y = 1.95;
        star.visible = false;
        group.add(star);
      }
    } else if (i > 0) {
      const pole = new THREE.Mesh(poleGeometry, poleMaterial);
      pole.position.y = 0.8;
      group.add(pole, flag);
    }
    root.add(group);
    return { x, y, path, flag, star, group };
  });

  /* ---------- Signs, screens, decor ---------- */

  function sign(text, x, y, width, style) {
    const s = Object.assign({ bg: SLDS.navy, fg: SLDS.white, size: 46 }, style);
    const mesh = new THREE.Mesh(plane, paint.label("w1-sign-" + text + x, text, { width: Math.round(width * 110), height: 80, size: s.size, bg: s.bg, fg: s.fg }));
    mesh.scale.set(width, 0.72, 1);
    mesh.position.set(x, y, -1.3);
    root.add(mesh);
    return mesh;
  }
  sign("Automatically selected target branch is integration", 4.5, 3.4, 7.4, { bg: SLDS.white, fg: SLDS.navy, size: 40 });
  sign(t("q_type"), 12.8, 4.2, 6.2, { size: 38 });
  sign(t("q_org"), 28.5, 6.2, 6.2, { size: 38 });
  for (const x of [54.5, 60.3, 102.3]) {
    sign(t("v_pit"), x, -1.6, 3.2, { bg: SLDS.error, size: 40 });
  }
  // Above each metadata, what it does for the story
  for (const p of platforms) {
    if (p.line) {
      sign(t(p.line), (p.x0 + p.x1) / 2, p.top + 2.75, Math.min(8.2, p.w + 0.4), { bg: SLDS.white, fg: SLDS.navy, size: 34 });
    }
  }
  const ghostSign = sign(t("v_ghostSign"), 106.3, 6.6, 5.6, { bg: SLDS.purple, size: 42 });
  ghostSign.visible = false;

  for (const [x0, x1, look, eyebrow, title] of SCREENS) {
    const w = x1 - x0;
    const h = 7;
    const mesh = new THREE.Mesh(
      plane,
      paint.material("w1-screen-" + x0, Math.min(2048, Math.round(w * 64)), Math.round(h * 64), (c, cw, ch) => drawScreen(c, cw, ch, look, eyebrow, title), {
        emissive: look === "vscode" ? 0x000000 : 0x1a1a1a,
        roughness: 0.9
      })
    );
    mesh.scale.set(w, h, 1);
    mesh.position.set(x0 + w / 2, 3.4, -3.4);
    root.add(mesh);
  }

  // Clouds far below: the drop under every pit
  const puffCount = 46;
  const clouds = new THREE.InstancedMesh(paint.geometry("w1-cloud", () => new THREE.SphereGeometry(1, 12, 8)), paint.plain(0xffffff, { roughness: 1 }), puffCount);
  {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();
    let seed = 11;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < puffCount; i++) {
      p.set(-10 + i * 5.6 + rnd() * 3, -6.5 - rnd() * 2.5, -2 - rnd() * 6);
      const r = 1.6 + rnd() * 1.8;
      s.set(r * 1.4, r * 0.7, r);
      m.compose(p, q, s);
      clouds.setMatrixAt(i, m);
    }
  }
  root.add(clouds);

  // A cartoon land around the screens: floating grass islands with trees far
  // behind, and a few flowers on the back edge of the panels. Decor only: it
  // never touches the guinea pig
  const decor = [];
  {
    let seed = 5;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const TREES = ["tree_oak", "tree_default", "tree_pineRoundA", "tree_fat", "tree_cone"];
    for (let x = -8; x < 245; x += 11 + rnd() * 5) {
      const z = -12 - rnd() * 4;
      const top = -3.2 - rnd() * 1.8;
      const island = ctx.models.get("block-grass-large", { width: 4 + rnd() * 2, shadows: false });
      if (!island) {
        break;
      }
      island.position.set(x, top - new THREE.Box3().setFromObject(island).max.y, z);
      root.add(island);
      const tree = ctx.models.get(TREES[Math.floor(rnd() * TREES.length)], { height: 3.2 + rnd() * 1.6, shadows: false });
      if (tree) {
        tree.position.set(x - 0.6 + rnd() * 1.2, top, z);
        tree.rotation.y = rnd() * Math.PI * 2;
        root.add(tree);
      }
      const bush = ctx.models.get(rnd() < 0.5 ? "plant_bushLarge" : "plant_bush", { height: 0.8, shadows: false });
      if (bush) {
        bush.position.set(x + 1.2, top, z + 0.6);
        root.add(bush);
      }
      decor.push(island);
    }
  }

  // The puff of dust on landing
  const dustMaterial = keep(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }));
  const dust = new THREE.Mesh(paint.geometry("w1-dust", () => new THREE.RingGeometry(0.3, 0.55, 24)), dustMaterial);
  dust.rotation.x = -Math.PI / 2;
  root.add(dust);
  let dustTime = 0;

  /* ---------- The HUD line ---------- */

  const bar = document.createElement("div");
  bar.className = "gr-w1-bar";
  const partsNode = document.createElement("span");
  partsNode.className = "gr-w1-count";
  const vegNode = document.createElement("span");
  vegNode.className = "gr-w1-veg";
  const ghostNode = document.createElement("span");
  ghostNode.className = "gr-w1-ghost";
  ghostNode.textContent = t("invisible");
  ghostNode.hidden = true;
  bar.append(partsNode, vegNode, ghostNode);
  hud.extra.appendChild(bar);

  /* ---------- State ---------- */

  const player = { x: 0, y: 0, vx: 0, vy: 0, grounded: true, ground: null, coyote: 0, buffer: 0, facing: 1, turn: -Math.PI / 2, inv: 0, lock: 0, squash: 0, cut: false, hit: 0 };
  const held = { left: false, right: false, jump: false };
  const nudge = { left: 0, right: 0 };
  let nextPart = 0;
  let checkpoint = 0;
  let pathIndex = -1;
  let ghost = false;
  let trapFalling = null;
  // The trap the guinea pig last stood on: a fall that starts there is that wrong answer
  let trapStood = null;
  let decoyDone = false;
  let refreshes = [];
  let ending = 0;
  let shake = 0;
  let saved = false;
  let note = null;
  let twistAt = 0;
  let pace = 1;
  let mercy = 0;
  let pacedStage = 0;
  let lastGoal = "";
  let coachAt = -10;
  const coached = new Set();

  const decoy = (() => {
    const group = new THREE.Group();
    group.position.set(DECOY_X, DECOY_Y, 0.2);
    const tile = itemOr("permission-set", 0.7, () => pictureBox(THREE, tileGeometry, paint.tile("w1-decoy", SLDS.success, "code"), paint.plain(0x2e844a)));
    group.add(tile);
    const label = paint.sign("w1-decoy", "Edit Access", { color: SLDS.success, height: 0.55 });
    label.position.y = 0.8;
    group.add(label);
    root.add(group);
    return group;
  })();

  refreshes = [
    [112.8, 5.4],
    [148.75, 6.2]
  ].map(([x, y]) => {
    const group = new THREE.Group();
    group.position.set(x, y, 0.2);
    // Refresh: an org that answers again, one more attempt
    group.add(itemOr("org-cloud", 0.7, () => pictureBox(THREE, tileGeometry, paint.tile("w1-refresh", SLDS.brand, "loop"), paint.plain(0x0176d3))));
    const label = paint.sign("w1-refresh", "Refresh", { color: SLDS.brand, glyph: "loop", height: 0.55 });
    label.position.y = 0.8;
    group.add(label);
    root.add(group);
    return { x, y, group, done: false };
  });

  // Victor's note: high above the right answer on the profiles, a full jump up
  {
    const group = new THREE.Group();
    group.position.set(89, 7.4, 0.2);
    group.add(itemOr("note", 0.75, () => pictureBox(THREE, tileGeometry, paint.tile("w1-note", "#F2C94C", "note"), paint.plain(0xf2c94c))));
    root.add(group);
    note = { x: 89, y: 7.4, group, done: false };
  }

  /* ---------- Starting further down (guinea-at, for checks) ---------- */

  const startAt = ctx.params.startAt || 0;
  if (startAt > 0) {
    for (let i = CHECKPOINTS.length - 1; i >= 0; i--) {
      if (CHECKPOINTS[i][0] <= startAt) {
        checkpoint = i;
        break;
      }
    }
    const cx = checkpoints[checkpoint].x;
    for (const part of parts) {
      if (cx > savePlatform.x1 && !saved && part.x > savePlatform.x1) {
        saved = true;
        setGhost(true);
        ghostSign.visible = true;
      }
      if (part.x < cx) {
        part.done = true;
        part.group.visible = false;
        nextPart = part.index + 1;
        if (part.event === "crewRead") {
          revealFaint();
        } else if (part.event === "mgrRead") {
          setGhost(false);
        }
      }
    }
    for (const v of vegetables) {
      if (v.x < cx) {
        v.done = true;
        if (v.label) {
          v.label.visible = false;
        }
      }
    }
    player.x = cx;
    player.y = checkpoints[checkpoint].y;
  }
  for (let i = 0; i <= checkpoint; i++) {
    checkpoints[i].flag.material = flagGreen;
    if (checkpoints[i].star) {
      checkpoints[i].star.visible = true;
    }
  }

  /* ---------- Input: held keys and pads, on top of the shell's actions ---------- */

  const overlay = hud.layer.parentElement;
  const KEYS = { ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right", ArrowUp: "jump", KeyW: "jump", Space: "jump" };
  const pointers = new Map();
  // A jump pressed on a key or a pad can be cut short; a tap has no release
  let heldPress = false;
  const pressedAt = { left: 0, right: 0 };

  function press(name, down) {
    held[name] = down;
    if (name === "jump" && down) {
      heldPress = true;
    }
    if (name !== "jump") {
      // Let go: it stops, but a quick tap still moves a little
      if (down) {
        pressedAt[name] = engine.time;
      } else {
        nudge[name] = Math.max(0, TAP_S - (engine.time - (pressedAt[name] || 0)));
      }
    } else if (!down) {
      player.cut = true;
    }
  }
  function onKey(event) {
    const name = KEYS[event.code];
    if (!name || event.repeat) {
      return;
    }
    press(name, event.type === "keydown");
  }
  function onPadDown(event) {
    const pad = event.target.closest ? event.target.closest("[data-pad]") : null;
    const name = pad ? pad.getAttribute("data-pad") : null;
    if (name && held[name] !== undefined) {
      pointers.set(event.pointerId, name);
      press(name, true);
    }
  }
  function onPadUp(event) {
    const name = pointers.get(event.pointerId);
    if (name) {
      pointers.delete(event.pointerId);
      press(name, false);
    }
  }
  function releaseAll() {
    for (const name of Object.keys(held)) {
      held[name] = false;
    }
    nudge.left = 0;
    nudge.right = 0;
    pointers.clear();
  }
  window.addEventListener("keydown", onKey, true);
  window.addEventListener("keyup", onKey, true);
  window.addEventListener("blur", releaseAll);
  overlay.addEventListener("pointerdown", onPadDown, true);
  window.addEventListener("pointerup", onPadUp, true);
  window.addEventListener("pointercancel", onPadUp, true);

  /* ---------- The rules ---------- */

  function setGhost(on) {
    ghost = on;
    pig.setGhost(on);
    ghostNode.hidden = !on;
    engine.hemi.intensity = on ? 1.15 : 1.6;
    ctx.setData("visible", on ? "no" : "yes");
  }

  // The part to point at: the first one not taken yet, ahead of the guinea pig
  function updateNext() {
    for (const part of parts) {
      if (!part.done) {
        if (part.x >= player.x - 1.5) {
          nextPart = part.index;
          return;
        }
      }
    }
    // Nothing left ahead: what was missed behind is told at the end, the goal is the record
    nextPart = totalParts;
  }

  function renderBar() {
    updateNext();
    const part = parts[nextPart];
    const taken = parts.filter((p) => p.done).length;
    const goal = part ? t("goalNext", { label: part.label }) : t("goalEnd");
    if (goal !== lastGoal) {
      lastGoal = goal;
      hud.goal(goal);
    }
    partsNode.textContent = t("parts") + " " + taken + "/" + totalParts;
    vegNode.textContent = t("vegetablesCount", { n: eaten }).replace(/\.$/, "");
    ctx.setData("parts", taken);
    ctx.setData("vegetables", eaten);
    ctx.setData("next", part ? part.label : "end");
  }

  function collectPart(part) {
    // Out of order still counts, for fewer points and a word on the order of the lab
    // (one left far behind is simply missed: the end of the world says so)
    const skipped = parts.find((p) => !p.done && p.index < part.index && p.x > part.x - 8);
    part.done = true;
    part.flying = 0.01;
    const big = part.kind === "meta";
    const color = new THREE.Color(part.color).getHex();
    ctx.fx.burst(part.x, part.y, 0.3, big ? { count: 60, speed: 5, up: 6 } : { count: 16, colors: [color, 0xffd24a, 0xffffff], speed: 3, up: 3 });
    ctx.collect(skipped ? 25 : big ? 150 : 50, skipped || part.line ? "" : part.label);
    if (skipped) {
      hud.toast(t("outOfOrder", { label: part.label, first: skipped.label }), "power");
    } else if (part.line) {
      // A metadata: its name, then what it does for the story
      hud.toast(t(part.line), "good");
    }
    if (part.line) {
      hud.tick(part.label);
    }
    if (big || part.kind === "answer") {
      ctx.sound.play("wheek");
    }
    switch (part.event) {
      case "branch":
        hud.toast(t("branch"), "good");
        hud.tick("sf hardis:work:new");
        hud.tick("git checkout -b features/US-014-panels-required");
        break;
      case "field":
        hud.tick(t("fieldName"));
        break;
      case "crewRead":
        revealFaint();
        hud.toast(t("crewRead"), "power");
        break;
      case "mgrRead":
        setGhost(false);
        hud.toast(t("mgrRead"), "good");
        coach("c_visible", true);
        ctx.sound.play("happy");
        break;
      default:
        break;
    }
    renderBar();
  }

  /** Save, the button of the field wizard: the field exists, and nobody can see it. */
  function save() {
    saved = true;
    hud.toast(t("saved"), "good");
    hud.tick("Panels_Required__c");
    ctx.sound.play("click");
    // The twist, a beat after the success toast
    twistAt = engine.time + 1.1;
  }

  /** The pace follows the parts taken; a mistake buys a few calmer seconds. */
  function updatePace(dt) {
    const progress = parts.filter((p) => p.done).length / totalParts;
    // The first stage stays at the gentle pace, then the level picks up
    const ramp = Math.max(0, (progress - PACE_CALM) / (1 - PACE_CALM));
    const wanted = (1 + PACE_GAIN * ramp * (0.35 + 0.65 * ramp)) * (mercy > 0 ? MERCY_FACTOR : 1);
    mercy = Math.max(0, mercy - dt);
    pace += Math.sign(wanted - pace) * Math.min(Math.abs(wanted - pace), PACE_RATE * dt);
    ctx.setData("pace", pace.toFixed(2));
    // Each new step of the Path is said out loud
    const stage = checkpoints[checkpoint].path;
    if (stage > pacedStage) {
      pacedStage = stage;
      if (stage > 0 && pace > 1.02) {
        hud.toast(t("faster"), "power");
        ctx.sound.play("power");
      }
    }
  }

  /** The big yellow instruction: once per moment, never in a rush. */
  function coach(key, force) {
    if (force || engine.time - coachAt > 3) {
      coachAt = engine.time;
      hud.coach(t(key));
    }
  }

  function coachOnce(key) {
    if (!coached.has(key)) {
      coached.add(key);
      coach(key, true);
    }
  }

  function hurt(title, tip, from) {
    if (player.inv > 0) {
      return;
    }
    const left = ctx.loseAttempt(t(title), t(tip));
    mercy = MERCY_S;
    coach("c_hazard", true);
    player.inv = INVULNERABLE_S;
    player.hit = 0.6;
    shake = engine.motion ? 0.35 : 0;
    const dir = Math.sign(player.x - from) || -player.facing;
    player.vx = dir * 7;
    player.vy = 8;
    player.lock = 0.3;
    player.grounded = false;
    return left;
  }

  function fell() {
    const trap = trapFalling || trapStood;
    trapFalling = null;
    trapStood = null;
    if (trap) {
      // Never twice the same mistake: that answer holds from now on
      trap.learned = true;
    }
    ctx.loseAttempt(t(trap ? trap.title : "o_fall"), t(trap ? trap.tip : "o_fall_tip"));
    mercy = MERCY_S;
    if (ctx.playing) {
      coach("c_fall", true);
      respawn();
    }
  }

  function respawn() {
    const cp = checkpoints[checkpoint];
    player.x = cp.x;
    player.y = cp.y + 0.6;
    player.vx = 0;
    player.vy = 0;
    player.grounded = false;
    player.inv = 1.2;
    player.facing = 1;
    for (const p of platforms) {
      if (p.trap) {
        p.gone = false;
        p.timer = 0;
        p.fallV = 0;
        p.mesh.position.set(p.x0 + p.w / 2, p.top - p.h / 2, 0);
        p.mesh.rotation.z = 0;
      }
    }
    camX = player.x + 2;
    camY = player.y + 1.4;
  }

  /* ---------- Physics ---------- */

  function movePlatforms(dt) {
    for (const p of platforms) {
      if (p.move) {
        // A moving element waits a moment at each end, so it can be timed
        p.phase = (p.phase || 0) + dt * p.move.speed * pace;
        const wave = Math.max(-1, Math.min(1, 1.5 * Math.sin(p.phase)));
        const nx0 = p.move.axis === "x" ? p.bx0 + wave * p.move.amp : p.x0;
        const ntop = p.move.axis === "y" ? p.btop + ((wave + 1) / 2) * p.move.amp : p.top;
        p.dx = nx0 - p.x0;
        p.dy = ntop - p.top;
        p.x0 = nx0;
        p.x1 = nx0 + p.w;
        p.top = ntop;
        p.mesh.position.set(p.x0 + p.w / 2, p.top - p.h / 2, 0);
      }
    }
    for (const h of hazards) {
      h.phase = (h.phase === undefined ? h.x : h.phase) + dt * h.speed * pace;
      const wave = Math.sin(h.phase);
      h.cx = h.axis === "x" ? h.x + wave * h.amp : h.x;
      h.bottom = h.axis === "y" ? h.y + ((wave + 1) / 2) * h.amp : h.y;
      h.mesh.position.set(h.cx, h.bottom + h.h / 2, 0);
    }
  }

  function solid(p) {
    return !p.gone;
  }

  function stepPlayer(dt) {
    // Carried by the platform it stands on
    if (player.grounded && player.ground && player.ground.move) {
      player.x += player.ground.dx;
      player.y = player.ground.top;
    }
    const wasGrounded = player.grounded;
    const left = held.left || nudge.left > 0;
    const right = held.right || nudge.right > 0;
    const want = player.lock > 0 || ending ? 0 : (right ? 1 : 0) - (left ? 1 : 0);
    if (want !== 0) {
      player.facing = want;
    }
    const accel = (wasGrounded ? GROUND_ACCEL : AIR_ACCEL) * dt;
    const target = want * RUN_SPEED * (1 + (pace - 1) * PACE_RUN_SHARE);
    if (player.lock <= 0) {
      player.vx += Math.sign(target - player.vx) * Math.min(Math.abs(target - player.vx), accel);
    }

    // Jump: buffered, with coyote time
    if (player.buffer > 0 && (wasGrounded || player.coyote > 0) && !ending) {
      player.vy = JUMP_SPEED;
      player.buffer = 0;
      player.coyote = 0;
      player.grounded = false;
      // Let go before the jump even started (a quick tap of the key): a short hop
      player.cut = heldPress && !held.jump;
      heldPress = false;
      player.squash = -0.18;
      ctx.sound.play("wheek");
    }
    if (player.cut && player.vy > 0) {
      player.vy *= JUMP_CUT;
      player.cut = false;
    } else if (player.vy <= 0) {
      player.cut = false;
    }
    player.vy = Math.max(MAX_FALL, player.vy - GRAVITY * dt);

    // Across
    player.x += player.vx * dt;
    for (const p of platforms) {
      if (!solid(p)) {
        continue;
      }
      const bottom = p.top - p.h;
      if (player.y + HEIGHT <= bottom + 0.01 || player.y >= p.top - 0.01) {
        continue;
      }
      if (player.x + HALF_W <= p.x0 || player.x - HALF_W >= p.x1) {
        continue;
      }
      if (wasGrounded && p.top - player.y <= STEP_UP && player.vy <= 0.01) {
        // A low step: up onto it, feet on it
        player.y = p.top;
        player.x = Math.min(Math.max(player.x, p.x0 - FOOT + 0.03), p.x1 + FOOT - 0.03);
        continue;
      }
      player.x = player.x < (p.x0 + p.x1) / 2 ? p.x0 - HALF_W : p.x1 + HALF_W;
      player.vx = 0;
    }

    // Up and down
    const prevY = player.y;
    const impact = -player.vy;
    player.y += player.vy * dt;
    let landed = null;
    for (const p of platforms) {
      if (!solid(p) || player.x + FOOT <= p.x0 || player.x - FOOT >= p.x1) {
        continue;
      }
      const bottom = p.top - p.h;
      if (player.vy <= 0 && prevY >= p.top - 0.06 - Math.max(0, p.dy) && player.y < p.top) {
        player.y = p.top;
        player.vy = 0;
        landed = p;
      } else if (player.vy > 0 && prevY + HEIGHT <= bottom + 0.06 && player.y + HEIGHT > bottom) {
        player.y = bottom - HEIGHT;
        player.vy = 0;
      }
    }
    player.grounded = Boolean(landed);
    if (landed && !landed.trap) {
      trapFalling = null;
      trapStood = null;
    } else if (landed && landed.trap && !landed.trap.learned) {
      trapStood = landed.trap;
    }
    player.ground = landed;
    if (landed === savePlatform && !saved) {
      save();
    }
    if (landed && !wasGrounded) {
      if (impact > 6) {
        player.squash = Math.min(0.3, impact * 0.022);
        dust.position.set(player.x, landed.top + 0.02, 0);
        dustTime = 0.35;
      }
    }
    if (wasGrounded && !landed && player.vy <= 0) {
      player.coyote = COYOTE_S;
    }
    // A trap gives way after the guinea pig has stood on it a moment
    if (landed && landed.trap && !landed.gone && !landed.trap.learned) {
      if (landed.timer === 0) {
        // Warned at once: there is time to jump back before it gives way
        hud.toast(t(landed.trap.title), "bad");
        coach("c_trap", true);
      }
      landed.timer += dt;
      if (landed.timer > landed.trap.delay / pace) {
        landed.gone = true;
        trapFalling = landed.trap;
        hud.toast(t(landed.trap.title), "bad");
        ctx.sound.play("wrong");
      }
    }
    player.coyote = Math.max(0, player.coyote - dt);
    player.buffer = Math.max(0, player.buffer - dt);
    player.inv = Math.max(0, player.inv - dt);
    player.lock = Math.max(0, player.lock - dt);
    player.hit = Math.max(0, player.hit - dt);
    nudge.left = Math.max(0, nudge.left - dt);
    nudge.right = Math.max(0, nudge.right - dt);
  }

  function dropTraps(dt) {
    for (const p of platforms) {
      if (p.trap && p.gone) {
        p.fallV += GRAVITY * 0.5 * dt;
        p.mesh.position.y -= p.fallV * dt;
        p.mesh.rotation.z += dt * 0.6;
      } else if (p.trap && p.timer > 0 && !p.gone) {
        // It trembles before it goes
        p.mesh.position.x = p.x0 + p.w / 2 + (engine.motion ? Math.sin(engine.time * 60) * 0.04 * (p.timer / p.trap.delay) : 0);
      }
    }
  }

  function touch(time) {
    const cx = player.x;
    const cy = player.y + 0.45;
    for (const part of parts) {
      if (part.done) {
        continue;
      }
      if ((part.x - cx) ** 2 + (part.y - cy) ** 2 < PART_RADIUS * PART_RADIUS) {
        collectPart(part);
      }
    }
    for (const v of vegetables) {
      if (!v.done && (v.x - cx) ** 2 + (v.y - cy) ** 2 < VEGETABLE_RADIUS * VEGETABLE_RADIUS) {
        eatVegetable(v);
      }
    }
    for (const r of refreshes) {
      if (!r.done && (r.x - cx) ** 2 + (r.y - cy) ** 2 < PART_RADIUS * PART_RADIUS) {
        r.done = true;
        r.group.visible = false;
        if (!ctx.gainAttempt()) {
          ctx.points(50);
        }
        ctx.sound.play("power");
        hud.toast(t("refresh"), "power");
      }
    }
    if (!note.done && (note.x - cx) ** 2 + (note.y - cy) ** 2 < PART_RADIUS * PART_RADIUS) {
      note.done = true;
      note.group.visible = false;
      ctx.foundNote();
    }
    if (!decoyDone && (DECOY_X - cx) ** 2 + (DECOY_Y - cy) ** 2 < 0.7 * 0.7) {
      decoyDone = true;
      decoy.visible = false;
      ctx.points(-50);
      ctx.sound.play("wrong");
      hud.toast(t("o_crewEdit"), "bad");
      hud.tip(t("o_crewEdit_tip"));
    }
    for (const h of hazards) {
      const m = HAZARD_MARGIN;
      if (player.x + HALF_W - m > h.cx - h.w / 2 && player.x - HALF_W + m < h.cx + h.w / 2 && player.y + HEIGHT - m > h.bottom && player.y + m < h.bottom + h.h) {
        hurt("o_valid", "o_valid_tip", h.cx);
        if (!ctx.playing) {
          return;
        }
      }
    }
    // Each new mechanic is said once, as it comes into view
    if (player.x > 62 && player.x < 66) {
      coachOnce("c_hazard");
    } else if (player.x > 122 && player.x < 126) {
      coachOnce("c_lift");
    }
    // The checkpoints: a flag turns green as the guinea pig passes it
    for (let i = checkpoint + 1; i < checkpoints.length; i++) {
      if (player.x >= checkpoints[i].x && player.grounded) {
        checkpoint = i;
        checkpoints[i].flag.material = flagGreen;
        if (checkpoints[i].star) {
          checkpoints[i].star.visible = true;
        }
        if (i === checkpoints.length - 1) {
          hud.tick("App Launcher > Helios Delivery > Installations");
        }
        ctx.fx.burst(checkpoints[i].x, checkpoints[i].y + 1.4, -0.9, { count: 10, colors: [0x2e844a, 0x91db8b, 0xffffff], speed: 2, up: 2.5, life: 0.7 });
        ctx.sound.play("click");
      }
    }
    if (checkpoints[checkpoint].path !== pathIndex) {
      pathIndex = checkpoints[checkpoint].path;
      hud.setPath([t("path0"), t("path1"), t("path2"), t("path3")], pathIndex);
    }
    // The end: the record page always ends the world; what was missed is told, not enforced
    if (!ending && player.x >= END_X && player.grounded && player.ground === recordPlatform) {
      ending = time;
      ctx.sound.play("gate");
      // The planner's number, typed in: 23 + 16 on the timeline, whatever was eaten on the way.
      // Still a ghost: no permission set grants the field to you, the record shows nothing
      recordPlatform.record.draw(ghost ? null : 39);
      hud.toast(ghost ? t("doneGhost") : t("done", { n: 39 }), ghost ? "bad" : "good");
    }
  }

  /** What was missed, the way the lab would put it: the two that matter most, then the rest by name. */
  function missedInfo() {
    const missed = parts.filter((p) => !p.done);
    const reasons = [];
    const explain = (key, test, always) => {
      const these = missed.filter(test);
      if (these.length || always) {
        reasons.push({ text: t(key), parts: these });
      }
    };
    if (ghost) {
      explain("info_ghost", (p) => p.event === "mgrRead", true);
    }
    explain("info_field", (p) => p.event === "field");
    explain("info_crew", (p) => p.event === "crewRead");
    explain("info_layout", (p) => p.event === "layout");
    const shown = reasons.slice(0, 2);
    // The rest, by name: what the sentences shown do not already cover
    const covered = new Set(shown.flatMap((r) => r.parts));
    const others = [...new Set(missed.filter((p) => !covered.has(p)).map((p) => p.label))];
    // The vegetables first, as in world 0
    const lines = [t("vegetablesCount", { n: eaten })].concat(shown.map((r) => r.text));
    if (others.length) {
      lines.push(t("info_other", { list: others.slice(0, 4).join(", ") + (others.length > 4 ? ", ..." : "") }));
    }
    return { text: lines.join(" "), count: missed.length };
  }

  /* ---------- Drawing each step ---------- */

  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const euler = new THREE.Euler();
  const scale = new THREE.Vector3();
  const position = new THREE.Vector3();
  let camX = player.x + 2;
  let camY = player.y + 1.4;

  const work = new THREE.Matrix4();

  function placeVegetables(time) {
    for (const v of vegetables) {
      position.set(v.x, v.y - VEGETABLE_HEIGHT / 2 + Math.sin(time * 3 + v.x) * 0.06, 0.2);
      euler.set(0, time * 2.2 + v.x, 0);
      quaternion.setFromEuler(euler);
      const s = v.done ? 0 : 1;
      scale.set(s, s, s);
      matrix.compose(position, quaternion, scale);
      for (const part of vegetablePools[v.kind]) {
        work.multiplyMatrices(matrix, part.local);
        part.mesh.setMatrixAt(v.slot, work);
      }
    }
    for (const kind of VEGETABLES) {
      for (const part of vegetablePools[kind]) {
        part.mesh.instanceMatrix.needsUpdate = true;
      }
    }
  }

  /** A vegetable: bonus points and a happy wheek, its name the first time each kind is eaten. */
  function eatVegetable(v) {
    v.done = true;
    if (v.label) {
      v.label.visible = false;
    }
    eaten += 1;
    ctx.collect(VEGETABLE_POINTS, eatenKinds.has(v.kind) ? "" : t("veg_" + v.kind));
    eatenKinds.add(v.kind);
    ctx.sound.play("wheek");
    // Told once, when no other instruction is on screen
    if (!vegTold && engine.time - coachAt > 3) {
      vegTold = true;
      coach("coachVeg", true);
    }
    renderBar();
  }

  function placeParts(dt, time) {
    const before = nextPart;
    updateNext();
    if (nextPart !== before) {
      renderBar();
    }
    for (const part of parts) {
      const next = part.index === nextPart;
      if (part.flying > 0) {
        part.flying += dt;
        const k = part.flying / 0.45;
        part.group.position.y = part.y + k * 1.4;
        part.group.scale.setScalar(Math.max(0.01, 1 - k));
        if (k >= 1) {
          part.group.visible = false;
          part.flying = 0;
        }
        continue;
      }
      if (part.done) {
        continue;
      }
      const glow = next ? 1 : 0.38;
      part.labelMaterial.opacity = glow;
      part.tileMaterial.opacity = glow;
      if (part.tile) {
        part.tile.scale.setScalar(next ? 1.15 : 0.8);
        part.tile.rotation.y = next ? Math.sin(time * 2.4) * 0.5 : 0;
        part.group.position.y = part.y + (next ? Math.sin(time * 4) * 0.08 : 0);
      }
    }
    const target = parts[nextPart];
    halo.visible = Boolean(target);
    if (target) {
      halo.position.set(target.x, target.y, 0.35);
      halo.scale.setScalar((target.kind === "meta" ? 1.2 : 1) + Math.sin(time * 6) * 0.1);
      halo.rotation.z = time;
    }
    for (const r of refreshes) {
      r.group.rotation.y = time * 2;
    }
    note.group.rotation.y = time * 2.5;
    for (const cp of checkpoints) {
      if (cp.star && cp.star.visible) {
        cp.star.rotation.y = time * 2;
      }
    }
    decoy.position.y = DECOY_Y + Math.sin(time * 3) * 0.06;
  }

  function placePig(dt, time) {
    const wantTurn = player.facing > 0 ? -Math.PI / 2 : Math.PI / 2;
    player.turn += (wantTurn - player.turn) * Math.min(1, dt * 14);
    pig.object.position.set(player.x, player.y, 0);
    pig.object.rotation.set(0, player.turn, 0);
    // Squash on landing, stretch on take-off
    player.squash += (0 - player.squash) * Math.min(1, dt * 10);
    const s = player.squash;
    pig.object.scale.set(1 + s * 0.6, 1 - s, 1 + s * 0.6);
    pig.hitWobble(player.hit);
    pig.object.visible = !(player.inv > 0 && Math.floor(time * 12) % 2 === 0);
    // The shadow on whatever is below
    let floor = null;
    for (const p of platforms) {
      if (solid(p) && player.x > p.x0 - 0.1 && player.x < p.x1 + 0.1 && p.top <= player.y + 0.02 && (!floor || p.top > floor.top)) {
        floor = p;
      }
    }
    pig.shadow.visible = Boolean(floor) && !ghost;
    if (floor) {
      pig.shadow.position.set(player.x, floor.top + 0.012, 0.05);
    }
    pig.state = { running: player.grounded && Math.abs(player.vx) > 0.6, airborne: !player.grounded, ducking: false, speed: Math.abs(player.vx), height: floor ? player.y - floor.top : 2 };
    if (dustTime > 0) {
      dustTime = Math.max(0, dustTime - dt);
      const k = 1 - dustTime / 0.35;
      dust.scale.setScalar(1 + k * 1.6);
      dustMaterial.opacity = 0.6 * (1 - k);
    } else {
      dustMaterial.opacity = 0;
    }
  }

  function placeCamera(dt) {
    const portrait = engine.portrait;
    const lead = portrait ? 1.2 : 2.4;
    const ease = Math.min(1, dt * 4);
    camX += (player.x + player.facing * lead - camX) * ease;
    const groundY = player.grounded ? player.y : Math.min(player.y, camY - 1.4);
    camY += (Math.max(groundY, -2) + 1.4 - camY) * Math.min(1, dt * 2.5);
    shake = Math.max(0, shake - dt);
    const jitter = shake > 0 ? (Math.random() - 0.5) * shake : 0;
    camera.fov = (portrait ? 64 : 46) + (pace - 1) * 10;
    camera.updateProjectionMatrix();
    const distance = portrait ? 13 : 12.5;
    camera.position.set(camX + jitter, camY + (portrait ? 2.4 : 1.6), distance);
    camera.lookAt(camX, camY + (portrait ? 0.8 : 0.4), 0);
    engine.aimSun(player.x, 0);
  }

  // The intro card shows the start, with the guinea pig facing the way to go
  pig.object.rotation.set(0, -Math.PI / 2, 0);
  pig.shadow.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
  movePlatforms(0);
  ctx.setData("pace", "1.00");
  placeVegetables(0);
  placeParts(0, 0);
  placePig(0, 0);
  ctx.setData("visible", ghost ? "no" : "yes");
  renderBar();
  // Lab 1.4, step 4: Panels Required on the record, still empty
  recordPlatform.record.draw("");
  ctx.setData("x", Math.round(player.x));

  return {
    start() {
      releaseAll();
      hud.setPath([t("path0"), t("path1"), t("path2"), t("path3")], checkpoints[checkpoint].path);
      pathIndex = checkpoints[checkpoint].path;
      hud.tick(t("target"));
      lastGoal = "";
      renderBar();
      coach("c_start", true);
    },
    update(dt, time) {
      if (!ctx.playing) {
        return;
      }
      updatePace(dt);
      movePlatforms(dt);
      stepPlayer(dt);
      dropTraps(dt);
      touch(time);
      if (!ctx.playing) {
        return;
      }
      if (twistAt && engine.time >= twistAt) {
        twistAt = 0;
        setGhost(true);
        ghostSign.visible = true;
        hud.toast(t("ghost"), "bad");
        hud.tick(t("ghostTick"));
        coach("c_ghost", true);
        ctx.sound.play("wrong");
        shake = engine.motion ? 0.25 : 0;
      }
      if (player.y < FALL_Y) {
        fell();
        if (!ctx.playing) {
          return;
        }
      }
      placeVegetables(time);
      placeParts(dt, time);
      placePig(dt, time);
      placeCamera(dt);
      ctx.setData("x", Math.round(player.x));
      ctx.setData("y", player.y.toFixed(1));
      // For checks: where things are, so a scripted run can time its jumps
      ctx.setData("xf", player.x.toFixed(2));
      ctx.setData("ground", player.grounded ? 1 : 0);
      ctx.setData("lift", lift.top.toFixed(2));
      const near = hazards.reduce((best, h) => (Math.abs(h.cx - player.x) < Math.abs(best.cx - player.x) ? h : best), hazards[0]);
      ctx.setData("hz", near.cx.toFixed(2) + "," + near.bottom.toFixed(2));
      ctx.setData("checkpoint", checkpoint);
      // A happy hop on the record, then the result
      if (ending) {
        if (player.grounded && time - ending < 1.2) {
          player.buffer = 0.1;
        }
        if (time - ending > 1.3) {
          const missed = missedInfo();
          hud.goal("");
          // Everything built and visible again: the full bonus. Each part missed costs a little
          const complete = missed.count === 0 && !ghost;
          ctx.finish(Math.max(0, 200 + (complete ? 300 : 0) - missed.count * 20), missed.text);
        }
      }
    },
    action(name) {
      if (name === "jump" || name === "tap") {
        // A key or a pad cuts the jump when let go; a tap or a swipe up has no release: a full jump
        player.buffer = BUFFER_S;
      } else if (name === "left" || name === "right") {
        nudge[name] = NUDGE_S;
        nudge[name === "left" ? "right" : "left"] = 0;
      }
    },
    idleCamera(time) {
      const portrait = engine.portrait;
      camera.fov = portrait ? 64 : 46;
      camera.updateProjectionMatrix();
      const sway = Math.sin(time * 0.4) * 0.8;
      camera.position.set(player.x + 2 + sway, player.y + (portrait ? 4 : 3), portrait ? 14.5 : 11.5);
      camera.lookAt(player.x + 2.5, player.y + (portrait ? 1.5 : 1), 0);
      engine.aimSun(player.x, 0);
    },
    dispose() {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("keyup", onKey, true);
      window.removeEventListener("blur", releaseAll);
      overlay.removeEventListener("pointerdown", onPadDown, true);
      window.removeEventListener("pointerup", onPadUp, true);
      window.removeEventListener("pointercancel", onPadUp, true);
      pig.object.scale.set(1, 1, 1);
      pig.shadow.rotation.set(-Math.PI / 2, 0, 0);
      pig.shadow.visible = true;
      for (const kind of VEGETABLES) {
        for (const part of vegetablePools[kind]) {
          part.mesh.dispose();
        }
      }
      clouds.dispose();
      for (const thing of disposables) {
        thing.dispose();
      }
      bar.remove();
      hud.goal("");
      hud.setPath([], 0);
    }
  };

  /* ---------- Canvas pictures ---------- */

  /** The Installation record: its column of fields, Panels Required with its value (null: no row, nobody grants it). */
  function recordTexture(w, h) {
    const canvas = document.createElement("canvas");
    canvas.width = Math.min(2048, Math.round(w * 110));
    canvas.height = Math.round(h * 110);
    const texture = keep(new THREE.CanvasTexture(canvas));
    texture.colorSpace = THREE.SRGBColorSpace;
    const c = canvas.getContext("2d");
    function draw(n) {
      const cw = canvas.width;
      const ch = canvas.height;
      const u = ch / 100;
      c.clearRect(0, 0, cw, ch);
      c.fillStyle = SLDS.white;
      c.fillRect(0, 0, cw, ch);
      c.fillStyle = SLDS.warningDark;
      c.fillRect(0, 0, cw, 3 * u);
      // The record header
      rounded(c, 3 * u, 8 * u, 18 * u, 18 * u, 3 * u);
      c.fill();
      glyph(c, "box", 12 * u, 17 * u, 17 * u);
      c.fillStyle = SLDS.weak;
      c.textAlign = "left";
      c.textBaseline = "middle";
      fitText(c, "Installation", 25 * u, 11 * u, cw * 0.3, 7 * u, "400");
      c.fillStyle = SLDS.text;
      fitText(c, "INST-00001", 25 * u, 21 * u, cw * 0.3, 11 * u, "800");
      // The column of fields
      const fields = [
        ["Status", "Scheduled"],
        ["Crew", "North crew"]
      ];
      if (n !== null) {
        fields.push(["Panels Required", String(n)]);
      }
      fields.forEach(([name, value], i) => {
        const y = 42 * u + i * 19 * u;
        const last = i === 2;
        if (last) {
          rounded(c, 2 * u, y - 8 * u, cw * 0.44, 16 * u, 3 * u);
          c.fillStyle = "#EEF4FF";
          c.fill();
        }
        c.fillStyle = SLDS.weak;
        fitText(c, name, 5 * u, y, cw * 0.18, 8 * u, last ? "800" : "400");
        c.fillStyle = last ? SLDS.brand : SLDS.text;
        fitText(c, value, cw * 0.26, y, cw * 0.17, (last ? 11 : 8) * u, "800");
      });
      // The small i of the help text, next to the name
      if (n !== null) {
        const iy = 42 * u + 2 * 19 * u;
        c.beginPath();
        c.arc(cw * 0.215, iy, 3.5 * u, 0, Math.PI * 2);
        c.strokeStyle = SLDS.grey;
        c.lineWidth = Math.max(2, 0.8 * u);
        c.stroke();
        c.fillStyle = SLDS.grey;
        font(c, 5 * u, "800");
        c.textAlign = "center";
        c.fillText("i", cw * 0.215, iy + 0.5 * u);
      }
      // The Panel delivery timeline on the right
      c.textAlign = "left";
      c.fillStyle = SLDS.text;
      fitText(c, "Panel delivery timeline", cw * 0.52, 14 * u, cw * 0.4, 9 * u, "700");
      [23, 16].forEach((q, i) => {
        const x = cw * 0.52 + i * cw * 0.22;
        rounded(c, x, 30 * u, cw * 0.19, 26 * u, 4 * u);
        c.fillStyle = "#EEF4FF";
        c.fill();
        c.fillStyle = SLDS.navy;
        fitText(c, q + " panels", x + 3 * u, 43 * u, cw * 0.16, 10 * u, "800");
      });
      texture.needsUpdate = true;
    }
    return { texture, draw };
  }
}

/** The front of a platform: the screen element it stands for. */
function drawFront(c, w, h, def) {
  const look = def.look;
  const text = def.text;
  c.textBaseline = "middle";
  if (look === "vscode") {
    c.fillStyle = "#1F1F1F";
    c.fillRect(0, 0, w, h);
    c.fillStyle = SLDS.brand;
    c.fillRect(0, 0, w, 6);
    c.fillStyle = "#E5E5E5";
    c.textAlign = "left";
    fitText(c, text, 24, h * 0.36, w * 0.6, 40, "700");
    if (def.sub) {
      c.fillStyle = "#9DA5B4";
      fitText(c, def.sub, 24, h * 0.72, w * 0.8, 28, "400");
    }
    return;
  }
  if (look === "button") {
    c.fillStyle = def.big ? SLDS.brandDark : SLDS.brand;
    c.fillRect(0, 0, w, h);
    c.fillStyle = SLDS.white;
    c.textAlign = "center";
    fitText(c, text, w / 2, h / 2 + 2, w * 0.86, def.big ? 56 : 46, "800");
    return;
  }
  if (look === "branch") {
    c.fillStyle = SLDS.success;
    c.fillRect(0, 0, w, h);
    glyph(c, "branch", 44, h / 2, 60);
    c.fillStyle = SLDS.white;
    c.textAlign = "left";
    fitText(c, text, 84, h / 2 + 2, w - 100, 38, "700", true);
    return;
  }
  c.fillStyle = SLDS.white;
  c.fillRect(0, 0, w, h);
  c.strokeStyle = SLDS.border;
  c.lineWidth = 4;
  c.strokeRect(2, 2, w - 4, h - 4);
  c.textAlign = "left";
  switch (look) {
    case "meta":
      // A metadata the story creates or updates: its type, then its API name
      c.fillStyle = SLDS.purple;
      c.fillRect(0, 0, 12, h);
      c.fillStyle = SLDS.grey;
      fitText(c, def.sub, 30, h * 0.3, w - 50, 24, "700");
      c.fillStyle = SLDS.text;
      fitText(c, text, 30, h * 0.66, w - 50, 34, "800", true);
      return;
    case "row":
      c.fillStyle = def.hot ? SLDS.brand : SLDS.border;
      c.fillRect(0, 0, 10, h);
      if (def.sub) {
        c.fillStyle = SLDS.grey;
        fitText(c, def.sub, 26, h * 0.3, w * 0.4, 20, "700");
      }
      c.fillStyle = def.hot ? SLDS.brand : SLDS.text;
      fitText(c, text, 26, def.sub ? h * 0.64 : h / 2, w - 40, 36, "700");
      return;
    case "answer":
    case "radio":
      c.beginPath();
      c.arc(34, h / 2, 14, 0, Math.PI * 2);
      c.strokeStyle = SLDS.grey;
      c.lineWidth = 4;
      c.stroke();
      if (def.hot) {
        c.beginPath();
        c.arc(34, h / 2, 7, 0, Math.PI * 2);
        c.fillStyle = SLDS.brand;
        c.fill();
      }
      c.fillStyle = SLDS.text;
      fitText(c, text, 62, h / 2 + 2, w - 76, 32, "600");
      return;
    case "input":
      c.fillStyle = SLDS.grey;
      fitText(c, def.sub || "", 18, h * 0.26, w - 36, 20, "700");
      c.strokeStyle = SLDS.border;
      c.lineWidth = 3;
      rounded(c, 14, h * 0.44, w - 28, h * 0.44, 6);
      c.stroke();
      c.fillStyle = SLDS.text;
      fitText(c, text, 26, h * 0.67, w - 52, 26, "600");
      return;
    case "check":
    case "header": {
      const box = Math.min(h * 0.5, 40);
      const x = look === "header" || !text ? (w - box) / 2 : 18;
      drawCheckbox(c, x, (look === "header" ? h * 0.62 : h / 2) - box / 2, box, !def.unticked && look !== "header");
      c.fillStyle = SLDS.text;
      if (look === "header") {
        c.textAlign = "center";
        fitText(c, text, w / 2, h * 0.22, w - 12, 24, "800");
      } else if (text) {
        fitText(c, text, x + box + 14, h / 2 + 2, w - box - 40, 32, "700");
      }
      return;
    }
    case "fls":
      c.fillStyle = SLDS.grey;
      fitText(c, def.sub, 18, h * 0.3, w * 0.4, 20, "700");
      c.fillStyle = SLDS.text;
      fitText(c, text, 18, h * 0.66, w * 0.4, 30, "700");
      c.fillStyle = SLDS.grey;
      fitText(c, "Read Access", w * 0.5, h * 0.3, w * 0.22, 20, "700");
      fitText(c, "Edit Access", w * 0.75, h * 0.3, w * 0.22, 20, "700");
      drawCheckbox(c, w * 0.5, h * 0.48, 30, false);
      drawCheckbox(c, w * 0.75, h * 0.48, 30, false);
      return;
    default:
      c.fillStyle = SLDS.brand;
      c.fillRect(0, 0, w, 8);
      c.fillStyle = SLDS.text;
      fitText(c, text, 20, h / 2 + 3, w - 40, 36, "700");
  }
}

function drawCheckbox(c, x, y, size, ticked) {
  rounded(c, x, y, size, size, size * 0.18);
  c.fillStyle = ticked ? SLDS.brand : SLDS.white;
  c.fill();
  c.strokeStyle = ticked ? SLDS.brand : SLDS.grey;
  c.lineWidth = Math.max(2, size * 0.08);
  c.stroke();
  if (ticked) {
    glyph(c, "check", x + size / 2, y + size / 2, size * 1.1);
  }
}

/** The page behind a stretch of the level: a VS Code panel or a Lightning page. */
function drawScreen(c, w, h, look, eyebrow, title) {
  if (look === "vscode") {
    c.fillStyle = "#1E1E1E";
    c.fillRect(0, 0, w, h);
    c.fillStyle = "#2D2D2D";
    c.fillRect(0, 0, w, 44);
    c.fillStyle = "#1F1F1F";
    c.fillRect(16, 6, Math.min(w * 0.5, 420), 38);
    c.fillStyle = SLDS.brand;
    c.fillRect(16, 6, Math.min(w * 0.5, 420), 3);
    c.fillStyle = "#CCCCCC";
    c.textAlign = "left";
    c.textBaseline = "middle";
    fitText(c, eyebrow, 30, 26, Math.min(w * 0.5, 420) - 28, 20, "600");
    c.fillStyle = "#FFFFFF";
    fitText(c, title, 30, 86, w - 60, 38, "700");
    c.fillStyle = "rgba(255,255,255,0.06)";
    for (let y = 130; y < h - 20; y += 34) {
      c.fillRect(30, y, w * (0.3 + ((y * 7) % 40) / 100), 14);
    }
    return;
  }
  const accent = look === "ghost" ? SLDS.purple : look === "record" ? SLDS.warningDark : SLDS.brand;
  c.fillStyle = look === "ghost" ? "#ECE6F8" : "#F3F3F3";
  c.fillRect(0, 0, w, h);
  // The global header and the navigation bar
  c.fillStyle = SLDS.white;
  c.fillRect(0, 0, w, 40);
  c.fillStyle = accent;
  c.fillRect(0, 40, w, 6);
  c.fillStyle = SLDS.brand;
  c.beginPath();
  c.arc(30, 20, 13, 0, Math.PI * 2);
  c.fill();
  // The page header card
  rounded(c, 14, 60, w - 28, 76, 10);
  c.fillStyle = SLDS.white;
  c.fill();
  c.strokeStyle = SLDS.border;
  c.lineWidth = 2;
  c.stroke();
  rounded(c, 28, 72, 52, 52, 8);
  c.fillStyle = accent;
  c.fill();
  glyph(c, look === "ghost" ? "permset" : look === "record" ? "box" : "gear", 54, 98, 50);
  c.textAlign = "left";
  c.textBaseline = "middle";
  c.fillStyle = SLDS.weak;
  fitText(c, eyebrow, 94, 84, w - 130, 18, "600");
  c.fillStyle = SLDS.text;
  fitText(c, title, 94, 112, w - 130, 30, "800");
  // The body: faint rows of a list
  c.fillStyle = "rgba(255,255,255,0.7)";
  rounded(c, 14, 150, w - 28, h - 170, 10);
  c.fill();
  c.fillStyle = "rgba(201,201,201,0.5)";
  for (let y = 176; y < h - 40; y += 30) {
    c.fillRect(30, y, w - 60, 2);
  }
}

export const CSS = `
.guinea-run .gr-w1-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  max-width: 720px;
  padding: 4px 8px;
  border: 1px solid #c9c9c9;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.95);
  font-size: 12px;
  pointer-events: none;
}
.guinea-run .gr-w1-count {
  padding: 2px 7px;
  border-radius: 999px;
  background: #e5e5e5;
  color: #181818;
  font-weight: 700;
  white-space: nowrap;
}
.guinea-run .gr-w1-veg {
  padding: 2px 7px;
  border-radius: 999px;
  background: #fff1d6;
  color: #8a4b00;
  font-weight: 800;
  white-space: nowrap;
}
.guinea-run .gr-w1-ghost {
  padding: 2px 7px;
  border-radius: 999px;
  background: #9050e9;
  color: #ffffff;
  font-weight: 700;
}
.guinea-run .gr-w1-ghost[hidden] {
  display: none;
}
`;
