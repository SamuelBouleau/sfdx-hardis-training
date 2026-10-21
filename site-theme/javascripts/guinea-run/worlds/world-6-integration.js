/*
 * World 6, Deploy to the integration org: a musical run along the deployment
 * job. The guinea pig runs to the music, the player only jumps, and the track
 * is the deployment log in its five parts: authentication, the package, the
 * pre-deployment actions, the Salesforce deployment, the post-deployment
 * actions.
 *
 * The track is built from the plan the player declared in world 3:
 * - the manual action declared before the deployment is a button to press on
 *   the way (or at the barrier, with a jump): Mark as done
 * - an action declared in the wrong place fails with its real error, as a
 *   block to jump over
 * - the backfill declared after the deployment turns the 30 accounts nobody
 *   can save into green checks; without it they stay, as blocks
 *
 * The bosses: the .forceignore fog of Romain Panda's US-056 (the deployment
 * log shows the walls it hides), the green lie (a green deployment, and 30
 * accounts nobody can save), and the three failed actions of Mariia's US-062,
 * each with its own way out, chosen on the beat.
 */
import { createLevel, createMusicalRun, MUSICAL_TEXTS, MUSICAL_CSS, endMissedInfo, musicalWorld } from "./musical.js";
import { melody } from "../core/music.js";
import { SLDS } from "../core/painter.js";

export const PADS = ["jump"];
// The salesforce items (components, checks, runners, orgs, the Cloudity logo), the Kenney
// springs, trees and bushes far behind, and the bonus vegetables
export const MODELS = ["salesforce", "platform", "nature", "vegetables"];

// Behind the track: trees, then the CI runners and the orgs, every row on the beat
const SCENERY = [
  { names: ["tree_default", "tree_oak", "tree_pineRoundA"], z: -4.6, depth: 1.6, every: 5.2, height: 3.2, bounce: 0.05 },
  // The CI runners of the pipeline, along the track, and the orgs in the sky
  { names: ["ci-runner"], z: -6.9, every: 9, height: 2.3, bounce: 0.04, turn: 0.4 },
  { names: ["org-cloud"], y: 7.5, rise: 2.5, z: -15, every: 19, height: 2.6, bounce: 0.02, turn: 0.3 }
];

const SONG = {
  bpm: 108,
  // F major: I V vi IV, the happiest four chords there are
  root: 65,
  progression: [0, 4, 5, 3],
  lead: {
    chorus: melody("4..4..2.4.5.4.2. 6..6..4.6.8.6.4. 9.8.7.5.7...5.4. 3..3..5.4.......")
  },
  start: "intro",
  end: "lounge"
};

const BAR = 4;

