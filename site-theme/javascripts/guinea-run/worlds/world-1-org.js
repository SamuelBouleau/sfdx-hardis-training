/*
 * World 1, Build it in the org (Labs 1.3 and 1.4): a side-on platformer
 * through the screens a contributor clicks, in the order of the labs.
 *
 * Lab 1.3 first: New User Story, the type, the name, the org, and the branch
 * it creates. Two answers of the command are traps that give way under the
 * guinea pig, the way the lab warns: Fix is for something already delivered,
 * and Create new scratch org fails after a long wait.
 *
 * Then Lab 1.4, screen by screen: Orgs Manager > Open, Setup, Object Manager,
 * the field wizard, field-level security (the Visible header is bumped twice:
 * once ticks everything, the second time clears the column), the layout, Save.
 * The part to get next glows; the others wait their turn.
 *
 * The twist is the lab's warning: after Save the guinea pig is a ghost, because
 * a field no permission grants is invisible to everybody, the admin who
 * created it included. It climbs on through the permission sets, and only
 * Read Access on Helios Delivery Manager, the one you hold, makes it visible
 * again. The crew gets Read Access only, as in the lab: Edit Access floats
 * above the crew's row as a temptation.
 *
 * The world comes to the guinea pig as solar panels too: 39 of them, the
 * number INST-00001 needs (23 + 16), shown in its Panels Required field at
 * the end.
 */
import { SLDS, rounded, fitText, glyph, font, pictureBox } from "../core/painter.js";

export const PADS = ["left", "right", "jump"];

