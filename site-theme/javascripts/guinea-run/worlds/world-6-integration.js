/*
 * World 6, Deploy to integration (Lab 3.3, with the actions of Labs 2.3 and
 * 2.4): a musical run along the deployment job. The guinea pig runs to the
 * music, the player only jumps, and the track is the log of Lab 3.3 in its
 * five parts: authentication, the package, the pre-deployment actions, the
 * Salesforce deployment, the post-deployment actions.
 *
 * The track is built from the plan the player declared in world 3:
 * - the manual action declared before the deployment is a button to press on
 *   the way (or at the barrier, with a jump): Mark as done
 * - an action declared in the wrong place fails with its real error, as a
 *   block to jump over
 * - the backfill declared after the deployment turns the 30 installations
 *   nobody can save into coins; without it they stay, as blocks
 *
 * The bosses: the .forceignore fog of Romain's US-056 (the deployment log
 * shows the walls it hides), the green lie of Lab 2.3, and the three failed
 * actions of Mariia's US-062, each with its own way out, chosen on the beat.
 */
import { createLevel, createMusicalRun, MUSICAL_TEXTS, MUSICAL_CSS, endMissedInfo, musicalWorld } from "./musical.js";
import { melody } from "../core/music.js";
import { SLDS } from "../core/painter.js";

