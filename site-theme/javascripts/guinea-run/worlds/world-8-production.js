/*
 * World 8, Release to production (Lab 3.6): the last runner. main, then the
 * production deployment itself, with Quick Deploy: the validation already ran
 * the tests, so the deployment does not run them again.
 *
 * The finale is the DORA card of Lab 3.6, with the lab's own numbers, and two
 * questions about what they really say: which lead time to quote, and how far
 * one red job moves a failure rate built on one deployment.
 */
import { createRunner } from "./runner.js";

export const PADS = ["left", "right", "jump", "duck", "confirm"];

const MAIN_LENGTH = 330;
const PROD_LENGTH = 260;

export const TEXTS = {
  en: {
    intro: "UAT signed off. The release goes to production this evening. If you get it wrong, real people cannot do their jobs tomorrow. Deploy through main to production, then read what your DORA metrics say.",
    note: "The rating is about the period, not about you. I wish someone had told me that on my first release. - V.",
    s0: "main",
    s1: "production",
    stopHeader: "In main: 1 to do by hand",
    stopTitle: "Set Email Deliverability to All Email",
    stopHint: "The last org that needs the click: production.",
    stopButton: "Mark as done (Enter)",
    stopDone: "Done in production: the deployment starts",
    o_deleted: "Metadata: 1 deleted, that nobody asked for",
    o_deleted_tip: "Stop. Find in destructiveChanges.xml and the diff what goes, and who intended it.",
    o_drift: "Fails in production, worked in preprod",
    o_drift_tip: "Production drifted: an extra validation rule, a record type, real data. Keep preprod close to production.",
    o_half: "The deployment half-succeeded",
    o_half_tip: "Deployments are atomic: a post-deployment action failed. Re-run the action, not the deployment.",
    o_latemain: "In main: the manual step was never done here",
    o_latemain_tip: "The manual action runs once in every org, production included: mark it as done, then re-run the jobs.",
    p_quick: "Quick Deploy. Apex tests: Already run during the validation",
    p_retry: "Re-run all jobs: one more attempt",
    item_story: "User Story",
    item_dora: "Deployment",
    doraTitle: "DORA metrics",
    doraPeriod: "main, Last 90 days",
    q1: "Your manager asks for your lead time. You quote:",
    q1a: "5.7 d: the Lead time (median), per User Story",
    q1b: "0.1 d: the Pull Requests of this branch alone",
    q1c: "No data",
    q1bTip: "Flattering and wrong: the User Stories waited days before that last Pull Request. Quote the per-story lead time, 5.7 d.",
    q1cTip: "No data is the honest answer for Recovery, when nothing failed. The lead time has data: 5.7 d.",
    q1Ok: "Days, not weeks: long means work is sitting somewhere.",
    q2: "One deployment so far, 0 % failure rate. One red job next week, and the failure rate reads:",
    q2a: "50 %",
    q2b: "10 %",
    q2c: "Still 0 %, a red job is not a failure",
    q2bTip: "With one deployment, small numbers move in big steps: one red job out of two is 50 %.",
    q2cTip: "A red deployment job is exactly what the failure rate counts.",
    q2Ok: "Small numbers move in big steps. The rating is about the period, not about you.",
    choose: "Up and down choose, Enter answers. Or tap.",
    shipped: "You have shipped once, and the DORA tab says exactly that."
  },
  fr: {
    intro: "La recette UAT est validée. La release part en production ce soir. Si vous vous trompez, de vraies personnes ne pourront pas travailler demain. Déployez de main jusqu'en production, puis lisez ce que disent vos métriques DORA.",
    note: "La note porte sur la période, pas sur vous. J'aurais aimé qu'on me le dise à ma première release. - V.",
    s0: "main",
    s1: "production",
    stopHeader: "In main: 1 to do by hand",
    stopTitle: "Set Email Deliverability to All Email",
    stopHint: "La dernière org qui a besoin du clic : la production.",
    stopButton: "Mark as done (Entrée)",
    stopDone: "Fait en production : le déploiement démarre",
    o_deleted: "Metadata : 1 supprimé, que personne n'a demandé",
    o_deleted_tip: "Arrêtez-vous. Cherchez dans destructiveChanges.xml et le diff ce qui part, et qui l'a voulu.",
    o_drift: "Échoue en production, marchait en preprod",
    o_drift_tip: "La production a dérivé : une règle de validation en plus, un type d'enregistrement, de vraies données. Gardez preprod proche de la production.",
    o_half: "Le déploiement a réussi à moitié",
    o_half_tip: "Les déploiements sont atomiques : une action post-deployment a échoué. Relancez l'action, pas le déploiement.",
    o_latemain: "In main : l'étape manuelle n'a jamais été faite ici",
    o_latemain_tip: "L'action manuelle s'exécute une fois dans chaque org, production comprise : marquez-la comme faite, puis relancez les jobs.",
    p_quick: "Quick Deploy. Apex tests: Already run during the validation",
    p_retry: "Re-run all jobs : un essai de plus",
    item_story: "User Story",
    item_dora: "Déploiement",
    doraTitle: "Métriques DORA",
    doraPeriod: "main, Last 90 days",
    q1: "Votre manager demande votre lead time. Vous annoncez :",
    q1a: "5.7 d : le Lead time (median), par User Story",
    q1b: "0.1 d : les Pull Requests de cette branch seule",
    q1c: "No data",
    q1bTip: "Flatteur et faux : les User Stories ont attendu des jours avant cette dernière Pull Request. Annoncez le lead time par story, 5.7 d.",
    q1cTip: "No data est la réponse honnête pour Recovery, quand rien n'a échoué. Le lead time a des données : 5.7 d.",
    q1Ok: "Des jours, pas des semaines : long veut dire que du travail attend quelque part.",
    q2: "Un seul déploiement jusqu'ici, 0 % de failure rate. Un job rouge la semaine prochaine, et le failure rate affiche :",
    q2a: "50 %",
    q2b: "10 %",
    q2c: "Toujours 0 %, un job rouge n'est pas un échec",
    q2bTip: "Avec un seul déploiement, les petits nombres bougent par grands pas : un job rouge sur deux, c'est 50 %.",
    q2cTip: "Un job de déploiement rouge, c'est exactement ce que compte le failure rate.",
    q2Ok: "Les petits nombres bougent par grands pas. La note porte sur la période, pas sur vous.",
    choose: "Haut et bas choisissent, Entrée répond. Ou touchez.",
    shipped: "Vous avez livré une fois, et l'onglet DORA dit exactement ça."
  }
};