export const TEXTS = {
  en: {
    intro: "US-014, Show the crew how many panels a job needs. Start it on its own branch, then build the Panels Required field in Setup, screen by screen.",
    how1: "Run with Left and Right, jump with Up or Space",
    how2: "Grab the glowing part: it is the next click of the lab",
    how3: "Load the solar panels and reach INST-00001",
    goalNext: "Next: {{label}}",
    goalEnd: "Run to INST-00001",
    c_start: "Run right and jump the gaps!",
    c_trap: "Wrong answer: jump back up!",
    c_bump: "Jump into the Visible box from below, twice!",
    c_hazard: "Wait for the red box to move, then go",
    c_fall: "Back at the last flag: try again",
    c_ghost: "Invisible! Grab Read Access to be seen again",
    c_visible: "Visible again! Run to INST-00001",
    c_lift: "Ride the Edit button up",
    note: "Created a field and cannot see it? Nobody can. Grant it in a permission set, never a profile, then look at a real record before you call it done. - V.",
    path0: "New User Story",
    path1: "Custom field",
    path2: "Permission sets",
    path3: "Record page",
    parts: "Parts",
    panels: "Panels",
    invisible: "Invisible",
    q_type: "What type of User Story do you want to create?",
    q_org: "Which Salesforce org do you want to work in?",
    o_fall: "Session expired or invalid",
    o_fall_tip: "Open the org again from Orgs Manager: the extension uses the credential it stored, no password, no login page.",
    o_fix: "Fix is for something already delivered",
    o_fix_tip: "US-014 adds something that was not there: answer Feature: a new capability or an improvement.",
    o_create: "The command fails after a long wait",
    o_create_tip: "Never take Create new scratch org here: a Developer Edition Dev Hub keeps only three alive. Take Reuse scratch org helios-dev.",
    o_valid: "Save fails with a validation rule error",
    o_valid_tip: "The Helios org refuses an installation date in the past. If you changed the date by accident, put it back to a future date.",
    o_crewEdit: "Leave Edit Access unticked on the crew",
    o_crewEdit_tip: "A crew member reads how many panels to load, they do not decide the number.",
    v_hazard: "Validation rule",
    v_hazardDetail: "date in the past",
    v_pit: "Session expired or invalid",
    v_required: "Required",
    v_ghostSign: "Panels Required: visible to nobody",
    v_typeStep: "Step 1. Choose the field type",
    v_detailStep: "Step 2. Enter the details",
    v_flsStep: "Step 3. Field-level security",
    v_layoutStep: "Step 4. Add to page layouts",
    branch: "git checkout -b features/US-014-panels-required",
    target: "Target branch: integration",
    fieldName: "Field Name: Panels_Required (Salesforce adds __c when it saves)",
    allTicked: "Every profile ticked: once more clears the column",
    cleared: "Visible cleared: access goes through a permission set",
    saved: "Panels_Required__c saved",
    ghost: "Panels Required is invisible to everybody, you included",
    ghostTick: "No profile, no permission set grants it yet",
    crewRead: "The crew can read it. You still cannot: you hold Helios Delivery Manager",
    mgrRead: "Visible again: Helios Delivery Manager grants it to you",
    mgrEdit: "Planners can fill it in",
    refresh: "Refresh: one more attempt",
    info_ghost: "You reached INST-00001 still invisible: in the lab, without Read Access on Helios Delivery Manager the record shows you nothing.",
    info_save: "You skipped Save: in the lab, the field only exists once it is saved.",
    info_crew: "You skipped Read Access for Helios Delivery Crew: in the lab, the crew could not see the field.",
    info_visible: "You left Visible ticked for the profiles: in the lab, access goes through a permission set, not a profile.",
    info_layout: "You skipped Installation Layout: in the lab, that is what puts the field on the record page.",
    info_edit: "You skipped Edit Access for the planners: in the lab, Helios Delivery Manager must be able to fill it in.",
    info_text: "You skipped Description or Help Text: in the lab, they make the generated documentation readable.",
    info_other: "Also missed: {{list}}.",
    info_panels: "{{n}} of {{total}} panels loaded: the crew needs every one.",
    outOfOrder: "{{label}}, out of order: in the lab, {{first}} comes first",
    done: "Panels Required on INST-00001: {{n}}",
    allPanels: "{{n}} panels: the right quantity on the van",
    somePanels: "{{n}} of {{total}} panels loaded"
  },
  fr: {
    intro: "US-014, Show the crew how many panels a job needs. Démarrez-la sur sa propre branch, puis créez le champ Panels Required dans Setup, écran par écran.",
    how1: "Courez avec Gauche et Droite, sautez avec Haut ou Espace",
    how2: "Prenez la pièce qui brille : c'est le prochain clic du lab",
    how3: "Chargez les panneaux solaires et atteignez INST-00001",
    goalNext: "Suivant : {{label}}",
    goalEnd: "Courez vers INST-00001",
    c_start: "Courez à droite et sautez les trous !",
    c_trap: "Mauvaise réponse : remontez d'un saut !",
    c_bump: "Sautez sous la case Visible, deux fois !",
    c_hazard: "Attendez que la boîte rouge bouge, puis passez",
    c_fall: "Retour au dernier drapeau : réessayez",
    c_ghost: "Invisible ! Prenez Read Access pour réapparaître",
    c_visible: "De nouveau visible ! Courez vers INST-00001",
    c_lift: "Montez sur le bouton Edit",
    note: "Vous avez créé un champ et vous ne le voyez pas ? Personne ne le voit. Accordez-le dans un permission set, jamais un profil, puis regardez un vrai enregistrement avant de dire que c'est fini. - V.",
    path0: "New User Story",
    path1: "Champ personnalisé",
    path2: "Permission sets",
    path3: "Page d'enregistrement",
    parts: "Pièces",
    panels: "Panneaux",
    invisible: "Invisible",
    q_type: "What type of User Story do you want to create?",
    q_org: "Which Salesforce org do you want to work in?",
    o_fall: "Session expired or invalid",
    o_fall_tip: "Rouvrez l'org depuis Orgs Manager : l'extension utilise l'identifiant qu'elle a gardé, pas de mot de passe, pas de page de connexion.",
    o_fix: "Fix, c'est pour quelque chose de déjà livré",
    o_fix_tip: "US-014 ajoute quelque chose qui n'existait pas : répondez Feature: a new capability or an improvement.",
    o_create: "La commande échoue après une longue attente",
    o_create_tip: "Ne prenez jamais Create new scratch org ici : un Dev Hub Developer Edition n'en garde que trois en vie. Prenez Reuse scratch org helios-dev.",
    o_valid: "L'enregistrement échoue avec une erreur de règle de validation",
    o_valid_tip: "L'org Helios refuse une date d'installation dans le passé. Si vous avez changé la date par erreur, remettez une date future.",
    o_crewEdit: "Laissez Edit Access décoché pour l'équipe",
    o_crewEdit_tip: "Un membre de l'équipe lit combien de panneaux charger, il ne décide pas du nombre.",
    v_hazard: "Validation rule",
    v_hazardDetail: "date dans le passé",
    v_pit: "Session expired or invalid",
    v_required: "Required",
    v_ghostSign: "Panels Required : visible par personne",
    v_typeStep: "Step 1. Choose the field type",
    v_detailStep: "Step 2. Enter the details",
    v_flsStep: "Step 3. Field-level security",
    v_layoutStep: "Step 4. Add to page layouts",
    branch: "git checkout -b features/US-014-panels-required",
    target: "Branch cible : integration",
    fieldName: "Field Name : Panels_Required (Salesforce ajoute __c à l'enregistrement)",
    allTicked: "Tous les profils cochés : encore une fois vide la colonne",
    cleared: "Visible décoché : l'accès passe par un permission set",
    saved: "Panels_Required__c enregistré",
    ghost: "Panels Required est invisible pour tout le monde, vous compris",
    ghostTick: "Aucun profil, aucun permission set ne l'accorde encore",
    crewRead: "L'équipe peut le lire. Vous, toujours pas : vous avez Helios Delivery Manager",
    mgrRead: "De nouveau visible : Helios Delivery Manager vous l'accorde",
    mgrEdit: "Les planificateurs peuvent le remplir",
    refresh: "Refresh : un essai de plus",
    info_ghost: "Vous avez atteint INST-00001 encore invisible : dans le lab, sans Read Access sur Helios Delivery Manager, l'enregistrement ne vous montre rien.",
    info_save: "Vous avez sauté Save : dans le lab, le champ n'existe qu'une fois enregistré.",
    info_crew: "Vous avez sauté Read Access pour Helios Delivery Crew : dans le lab, l'équipe ne voyait pas le champ.",
    info_visible: "Vous avez laissé Visible coché pour les profils : dans le lab, l'accès passe par un permission set, pas par un profil.",
    info_layout: "Vous avez sauté Installation Layout : dans le lab, c'est ce qui met le champ sur la page d'enregistrement.",
    info_edit: "Vous avez sauté Edit Access pour les planificateurs : dans le lab, Helios Delivery Manager doit pouvoir le remplir.",
    info_text: "Vous avez sauté Description ou Help Text : dans le lab, ils rendent la documentation générée lisible.",
    info_other: "Également manqué : {{list}}.",
    info_panels: "{{n}} panneaux chargés sur {{total}} : l'équipe a besoin de chacun.",
    outOfOrder: "{{label}}, dans le désordre : dans le lab, {{first}} vient d'abord",
    done: "Panels Required sur INST-00001 : {{n}}",
    allPanels: "{{n}} panneaux : la bonne quantité dans la camionnette",
    somePanels: "{{n}} panneaux chargés sur {{total}}"
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
  { lab: "1.4", text: "Decimal Places" },
  { lab: "1.4", text: "Ask the planner if this is empty." },
  { lab: "1.4", text: "Installation Layout" },
  { lab: "1.4", text: "Setup > Permission Sets > Helios Delivery Crew" },
  { lab: "1.4", text: "Helios Delivery Manager" },
  { lab: "1.4", text: "Object Settings" },
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
const PANEL_RADIUS = 0.75;
const DEPTH = 2.4;
const TRAP_S = 1.2;
const END_X = 231;

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
    // Orgs Manager: read the ALIAS column
    { x0: 40, x1: 44, top: 2.6, look: "row", text: "helios-integration", sub: "ALIAS" },
    { x0: 44, x1: 47.7, top: 1.8, look: "row", text: "helios-uat", sub: "ALIAS" },
    { x0: 47.7, x1: 53.5, top: 1, look: "row", text: "helios-dev", sub: "ALIAS", hot: true },
    // Setup > Object Manager > Installation
    { x0: 55.5, x1: 59, top: 1, look: "card", text: "Setup" },
    { x0: 61.6, x1: 70, top: 1, look: "card", text: "Object Manager" },
    { x0: 70, x1: 74, top: 1.4, look: "card", text: "Installation" },
    { x0: 75, x1: 79, top: 2.6, look: "row", text: "Fields & Relationships", hot: true },
    { x0: 81, x1: 85.5, top: 2.6, look: "button", text: "New" },
    // The field wizard
    { x0: 87, x1: 90.5, top: 2, look: "card", text: t("v_typeStep") },
    { x0: 91.5, x1: 94, top: 2, look: "radio", text: "Text" },
    { x0: 94.8, x1: 97.8, top: 3.6, look: "radio", text: "Number", hot: true },
    { x0: 98.6, x1: 101, top: 2, look: "radio", text: "Checkbox" },
    { x0: 102.5, x1: 108.5, top: 2.8, look: "input", text: "Panels Required", sub: "Field Label" },
    { x0: 110, x1: 113.5, top: 2, look: "input", text: "4", sub: "Length" },
    { x0: 115, x1: 118.5, top: 3.2, look: "input", text: "0", sub: "Decimal Places" },
    { x0: 120, x1: 127, top: 2.4, look: "input", text: "How many panels the crew has to load for this installation.", sub: "Description" },
    { x0: 123.2, x1: 124, top: 3.9, h: 1.5, look: "check", text: t("v_required"), unticked: true },
    { x0: 128.5, x1: 133, top: 2.4, look: "input", text: "Ask the planner if this is empty.", sub: "Help Text" },
    // Field-level security
    { x0: 134, x1: 151, top: 2, look: "card", text: t("v_flsStep") },
    { x0: 138, x1: 139.2, top: 3.8, h: 0.8, look: "check", text: "", unticked: false },
    { x0: 140.5, x1: 141.7, top: 4.3, h: 0.8, look: "header", text: "Visible", bump: true },
    { x0: 151, x1: 154, top: 3, look: "button", text: "Next" },
    // The layout, and Save
    { x0: 155.5, x1: 161, top: 3, look: "check", text: "Installation Layout" },
    { x0: 163.6, x1: 172, top: 3, look: "button", text: "Save", big: true },
    // After the twist: the permission sets
    { x0: 173.5, x1: 177.5, top: 2.2, look: "card", text: "Setup > Permission Sets", ghost: true },
    { x0: 178.5, x1: 182, top: 3.4, look: "row", text: "Object Settings", ghost: true },
    { x0: 183.4, x1: 187.2, top: 3, look: "row", text: "Installations", ghost: true },
    { x0: 188.5, x1: 191.7, top: 2, look: "button", text: "Edit", ghost: true, move: { axis: "y", amp: 2.4, speed: 0.95, lift: true } },
    { x0: 192.8, x1: 201, top: 4.4, look: "fls", text: "Panels Required", sub: "Field Permissions", faint: true },
    { x0: 202.4, x1: 207, top: 4.4, look: "card", text: "Helios Delivery Manager", ghost: true },
    { x0: 208.5, x1: 217.5, top: 3.6, look: "fls", text: "Panels Required", sub: "Field Permissions", faint: true },
    // The record
    { x0: 219, x1: 222.5, top: 2.8, look: "card", text: "App Launcher > Helios Delivery > Installations" },
    { x0: 224, x1: 237, top: 2, h: 2.6, look: "record", text: "INST-00001" }
  ];
}

