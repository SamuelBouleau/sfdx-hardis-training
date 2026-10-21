/*
 * World 6, Deploy to integration (Lab 3.3, with the actions of Labs 2.3 and
 * 2.4): a runner along the deployment job itself. Pre-deployment actions,
 * then the metadata deployment, then the post-deployment actions.
 *
 * The track is built from the plan the player committed in world 3:
 * - an action in the right place runs: the manual one stops the guinea pig
 *   until it is marked as done, the others pass with their log line
 * - an action in the wrong place fails with its real error, as an obstacle
 *
 * The bosses: the .forceignore fog that hides Romain's field (Lab 3.3), the
 * green lie of Lab 2.3 (a green deployment, then 30 installations nobody can
 * save, unless the backfill was declared after the deployment), and a failed
 * post-deployment action with its three ways out, one of them a trap.
 */
import { createRunner } from "./runner.js";

export const PADS = ["left", "right", "jump", "duck", "confirm"];

const PRE_LENGTH = 170;
const DEPLOY_LENGTH = 380;
const POST_LENGTH = 360;

export const TEXTS = {
  en: {
    intro: "Your Pull Request is merged into integration, and the deployment job starts. Run its deployment actions in the order you declared them, keep the metadata deployment going, and read the log: it tells you what the green tick does not.",
    note: "Victor knew this org. Victor has left. Read the log, it knows more than I did. - V.",
    s0: "Pre-deployment",
    s1: "Deploying metadata",
    s2: "Post-deployment",
    stopHeader: "In integration: 1 to do by hand",
    stopHint: "Do the click in the org, then mark it as done: the release waits for you.",
    stopButton: "Mark as done (Enter)",
    stopDone: "Manual action marked as done: the deployment goes on",
    o_auth: "No authentication found for org integration",
    o_auth_tip: "The SFDX_AUTH_URL_INTEGRATION secret is missing or wrong: it must start with force://.",
    o_forceignore: "no CustomField named Installation__c.Crew_Workload__c found",
    o_forceignore_tip: "A .forceignore wildcard hid Romain's field from the deployment, though it was in his diff. Read the deployment log first.",
    o_xref: "INVALID_CROSS_REFERENCE_KEY",
    o_xref_tip: "A component references something that is not in the package: ship them together.",
    o_lock: "[NoOverwrite]",
    o_lock_tip: "That file is in the no-overwrite list: it is never deployed over the org's version.",
    o_record: "We hit a snag. Review the following fields: Crew Size",
    o_record_tip: "Salesforce enforces a required field on save, not on the data already there. Ship a backfill as a post-deployment Apex action before merging.",
    o_prebackfill: "Invalid type: CrewSizeBackfillBatch",
    o_prebackfill_tip: "The Apex action ran before the deployment: the class only exists once the metadata is deployed. Declare it After Metadata Deployment.",
    o_prerefdata: "{Crew_Capacity__c} is missing in the Target",
    o_prerefdata_tip: "The data import ran before the object it fills was deployed. Declare it after the deployment.",
    o_preschedule: "Invalid type: CrewCapacityBatch",
    o_preschedule_tip: "The batch was scheduled before its class was deployed. Declare it after the deployment, after the data it reads.",
    o_latemanual: "Set Email Deliverability to All Email was declared after the deployment",
    o_latemanual_tip: "A manual step that must happen with the org as it was goes Before Metadata Deployment.",
    o_lateorder: "The batch is scheduled before its reference data is loaded",
    o_lateorder_tip: "Load the reference data first, then schedule the batch that reads it.",
    p_log: "Read the deployment log: what was hidden shows up",
    p_quick: "Quick Deploy: the validation already ran the tests",
    p_retry: "Retry: one more attempt",
    p_empty: "Exit code 0 (SUCCESS). Not one record written.",
    item_field: "Panels_Required__c",
    item_layout: "Installation Layout",
    item_permset: "Helios_Delivery_Crew",
    item_flow: "Installation_Crew_Warning",
    greenLie: "Deployment succeeded. All checks passed.",
    greenLieTwist: "30 installations can no longer be saved",
    backfillRuns: "Crew size backfill started, batch job ...",
    backfillMissing: "No backfill declared: dodge the records nobody can save",
    refdataRuns: "Load crew capacity reference data: 12 records",
    scheduleRuns: "Schedule the nightly crew capacity recalculation: 0 0 2 * * ?",
    fogComes: "The log mentions a .forceignore line. Something is hidden ahead.",
    romainFog: "# My scratch test fields, never versioned. That wildcard was mine, sorry.",
    failBanner: "US-062: System.QueryException: List has no rows for assignment to SObject",
    doorRetry: "Retry",
    doorFix: "Move it to a fix Pull Request",
    doorRerun: "Re-run the GitHub job",
    doorRerunTip: "Re-running the job deploys everything again. A failed action has its own way out: Retry, a fix Pull Request, or Mark as done.",
    mariiaFail: "The other two actions wait for that one. Retry it, or fix the typo in a new Pull Request: CrewCapacityBach.",
    arrived: "US-014 is in integration, and it works."
  },
  fr: {
    intro: "Votre Pull Request est mergée dans integration, et le job de déploiement démarre. Exécutez ses actions de déploiement dans l'ordre déclaré, gardez le déploiement des metadata en marche, et lisez le log : il vous dit ce que la coche verte ne dit pas.",
    note: "Victor connaissait cette org. Victor est parti. Lisez le log, il en sait plus que moi. - V.",
    s0: "Pre-deployment",
    s1: "Déploiement des metadata",
    s2: "Post-deployment",
    stopHeader: "In integration: 1 to do by hand",
    stopHint: "Faites le clic dans l'org, puis marquez-le comme fait : la release vous attend.",
    stopButton: "Mark as done (Entrée)",
    stopDone: "Action manuelle marquée comme faite : le déploiement continue",
    o_auth: "No authentication found for org integration",
    o_auth_tip: "Le secret SFDX_AUTH_URL_INTEGRATION manque ou est faux : il doit commencer par force://.",
    o_forceignore: "no CustomField named Installation__c.Crew_Workload__c found",
    o_forceignore_tip: "Un joker du .forceignore a caché le champ de Romain au déploiement, alors qu'il était dans son diff. Lisez d'abord le log de déploiement.",
    o_xref: "INVALID_CROSS_REFERENCE_KEY",
    o_xref_tip: "Un composant fait référence à quelque chose qui n'est pas dans le package : livrez-les ensemble.",
    o_lock: "[NoOverwrite]",
    o_lock_tip: "Ce fichier est dans la liste no-overwrite : il n'est jamais déployé par-dessus la version de l'org.",
    o_record: "We hit a snag. Review the following fields: Crew Size",
    o_record_tip: "Salesforce impose un champ obligatoire à l'enregistrement, pas sur les données déjà là. Livrez un backfill en action Apex post-deployment avant de merger.",
    o_prebackfill: "Invalid type: CrewSizeBackfillBatch",
    o_prebackfill_tip: "L'action Apex s'est exécutée avant le déploiement : la classe n'existe qu'une fois les metadata déployées. Déclarez-la After Metadata Deployment.",
    o_prerefdata: "{Crew_Capacity__c} is missing in the Target",
    o_prerefdata_tip: "L'import de données s'est exécuté avant le déploiement de l'objet qu'il remplit. Déclarez-le après le déploiement.",
    o_preschedule: "Invalid type: CrewCapacityBatch",
    o_preschedule_tip: "Le batch a été planifié avant le déploiement de sa classe. Déclarez-le après le déploiement, après les données qu'il lit.",
    o_latemanual: "Set Email Deliverability to All Email a été déclarée après le déploiement",
    o_latemanual_tip: "Une étape manuelle qui doit se faire avec l'org telle qu'elle était va en Before Metadata Deployment.",
    o_lateorder: "Le batch est planifié avant le chargement de ses données de référence",
    o_lateorder_tip: "Chargez d'abord les données de référence, puis planifiez le batch qui les lit.",
    p_log: "Lire le log de déploiement : ce qui était caché apparaît",
    p_quick: "Quick Deploy : la validation a déjà exécuté les tests",
    p_retry: "Retry : un essai de plus",
    p_empty: "Exit code 0 (SUCCESS). Pas un seul enregistrement écrit.",
    item_field: "Panels_Required__c",
    item_layout: "Installation Layout",
    item_permset: "Helios_Delivery_Crew",
    item_flow: "Installation_Crew_Warning",
    greenLie: "Déploiement réussi. Tous les contrôles sont passés.",
    greenLieTwist: "30 installations ne peuvent plus être enregistrées",
    backfillRuns: "Crew size backfill started, batch job ...",
    backfillMissing: "Pas de backfill déclaré : évitez les enregistrements que personne ne peut sauver",
    refdataRuns: "Load crew capacity reference data : 12 enregistrements",
    scheduleRuns: "Schedule the nightly crew capacity recalculation : 0 0 2 * * ?",
    fogComes: "Le log mentionne une ligne de .forceignore. Quelque chose est caché devant.",
    romainFog: "# My scratch test fields, never versioned. Ce joker était le mien, désolé.",
    failBanner: "US-062: System.QueryException: List has no rows for assignment to SObject",
    doorRetry: "Retry",
    doorFix: "La déplacer dans une Pull Request de correction",
    doorRerun: "Relancer le job GitHub",
    doorRerunTip: "Relancer le job redéploie tout. Une action en échec a ses propres sorties : Retry, une Pull Request de correction, ou Mark as done.",
    mariiaFail: "Les deux autres actions attendent celle-là. Relancez-la, ou corrigez la faute dans une nouvelle Pull Request : CrewCapacityBach.",
    arrived: "US-014 est en integration, et ça marche."
  }
};