/** The strings taken word for word from the labs, checked by scripts/verify/check-easter-egg.mjs. */
export const QUOTES = [
  { lab: "1.6", text: "Already run during the validation" },
  { lab: "2.8", text: "destructiveChanges.xml" },
  { lab: "3.6", text: "Deployments per week" },
  { lab: "3.6", text: "Lead time" },
  { lab: "3.6", text: "Failure rate" },
  { lab: "3.6", text: "Recovery" },
  { lab: "3.6", text: "Rework" },
  { lab: "3.6", text: "No data" },
  { lab: "3.6", text: "5.7 d" },
  { lab: "3.6", text: "0.1 d" },
  { lab: "3.6", text: "50 %" }
];

// The numbers of the DORA card in Lab 3.6
const DORA = [
  { metric: "Deployments per week", value: "0.1 / week", rating: "Low" },
  { metric: "Lead time (median)", value: "5.7 d", rating: "High" },
  { metric: "Failure rate", value: "0 %", rating: "Elite" },
  { metric: "Recovery (median)", value: "No data", rating: "" },
  { metric: "Rework", value: "0 %", rating: "Elite" }
];
const RATING_COLORS = { Elite: "#2E844A", High: "#0176D3", Medium: "#DD7A01", Low: "#BA0517", "": "#706E6B" };

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
  const { t, hud } = ctx;
  const verdict = ctx.judgePlan();
  let phase = "run";
  let finished = false;
  let card = null;
  let quiz = null;

  const ob = (move, key, theme, detail) => ({ move, title: "o_" + key, tip: "o_" + key + "_tip", theme: theme || "error", detail });
  const config = {
    sections: [
      { name: t("s0"), color: 0xba0517, length: MAIN_LENGTH, speed: 12, obstacles: ["deleted", "drift"], items: ["story", "dora"], powers: ["retry"], doubles: 0.35 },
      { name: t("s1"), color: 0x032d60, length: PROD_LENGTH, speed: 13.5, obstacles: ["drift", "half", "deleted"], items: ["story", "dora"], powers: ["quick", "retry"], doubles: 0.4 }
    ],
    spacing: [11, 17],
    obstacles: {
      deleted: ob("duck", "deleted", "warning", "destructiveChanges.xml"),
      drift: ob("lane", "drift", "error", "Validation rule"),
      half: ob("jump", "half", "warning", "post-deployment"),
      latemain: ob("lane", "latemain", "warning", "manual")
    },
    items: {
      story: { glyph: "note", color: "#0176D3", label: t("item_story"), points: 10 },
      dora: { glyph: "star", color: "#2E844A", label: t("item_dora"), points: 10 },
      note: { glyph: "note", color: "#F2C94C", label: "?", points: 0 }
    },
    powers: {
      quick: { glyph: "bolt", color: "#9050E9", label: "Quick Deploy", effect: "quick", seconds: 6, toast: "p_quick" },
      retry: { glyph: "loop", color: "#2E844A", label: "Re-run all jobs", effect: "attempt", toast: "p_retry" }
    },
    gates(index) {
      if (index === 0) {
        // The production gate: the Path from feature to production, all done but the last
        return {
          doors: [
            { text: "production", ok: true, look: "open" },
            { text: "production", ok: true, look: "open" },
            { text: "production", ok: true, look: "open" }
          ],
          banner: ["feature", "integration", "uat", "preprod", "main", "production"],
          bannerIndex: 5
        };
      }
      return null;
    },
    script: [
      { at: 5, tick: "Deployment mode: FULL + Quick Deploy" },
      { at: 30, manual: true },
      { at: MAIN_LENGTH - 10, quick: true },
      { at: MAIN_LENGTH + 120, note: true }
    ]
  };

  const runner = createRunner(ctx, config);

  function onScript(step) {
    const ahead = 70;
    if (step.tick) {
      hud.tick(step.tick);
    }
    if (step.manual) {
      if (verdict.deliverability.ok) {
        runner.spawnStop({ header: t("stopHeader"), title: t("stopTitle"), hint: t("stopHint"), button: t("stopButton") }, step.at + ahead);
      } else {
        runner.spawnObstacle("latemain", 1, step.at + ahead);
      }
    }
    if (step.quick) {
      // Quick Deploy is never missed: one coin in every lane
      for (const lane of [0, 1, 2]) {
        runner.spawnPower("quick", lane, step.at + ahead);
      }
    }
    if (step.note) {
      runner.spawnObstacle("half", 0, step.at + ahead);
      runner.spawnItem("note", 0, step.at + ahead, 2.1);
    }
  }

  /* ---------- The DORA card ---------- */

  function showDora() {
    phase = "dora";
    ctx.setData("phase", "dora");
    card = el("div", "gr-w8-card gr-scroll", hud.layer);
    const head = el("div", "gr-w8-head", card);
    el("strong", "", head, t("doraTitle"));
    el("span", "", head, t("doraPeriod"));
    const grid = el("div", "gr-w8-grid", card);
    for (const row of DORA) {
      const cell = el("div", "gr-w8-metric", grid);
      el("span", "gr-w8-name", cell, row.metric);
      el("strong", "gr-w8-value", cell, row.value);
      if (row.rating) {
        const badge = el("span", "gr-w8-rating", cell, row.rating);
        badge.style.background = RATING_COLORS[row.rating];
      }
    }
    quiz = el("div", "gr-w8-quiz", card);
    ask(0);
  }

  const QUESTIONS = [
    { q: "q1", answers: [{ key: "q1a", ok: true }, { key: "q1b", tip: "q1bTip" }, { key: "q1c", tip: "q1cTip" }], lesson: "q1Ok" },
    { q: "q2", answers: [{ key: "q2a", ok: true }, { key: "q2b", tip: "q2bTip" }, { key: "q2c", tip: "q2cTip" }], lesson: "q2Ok" }
  ];
  let question = 0;
  let choice = 0;
  let buttons = [];

  function ask(index) {
    question = index;
    ctx.setData("question", index + 1);
    quiz.replaceChildren();
    const q = QUESTIONS[index];
    el("p", "gr-w8-question", quiz, t(q.q));
    el("p", "gr-w8-hint", quiz, t("choose"));
    const answers = q.answers.slice().sort(() => ctx.random() - 0.5);
    buttons = answers.map((answer, i) => {
      const button = el("button", "gr-w8-answer", quiz, t(answer.key));
      button.type = "button";
      button.addEventListener("click", () => {
        choice = i;
        answerWith(answer, button);
      });
      return button;
    });
    choice = 0;
    highlight();
  }

  function highlight() {
    buttons.forEach((b, i) => b.classList.toggle("is-chosen", i === choice));
  }

  function answerWith(answer, button) {
    if (!ctx.playing) {
      return;
    }
    const q = QUESTIONS[question];
    if (answer.ok) {
      ctx.sound.play("wheek");
      ctx.collect(250, t(q.lesson));
      if (question + 1 < QUESTIONS.length) {
        ask(question + 1);
      } else {
        finished = true;
        hud.toast(t("shipped"), "good");
        ctx.finish(300);
      }
    } else {
      button.disabled = true;
      button.classList.add("is-wrong");
      ctx.loseAttempt(t(answer.key), t(answer.tip));
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
        runner.handle(event);
        return;
      case "end":
        showDora();
        return;
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
      if (phase === "dora") {
        // The guinea pig waits on the track while the card is read
        ctx.pig.state = { running: false };
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
      if (phase === "dora") {
        if (name === "jump" || name === "left") {
          choice = (choice - 1 + buttons.length) % buttons.length;
          highlight();
        } else if (name === "duck" || name === "right") {
          choice = (choice + 1) % buttons.length;
          highlight();
        } else if (name === "confirm") {
          buttons[choice].click();
        }
        return;
      }
      if (runner.action(name) === "release") {
        runner.release();
        ctx.collect(150, t("stopDone"));
      }
    },
    dispose() {
      runner.dispose();
      if (card) {
        card.remove();
      }
    }
  };
}