export const TEXTS = {
  en: Object.assign({}, MUSICAL_TEXTS.en, {
    intro: "Your Pull Request is merged into the integration branch and the deployment job starts. Run through the log in its five parts, to the music.",
    how1: "Jump with Up, Space or a tap when the ring closes",
    how2: "Eat the vegetables, press Mark as done on the way",
    how3: "Read the log: it shows what the fog hides",
    note: "Victor knew this org. Victor has left. Read the log, it knows more than I did. - V.",
    path0: "Auth",
    path1: "Package",
    path2: "Pre-deploy",
    path3: "Deploy",
    path4: "Post-deploy",
    arch0: "1 · Authentication",
    arch1: "2 · Package",
    arch2: "3 · Pre-deploy",
    arch3: "4 · Deployment",
    arch4: "5 · Post-deploy",
    goal0: "Part 1 of the log: authentication. Jump the red blocks",
    goal1: "Part 2: the package. Collect its components",
    goal2: "Part 3: the pre-deploy actions",
    goal2manual: "Part 3: press Mark as done on the way",
    goal3: "Part 4: the deployment. Jump for Quick Deploy",
    goal3fog: "Jump for the deployment log: it shows the hidden walls",
    goal4: "Part 5: the post-deploy actions",
    goal5: "Pick the way out of each failed action",
    goal6: "Verify in the org, not in the log",
    coachArc: "Pink rings are for fun: jump for the vegetables!",
    coachPackage: "1 file in your Pull Request, about sixty in the package: delta is off",
    coachQuick: "Quick Deploy: the check already ran the tests",
    coachLog: "Jump for the log: it shows what .forceignore hides!",
    coachFogOut: "Tier_* also matched Tier_Updated__c: name the file exactly",
    coachGreen: "Green is not working: look at the records",
    meter: "Components: {{n}}",
    p_auth: "Part 1 of the log says auth URL. On the preprod and main branches it says JWT.",
    p_quick: "Deployment mode: FULL + Quick Deploy",
    p_log: "Deployment log read: the walls .forceignore hid show up",
    o_auth: "No authentication found for org integration",
    o_auth_tip: "The SFDX_AUTH_URL_INTEGRATION secret is missing or wrong: it must start with force://.",
    o_empty: "The log says nothing to deploy",
    o_empty_tip: "With delta off it should not happen: check that manifest/package.xml is still in the branch and still lists something.",
    o_tests: "Apex tests ran again",
    o_tests_tip: "The check of the Pull Request already validated this package, tests included. The merge job applies that validation: Quick Deploy.",
    o_fog: "no CustomField named Account.Tier_Updated__c found",
    o_fog_tip: "A .forceignore line is a pattern: Tier_*.field-meta.xml also hid Tier_Updated__c, a field the release needs. Read the log, then name the file exactly.",
    o_drift: "The org drifted",
    o_drift_tip: "Somebody changed the org by hand, and the deployment overwrote it without a word: nothing compares.",
    o_record: "We hit a snag. Review the following fields: Customer Tier",
    o_record_tip: "Salesforce enforces a required field on save, not on the data already there. Ship a backfill as a post-deployment Apex action.",
    o_prebackfill: "Invalid type: AccountTierBackfill",
    o_prebackfill_tip: "The Apex action ran before the deployment: the class only exists once the metadata is deployed. Declare it After Metadata Deployment.",
    o_prerefdata: "{Tier_Threshold__c} is missing in the Target",
    o_prerefdata_tip: "The data import ran before the field it fills was deployed. Declare it after the deployment.",
    o_preschedule: "Invalid type: AccountTierBatch",
    o_preschedule_tip: "The batch was scheduled before its class was deployed. Declare it after the deployment, after the data it reads.",
    o_latemanual: "Deliverability was declared too late",
    o_latemanual_tip: "Set Email Deliverability to All Email must happen with the org as it was: Before Metadata Deployment.",
    o_lateorder: "Scheduled before its data",
    o_lateorder_tip: "Load the reference data first, then schedule the batch that reads it.",
    s_auth: "No auth",
    s_empty: "nothing to deploy",
    s_invalid: "Invalid type",
    s_target: "Missing in Target",
    s_tests: "Apex tests",
    s_fog: "Tier_*",
    s_drift: "Changed by hand",
    s_record: "Can't save",
    s_late: "Too late",
    s_order: "Wrong order",
    s_authurl: "auth URL",
    s_quick: "Quick Deploy",
    s_log: "Deployment log",
    s_delta: "Delta: Disabled",
    s_refdata: "12 records",
    stopHeader: "1 to do by hand",
    stopButton: "Mark as done",
    stopDone: "Set Email Deliverability to All Email: done",
    stopOnTheWay: "Pressed on the way: the release did not even wait",
    choiceHeader: "US-062: 1 failed",
    romainFog: "# My scratch test fields, never versioned. That wildcard was mine, sorry.",
    fogTick: "**/objects/Account/fields/Tier_*.field-meta.xml",
    greenLie: "Deployment succeeded. All checks passed.",
    greenLieTwist: "30 accounts can no longer be saved",
    backfillRuns: "Customer Tier backfill started: the accounts save again",
    backfillMissing: "No backfill declared: jump the records nobody can save",
    mariiaFail: "My three actions run after the merge only: the check never ran them. Pick the right way out for each.",
    failTick: "System.QueryException: List has no rows for assignment to SObject",
    r1: "Add sales managers to the Key Accounts group: failed",
    r1d: "The action is right, the org had no group. Now the Key_Accounts group exists.",
    r2: "Recalculate account scores once: failed",
    r2d: "The action is wrong: it calls the class AccountScoreBach, a typo.",
    r3: "Add the deployment user to the Key Accounts group: stopped",
    r3d: "You already did it by hand in Setup.",
    optRetry: "Retry",
    optFix: "Move to a fix Pull Request",
    optDone: "Mark as done",
    optRerun: "Re-run the job",
    l1: "The org was missing something, now it has it: Retry",
    l2: "The action itself is wrong: a fix Pull Request",
    l3: "Done by hand: Mark as done",
    tRerun: "Re-running the job deploys everything again. Each failed action has its own way out.",
    t1fix: "Nothing to fix: the action is right. Retry it.",
    t1done: "Nobody did it by hand: Retry it.",
    t2retry: "Retry fails every time: the class name is wrong. Fix Pull Request.",
    t2done: "Nothing ran: the action is wrong. Fix Pull Request.",
    t3retry: "Already done by hand: Mark as done.",
    t3fix: "The action is right and already done: Mark as done.",
    endSign: "the integration org",
    arrived: "US-014 is in the integration org, and it works: Acme Corp shows Customer Tier: Gold.",
    info_coins: "You ate {{got}} of {{total}} vegetables.",
    info_log: "You did not read the deployment log: it names the .forceignore line that hid Account.Tier_Updated__c.",
    info_quick: "You missed Quick Deploy: the check already ran the tests, so the merge job takes seconds.",
    info_backfill: "No backfill after the deployment in World 3: 30 accounts could not be saved until it ran.",
    info_misplaced: "{{n}} deployment actions sat in the wrong place in World 3, and failed here."
  }),
  fr: Object.assign({}, MUSICAL_TEXTS.fr, {
    intro: "Votre Pull Request est mergée dans la branch integration et le job de déploiement démarre. Traversez le log en cinq parties, en musique.",
    how1: "Sautez avec Haut, Espace ou en touchant quand l'anneau se referme",
    how2: "Mangez les légumes, appuyez sur Mark as done en passant",
    how3: "Lisez le log : il montre ce que cache le brouillard",
    note: "Victor connaissait cette org. Victor est parti. Lisez le log, il en sait plus que moi. - V.",
    path0: "Auth",
    path1: "Package",
    path2: "Pre-deploy",
    path3: "Déploiement",
    path4: "Post-deploy",
    arch0: "1 · Authentification",
    arch1: "2 · Package",
    arch2: "3 · Pre-deploy",
    arch3: "4 · Déploiement",
    arch4: "5 · Post-deploy",
    goal0: "Partie 1 du log : l'authentification. Sautez les blocs rouges",
    goal1: "Partie 2 : le package. Ramassez ses composants",
    goal2: "Partie 3 : les actions pre-deploy",
    goal2manual: "Partie 3 : appuyez sur Mark as done en passant",
    goal3: "Partie 4 : le déploiement. Sautez pour le Quick Deploy",
    goal3fog: "Sautez pour le log de déploiement : il montre les murs cachés",
    goal4: "Partie 5 : les actions post-deploy",
    goal5: "Choisissez la sortie de chaque action en échec",
    goal6: "Vérifiez dans l'org, pas dans le log",
    coachArc: "Les anneaux roses, c'est pour le plaisir : sautez pour les légumes !",
    coachPackage: "1 fichier dans votre Pull Request, une soixantaine dans le package : le delta est désactivé",
    coachQuick: "Quick Deploy : le contrôle a déjà exécuté les tests",
    coachLog: "Sautez pour le log : il montre ce que cache .forceignore !",
    coachFogOut: "Tier_* attrapait aussi Tier_Updated__c : nommez le fichier exactement",
    coachGreen: "Vert ne veut pas dire que ça marche : regardez les enregistrements",
    meter: "Composants : {{n}}",
    p_auth: "La partie 1 du log dit auth URL. Sur les branches preprod et main, elle dit JWT.",
    p_quick: "Deployment mode: FULL + Quick Deploy",
    p_log: "Log de déploiement lu : les murs cachés par .forceignore apparaissent",
    o_auth: "No authentication found for org integration",
    o_auth_tip: "Le secret SFDX_AUTH_URL_INTEGRATION manque ou est faux : il doit commencer par force://.",
    o_empty: "Le log dit nothing to deploy",
    o_empty_tip: "Avec le delta désactivé, ça ne devrait pas arriver : vérifiez que manifest/package.xml est toujours dans la branch et liste toujours quelque chose.",
    o_tests: "Les tests Apex ont tourné à nouveau",
    o_tests_tip: "Le contrôle de la Pull Request a déjà validé ce package, tests compris. Le job du merge applique cette validation : le Quick Deploy.",
    o_fog: "no CustomField named Account.Tier_Updated__c found",
    o_fog_tip: "Une ligne de .forceignore est un motif : Tier_*.field-meta.xml cachait aussi Tier_Updated__c, un champ dont la release a besoin. Lisez le log, puis nommez le fichier exactement.",
    o_drift: "L'org a dérivé",
    o_drift_tip: "Quelqu'un a modifié l'org à la main, et le déploiement l'a écrasée sans un mot : rien ne compare.",
    o_record: "We hit a snag. Review the following fields: Customer Tier",
    o_record_tip: "Salesforce impose un champ obligatoire à l'enregistrement, pas sur les données déjà là. Livrez un backfill en action Apex post-deployment.",
    o_prebackfill: "Invalid type: AccountTierBackfill",
    o_prebackfill_tip: "L'action Apex s'est exécutée avant le déploiement : la classe n'existe qu'une fois les metadata déployées. Déclarez-la After Metadata Deployment.",
    o_prerefdata: "{Tier_Threshold__c} is missing in the Target",
    o_prerefdata_tip: "L'import de données s'est exécuté avant le déploiement du champ qu'il remplit. Déclarez-le après le déploiement.",
    o_preschedule: "Invalid type: AccountTierBatch",
    o_preschedule_tip: "Le batch a été planifié avant le déploiement de sa classe. Déclarez-le après le déploiement, après les données qu'il lit.",
    o_latemanual: "Délivrabilité déclarée trop tard",
    o_latemanual_tip: "Set Email Deliverability to All Email doit se faire avec l'org telle qu'elle était : Before Metadata Deployment.",
    o_lateorder: "Planifié avant ses données",
    o_lateorder_tip: "Chargez d'abord les données de référence, puis planifiez le batch qui les lit.",
    s_auth: "Pas d'auth",
    s_empty: "nothing to deploy",
    s_invalid: "Invalid type",
    s_target: "Missing in Target",
    s_tests: "Tests Apex",
    s_fog: "Tier_*",
    s_drift: "Modifié à la main",
    s_record: "Bloqué",
    s_late: "Trop tard",
    s_order: "Mauvais ordre",
    s_authurl: "auth URL",
    s_quick: "Quick Deploy",
    s_log: "Log de déploiement",
    s_delta: "Delta : Disabled",
    s_refdata: "12 enregistrements",
    stopHeader: "1 to do by hand",
    stopButton: "Mark as done",
    stopDone: "Set Email Deliverability to All Email : fait",
    stopOnTheWay: "Appuyé en passant : la release n'a même pas attendu",
    choiceHeader: "US-062 : 1 en échec",
    romainFog: "# My scratch test fields, never versioned. Ce joker était le mien, désolé.",
    fogTick: "**/objects/Account/fields/Tier_*.field-meta.xml",
    greenLie: "Déploiement réussi. Tous les contrôles sont passés.",
    greenLieTwist: "30 comptes ne peuvent plus être enregistrés",
    backfillRuns: "Backfill de Customer Tier démarré : les comptes s'enregistrent à nouveau",
    backfillMissing: "Pas de backfill déclaré : sautez les enregistrements que personne ne peut sauver",
    mariiaFail: "Mes trois actions ne tournent qu'après le merge : le contrôle ne les a jamais exécutées. Choisissez la bonne sortie pour chacune.",
    failTick: "System.QueryException: List has no rows for assignment to SObject",
    r1: "Ajouter les sales managers au groupe Key Accounts : en échec",
    r1d: "L'action est juste, il manquait le groupe à l'org. Le groupe Key_Accounts existe maintenant.",
    r2: "Recalculer une fois le score des comptes : en échec",
    r2d: "L'action est fausse : elle appelle la classe AccountScoreBach, une faute de frappe.",
    r3: "Ajouter l'utilisateur de déploiement au groupe Key Accounts : arrêtée",
    r3d: "Vous l'avez déjà fait à la main dans Setup.",
    optRetry: "Retry",
    optFix: "Pull Request de correction",
    optDone: "Mark as done",
    optRerun: "Relancer le job",
    l1: "Il manquait quelque chose à l'org, elle l'a désormais : Retry",
    l2: "L'action elle-même est fausse : une Pull Request de correction",
    l3: "Fait à la main : Mark as done",
    tRerun: "Relancer le job redéploie tout. Chaque action en échec a sa propre sortie.",
    t1fix: "Rien à corriger : l'action est juste. Retry.",
    t1done: "Personne ne l'a faite à la main : Retry.",
    t2retry: "Retry échoue à chaque fois : le nom de classe est faux. Pull Request de correction.",
    t2done: "Rien n'a tourné : l'action est fausse. Pull Request de correction.",
    t3retry: "Déjà fait à la main : Mark as done.",
    t3fix: "L'action est juste et déjà faite : Mark as done.",
    endSign: "l'org d'integration",
    arrived: "US-014 est dans l'org d'integration, et ça marche : Acme Corp affiche Customer Tier: Gold.",
    info_coins: "Vous avez mangé {{got}} légumes sur {{total}}.",
    info_log: "Vous n'avez pas lu le log de déploiement : il nomme la ligne de .forceignore qui cachait Account.Tier_Updated__c.",
    info_quick: "Vous avez raté le Quick Deploy : le contrôle a déjà exécuté les tests, donc le job du merge prend quelques secondes.",
    info_backfill: "Pas de backfill après le déploiement dans le Monde 3 : 30 comptes ne pouvaient plus être enregistrés tant qu'il n'avait pas tourné.",
    info_misplaced: "{{n}} actions de déploiement étaient mal placées dans le Monde 3, et ont échoué ici."
  })
};