/** The strings taken word for word from the labs, checked by scripts/verify/check-easter-egg.mjs. */
export const QUOTES = [
  { lab: "1.6", text: "No authentication found for org integration" },
  { lab: "2.3", text: "We hit a snag" },
  { lab: "2.3", text: "Invalid type: CrewSizeBackfillBatch" },
  { lab: "2.3", text: "Crew size backfill started" },
  { lab: "2.4", text: "Exit code 0 (SUCCESS)" },
  { lab: "2.4", text: "is missing in the Target" },
  { lab: "2.4", text: "Mark as done" },
  { lab: "2.4", text: "1 to do by hand" },
  { lab: "3.3", text: "List has no rows for assignment to SObject" },
  { lab: "3.3", text: "CrewCapacityBach" },
  { lab: "3.3", text: "My scratch test fields, never versioned" },
  { lab: "3.3", text: "Deployment mode: FULL + Quick Deploy" },
  { lab: "3.3", text: "Crew_W*.field-meta.xml" }
];

export function createWorld(ctx) {
  const { t, hud } = ctx;
  const verdict = ctx.judgePlan();
  const plan = ctx.plan;
  let finished = false;
  let fogDone = false;
  let clearRecordsAt = Infinity;

  const ob = (move, key, theme, detail, extra) => Object.assign({ move, title: "o_" + key, tip: "o_" + key + "_tip", theme: theme || "error", detail }, extra);
  const config = {
    sections: [
      { name: t("s0"), color: 0xdd7a01, length: PRE_LENGTH, speed: 9.5, obstacles: ["auth"], items: ["field", "layout"], powers: [] },
      { name: t("s1"), color: 0x0176d3, length: DEPLOY_LENGTH, speed: 11, obstacles: ["xref", "lock", "auth"], items: ["field", "layout", "permset", "flow"], powers: ["quick", "retry"], doubles: 0.3 },
      { name: t("s2"), color: 0x2e844a, length: POST_LENGTH, speed: 11.5, obstacles: ["xref"], items: ["permset", "flow"], powers: ["retry"], doubles: 0.2 }
    ],
    spacing: [11, 18],
    obstacles: {
      auth: ob("jump", "auth", "lock", "SFDX_AUTH_URL_INTEGRATION"),
      forceignore: ob("lane", "forceignore", "warning", "**/fields/Crew_W*.field-meta.xml", { hidden: true }),
      xref: ob("duck", "xref", "error", "Installation__c.Panels_Required__c"),
      lock: ob("lane", "lock", "lock", "package-no-overwrite"),
      record: ob("lane", "record", "error", "INST-000.. Crew Size"),
      prebackfill: ob("lane", "prebackfill", "error", "Before Metadata Deployment"),
      prerefdata: ob("jump", "prerefdata", "warning", "SFDMU"),
      preschedule: ob("duck", "preschedule", "error", "Schedule Batch"),
      latemanual: ob("lane", "latemanual", "warning", "manual"),
      lateorder: ob("duck", "lateorder", "warning", "0 0 2 * * ?")
    },
    items: {
      field: { glyph: "gear", color: "#0176D3", label: t("item_field"), points: 10 },
      layout: { glyph: "log", color: "#06A59A", label: t("item_layout"), points: 10 },
      permset: { glyph: "permset", color: "#DD7A01", label: t("item_permset"), points: 10 },
      flow: { glyph: "flow", color: "#9050E9", label: t("item_flow"), points: 10 },
      note: { glyph: "note", color: "#F2C94C", label: "?", points: 0 }
    },
    powers: {
      log: { glyph: "log", color: "#032D60", label: "Deployment log", effect: "reveal", toast: "p_log" },
      quick: { glyph: "bolt", color: "#9050E9", label: "Quick Deploy", effect: "quick", seconds: 4, toast: "p_quick" },
      retry: { glyph: "loop", color: "#2E844A", label: "Retry", effect: "attempt", toast: "p_retry" },
      empty: { glyph: "empty", color: "#706E6B", label: "SFDMU", effect: "empty", toast: "p_empty" }
    },
    gates(index) {
      // The manual pre-deployment action, when it was declared before the deployment
      if (index === 0 && verdict.deliverability.ok) {
        return { type: "stop", header: t("stopHeader"), title: "Set Email Deliverability to All Email", hint: t("stopHint"), button: t("stopButton") };
      }
      return null;
    },
    script: buildScript()
  };

  function buildScript() {
    const s = [];
    const preBase = 40;
    // Actions declared before the deployment: the post ones fail there, with their real errors
    let at = preBase;
    for (const id of (plan && plan.pre) || []) {
      const kind = { backfill: "prebackfill", refdata: "prerefdata", schedule: "preschedule" }[id];
      if (kind) {
        s.push({ at, spawnObstacle: kind });
        at += 30;
      }
    }
    s.push({ at: 5, tick: "Deployment mode: FULL + Quick Deploy" });
    s.push({ at: PRE_LENGTH + 10, tick: "Deploying metadata..." });
    // The .forceignore fog, in the middle of the deployment
    s.push({ at: PRE_LENGTH + 90, fog: true });
    s.push({ at: PRE_LENGTH + DEPLOY_LENGTH - 30, unfog: true });
    s.push({ at: PRE_LENGTH + DEPLOY_LENGTH - 5, tick: "Components: 61 deployed" });
    // The green lie, as soon as the deployment ends
    s.push({ at: PRE_LENGTH + DEPLOY_LENGTH + 5, greenLie: true });
    s.push({ at: PRE_LENGTH + DEPLOY_LENGTH + 15, tick: "Listing Post-deployment actions" });
    // The failed action of US-062, late in the post-deployment
    s.push({ at: PRE_LENGTH + DEPLOY_LENGTH + 200, failedAction: true });
    return s;
  }

  const runner = createRunner(ctx, config);
  // How many declared actions fail on this track: the check reads it
  ctx.setData("misplaced", Object.values(verdict).filter((v) => !v.ok).length);

  /** The set pieces, spawned ahead of the guinea pig when their moment comes. */
  function onScript(step) {
    const ahead = 70;
    if (step.tick) {
      hud.tick(step.tick);
    }
    if (step.spawnObstacle) {
      runner.spawnObstacle(step.spawnObstacle, Math.floor(ctx.random() * 3), step.at + ahead);
    }
    if (step.fog) {
      hud.toast(t("fogComes"), "bad");
      hud.tick("**/objects/Installation__c/fields/Crew_W*.field-meta.xml");
      runner.setFog(true);
      const start = step.at + 40;
      for (let i = 0; i < 6; i++) {
        runner.spawnObstacle("forceignore", (i * 2 + 1) % 3, start + i * 26);
      }
      runner.spawnPower("log", 1, step.at + 25);
      // Victor's note waits in the fog, between two hidden walls
      runner.spawnItem("note", 0, start + 2 * 26 + 12, 0.85);
      hud.chat("romain", t("romainFog"), 6000);
    }
    if (step.unfog && !fogDone) {
      fogDone = true;
      runner.setFog(false);
    }
    if (step.greenLie) {
      hud.toast(t("greenLie"), "good");
      runner.spawnSign(t("greenLie"), step.at + 30, -1, "plain");
      postActions(step.at);
    }
    if (step.failedAction) {
      hud.tick(t("failBanner"));
      hud.chat("mariia", t("mariiaFail"), 6000);
      const lanes = [0, 1, 2].sort(() => ctx.random() - 0.5);
      const doors = [];
      doors[lanes[0]] = { text: t("doorRetry"), ok: true, look: "quiz" };
      doors[lanes[1]] = { text: t("doorFix"), ok: true, look: "quiz" };
      doors[lanes[2]] = { text: t("doorRerun"), ok: false, look: "trap", tip: t("doorRerunTip") };
      runner.spawnGate({ doors, banner: t("failBanner"), quiz: true }, step.at + ahead);
    }
  }

  /** What the declared post-deployment actions do, in the order they were declared. */
  function postActions(at) {
    let next = at + 40;
    const post = (plan && plan.post) || ["backfill", "refdata", "schedule"];
    // The 30 installations nobody can save: the backfill clears them, if it runs
    const backfillOk = verdict.backfill.ok;
    if (backfillOk) {
      runner.spawnSign(t("backfillRuns"), at + 45, 1, "log");
    } else {
      ctx.setData("boss", "records");
      hud.chat("mariia", t("backfillMissing"), 5000);
    }
    hud.toast(t("greenLieTwist"), "bad");
    for (let row = 0; row < 6; row++) {
      for (const lane of row % 2 === 0 ? [0, 2] : [1]) {
        runner.spawnObstacle("record", lane, at + 70 + row * 16);
      }
    }
    if (backfillOk) {
      // The backfill runs just before the guinea pig reaches them: they vanish
      clearRecordsAt = at + 50;
    }
    next = at + 180;
    if (!verdict.deliverability.ok && !((plan && plan.pre) || []).includes("deliverability")) {
      runner.spawnObstacle("latemanual", 1, next);
      next += 25;
    }
    if (post.includes("refdata")) {
      if (verdict.refdata.ok) {
        runner.spawnSign(t("refdataRuns"), next, -1, "log");
      } else {
        runner.spawnPower("empty", 1, next);
      }
      next += 20;
    }
    if (post.includes("schedule")) {
      if (verdict.schedule.ok) {
        runner.spawnSign(t("scheduleRuns"), next, 1, "log");
      } else {
        runner.spawnObstacle("lateorder", 0, next);
      }
    }
  }

  function onEvent(event) {
    switch (event.type) {
      case "script":
        onScript(event.step);
        return;
      case "stop":
        hud.toast(t("stopHeader"), "bad");
        ctx.sound.play("gate");
        return;
      case "item":
        if (event.kind === "note") {
          ctx.foundNote();
          return;
        }
        runner.handle(event);
        return;
      case "end":
        finished = true;
        hud.toast(t("arrived"), "good");
        ctx.finish(150);
        return;
      default:
        runner.handle(event);
    }
  }

  return {
    start() {
      hud.tick("Listing Pre-deployment actions");
    },
    update(dt, time) {
      if (finished) {
        return;
      }
      const events = runner.update(dt, time);
      for (const event of events) {
        onEvent(event);
        if (!ctx.playing) {
          return;
        }
      }
      if (runner.distance >= clearRecordsAt) {
        clearRecordsAt = Infinity;
        runner.clearAhead(140);
        ctx.sound.play("power");
        hud.toast(t("backfillRuns"), "power");
        ctx.setData("boss", "backfilled");
      }
      ctx.setData("stopped", runner.stopped ? "yes" : "no");
    },
    action(name) {
      if (runner.action(name) === "release") {
        runner.release();
        ctx.collect(150, t("stopDone"));
      }
    },
    dispose() {
      runner.setFog(false);
      runner.dispose();
    }
  };
}