export const CSS = `
.guinea-run .gr-w8-card {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(560px, calc(100vw - 24px));
  max-height: calc(100dvh - 140px);
  overflow-y: auto;
  overscroll-behavior: contain;
  transform: translate(-50%, -45%);
  border: 1px solid #c9c9c9;
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0 4px 30px rgba(3, 45, 96, 0.45);
  touch-action: pan-y;
  animation: gr-card-in 0.4s ease-out;
}
.guinea-run:not([data-state="playing"]) .gr-w8-card {
  visibility: hidden;
}
.guinea-run .gr-w8-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 10px 14px;
  border-bottom: 2px solid #c9c9c9;
}
.guinea-run .gr-w8-head strong {
  font-size: 18px;
}
.guinea-run .gr-w8-head span {
  color: #444444;
  font-size: 13px;
}
.guinea-run .gr-w8-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
  padding: 10px 14px;
}
.guinea-run .gr-w8-metric {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
  border: 1px solid #c9c9c9;
  border-radius: 4px;
}
.guinea-run .gr-w8-name {
  color: #444444;
  font-size: 12px;
}
.guinea-run .gr-w8-value {
  font-size: 20px;
}
.guinea-run .gr-w8-rating {
  align-self: flex-start;
  padding: 1px 8px;
  border-radius: 999px;
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
}
.guinea-run .gr-w8-quiz {
  padding: 4px 14px 14px;
}
.guinea-run .gr-w8-question {
  margin: 6px 0 2px;
  font-size: 15px;
  font-weight: 700;
}
.guinea-run .gr-w8-hint {
  margin: 0 0 8px;
  color: #444444;
  font-size: 12px;
}
.guinea-run .gr-w8-answer {
  display: block;
  width: 100%;
  min-height: 44px;
  margin: 6px 0;
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
.guinea-run .gr-w8-answer.is-chosen {
  border-color: #0176d3;
  box-shadow: 0 0 0 2px #0176d3;
}
.guinea-run .gr-w8-answer.is-wrong {
  border-color: #ea001e;
  background: #fef1ee;
  color: #ba0517;
  text-decoration: line-through;
}
`;
