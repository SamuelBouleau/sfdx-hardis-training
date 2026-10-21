/*
 * World 7, Promote to uat and preprod (Labs 3.5 and 3.10): a runner up the
 * pipeline, carrying the release.
 *
 * In uat (Lab 3.5): the merge method doors, where squash empties the release
 * notes; the package-no-overwrite shield that keeps UAT's warehouse endpoint;
 * the Pull Requests and tickets of the release notes to collect.
 * In preprod (Lab 3.10): five stories in uat, three approved. The guinea pig
 * builds a promotion branch with the three approved ones only, then meets the
 * cherry-pick of US-059 that conflicts, because it was written on top of
 * US-058, which preprod never saw.
 */
import { createRunner } from "./runner.js";

export const PADS = ["left", "right", "jump", "duck", "confirm"];

const UAT_LENGTH = 400;
const PREPROD_LENGTH = 420;
const APPROVED = ["us057", "us059", "us061"];
const NOT_APPROVED = ["us058", "us060"];
const STORY_LABELS = { us057: "US-057", us058: "US-058", us059: "US-059", us060: "US-060", us061: "US-061" };

export const TEXTS = {
  en: {
    intro: "Integration is green: now the release climbs. Promote it to uat with the right merge method and keep its release notes full, then build a promotion branch to preprod with only the approved stories. The release is Thursday and the date does not move.",
    note: "Preview Upcoming Promotion Notes: the one to use on a Wednesday, when somebody asks what Thursday's release will contain. I never found it. - V.",
    s0: "uat",
    s1: "preprod",
    notes: "Promotion Notes - uat: Pull Requests {{prs}}, Tickets {{tickets}}",
    mergeBanner: "Merge the promotion into uat:",
    doorSquash: "Squash and merge",
    doorMergeCommit: "Create a merge commit",
    doorRebase: "Rebase and merge",
    squashTip: "Use the arrow beside the green button and pick Create a merge commit: the release notes, the retrofit and the next promotion need every commit.",
    notesEmptied: "Squashed: the release notes are empty",
    o_warehouse: "Helios_Warehouse would point UAT at production",
    o_warehouse_tip: "Add RemoteSiteSetting Helios_Warehouse to manifest/package-no-overwrite.xml: present means protected.",
    o_token: "Release notes: no git provider token",
    o_token_tip: "Without a token the release notes do not stop: they warn, collect zero Pull Requests, and write a perfectly formatted empty document.",
    o_markers: "Cannot merge into preprod: Git conflict markers in the promotion branch",
    o_markers_tip: "Nothing was deployed. Solve the markers on the promotion branch, commit, push.",
    o_lateuat: "In uat: 1 to do by hand",
    o_lateuat_tip: "The manual step runs once in every org: do it in helios-uat, mark it as done, then re-run the jobs.",
    p_shield: "package-no-overwrite: Helios_Warehouse skipped, protected",
    p_preview: "Preview Upcoming Promotion Notes",
    p_retry: "Re-run all jobs: one more attempt",
    item_pr: "Pull Request",
    item_ticket: "Ticket",
    item_us: "{{id}} approved",
    stopTitle: "Set Email Deliverability to All Email",
    stopHeader: "In uat: 1 to do by hand",
    stopHint: "The manual action runs in every org: do it in helios-uat too.",
    stopButton: "Mark as done (Enter)",
    stopDone: "Done in uat too: the promotion goes on",
    promoBanner: "Five stories in uat, three approved. Release Thursday.",
    doorAll: "Promote everything to preprod",
    doorAllTip: "The ordinary promotion is all or nothing: it would take US-058 and US-060, which nobody approved.",
    doorBranch: "Create a promotion branch: US-057, US-059, US-061",
    doorWait: "Wait until every story is approved",
    doorWaitTip: "The release is Thursday and the date does not move: the warehouse cutover depends on it.",
    notApproved: "{{id}} is not approved: it stays in uat",
    notApprovedTip: "Only the approved stories go into the promotion branch. The others wait in uat for the next one.",
    carried: "{{id}} on the promotion branch",
    pickBanner: "Cherry-pick of US-059: conflict in the Panel Batch layout and Helios_Delivery_Manager",
    doorKeep: "Keep the Supplier entry, leave Warranty Years out",
    doorTake: "Take Warranty_Years__c in too",
    doorTakeTip: "preprod has no Warranty_Years__c field: a layout or permission set naming it fails to deploy. It came from US-058, which preprod never saw.",
    doorDrop: "Leave US-059 out of the promotion",
    doorDropTip: "US-059 is approved: dropping it makes the promotion lie about the week. The conflict is git being exact, not git being difficult.",
    mariiaSquash: "GitHub remembers the last merge method. Look at the arrow before you click.",
    romainWarehouse: "package-no-overwrite: present means protected. UAT keeps pointing at warehouse-test.helios.invalid.",
    us061Line: "US-061, approved: the gate code on the installation, so that I get in without phoning the customer at seven in the morning.",
    arrived: "preprod is ready for Thursday: three stories, and notes that say why.",
    shortNotes: "Release notes thin: collect the Pull Requests and tickets",
    shortNotesInfo: "The Promotion Notes listed {{n}} Pull Requests and tickets out of 20 or more. A release manager reads them before every promotion: what is missing there is what nobody checks."
  },
  fr: {
    intro: "Integration est au vert : la release monte. Promouvez-la en uat avec la bonne méthode de merge en gardant ses notes de release pleines, puis construisez une branch de promotion vers preprod avec seulement les stories approuvées. La release est jeudi et la date ne bouge pas.",
    note: "Preview Upcoming Promotion Notes : celle à utiliser le mercredi, quand quelqu'un demande ce que contiendra la release du jeudi. Je ne l'ai jamais trouvée. - V.",
    s0: "uat",
    s1: "preprod",
    notes: "Promotion Notes - uat : Pull Requests {{prs}}, Tickets {{tickets}}",
    mergeBanner: "Merger la promotion dans uat :",
    doorSquash: "Squash and merge",
    doorMergeCommit: "Create a merge commit",
    doorRebase: "Rebase and merge",
    squashTip: "Utilisez la flèche à côté du bouton vert et choisissez Create a merge commit : les notes de release, le retrofit et la promotion suivante ont besoin de chaque commit.",
    notesEmptied: "Squashée : les notes de release sont vides",
    o_warehouse: "Helios_Warehouse pointerait UAT vers la production",
    o_warehouse_tip: "Ajoutez RemoteSiteSetting Helios_Warehouse à manifest/package-no-overwrite.xml : présent veut dire protégé.",
    o_token: "Notes de release : pas de token du git provider",
    o_token_tip: "Sans token, les notes de release ne s'arrêtent pas : elles avertissent, ne récupèrent aucune Pull Request, et écrivent un document vide parfaitement formaté.",
    o_markers: "Cannot merge into preprod : marqueurs de conflit Git dans la branch de promotion",
    o_markers_tip: "Rien n'a été déployé. Résolvez les marqueurs sur la branch de promotion, commitez, poussez.",
    o_lateuat: "In uat: 1 to do by hand",
    o_lateuat_tip: "L'étape manuelle s'exécute une fois dans chaque org : faites-la dans helios-uat, marquez-la comme faite, puis relancez les jobs.",
    p_shield: "package-no-overwrite : Helios_Warehouse ignoré, protégé",
    p_preview: "Preview Upcoming Promotion Notes",
    p_retry: "Re-run all jobs : un essai de plus",
    item_pr: "Pull Request",
    item_ticket: "Ticket",
    item_us: "{{id}} approuvée",
    stopTitle: "Set Email Deliverability to All Email",
    stopHeader: "In uat: 1 to do by hand",
    stopHint: "L'action manuelle s'exécute dans chaque org : faites-la aussi dans helios-uat.",
    stopButton: "Mark as done (Entrée)",
    stopDone: "Faite en uat aussi : la promotion continue",
    promoBanner: "Cinq stories en uat, trois approuvées. Release jeudi.",
    doorAll: "Tout promouvoir en preprod",
    doorAllTip: "La promotion ordinaire, c'est tout ou rien : elle prendrait US-058 et US-060, que personne n'a approuvées.",
    doorBranch: "Créer une branch de promotion : US-057, US-059, US-061",
    doorWait: "Attendre que toutes les stories soient approuvées",
    doorWaitTip: "La release est jeudi et la date ne bouge pas : la bascule de l'entrepôt en dépend.",
    notApproved: "{{id}} n'est pas approuvée : elle reste en uat",
    notApprovedTip: "Seules les stories approuvées vont dans la branch de promotion. Les autres attendent la suivante en uat.",
    carried: "{{id}} sur la branch de promotion",
    pickBanner: "Cherry-pick de US-059 : conflit dans le layout Panel Batch et Helios_Delivery_Manager",
    doorKeep: "Garder l'entrée Supplier, laisser Warranty Years de côté",
    doorTake: "Prendre aussi Warranty_Years__c",
    doorTakeTip: "preprod n'a pas de champ Warranty_Years__c : un layout ou un permission set qui le nomme échoue au déploiement. Il venait de US-058, que preprod n'a jamais vue.",
    doorDrop: "Laisser US-059 hors de la promotion",
    doorDropTip: "US-059 est approuvée : l'écarter fait mentir la promotion sur la semaine. Le conflit, c'est git qui est exact, pas git qui est difficile.",
    mariiaSquash: "GitHub retient la dernière méthode de merge. Regardez la flèche avant de cliquer.",
    romainWarehouse: "package-no-overwrite : présent veut dire protégé. UAT continue de pointer vers warehouse-test.helios.invalid.",
    us061Line: "US-061, approuvée : le code du portail sur l'installation, pour entrer sans appeler le client à sept heures du matin.",
    arrived: "preprod est prête pour jeudi : trois stories, et des notes qui disent pourquoi.",
    shortNotes: "Notes de release maigres : récupérez les Pull Requests et les tickets",
    shortNotesInfo: "Les Promotion Notes listaient {{n}} Pull Requests et tickets sur 20 ou plus. Un release manager les lit avant chaque promotion : ce qui y manque, personne ne le vérifie."
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
  { lab: "3.10", text: "US-061" },
];

export function createWorld(ctx) {
  const { t, hud } = ctx;
  const verdict = ctx.judgePlan();
  let finished = false;
  let prs = 0;
  let tickets = 0;
  const carried = [];

  const ob = (move, key, theme, detail) => ({ move, title: "o_" + key, tip: "o_" + key + "_tip", theme: theme || "error", detail });
  const storyItem = (id) => ({ glyph: "note", color: APPROVED.includes(id) ? "#2E844A" : "#706E6B", label: STORY_LABELS[id], points: 0 });

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
      shield: { glyph: "shield", color: "#032D60", label: "no-overwrite", effect: "shield", seconds: 6, toast: "p_shield" },
      preview: { glyph: "eye", color: "#9050E9", label: "Preview", effect: "custom" },
      retry: { glyph: "loop", color: "#2E844A", label: "Re-run all jobs", effect: "attempt", toast: "p_retry" }
    },
    gates(index) {
      if (index === 0) {
        return quiz(t("promoBanner"), [
          { text: t("doorBranch"), ok: true },
          { text: t("doorAll"), tip: t("doorAllTip") },
          { text: t("doorWait"), tip: t("doorWaitTip") }
        ]);
      }
      return null;
    },
    script: [
      { at: 10, mergeDoors: true },
      { at: 120, manual: true },
      { at: 200, preview: true },
      { at: UAT_LENGTH + 30, stories: true },
      { at: UAT_LENGTH + 230, cherryPick: true },
      { at: UAT_LENGTH + 300, note: true }
    ]
  };

  function quiz(banner, answers) {
    const lanes = [0, 1, 2].sort(() => ctx.random() - 0.5);
    const doors = [];
    answers.forEach((answer, i) => {
      doors[lanes[i]] = Object.assign({ look: answer.ok ? "quiz" : "quiz", ok: Boolean(answer.ok) }, answer);
    });
    return { doors, banner, quiz: true };
  }

  const runner = createRunner(ctx, config);

  // The release notes counter, under the top bar
  const counter = document.createElement("div");
  counter.className = "gr-w7-notes";
  hud.extra.appendChild(counter);
  function renderNotes() {
    counter.textContent = t("notes", { prs, tickets });
    ctx.setData("notes", prs + tickets);
    ctx.setData("carried", carried.length);
  }
  renderNotes();

  function onScript(step) {
    const ahead = 70;
    if (step.mergeDoors) {
      hud.chat("mariia", t("mariiaSquash"), 5000);
      const spec = quiz(t("mergeBanner"), [
        { text: t("doorMergeCommit"), ok: true, mergeCommit: true },
        { text: t("doorSquash"), tip: t("squashTip"), squash: true },
        { text: t("doorRebase"), tip: t("squashTip"), squash: true }
      ]);
      runner.spawnGate(spec, step.at + ahead);
    }
    if (step.manual) {
      // The manual action runs once in every org: uat too
      if (verdict.deliverability.ok) {
        runner.spawnStop({ header: t("stopHeader"), title: t("stopTitle"), hint: t("stopHint"), button: t("stopButton") }, step.at + ahead);
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
    }
    if (step.cherryPick) {
      const spec = quiz(t("pickBanner"), [
        { text: t("doorKeep"), ok: true },
        { text: t("doorTake"), tip: t("doorTakeTip") },
        { text: t("doorDrop"), tip: t("doorDropTip") }
      ]);
      runner.spawnGate(spec, step.at + ahead);
    }
    if (step.note) {
      runner.spawnObstacle("token", 2, step.at + ahead);
      runner.spawnItem("note", 2, step.at + ahead, 2.1);
    }
  }

  function onEvent(event) {
    switch (event.type) {
      case "script":
        onScript(event.step);
        return;
      case "stop":
        ctx.sound.play("gate");
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
          return;
        }
        if (APPROVED.includes(event.kind)) {
          carried.push(event.kind);
          ctx.pig.setRiders(carried.map((id) => ctx.paint.tile(id, "#2E844A", "note")));
          ctx.collect(100, t("carried", { id: STORY_LABELS[event.kind] }));
          renderNotes();
          return;
        }
        if (NOT_APPROVED.includes(event.kind)) {
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
          return;
        }
        runner.handle(event);
        return;
      case "gate":
        if (!event.ok && event.door.squash) {
          // Squash takes the history away: the release notes have nothing to read
          prs = 0;
          tickets = 0;
          renderNotes();
          hud.toast(t("notesEmptied"), "bad");
        }
        runner.handle(event);
        return;
      case "end": {
        finished = true;
        const full = prs + tickets;
        hud.toast(full >= 20 ? t("arrived") : t("shortNotes"), full >= 20 ? "good" : "bad");
        // Full notes and every approved story are worth a bonus
        ctx.finish(full * 5 + carried.length * 50, full >= 20 ? "" : t("shortNotesInfo", { n: full }));
        return;
      }
      default:
        runner.handle(event);
    }
  }

  return {
    start() {},
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
    },
    action(name) {
      if (runner.action(name) === "release") {
        runner.release();
        ctx.collect(150, t("stopDone"));
      }
    },
    dispose() {
      runner.dispose();
      counter.remove();
      ctx.pig.setRiders([]);
    }
  };
}

export const CSS = `
.guinea-run .gr-w7-notes {
  padding: 3px 10px;
  border: 1px solid #c9c9c9;
  border-left: 4px solid #9050e9;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.95);
  color: #181818;
  font-size: 12px;
  font-weight: 700;
  pointer-events: none;
}
`;