/** The product words and error texts taken word for word from the labs, checked by scripts/verify/check-easter-egg.mjs. */
export const QUOTES = [
  { lab: "1.6", text: "No authentication found for org integration" },
  { lab: "2.3", text: "We hit a snag" },
  { lab: "2.3", text: "Invalid type" },
  { lab: "2.4", text: "is missing in the Target" },
  { lab: "2.4", text: "Mark as done" },
  { lab: "2.4", text: "1 to do by hand" },
  { lab: "2.4", text: "Set Email Deliverability to All Email" },
  { lab: "3.3", text: "List has no rows for assignment to SObject" },
  { lab: "3.3", text: "Deployment mode: FULL + Quick Deploy" },
  { lab: "3.3", text: "nothing to deploy" },
  { lab: "3.3", text: "auth URL" },
  { lab: "3.3", text: "Retry" }
];

export const CSS = MUSICAL_CSS;

export function createWorld(ctx) {
  const { t, hud } = ctx;
  const verdict = ctx.judgePlan();
  const plan = ctx.plan;
  const pre = (plan && plan.pre) || [];
  const post = (plan && plan.post) || ["backfill", "refdata", "schedule"];
  const manualPre = verdict.deliverability.ok;
  const misplaced = Object.values(verdict).filter((v) => !v.ok).length;
  // How many declared actions fail on this track: the check reads it
  ctx.setData("misplaced", misplaced);

  /* ---------- What is on the track ---------- */

  const look = (id, color, glyph, sign, title, extra) => Object.assign({ id, color, glyph, sign: t(sign), title: t(title), tip: t(title + "_tip") }, extra);
  const LOOKS = {
    auth: look("auth", SLDS.errorDark, "lock", "s_auth", "o_auth"),
    empty: look("empty", SLDS.grey, "empty", "s_empty", "o_empty"),
    tests: look("tests", SLDS.purple, "code", "s_tests", "o_tests", { group: "tests" }),
    fog: look("fog", "#7526E3", "eye", "s_fog", "o_fog", { group: "fog", hidden: true, signEvery: true }),
    drift: look("drift", SLDS.warningDark, "warning", "s_drift", "o_drift"),
    record: look("record", SLDS.error, "error", "s_record", "o_record", { group: "records" }),
    prebackfill: look("prebackfill", SLDS.error, "apex", "s_invalid", "o_prebackfill", { signEvery: true }),
    prerefdata: look("prerefdata", SLDS.error, "box", "s_target", "o_prerefdata", { signEvery: true }),
    preschedule: look("preschedule", SLDS.error, "loop", "s_invalid", "o_preschedule", { signEvery: true }),
    latemanual: look("latemanual", SLDS.warningDark, "warning", "s_late", "o_latemanual", { signEvery: true }),
    lateorder: look("lateorder", SLDS.warningDark, "loop", "s_order", "o_lateorder", { signEvery: true })
  };
  // The bonus pickups on the beat: vegetables, as in world 0
  const COIN = { id: "veg", vegetable: true, color: "#2E844A", glyph: "star" };
  const COMP = { id: "comp", color: SLDS.brand, glyph: "box" };
  const OK = { id: "ok", color: SLDS.success, glyph: "check" };
  const L = createLevel();
  const part = (bar, color, archKey) => {
    L.zone(bar * BAR, color);
    L.arch(bar * BAR + 0.6, t(archKey), { color: "#" + color.toString(16).padStart(6, "0") });
  };

  // Part 1: authentication
  part(0, 0xfe9339, "arch0");
  L.music(0, "intro");
  L.music(2 * BAR, "verse");
  const p1 = { block: LOOKS.auth, coin: COIN };
  ["..--", "----", "x.--", "x.x.", "X.--", "x-.."].forEach((p, i) => L.riff(i, p, p1));
  L.power(5 * BAR + 3, { id: "authurl", model: "permission-set", color: SLDS.navy, glyph: "lock", sign: t("s_authurl") }, true);

  // Part 2: the package, about sixty components for one file
  L.checkpoint(6 * BAR);
  part(6, 0x06a59a, "arch1");
  const p2 = { gap: LOOKS.empty, coin: COMP };
  ["====", "o-o-", "g===", "-o-o", "g.g.", "====", "G-o-", "-.-."].forEach((p, i) => L.riff(6 + i, p, p2));
  L.sign(13 * BAR + 1.5, t("s_delta"), { color: SLDS.navy, glyph: "delta", y: 2.4 });

  // Part 3: the pre-deployment actions
  L.checkpoint(14 * BAR);
  part(14, 0xdd7a01, "arch2");
  const p3 = { block: LOOKS.auth, coin: COIN };
  L.riff(14, "-.-.", p3);
  L.riff(15, "o...", p3);
  L.riff(16, "-...", p3);
  if (manualPre) {
    L.manual(17 * BAR, { header: t("stopHeader"), button: t("stopButton") });
  } else {
    L.riff(16, "..-.", p3);
  }
  L.riff(17, "..-.", p3);
  // The actions declared before the deployment that belong after it: their real errors
  const wrongPre = pre.filter((id) => ["backfill", "refdata", "schedule"].includes(id)).map((id) => LOOKS["pre" + id]);
  [18, 19, 20].forEach((bar, i) => {
    if (wrongPre[i]) {
      L.riff(bar, "-.-.", p3);
      L.block(bar * BAR + 1, wrongPre[i]);
    } else {
      L.riff(bar, "-o-.", p3);
    }
  });
  L.riff(21, "-o-o", p3);

  // Part 4: the Salesforce deployment, Quick Deploy, then the fog of .forceignore
  L.checkpoint(22 * BAR);
  part(22, 0x0176d3, "arch3");
  L.music(22 * BAR, "chorus");
  const p4 = { block: LOOKS.tests, coin: COIN };
  L.riff(22, "-.--", p4);
  L.power(22 * BAR + 1, { id: "quick", model: "rocket", color: SLDS.purple, glyph: "bolt", sign: t("s_quick") });
  for (const bar of [23, 24]) {
    for (const beat of [0, 2]) {
      L.block(bar * BAR + beat, LOOKS.tests, { convert: OK });
    }
  }
  L.riff(23, ".-.-", p4);
  L.riff(24, ".-.-", p4);
  L.riff(25, "----", p4);
  L.checkpoint(26 * BAR);
  L.riff(26, "..--", p4);
  L.power(26 * BAR + 1, { id: "log", model: "record", color: SLDS.navy, glyph: "log", sign: t("s_log") });
  L.fog(26 * BAR + 2, 33 * BAR);
  L.music(27 * BAR, "verse");
  const pf = { block: LOOKS.fog, coin: COIN };
  ["x..-", "-.x.", "x.s.", "-.x.", "x.x.", "-..x"].forEach((p, i) => L.riff(27 + i, p, pf));
  // Victor's note, at the top of the spring's jump, in the fog
  L.note(29 * BAR + 3, 2 * 2.3 + 0.45);
  L.checkpoint(33 * BAR);
  L.music(33 * BAR, "chorus");
  const pd = { block: LOOKS.drift, coin: COIN };
  ["----", "x-x-", "X.o.", "xx..", "-.-."].forEach((p, i) => L.riff(33 + i, p, pd));

  // Part 5: the post-deployment actions, the green lie, then US-062
  L.checkpoint(38 * BAR);
  part(38, 0x2e844a, "arch4");
  const p5 = { block: LOOKS.record, coin: COIN };
  L.riff(38, "--..", p5);
  for (const [bar, beats] of [
    [39, [0, 2]],
    [40, [0, 2]],
    [41, [0, 1]],
    [42, [0]]
  ]) {
    for (const beat of beats) {
      L.block(bar * BAR + beat, LOOKS.record, { convert: OK });
    }
  }
  L.riff(42, "o.-.", p5);
  L.riff(43, "-.-.", p5);
  if (post.includes("refdata") && verdict.refdata.ok) {
    L.sign(43 * BAR, t("s_refdata"), { color: SLDS.success, glyph: "box", y: 2.4 });
  }
  if (post.includes("schedule") && !verdict.schedule.ok) {
    L.block(43 * BAR + 1, LOOKS.lateorder);
  }
  if (!manualPre && !pre.includes("deliverability")) {
    L.block(43 * BAR + 3, LOOKS.latemanual);
  }
  L.checkpoint(44 * BAR);
  ["-o-o", "o=o=", "----", "-.-."].forEach((p, i) => L.riff(44 + i, p, p5));
  const round = (prompt, detail, lesson, right, tips) => ({
    prompt: t(prompt),
    detail: t(detail),
    lesson: t(lesson),
    options: [
      { label: t("optRetry"), ok: right === "retry", tip: t(tips.retry || "") },
      { label: t("optFix"), ok: right === "fix", tip: t(tips.fix || "") },
      { label: t("optDone"), ok: right === "done", tip: t(tips.done || "") },
      { label: t("optRerun"), ok: false, tip: t("tRerun") }
    ]
  });
  L.choice(48 * BAR, {
    header: t("choiceHeader"),
    rounds: [round("r1", "r1d", "l1", "retry", { fix: "t1fix", done: "t1done" }), round("r2", "r2d", "l2", "fix", { retry: "t2retry", done: "t2done" }), round("r3", "r3d", "l3", "done", { retry: "t3retry", fix: "t3fix" })]
  });
  L.checkpoint(49 * BAR);
  L.music(49 * BAR, "chorus");
  const pe = { gap: LOOKS.empty, coin: OK };
  L.riff(48, "..-.", pe);
  ["o-o-", "G-o-", "o=o=", "G.G.", "----"].forEach((p, i) => L.riff(49 + i, p, pe));
  // The song speeds up part by part, on bar lines: +28 % for the last lap
  [
    [6, 1.06],
    [14, 1.12],
    [22, 1.18],
    [38, 1.24],
    [49, 1.28]
  ].forEach(([bar, pace]) => L.tempo(bar * BAR, pace));
  L.end(54 * BAR, { text: t("endSign"), glyph: "cloud", color: SLDS.brand });

  /* ---------- The story on the way ---------- */

  let meter = null;
  const say = (at, run) => L.script(at, run);
  say(0, () => {
    hud.setPath([t("path0"), t("path1"), t("path2"), t("path3"), t("path4")], 0);
    hud.goal(t("goal0"));
    hud.tick("Login to the integration org: auth URL");
  });
  say(7 * BAR - 1, (api) => api.coach(t("coachArc"), 2400));
  say(6 * BAR, () => {
    hud.setPath([t("path0"), t("path1"), t("path2"), t("path3"), t("path4")], 1);
    hud.goal(t("goal1"));
    meter = document.createElement("div");
    meter.className = "gr-mu-meter";
    hud.extra.appendChild(meter);
    updateMeter();
  });
  say(13 * BAR, (api) => {
    hud.tick("Components: 61 deployed");
    api.coach(t("coachPackage"), 3200, true);
  });
  say(14 * BAR, () => {
    hud.setPath([t("path0"), t("path1"), t("path2"), t("path3"), t("path4")], 2);
    hud.goal(t(manualPre ? "goal2manual" : "goal2"));
    hud.tick("Listing Pre-deployment actions");
    if (manualPre) {
      hud.tick("Set Email Deliverability to All Email");
    }
  });
  say(22 * BAR, () => {
    hud.setPath([t("path0"), t("path1"), t("path2"), t("path3"), t("path4")], 3);
    hud.goal(t("goal3"));
    hud.tick("Deploying metadata...");
  });
  say(25 * BAR, (api) => {
    hud.goal(t("goal3fog"));
    hud.chat("romain", t("romainFog"), 6000);
    hud.tick(t("fogTick"));
    api.coach(t("coachLog"), 2800, true);
  });
  say(33 * BAR, (api) => {
    hud.goal(t("goal3"));
    api.coach(t("coachFogOut"), 3200, true);
  });
  say(38 * BAR, (api) => {
    hud.setPath([t("path0"), t("path1"), t("path2"), t("path3"), t("path4")], 4);
    hud.goal(t("goal4"));
    hud.toast(t("greenLie"), "good");
    hud.tick("Listing Post-deployment actions");
    ctx.sound.play("fanfare");
    ctx.fx.burst(api.x(api.beat) + 4, 3, 0, { count: 60, speed: 5, up: 6, life: 1.4 });
  });
  say(38 * BAR + 2, (api) => {
    hud.toast(t("greenLieTwist"), "bad");
    api.coach(t("coachGreen"), 2400, true);
    if (verdict.backfill.ok && post.includes("backfill")) {
      api.convert("records");
      hud.tick(t("backfillRuns"));
      ctx.sound.play("power");
      ctx.setData("boss", "backfilled");
    } else {
      ctx.setData("boss", "records");
      hud.chat("mariia", t("backfillMissing"), 5000);
    }
  });
  say(46 * BAR, () => {
    hud.goal(t("goal5"));
    hud.tick(t("failTick"));
    hud.chat("mariia", t("mariiaFail"), 6500);
  });
  say(49 * BAR, () => hud.goal(t("goal6")));

  function updateMeter() {
    if (meter) {
      meter.textContent = t("meter", { n: run.coinsOf("comp").got });
    }
  }

  let finished = false;
  const run = createMusicalRun(ctx, {
    song: SONG,
    level: L,
    palette: [0x06a59a, 0x9050e9, 0x2e844a, 0xfe9339, 0x1b96ff, 0xe3066a],
    scenery: SCENERY,
    // The package is its components, in turn; what the backfill and Quick Deploy free passes
    coinModels: { comp: ["custom-field", "apex", "flow", "permission-set", "lwc"], ok: "check-pass" },
    // A gap is a failed check to fall in; a checkpoint is a check that passed
    pitModel: "check-fail",
    checkpointModel: "check-pass",
    // The integration org: the org the deployment reaches, and the Cloudity logo on the finish line
    finish: [{ name: "org-cloud", height: 3 }],
    finishLine: { name: "cloudity-logo", height: 1.3 },
    callbacks: {
      onCoin(coin) {
        if (coin.id === "comp") {
          updateMeter();
        }
      },
      onPower(power) {
        if (power.id === "authurl") {
          hud.toast(t("p_auth"), "power");
        } else if (power.id === "quick") {
          hud.toast(t("p_quick"), "power");
          hud.tick("Deployment mode: FULL + Quick Deploy");
          run.convert("tests");
          run.coach(t("coachQuick"), 2600, true);
        } else if (power.id === "log") {
          hud.toast(t("p_log"), "power");
          run.reveal("fog");
        }
      },
      onManual(stop, onTheWay) {
        ctx.collect(onTheWay ? 200 : 120, t("stopDone"));
        if (onTheWay) {
          hud.tick(t("stopOnTheWay"));
        }
      },
      onEnd() {
        finished = true;
        hud.goal("");
        hud.toast(t("arrived"), "good");
        run.finale();
        const info = missedInfo();
        ctx.setData("missed", info ? "yes" : "no");
        ctx.finish(bonus(), info);
      }
    }
  });

  function bonus() {
    const s = run.stats;
    let points = 150 + Math.round((200 * s.got) / Math.max(1, s.coins));
    points -= misplaced * 30;
    if (!run.powerTaken("log")) {
      points -= 40;
    }
    if (!run.powerTaken("quick")) {
      points -= 40;
    }
    return Math.max(0, points);
  }

  function missedInfo() {
    const lines = [];
    const s = run.stats;
    // What the plan of World 3 got wrong comes first: it is what this world is about
    if (!(verdict.backfill.ok && post.includes("backfill"))) {
      lines.push(t("info_backfill"));
    } else if (misplaced > 0) {
      lines.push(t("info_misplaced", { n: misplaced }));
    }
    if (!run.powerTaken("log")) {
      lines.push(t("info_log"));
    }
    return endMissedInfo(lines, run, s, t);
  }

  return musicalWorld(
    run,
    () => finished,
    () => {
      if (meter) {
        meter.remove();
      }
    }
  );
}