// The parts, in the order they must be got. kind: answer (Lab 1.3), field, perm
function levelParts() {
  return [
    { x: 5.5, y: 1.1, label: "New User Story", glyph: "star", color: SLDS.brand, kind: "answer" },
    { x: 13.4, y: 2.6, label: "Feature", glyph: "bolt", color: SLDS.success, kind: "answer" },
    { x: 21, y: 3.2, label: "US-014-panels-required", sign: "US-014", glyph: "code", color: SLDS.navy, kind: "answer" },
    { x: 28.5, y: 4.8, label: "Reuse scratch org helios-dev", sign: "Reuse helios-dev", glyph: "org", color: SLDS.teal, kind: "answer" },
    { x: 35, y: 4.4, label: "features/US-014-panels-required", sign: "Branch", glyph: "branch", color: SLDS.success, kind: "answer", event: "branch" },
    { x: 52.4, y: 2, label: "Open", glyph: "cloud", color: SLDS.brand, kind: "field" },
    { x: 68.8, y: 2, label: "Installation", glyph: "box", color: SLDS.warningDark, kind: "field" },
    { x: 77, y: 3.6, label: "Fields & Relationships", glyph: "log", color: SLDS.brand, kind: "field" },
    { x: 83.5, y: 3.6, label: "New", glyph: "star", color: SLDS.brand, kind: "field" },
    { x: 96.3, y: 4.6, label: "Data Type: Number", sign: "Number", glyph: "hexagon", color: SLDS.purple, kind: "field" },
    { x: 105.5, y: 3.8, label: "Field Label: Panels Required", sign: "Field Label", glyph: "code", color: SLDS.navy, kind: "field", event: "label" },
    { x: 111.8, y: 3, label: "Length: 4", glyph: "code", color: SLDS.navy, kind: "field" },
    { x: 116.75, y: 4.2, label: "Decimal Places: 0", glyph: "code", color: SLDS.navy, kind: "field" },
    { x: 121.6, y: 3.4, label: "Description", glyph: "log", color: SLDS.teal, kind: "field" },
    { x: 131, y: 3.4, label: "Help Text: Ask the planner if this is empty.", sign: "Help Text", glyph: "note", color: SLDS.teal, kind: "field" },
    { x: 141.1, y: 3.8, label: "Visible", glyph: "eye", color: SLDS.grey, kind: "field", bump: true },
    { x: 152.5, y: 4, label: "Next", glyph: "check", color: SLDS.brand, kind: "field" },
    { x: 158.2, y: 4, label: "Installation Layout", glyph: "check", color: SLDS.success, kind: "field" },
    { x: 167.5, y: 4, label: "Save", glyph: "check", color: SLDS.brand, kind: "field", event: "save" },
    { x: 176, y: 3.2, label: "Helios Delivery Crew", glyph: "permset", color: SLDS.purple, kind: "perm" },
    { x: 180.2, y: 4.4, label: "Object Settings", glyph: "gear", color: SLDS.purple, kind: "perm" },
    { x: 186.2, y: 4, label: "Installations", glyph: "box", color: SLDS.warningDark, kind: "perm" },
    { x: 190, y: 5.4, label: "Edit", glyph: "code", color: SLDS.brand, kind: "perm" },
    { x: 196, y: 5.4, label: "Read Access", glyph: "eye", color: SLDS.success, kind: "perm", event: "crewRead" },
    { x: 205, y: 5.4, label: "Helios Delivery Manager", glyph: "permset", color: SLDS.purple, kind: "perm" },
    { x: 210.5, y: 4.6, label: "Read Access", glyph: "eye", color: SLDS.success, kind: "perm", event: "mgrRead" },
    { x: 216.5, y: 4.6, label: "Edit Access", glyph: "code", color: SLDS.success, kind: "perm", event: "mgrEdit" }
  ];
}