export const PADS = ["jump"];
// The salesforce items (components, checks, runners, orgs, the Cloudity logo), the Kenney
// springs, and trees and bushes far behind
export const MODELS = ["salesforce", "platform", "nature"];

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
    intro: "Your Pull Request is merged into integration and the deployment job starts. Run through the log in its five parts, to the music.",
    how1: "Jump with Up, Space or a tap when the ring closes",
    how2: "Collect the notes, press Mark as done on the way",
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
    coachArc: "Pink rings are for fun: jump for the notes!",
    coachPackage: "1 file in your Pull Request, about sixty in the package: delta is off",
    coachQuick: "Quick Deploy: the check already ran the tests",
    coachLog: "Jump for the log: it shows what .forceignore hides!",
    coachFogOut: "Crew_W* also matched Crew_Workload__c: name the file exactly",
    coachGreen: "Green is not working: look at the records",
    meter: "Components: {{n}}",
    p_auth: "Part 1 of the log says auth URL. On preprod and main it says JWT.",
    p_quick: "Deployment mode: FULL + Quick Deploy",
    p_log: "Deployment log read: the walls .forceignore hid show up",
    o_auth: "No authentication found for org integration",
    o_auth_tip: "The SFDX_AUTH_URL_INTEGRATION secret is missing or wrong: it must start with force://.",
    o_empty: "The log says nothing to deploy",
    o_empty_tip: "With delta off it should not happen: check that manifest/package.xml is still in the branch and still lists something.",
    o_tests: "Apex tests ran again",
    o_tests_tip: "The check of the Pull Request already validated this package, tests included. The merge job applies that validation: Quick Deploy.",
    o_fog: "no CustomField named Installation__c.Crew_Workload__c found",
    o_fog_tip: "A .forceignore line is a pattern: Crew_W*.field-meta.xml also hid Crew_Workload__c. Read the log, then name the file exactly.",
    o_drift: "The org drifted",
    o_drift_tip: "Somebody changed the org by hand, and the deployment overwrote it without a word: nothing compares.",
    o_record: "We hit a snag. Review the following fields: Crew Size",
    o_record_tip: "Salesforce enforces a required field on save, not on the data already there. Ship a backfill as a post-deployment Apex action.",
    o_prebackfill: "Invalid type: CrewSizeBackfillBatch",
    o_prebackfill_tip: "The Apex action ran before the deployment: the class only exists once the metadata is deployed. Declare it After Metadata Deployment.",
    o_prerefdata: "{Crew_Capacity__c} is missing in the Target",
    o_prerefdata_tip: "The data import ran before the object it fills was deployed. Declare it after the deployment.",
    o_preschedule: "Invalid type: CrewCapacityBatch",
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
    s_fog: "Crew_W*",
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
    fogTick: "**/objects/Installation__c/fields/Crew_W*.field-meta.xml",
    greenLie: "Deployment succeeded. All checks passed.",
    greenLieTwist: "30 installations can no longer be saved",
    backfillRuns: "Crew size backfill started: the records save again",
    backfillMissing: "No backfill declared: jump the records nobody can save",
    mariiaFail: "My three actions run after the merge only: the check never ran them. Pick the right way out for each.",
    failTick: "System.QueryException: List has no rows for assignment to SObject",
    r1: "Put the delivery managers in the Crew Leads group: failed",
    r1d: "List has no rows for assignment to SObject. You have now created the Helios_Crew_Leads group.",
    r2: "Recalculate the crew capacity once: failed",
    r2d: "The class CrewCapacityBach does not exist: a typo in a merged Pull Request.",
    r3: "Add the deployment user to the Crew Leads group",
    r3d: "You did it by hand in Setup: it took twenty seconds.",
    optRetry: "Retry",
    optFix: "Move to a fix Pull Request",
    optDone: "Mark as done",
    optRerun: "Re-run the job",
    l1: "The org was missing something, now it has it: Retry",
    l2: "The action itself is wrong: a fix Pull Request",
    l3: "Done by hand: Mark as done",
    tRerun: "Re-running the job deploys everything again, without the Quick Deploy. A failed action has its own way out.",
    t1fix: "The action is right: the org was missing its group. Now that the group exists, Retry.",
    t1done: "Nobody put the delivery managers in the group: Retry it now that the group exists.",
    t2retry: "Retrying fails every time: the class name has a typo. Move it to a fix Pull Request.",
    t2done: "Nothing recalculated the crew capacity: the action itself is wrong. Move it to a fix Pull Request.",
    t3retry: "It is already done, by hand: Mark as done records it, and the next deployment skips it.",
    t3fix: "The action is right, and already done by hand: Mark as done.",
    endSign: "helios-integration",
    arrived: "US-014 is in integration, and it works.",
    info_coins: "You picked up {{got}} of {{total}} notes.",
    info_log: "You did not read the deployment log: in Lab 3.3, it names the .forceignore line that hid Crew_Workload__c.",
    info_quick: "You missed Quick Deploy: the check already ran the tests, so the merge job takes seconds.",
    info_backfill: "No backfill after the deployment in World 3: in Lab 2.3, 30 installations could not be saved.",
    info_misplaced: "{{n}} deployment actions sat in the wrong place in World 3, and failed here."
  }),
  fr: Object.assign({}, MUSICAL_TEXTS.fr, {
    intro: "Votre Pull Request est mergée dans integration et le job de déploiement démarre. Traversez le log en cinq parties, en musique.",
    how1: "Sautez avec Haut, Espace ou en touchant quand l'anneau se referme",
    how2: "Ramassez les notes, appuyez sur Mark as done en passant",
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
    coachArc: "Les anneaux roses, c'est pour le plaisir : sautez pour les notes !",
    coachPackage: "1 fichier dans votre Pull Request, une soixantaine dans le package : le delta est désactivé",
    coachQuick: "Quick Deploy : le contrôle a déjà exécuté les tests",
    coachLog: "Sautez pour le log : il montre ce que cache .forceignore !",
    coachFogOut: "Crew_W* attrapait aussi Crew_Workload__c : nommez le fichier exactement",
    coachGreen: "Vert ne veut pas dire que ça marche : regardez les enregistrements",
    meter: "Composants : {{n}}",
    p_auth: "La partie 1 du log dit auth URL. Sur preprod et main, elle dit JWT.",
    p_quick: "Deployment mode: FULL + Quick Deploy",
    p_log: "Log de déploiement lu : les murs cachés par .forceignore apparaissent",
    o_auth: "No authentication found for org integration",
    o_auth_tip: "Le secret SFDX_AUTH_URL_INTEGRATION manque ou est faux : il doit commencer par force://.",
    o_empty: "Le log dit nothing to deploy",
    o_empty_tip: "Avec le delta désactivé, ça ne devrait pas arriver : vérifiez que manifest/package.xml est toujours dans la branch et liste toujours quelque chose.",
    o_tests: "Les tests Apex ont tourné à nouveau",
    o_tests_tip: "Le contrôle de la Pull Request a déjà validé ce package, tests compris. Le job du merge applique cette validation : le Quick Deploy.",
    o_fog: "no CustomField named Installation__c.Crew_Workload__c found",
    o_fog_tip: "Une ligne de .forceignore est un motif : Crew_W*.field-meta.xml cachait aussi Crew_Workload__c. Lisez le log, puis nommez le fichier exactement.",
    o_drift: "L'org a dérivé",
    o_drift_tip: "Quelqu'un a modifié l'org à la main, et le déploiement l'a écrasée sans un mot : rien ne compare.",
    o_record: "We hit a snag. Review the following fields: Crew Size",
    o_record_tip: "Salesforce impose un champ obligatoire à l'enregistrement, pas sur les données déjà là. Livrez un backfill en action Apex post-deployment.",
    o_prebackfill: "Invalid type: CrewSizeBackfillBatch",
    o_prebackfill_tip: "L'action Apex s'est exécutée avant le déploiement : la classe n'existe qu'une fois les metadata déployées. Déclarez-la After Metadata Deployment.",
    o_prerefdata: "{Crew_Capacity__c} is missing in the Target",
    o_prerefdata_tip: "L'import de données s'est exécuté avant le déploiement de l'objet qu'il remplit. Déclarez-le après le déploiement.",
    o_preschedule: "Invalid type: CrewCapacityBatch",
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
    s_fog: "Crew_W*",
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
    fogTick: "**/objects/Installation__c/fields/Crew_W*.field-meta.xml",
    greenLie: "Déploiement réussi. Tous les contrôles sont passés.",
    greenLieTwist: "30 installations ne peuvent plus être enregistrées",
    backfillRuns: "Crew size backfill started : les enregistrements se sauvent à nouveau",
    backfillMissing: "Pas de backfill déclaré : sautez les enregistrements que personne ne peut sauver",
    mariiaFail: "Mes trois actions ne tournent qu'après le merge : le contrôle ne les a jamais exécutées. Choisissez la bonne sortie pour chacune.",
    failTick: "System.QueryException: List has no rows for assignment to SObject",
    r1: "Mettre les delivery managers dans le groupe Crew Leads : en échec",
    r1d: "List has no rows for assignment to SObject. Vous avez maintenant créé le groupe Helios_Crew_Leads.",
    r2: "Recalculer une fois la capacité des équipes : en échec",
    r2d: "La classe CrewCapacityBach n'existe pas : une faute de frappe dans une Pull Request mergée.",
    r3: "Ajouter l'utilisateur de déploiement au groupe Crew Leads",
    r3d: "Vous l'avez fait à la main dans Setup : vingt secondes.",
    optRetry: "Retry",
    optFix: "Pull Request de correction",
    optDone: "Mark as done",
    optRerun: "Relancer le job",
    l1: "Il manquait quelque chose à l'org, elle l'a désormais : Retry",
    l2: "L'action elle-même est fausse : une Pull Request de correction",
    l3: "Fait à la main : Mark as done",
    tRerun: "Relancer le job redéploie tout, sans le Quick Deploy. Une action en échec a sa propre sortie.",
    t1fix: "L'action est juste : il manquait son groupe à l'org. Maintenant que le groupe existe, Retry.",
    t1done: "Personne n'a mis les delivery managers dans le groupe : relancez-la avec Retry maintenant que le groupe existe.",
    t2retry: "Retry échouera à chaque fois : le nom de classe a une faute. Déplacez-la dans une Pull Request de correction.",
    t2done: "Rien n'a recalculé la capacité des équipes : l'action elle-même est fausse. Déplacez-la dans une Pull Request de correction.",
    t3retry: "C'est déjà fait, à la main : Mark as done l'enregistre, et le prochain déploiement la saute.",
    t3fix: "L'action est juste, et déjà faite à la main : Mark as done.",
    endSign: "helios-integration",
    arrived: "US-014 est en integration, et ça marche.",
    info_coins: "Vous avez ramassé {{got}} notes sur {{total}}.",
    info_log: "Vous n'avez pas lu le log de déploiement : dans le Lab 3.3, il nomme la ligne de .forceignore qui cachait Crew_Workload__c.",
    info_quick: "Vous avez raté le Quick Deploy : le contrôle a déjà exécuté les tests, donc le job du merge prend quelques secondes.",
    info_backfill: "Pas de backfill après le déploiement dans le Monde 3 : dans le Lab 2.3, 30 installations ne pouvaient plus être enregistrées.",
    info_misplaced: "{{n}} actions de déploiement étaient mal placées dans le Monde 3, et ont échoué ici."
  })
};