// The validation rules: boxes that slide along an axis, slowly enough to time
const HAZARDS = [
  { x: 66.2, y: 1, w: 1.1, h: 1.1, axis: "y", amp: 2.6, speed: 1.6 },
  { x: 146.3, y: 2, w: 1.1, h: 1, axis: "x", amp: 1.8, speed: 1.2 },
  { x: 162.3, y: 1, w: 1, h: 1, axis: "y", amp: 4, speed: 1.7 },
  { x: 214.6, y: 3.6, w: 1.1, h: 1, axis: "x", amp: 1, speed: 1.4 }
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
  [76, 2.6, 1],
  [88, 2, 1],
  [103.5, 2.8, 1],
  [121, 2.4, 1],
  [135, 2, 1],
  [156.5, 3, 1],
  [174.5, 2.2, 2],
  [194, 4.4, 2],
  [204, 4.4, 2],
  [220, 2.8, 3]
];

// 39 solar panels: INST-00001 needs 23 + 16
const PANELS = [
  [1.5, 0.9], [2.5, 0.9], [3.5, 0.9], [16.6, 3.2], [17.3, 3.5], [22.5, 3], [24.5, 3.9], [31.5, 4.6],
  [36.5, 4.2], [37.5, 4.2], [38.5, 4.2], [42, 3.4], [46, 2.6], [50, 1.8], [54.5, 2.2], [60.2, 2.6],
  [60.9, 3], [61.6, 2.6], [64.5, 1.8], [72, 2.2], [80, 3.8], [92.8, 2.8], [99.8, 2.8], [101.8, 3.4],
  [109.3, 3.4], [114.3, 3.4], [119.3, 3.6], [123.6, 4.6], [126, 3.2], [138.6, 4.6], [145, 2.8], [147.5, 2.8],
  [150.5, 3.4], [162.6, 4.4], [175, 3.0], [184, 3.8], [198.5, 5.1], [226, 2.8], [228, 2.8]
];