/** The strings taken word for word from the labs, checked by scripts/verify/check-easter-egg.mjs. */
export const QUOTES = [
  { lab: "1.6", text: "No authentication found for org integration" },
  { lab: "2.3", text: "We hit a snag" },
  { lab: "2.3", text: "Invalid type: CrewSizeBackfillBatch" },
  { lab: "2.3", text: "Crew size backfill started" },
  { lab: "2.4", text: "is missing in the Target" },
  { lab: "2.4", text: "Mark as done" },
  { lab: "2.4", text: "1 to do by hand" },
  { lab: "2.4", text: "Set Email Deliverability to All Email" },
  { lab: "3.3", text: "List has no rows for assignment to SObject" },
  { lab: "3.3", text: "CrewCapacityBach" },
  { lab: "3.3", text: "Helios_Crew_Leads" },
  { lab: "3.3", text: "My scratch test fields, never versioned" },
  { lab: "3.3", text: "Deployment mode: FULL + Quick Deploy" },
  { lab: "3.3", text: "Crew_W*.field-meta.xml" },
  { lab: "3.3", text: "no CustomField named Installation__c.Crew_Workload__c found" },
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
  const COIN = { id: "note", color: "#FFB400", glyph: "star" };
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
    hud.tick("Login to integration: auth URL");
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
    // The notes and the package are its components, in turn; what the backfill and Quick Deploy free passes
    coinModels: { note: ["custom-field", "apex", "flow", "permission-set", "lwc"], comp: ["custom-field", "apex", "flow", "permission-set", "lwc"], ok: "check-pass" },
    // A gap is a failed check to fall in; a checkpoint is a check that passed
    pitModel: "check-fail",
    checkpointModel: "check-pass",
    // helios-integration: the org the deployment reaches, and the Cloudity logo on the finish line
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
    // What the plan of World 3 got wrong comes first: it is what the lab is about
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