// The screens behind the platforms: x0, x1, look, eyebrow, title
const SCREENS = [
  [-7, 24, "vscode", "DevOps Pipeline", "New User Story"],
  [24, 40, "vscode", "New User Story", "helios-dev"],
  [40, 55, "vscode", "sfdx-hardis", "Orgs Manager"],
  [55, 72, "setup", "Setup", "Object Manager"],
  [72, 87, "setup", "Setup > Object Manager", "Installation"],
  [87, 109.5, "setup", "Installation", "New Custom Field"],
  [109.5, 134, "setup", "New Custom Field", "Panels Required"],
  [134, 155, "setup", "New Custom Field", "Field-level security"],
  [155, 173, "setup", "New Custom Field", "Installation Layout"],
  [173, 202, "ghost", "Setup > Permission Sets", "Helios Delivery Crew"],
  [202, 218, "ghost", "Setup > Permission Sets", "Helios Delivery Manager"],
  [218, 238, "record", "Helios Delivery · Installations", "INST-00001"]
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

  const bumpBlock = platforms.find((p) => p.bump);
  const lift = platforms.find((p) => p.move && p.move.lift);
  const recordPlatform = platforms.find((p) => p.record);

  /* ---------- Parts, panels, hazards, checkpoints ---------- */

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
    let tile = null;
    if (!def.bump) {
      tile = pictureBox(THREE, tileGeometry, tileMaterial, edge);
      group.add(tile);
    }
    // A few words that face the camera; the whole label is in the goal line
    const label = paint.sign("w1-part-" + i, def.sign || def.label, { color: def.color, height: 0.6 });
    const labelMaterial = label.material;
    label.position.set(0, def.bump ? 1.1 : 0.8, 0.3);
    group.add(label);
    root.add(group);
    return Object.assign({}, def, { index: i, group, tile, tileMaterial, labelMaterial, done: false, flying: 0, bumps: 0 });
  });
  const totalParts = parts.length;

  // The ring round the part to get next
  const halo = new THREE.Mesh(
    paint.geometry("w1-halo", () => new THREE.TorusGeometry(0.55, 0.06, 8, 40)),
    paint.plain(0xffd24a, { emissive: 0xffb020, emissiveIntensity: 1.2, roughness: 0.3 })
  );
  root.add(halo);

  // The profiles of the field-level security screen, as a column of ticks
  const tickOn = paint.material("w1-tick-on", 64, 64, (c, w) => drawCheckbox(c, 4, 4, w - 8, true), { emissive: 0x202020 });
  const tickOff = paint.material("w1-tick-off", 64, 64, (c, w) => drawCheckbox(c, 4, 4, w - 8, false), { emissive: 0x202020 });
  const profileTicks = [];
  for (let i = 0; i < 7; i++) {
    const tick = new THREE.Mesh(plane, i === 4 ? tickOff : tickOn);
    tick.scale.set(0.5, 0.5, 1);
    tick.position.set(142.6 + i * 1.05, 5.5, -1.3);
    root.add(tick);
    profileTicks.push(tick);
  }
  const tickLabel = new THREE.Mesh(plane, paint.label("w1-profiles", "Visible", { width: 256, height: 64, size: 40, fg: SLDS.navy, bg: "rgba(255,255,255,0.9)" }));
  tickLabel.scale.set(1.4, 0.35, 1);
  tickLabel.position.set(145.8, 6.15, -1.3);
  root.add(tickLabel);

  function setTicks(on) {
    profileTicks.forEach((tick, i) => {
      tick.material = on === "all" ? tickOn : on === "none" ? tickOff : i === 4 ? tickOff : tickOn;
    });
  }

  // The solar panels: one instanced mesh, a collected one shrinks to nothing
  const panelMaterial = paint.material("w1-solar", 128, 96, (c, w, h) => {
    c.fillStyle = "#0B2A55";
    c.fillRect(0, 0, w, h);
    c.strokeStyle = "#8EC5FF";
    c.lineWidth = 3;
    for (let x = 0; x <= w; x += w / 4) {
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x, h);
      c.stroke();
    }
    for (let y = 0; y <= h; y += h / 3) {
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(w, y);
      c.stroke();
    }
    c.strokeStyle = "#C9C9C9";
    c.lineWidth = 8;
    c.strokeRect(0, 0, w, h);
  }, { emissive: 0x0a2244, metalness: 0.3, roughness: 0.3 });
  const panelMesh = new THREE.InstancedMesh(paint.geometry("w1-solar", () => new THREE.BoxGeometry(0.62, 0.46, 0.05)), panelMaterial, PANELS.length);
  root.add(panelMesh);
  const panels = PANELS.map(([x, y]) => ({ x, y, done: false }));
  const totalPanels = panels.length;
  let panelsLoaded = 0;

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
    const box = new THREE.Mesh(unit, [hazardSide, hazardSide, hazardSide, hazardSide, hazardFront, hazardSide]);
    box.scale.set(def.w, def.h, 1.2);
    box.castShadow = shadows;
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
    if (i > 0) {
      const pole = new THREE.Mesh(poleGeometry, poleMaterial);
      pole.position.y = 0.8;
      group.add(pole, flag);
    }
    root.add(group);
    return { x, y, path, flag };
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
  for (const x of [54.5, 60.6, 162.6]) {
    sign(t("v_pit"), x, -1.6, 3.2, { bg: SLDS.error, size: 40 });
  }
  sign(t("v_detailStep"), 112, 5.6, 4.6, { bg: SLDS.white, fg: SLDS.navy, size: 40 });
  sign(t("v_layoutStep"), 158.2, 5.8, 4.6, { bg: SLDS.white, fg: SLDS.navy, size: 40 });
  const ghostSign = sign(t("v_ghostSign"), 171, 6.4, 5.6, { bg: SLDS.purple, size: 42 });
  ghostSign.visible = false;

  for (const [x0, x1, look, eyebrow, title] of SCREENS) {
    const w = x1 - x0;
    const h = 7;
    const mesh = new THREE.Mesh(
      plane,
      paint.material("w1-screen-" + x0, Math.min(2048, Math.round(w * 64)), Math.round(h * 64), (c, cw, ch) => drawScreen(c, cw, ch, look, eyebrow, title), {
        emissive: look === "vscode" ? 0x000000 : 0x1a1a1a,
        roughness: 0.9,
        transparent: true
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
  const panelsNode = document.createElement("span");
  panelsNode.className = "gr-w1-count gr-w1-panels";
  const ghostNode = document.createElement("span");
  ghostNode.className = "gr-w1-ghost";
  ghostNode.textContent = t("invisible");
  ghostNode.hidden = true;
  bar.append(partsNode, panelsNode, ghostNode);
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
  let decoyDone = false;
  let refreshes = [];
  let ending = 0;
  let shake = 0;
  let lastRecord = -1;
  let note = null;
  let twistAt = 0;
  let lastGoal = "";
  let coachAt = -10;
  const coached = new Set();

  const decoy = (() => {
    const group = new THREE.Group();
    group.position.set(201.7, 6.6, 0.2);
    const tile = pictureBox(THREE, tileGeometry, paint.tile("w1-decoy", SLDS.success, "code"), paint.plain(0x2e844a));
    group.add(tile);
    const label = paint.sign("w1-decoy", "Edit Access", { color: SLDS.success, height: 0.55 });
    label.position.y = 0.8;
    group.add(label);
    root.add(group);
    return group;
  })();

  refreshes = [
    [123.6, 5.6],
    [209.5, 6.6]
  ].map(([x, y]) => {
    const group = new THREE.Group();
    group.position.set(x, y, 0.2);
    group.add(pictureBox(THREE, tileGeometry, paint.tile("w1-refresh", SLDS.brand, "loop"), paint.plain(0x0176d3)));
    const label = paint.sign("w1-refresh", "Refresh", { color: SLDS.brand, glyph: "loop", height: 0.55 });
    label.position.y = 0.8;
    group.add(label);
    root.add(group);
    return { x, y, group, done: false };
  });

  // Victor's note: above the Visible header, two good jumps up from the ledge
  {
    const group = new THREE.Group();
    group.position.set(141.1, 7.25, 0.2);
    group.add(pictureBox(THREE, tileGeometry, paint.tile("w1-note", "#F2C94C", "note"), paint.plain(0xf2c94c)));
    root.add(group);
    note = { x: 141.1, y: 7.25, group, done: false };
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
      if (part.x < cx) {
        part.done = true;
        part.group.visible = false;
        nextPart = part.index + 1;
        if (part.event === "save") {
          setGhost(true);
          ghostSign.visible = true;
        } else if (part.event === "crewRead") {
          revealFaint();
        } else if (part.event === "mgrRead") {
          setGhost(false);
        }
      }
    }
    if (bumpBlock && parts.find((p) => p.bump).done) {
      setTicks("none");
    }
    for (const panel of panels) {
      if (panel.x < cx) {
        panel.done = true;
        panelsLoaded += 1;
      }
    }
    player.x = cx;
    player.y = checkpoints[checkpoint].y;
  }
  for (let i = 0; i <= checkpoint; i++) {
    checkpoints[i].flag.material = flagGreen;
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
    let first = -1;
    for (const part of parts) {
      if (!part.done) {
        if (first < 0) {
          first = part.index;
        }
        if (part.x >= player.x - 1.5) {
          nextPart = part.index;
          return;
        }
      }
    }
    nextPart = first < 0 ? totalParts : first;
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
    panelsNode.textContent = t("panels") + " " + panelsLoaded + "/" + totalPanels;
    ctx.setData("parts", taken);
    ctx.setData("panels", panelsLoaded);
    ctx.setData("next", part ? part.label : "end");
  }

  function collectPart(part) {
    // Out of order still counts, for fewer points and a word on the order of the lab
    const skipped = parts.find((p) => !p.done && p.index < part.index);
    part.done = true;
    part.flying = 0.01;
    const big = part.event === "save" || part.event === "mgrRead";
    const color = new THREE.Color(part.color).getHex();
    ctx.fx.burst(part.x, part.y, 0.3, { count: big ? 60 : 16, colors: big ? undefined : [color, 0xffd24a, 0xffffff], speed: big ? 5 : 3, up: big ? 6 : 3 });
    ctx.collect(skipped ? 25 : big ? 150 : 50, skipped ? "" : part.label);
    if (skipped) {
      hud.toast(t("outOfOrder", { label: part.label, first: skipped.label }), "power");
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
      case "label":
        hud.tick(t("fieldName"));
        break;
      case "save":
        hud.toast(t("saved"), "good");
        hud.tick("Panels_Required__c");
        // The twist, a beat after the success toast
        twistAt = engine.time + 1.1;
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
      case "mgrEdit":
        hud.tick(t("mgrEdit"));
        break;
      default:
        break;
    }
    renderBar();
  }

  function bump(box) {
    const part = parts.find((p) => p.bump);
    box.wobble = 0.25;
    ctx.sound.play("click");
    if (part.done) {
      return;
    }
    part.bumps += 1;
    ctx.fx.burst(part.x, bumpBlock.top, 0.3, { count: 12, colors: [0x1b96ff, 0xffffff], speed: 3, up: 4 });
    if (part.bumps === 1) {
      setTicks("all");
      hud.toast(t("allTicked"), "power");
    } else {
      setTicks("none");
      hud.tick(t("cleared"));
      collectPart(part);
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
    const trap = trapFalling;
    trapFalling = null;
    if (trap) {
      // Never twice the same mistake: that answer holds from now on
      trap.learned = true;
    }
    ctx.loseAttempt(t(trap ? trap.title : "o_fall"), t(trap ? trap.tip : "o_fall_tip"));
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

  function movePlatforms(time) {
    for (const p of platforms) {
      if (p.move) {
        // A moving element waits a moment at each end, so it can be timed
        const wave = Math.max(-1, Math.min(1, 1.5 * Math.sin(time * p.move.speed)));
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
      const wave = Math.sin(time * h.speed + h.x);
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
    const target = want * RUN_SPEED;
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
        if (p.bump) {
          bump(p);
        }
      }
    }
    player.grounded = Boolean(landed);
    if (landed && !landed.trap) {
      trapFalling = null;
    }
    player.ground = landed;
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
      if (landed.timer > landed.trap.delay) {
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
      if (!part.bump && (part.x - cx) ** 2 + (part.y - cy) ** 2 < PART_RADIUS * PART_RADIUS) {
        collectPart(part);
      }
    }
    panels.forEach((panel) => {
      if (!panel.done && (panel.x - cx) ** 2 + (panel.y - cy) ** 2 < PANEL_RADIUS * PANEL_RADIUS) {
        panel.done = true;
        panelsLoaded += 1;
        ctx.collect(10);
        renderBar();
      }
    });
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
    if (!decoyDone && (201.7 - cx) ** 2 + (6.6 - cy) ** 2 < 0.7 * 0.7) {
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
    } else if (player.x > 136.5 && player.x < 141 && !parts.find((p) => p.bump).done) {
      coachOnce("c_bump");
    } else if (player.x > 184 && player.x < 189) {
      coachOnce("c_lift");
    }
    // The checkpoints: a flag turns green as the guinea pig passes it
    for (let i = checkpoint + 1; i < checkpoints.length; i++) {
      if (player.x >= checkpoints[i].x && player.grounded) {
        checkpoint = i;
        checkpoints[i].flag.material = flagGreen;
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
      hud.toast(t("done", { n: panelsLoaded }), "good");
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
    explain("info_save", (p) => p.event === "save");
    explain("info_crew", (p) => p.event === "crewRead");
    explain("info_visible", (p) => p.bump);
    explain("info_layout", (p) => p.label === "Installation Layout");
    explain("info_edit", (p) => p.event === "mgrEdit");
    explain("info_text", (p) => p.label === "Description" || p.label.startsWith("Help Text"));
    const shown = reasons.slice(0, 2);
    // The rest, by name: what the sentences shown do not already cover
    const covered = new Set(shown.flatMap((r) => r.parts));
    const others = [...new Set(missed.filter((p) => !covered.has(p)).map((p) => p.label))];
    const lines = shown.map((r) => r.text);
    if (others.length) {
      lines.push(t("info_other", { list: others.slice(0, 4).join(", ") + (others.length > 4 ? ", ..." : "") }));
    }
    if (panelsLoaded < totalPanels) {
      lines.push(t("info_panels", { n: panelsLoaded, total: totalPanels }));
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

  function placePanels(time) {
    panels.forEach((panel, i) => {
      position.set(panel.x, panel.y + Math.sin(time * 3 + i) * 0.06, 0.2);
      euler.set(-0.35, time * 1.8 + i, 0);
      quaternion.setFromEuler(euler);
      const s = panel.done ? 0 : 1;
      scale.set(s, s, s);
      matrix.compose(position, quaternion, scale);
      panelMesh.setMatrixAt(i, matrix);
    });
    panelMesh.instanceMatrix.needsUpdate = true;
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
        part.tile.rotation.y = next ? Math.sin(time * 2.4) * 0.5 : 0;
        part.group.position.y = part.y + (next ? Math.sin(time * 4) * 0.08 : 0);
      }
    }
    const target = parts[nextPart];
    halo.visible = Boolean(target);
    if (target) {
      halo.position.set(target.x, target.bump ? bumpBlock.top - bumpBlock.h / 2 : target.y, 0.35);
      halo.scale.setScalar(target.bump ? 1.3 + Math.sin(time * 6) * 0.1 : 1 + Math.sin(time * 6) * 0.1);
      halo.rotation.z = time;
    }
    if (bumpBlock.wobble > 0) {
      bumpBlock.wobble = Math.max(0, bumpBlock.wobble - dt);
      bumpBlock.mesh.position.y = bumpBlock.top - bumpBlock.h / 2 + Math.sin((bumpBlock.wobble / 0.25) * Math.PI) * 0.25;
    }
    for (const r of refreshes) {
      r.group.rotation.y = time * 2;
    }
    note.group.rotation.y = time * 2.5;
    decoy.position.y = 6.6 + Math.sin(time * 3) * 0.06;
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
    camera.fov = portrait ? 64 : 46;
    camera.updateProjectionMatrix();
    const distance = portrait ? 13 : 12.5;
    camera.position.set(camX + jitter, camY + (portrait ? 2.4 : 1.6), distance);
    camera.lookAt(camX, camY + (portrait ? 0.8 : 0.4), 0);
    engine.aimSun(player.x, 0);
  }

  function updateRecord() {
    if (panelsLoaded !== lastRecord && recordPlatform) {
      lastRecord = panelsLoaded;
      recordPlatform.record.draw(panelsLoaded);
    }
  }

  // The intro card shows the start, with the guinea pig facing the way to go
  pig.object.rotation.set(0, -Math.PI / 2, 0);
  pig.shadow.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
  movePlatforms(0);
  placePanels(0);
  placeParts(0, 0);
  placePig(0, 0);
  setTicks(parts.find((p) => p.bump).done ? "none" : "some");
  ctx.setData("visible", ghost ? "no" : "yes");
  renderBar();
  updateRecord();
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
      movePlatforms(time);
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
      placePanels(time);
      placeParts(dt, time);
      placePig(dt, time);
      placeCamera(dt);
      updateRecord();
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
          const all = panelsLoaded === totalPanels;
          const missed = missedInfo();
          hud.toast(all ? t("allPanels", { n: panelsLoaded }) : t("somePanels", { n: panelsLoaded, total: totalPanels }), "good");
          hud.goal("");
          // Everything built and visible again: the full bonus. Each part missed costs a little
          const complete = missed.count === 0 && !ghost;
          ctx.finish(Math.max(0, panelsLoaded * 5 + (all ? 200 : 0) + (complete ? 300 : 0) - missed.count * 20), missed.text);
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
      panelMesh.dispose();
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

  /** The Installation record: its column of fields, Panels Required with what was loaded. */
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
        ["Crew", "North crew"],
        ["Panels Required", String(n)]
      ];
      fields.forEach(([name, value], i) => {
        const y = 42 * u + i * 19 * u;
        const last = i === fields.length - 1;
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
    c.fillStyle = "rgba(30, 30, 30, 0.92)";
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
  c.fillStyle = look === "ghost" ? "rgba(236, 230, 248, 0.88)" : "rgba(243, 243, 243, 0.88)";
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
.guinea-run .gr-w1-panels {
  background: #0b2a55;
  color: #ffffff;
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
