/*
 * World 0, Get set up (Labs 1.1 and 1.2): a runner where the guinea pig
 * collects what a contributor installs on their first morning, then connects
 * the org, the Dev Hub and the fork, and opens the scratch org.
 *
 * The running gag of Lab 1.1: a tool you just installed stays "installed, not
 * found" in the Setup panel until VS Code is closed completely and opened
 * again, because VS Code only reads the PATH at startup. The gates at the end
 * of the first two sections are that restart, as a quiz.
 *
 * A missed install comes back down the track as a pending install, and what
 * is still missing at the end costs points, never the end of the world.
 *
 * The goal line always says what is next (the tools of the section, the
 * restart that is owed, the green door), and the coach teaches each new
 * thing the first time it comes.
 */
import { createRunner, RUNNER_TEXTS, RUNNER_CSS } from "./runner.js";

export const PADS = ["left", "right", "jump", "duck"];
// The Kenney packs the runner draws the track with
export const MODELS = ["platform", "nature"];

// What VS Code only sees after a restart
const NEEDS_RESTART = ["git", "node", "cli"];
const REQUIRED = ["git", "vscode", "node", "pack", "cli", "plugin", "org", "devhub", "fork"];
// The tools each section brings, for the goal line
const BY_SECTION = [
  ["git", "vscode", "node", "pack"],
  ["cli", "plugin"],
  ["org", "devhub", "fork"]
];
// Where each required item comes down the track, and in which lane
const PLACES = {
  git: [40, 1],
  vscode: [95, 0],
  node: [160, 2],
  pack: [230, 1],
  cli: [345, 0],
  plugin: [455, 2],
  org: [585, 1],
  devhub: [680, 0],
  fork: [770, 2]
};

export const TEXTS = {
  en: {
    ...RUNNER_TEXTS.en,
    intro: "Your first morning on a Salesforce team: install your tools, connect your org, open your scratch org. The Setup panel at the top turns green as you go.",
    how1: "Collect Git, VS Code, Node.js and the other tools",
    how2: "Arrows or swipe: change lane, Up to jump, Down to duck",
    how3: "Pick the right door, then the green one at the end",
    goal0: "Collect the 4 tools: {{n}} left",
    goal1: "Collect the Salesforce CLI and sfdx-hardis: {{n}} left",
    goal2: "Connect helios-prod, Dev Hub and your fork: {{n}} left",
    goalReady: "All collected: get ready for the door",
    goalDoor: "Read the question, steer into the right door",
    goalRestart: "Restart VS Code: grab the restart power-up",
    goalPortal: "Take the green door: Set up my training environment",
    coachStart: "Collect the tools! Left and Right to change lane",
    coachStartTouch: "Collect the tools! Swipe left or right",
    coachFound: "Installed, not found: see the orange card?",
    coachRestart: "Grab the restart power-up!",
    coachGreen: "Setup panel all green!",
    coachPortal: "Green door: Set up my training environment!",
    q0: "Git and Node.js are installed, but VS Code says they are missing. What do you do?",
    q1: "The Setup panel installed the Salesforce CLI, then says it is missing. What now?",
    q2: "Last card of the Setup panel: your training environment. Which door?",
    signQuiz: "Which door?",
    note: "Your first morning on any Salesforce team. Five things before anyone gives you a ticket. - V.",
    s0: "Install",
    s1: "Setup panel",
    s2: "Connect",
    panelTitle: "Setup panel",
    stateMissing: "missing",
    stateFound: "installed, not found",
    stateOk: "ready",
    o_path: "Installed, but VS Code does not see it",
    o_path_tip: "Close VS Code completely, windows and all, and open it again: VS Code only reads the PATH at startup.",
    o_path_s: "PATH",
    o_trust_s: "Trust?",
    o_gitbash_s: "No Git Bash",
    o_cli_s: "CLI missing",
    o_noext_s: "No extension",
    o_redline_s: "Red line",
    o_outdated_s: "Outdated",
    o_sandbox_s: "Wrong login",
    o_fork_s: "Fork failed",
    o_devhub_s: "Dev Hub off",
    o_threeorgs_s: "3 / 3 orgs",
    o_api_s: "API limit",
    p_pending_s: "Pending installs",
    p_reload_s: "Reload Window",
    p_vibes_s: "Agentforce Vibes",
    p_delete_s: "Delete org",
    p_restart_s: "Restart VS Code",
    g_restart_s: "Restart VS Code",
    g_keep_s: "Wait",
    g_terminal_s: "New terminal",
    g_again_s: "Run again",
    g_reinstall_s: "Reinstall CLI",
    g_setup_s: "Set up",
    g_recreate_s: "Recreate org",
    g_testlogin_s: "test.salesforce.com",
    o_trust: "Do you trust the publishers of these extensions?",
    o_trust_tip: "Answer Trust Publishers & Install, or the install stops.",
    o_gitbash: "Errors that look like nothing to do with Git",
    o_gitbash_tip: "Reinstall Git and keep every default, with the Git Bash components ticked.",
    o_cli: "The Setup panel says the Salesforce CLI is missing",
    o_cli_tip: "Close VS Code completely and open it again: the CLI landed on a PATH the open VS Code does not know yet.",
    o_noext: "The extension does not appear",
    o_noext_tip: "View > Command Palette, then Developer: Reload Window.",
    o_redline: "A red line you cannot clear",
    o_redline_tip: "Click the line: the panel says what it tried and what it got back, and that message is nearly always the answer.",
    o_outdated: "A panel does not look like its screenshot",
    o_outdated_tip: "Tick Auto Update on the extension pack: an outdated extension is the most common cause.",
    o_sandbox: "The login page refuses your username",
    o_sandbox_tip: "A Developer Edition is not a sandbox: log in through login.salesforce.com.",
    o_fork: "The fork could not be created",
    o_fork_tip: "Fork by hand and untick Copy the main branch only: the course needs every branch.",
    o_devhub: "Dev Hub could not be turned on",
    o_devhub_tip: "Open helios-prod, Setup, type Dev Hub in Quick Find, and switch Enable Dev Hub on.",
    o_threeorgs: "The Dev Hub already has its active scratch orgs",
    o_threeorgs_tip: "A Developer Edition Dev Hub keeps three alive at once. Open Active Scratch Orgs and delete the ones this course did not create.",
    o_api: "TotalRequests Limit exceeded",
    o_api_tip: "The org's daily API calls are used up. Nothing is lost: come back in a few hours.",
    p_pending: "Run pending installs: every missing tool comes to you",
    p_reload: "Developer: Reload Window: one more attempt",
    p_vibes: "Agentforce Vibes: everything is already installed, nothing can stop you",
    p_delete: "Deleting a scratch org does not give its allowance back",
    p_delete_tip: "Do not delete scratch orgs for fun: the daily allowance does not come back when you delete one.",
    p_restart: "VS Code restarted: it sees every tool now",
    g0_banner: "Git and Node.js are installed. VS Code says they are missing.",
    g1_banner: "The Setup panel installed the Salesforce CLI, then says it is missing.",
    g_restart: "Close VS Code completely and open it again",
    g_keep: "Keep VS Code open and wait",
    g_terminal: "Open a new terminal in VS Code",
    g_terminal_tip: "A new terminal of the same VS Code still has the old PATH. Close VS Code completely.",
    g_keep_tip: "Waiting changes nothing: VS Code only reads the PATH when it starts.",
    g_again: "Click Run pending installs again",
    g_again_tip: "It is installed already. VS Code just cannot see it until it restarts.",
    g_reinstall: "Reinstall the Salesforce CLI",
    g_reinstall_tip: "Reinstalling lands it in the same place, and VS Code still has the old PATH.",
    g2_banner: "Last card of the Setup panel: your training environment",
    g_setup: "Set up my training environment",
    g_recreate: "Delete and recreate the scratch org",
    g_recreate_tip: "Deleting a scratch org does not give its allowance back. Click the card again instead.",
    g_testlogin: "Log in at test.salesforce.com",
    g_testlogin_tip: "That is the sandbox login. A Developer Edition logs in at login.salesforce.com.",
    restarted: "VS Code restarted: {{tools}} found",
    pendingAgain: "Pending installs: {{tools}}",
    stillNotFound: "Still not found: VS Code needs a restart",
    missedTools: "Still pending at the end: {{tools}}. On a real machine, each missing tool is a command that fails later in the labs, so each one cost you points.",
    created: "OK  helios-dev is created, for 30 days."
  },
  fr: {
    ...RUNNER_TEXTS.fr,
    intro: "Votre premier matin dans une équipe Salesforce : installez vos outils, connectez votre org, ouvrez votre scratch org. Le Setup panel en haut passe au vert à mesure.",
    how1: "Récupérez Git, VS Code, Node.js et les autres outils",
    how2: "Flèches ou swipe : changez de voie, Haut saute, Bas baisse",
    how3: "Choisissez la bonne porte, puis la verte à la fin",
    goal0: "Récupérez les 4 outils : encore {{n}}",
    goal1: "Récupérez la Salesforce CLI et sfdx-hardis : encore {{n}}",
    goal2: "Connectez helios-prod, le Dev Hub et votre fork : encore {{n}}",
    goalReady: "Tout est récupéré : préparez-vous pour la porte",
    goalDoor: "Lisez la question, prenez la bonne porte",
    goalRestart: "Redémarrez VS Code : attrapez le bonus de redémarrage",
    goalPortal: "Prenez la porte verte : Set up my training environment",
    coachStart: "Récupérez les outils ! Gauche et Droite pour changer de voie",
    coachStartTouch: "Récupérez les outils ! Swipe à gauche ou à droite",
    coachFound: "Installé, introuvable : vous voyez la carte orange ?",
    coachRestart: "Attrapez le bonus de redémarrage !",
    coachGreen: "Setup panel tout vert !",
    coachPortal: "Porte verte : Set up my training environment !",
    q0: "Git et Node.js sont installés, mais VS Code dit qu'ils manquent. Que faites-vous ?",
    q1: "Le Setup panel a installé la Salesforce CLI, puis dit qu'elle manque. Et maintenant ?",
    q2: "Dernière carte du Setup panel : votre environnement de formation. Quelle porte ?",
    signQuiz: "Quelle porte ?",
    note: "Votre premier matin dans une équipe Salesforce. Cinq choses avant qu'on vous donne un ticket. - V.",
    s0: "Installer",
    s1: "Setup panel",
    s2: "Connecter",
    panelTitle: "Setup panel",
    stateMissing: "manquant",
    stateFound: "installé, introuvable",
    stateOk: "prêt",
    o_path: "Installé, mais VS Code ne le voit pas",
    o_path_tip: "Fermez complètement VS Code, toutes ses fenêtres, et rouvrez-le : VS Code ne lit le PATH qu'au démarrage.",
    o_path_s: "PATH",
    o_trust_s: "Trust ?",
    o_gitbash_s: "Pas de Git Bash",
    o_cli_s: "CLI manquante",
    o_noext_s: "Pas d'extension",
    o_redline_s: "Ligne rouge",
    o_outdated_s: "Pas à jour",
    o_sandbox_s: "Mauvais login",
    o_fork_s: "Fork raté",
    o_devhub_s: "Dev Hub éteint",
    o_threeorgs_s: "3 / 3 orgs",
    o_api_s: "Limite API",
    p_pending_s: "Installations",
    p_reload_s: "Reload Window",
    p_vibes_s: "Agentforce Vibes",
    p_delete_s: "Supprimer l'org",
    p_restart_s: "Redémarrer VS Code",
    g_restart_s: "Redémarrer VS Code",
    g_keep_s: "Attendre",
    g_terminal_s: "Nouveau terminal",
    g_again_s: "Relancer",
    g_reinstall_s: "Réinstaller la CLI",
    g_setup_s: "Set up",
    g_recreate_s: "Recréer l'org",
    g_testlogin_s: "test.salesforce.com",
    o_trust: "Do you trust the publishers of these extensions?",
    o_trust_tip: "Répondez Trust Publishers & Install, sinon l'installation s'arrête.",
    o_gitbash: "Des erreurs qui semblent sans rapport avec Git",
    o_gitbash_tip: "Réinstallez Git en gardant tous les choix par défaut, composants Git Bash cochés.",
    o_cli: "Le Setup panel dit que la Salesforce CLI manque",
    o_cli_tip: "Fermez complètement VS Code et rouvrez-le : la CLI est arrivée sur un PATH que le VS Code ouvert ne connaît pas encore.",
    o_noext: "L'extension n'apparaît pas",
    o_noext_tip: "View > Command Palette, puis Developer: Reload Window.",
    o_redline: "Une ligne rouge qui ne part pas",
    o_redline_tip: "Cliquez sur la ligne : le panel dit ce qu'il a essayé et ce qu'il a reçu, et ce message est presque toujours la réponse.",
    o_outdated: "Un panel ne ressemble pas à sa capture",
    o_outdated_tip: "Cochez Auto Update sur l'extension pack : une extension pas à jour est la cause la plus fréquente.",
    o_sandbox: "La page de connexion refuse votre nom d'utilisateur",
    o_sandbox_tip: "Une Developer Edition n'est pas une sandbox : connectez-vous par login.salesforce.com.",
    o_fork: "Le fork n'a pas pu être créé",
    o_fork_tip: "Forkez à la main et décochez Copy the main branch only : le cours a besoin de toutes les branches.",
    o_devhub: "Le Dev Hub n'a pas pu être activé",
    o_devhub_tip: "Ouvrez helios-prod, Setup, tapez Dev Hub dans Quick Find, et activez Enable Dev Hub.",
    o_threeorgs: "Le Dev Hub a déjà ses scratch orgs actives",
    o_threeorgs_tip: "Un Dev Hub Developer Edition en garde trois en vie à la fois. Ouvrez Active Scratch Orgs et supprimez celles que ce cours n'a pas créées.",
    o_api: "TotalRequests Limit exceeded",
    o_api_tip: "Les appels API du jour sont épuisés. Rien n'est perdu : revenez dans quelques heures.",
    p_pending: "Run pending installs : chaque outil manquant vient à vous",
    p_reload: "Developer: Reload Window : un essai de plus",
    p_vibes: "Agentforce Vibes : tout est déjà installé, rien ne vous arrête",
    p_delete: "Supprimer une scratch org ne rend pas son allocation",
    p_delete_tip: "Ne supprimez pas des scratch orgs pour le plaisir : l'allocation du jour ne revient pas quand vous en supprimez une.",
    p_restart: "VS Code redémarré : il voit tous les outils",
    g0_banner: "Git et Node.js sont installés. VS Code dit qu'ils manquent.",
    g1_banner: "Le Setup panel a installé la Salesforce CLI, puis dit qu'elle manque.",
    g_restart: "Fermer complètement VS Code et le rouvrir",
    g_keep: "Garder VS Code ouvert et attendre",
    g_terminal: "Ouvrir un nouveau terminal dans VS Code",
    g_terminal_tip: "Un nouveau terminal du même VS Code a toujours l'ancien PATH. Fermez complètement VS Code.",
    g_keep_tip: "Attendre ne change rien : VS Code ne lit le PATH qu'à son démarrage.",
    g_again: "Cliquer encore sur Run pending installs",
    g_again_tip: "C'est déjà installé. VS Code ne peut juste pas le voir avant de redémarrer.",
    g_reinstall: "Réinstaller la Salesforce CLI",
    g_reinstall_tip: "La réinstaller la pose au même endroit, et VS Code a toujours l'ancien PATH.",
    g2_banner: "Dernière carte du Setup panel : votre environnement de formation",
    g_setup: "Set up my training environment",
    g_recreate: "Supprimer et recréer la scratch org",
    g_recreate_tip: "Supprimer une scratch org ne rend pas son allocation. Recliquez plutôt sur la carte.",
    g_testlogin: "Se connecter sur test.salesforce.com",
    g_testlogin_tip: "C'est la connexion des sandboxes. Une Developer Edition se connecte sur login.salesforce.com.",
    restarted: "VS Code redémarré : {{tools}} trouvés",
    pendingAgain: "Installations en attente : {{tools}}",
    stillNotFound: "Toujours introuvable : VS Code doit redémarrer",
    missedTools: "Encore en attente à la fin : {{tools}}. Sur une vraie machine, chaque outil manquant est une commande qui échoue plus tard dans les labs : chacun vous a coûté des points.",
    created: "OK  helios-dev is created, for 30 days."
  }
};

/** The strings taken word for word from the labs, checked by scripts/verify/check-easter-egg.mjs. */
export const QUOTES = [
  { lab: "1.1", text: "Run pending installs" },
  { lab: "1.1", text: "Developer: Reload Window" },
  { lab: "1.1", text: "Close VS Code completely, windows and all, and open it again", locales: ["en"] },
  { lab: "1.2", text: "Copy the `main` branch only" },
  { lab: "1.2", text: "Set up my training environment" },
  { lab: "1.2", text: "TotalRequests Limit exceeded" },
  { lab: "1.2", text: "Active Scratch Orgs" },
  { lab: "1.2", text: "Enable Dev Hub" },
  { lab: "1.2", text: "helios-prod" },
  { lab: "1.2", text: "helios-dev" }
];

const TOOLS = {
  git: { glyph: "branch", color: "#F05032", label: "Git" },
  vscode: { glyph: "code", color: "#0176D3", label: "VS Code" },
  node: { glyph: "hexagon", color: "#3C873A", label: "Node.js" },
  pack: { glyph: "puzzle", color: "#0B5CAB", label: "Extension pack" },
  cli: { glyph: "cloud", color: "#032D60", label: "Salesforce CLI" },
  plugin: { glyph: "infinity", color: "#9050E9", label: "sfdx-hardis" },
  org: { glyph: "org", color: "#06A59A", label: "helios-prod" },
  devhub: { glyph: "gear", color: "#DD7A01", label: "Dev Hub" },
  fork: { glyph: "fork", color: "#24292F", label: "Your fork" }
};

export function createWorld(ctx) {
  const { t, hud } = ctx;
  const state = {};
  for (const id of REQUIRED) {
    state[id] = "missing";
  }
  const required = {};
  let restartsDone = 0;
  let finished = false;
  // A restart is owed: a wrong door left tools "installed, not found"
  let owed = false;
  // The gate the guinea pig is running at, once its doors are shown
  let nearGate = null;
  let foundTold = false;
  let allGreen = false;
  let greeted = false;

  const items = {};
  for (const [id, tool] of Object.entries(TOOLS)) {
    // The tools that count are big, with a halo and their name always shown
    items[id] = { glyph: tool.glyph, color: tool.color, label: tool.label, points: 50, big: true };
  }
  items.sfdmu = { glyph: "box", color: "#0D9DDA", label: "SFDMU", points: 10 };
  items.sgd = { glyph: "delta", color: "#DD7A01", label: "sfdx-git-delta", points: 10 };
  items.gh = { glyph: "branch", color: "#24292F", label: "GitHub CLI", points: 10 };
  items.note = { glyph: "note", color: "#F2C94C", label: "?", points: 0 };

  const ob = (move, key, theme, detail) => ({ move, title: "o_" + key, tip: "o_" + key + "_tip", short: "o_" + key + "_s", theme: theme || "error", detail });
  const config = {
    sections: [
      { name: t("s0"), color: 0x2e844a, length: 300, speed: 7.5, obstacles: ["path", "trust", "gitbash"], items: ["sfdmu", "gh"], powers: ["reload", "vibes"] },
      { name: t("s1"), color: 0x0176d3, length: 250, speed: 8.2, obstacles: ["cli", "noext", "redline", "outdated"], items: ["sfdmu", "sgd"], powers: ["pending", "reload", "delete"], doubles: 0.1 },
      { name: t("s2"), color: 0x9050e9, length: 300, speed: 9, obstacles: ["sandbox", "fork", "devhub", "threeorgs", "api"], items: ["gh", "sgd"], powers: ["pending", "vibes", "delete"], doubles: 0.15 }
    ],
    obstacles: {
      path: ob("lane", "path", "warning", "PATH"),
      trust: ob("jump", "trust", "info", "Trust Publishers & Install"),
      gitbash: ob("duck", "gitbash", "warning", "Git Bash"),
      cli: ob("lane", "cli", "warning", "@salesforce/cli"),
      noext: ob("jump", "noext", "info", "Developer: Reload Window"),
      redline: ob("duck", "redline", "error"),
      outdated: ob("jump", "outdated", "warning", "Auto Update"),
      sandbox: ob("lane", "sandbox", "lock", "login.salesforce.com"),
      fork: ob("gap", "fork", "error", "Copy the main branch only"),
      devhub: ob("lane", "devhub", "lock", "Enable Dev Hub"),
      threeorgs: ob("duck", "threeorgs", "warning", "3 / 3"),
      api: ob("jump", "api", "error", "TotalRequests Limit exceeded")
    },
    items,
    powers: {
      pending: { glyph: "loop", color: "#0176D3", label: "Run pending installs", short: "p_pending_s", effect: "magnet", metres: 200, kinds: REQUIRED, toast: "p_pending" },
      reload: { glyph: "loop", color: "#2E844A", label: "Reload Window", short: "p_reload_s", effect: "attempt", toast: "p_reload" },
      vibes: { glyph: "bolt", color: "#9050E9", label: "Agentforce Vibes", short: "p_vibes_s", effect: "shield", seconds: 5, toast: "p_vibes" },
      delete: { glyph: "error", color: "#BA0517", label: "Delete scratch org", short: "p_delete_s", effect: "trap", toast: "p_delete", tip: "p_delete_tip" },
      restart: { glyph: "loop", color: "#0176D3", label: "Restart VS Code", short: "p_restart_s", effect: "custom" }
    },
    gates(index) {
      if (index === 0) {
        return restartGate("q0", [
          { text: t("g_keep"), short: t("g_keep_s"), tip: t("g_keep_tip") },
          { text: t("g_terminal"), short: t("g_terminal_s"), tip: t("g_terminal_tip") }
        ]);
      }
      if (index === 1) {
        return restartGate("q1", [
          { text: t("g_again"), short: t("g_again_s"), tip: t("g_again_tip") },
          { text: t("g_reinstall"), short: t("g_reinstall_s"), tip: t("g_reinstall_tip") }
        ]);
      }
      return portalGate();
    },
    script: [
      ...REQUIRED.map((id) => ({ at: PLACES[id][0] - 80, spawn: id })),
      // Victor's note: high above a barrier, in the lane nobody takes
      { at: 420, note: true }
    ]
  };

  // The runner asks for the gates again each time it lays a row: build each
  // once, so its doors stay where they were drawn
  const gateSpecs = {};
  function cached(key, make) {
    if (!gateSpecs[key]) {
      gateSpecs[key] = make();
    }
    return gateSpecs[key];
  }

  function restartGate(question, wrong) {
    return cached(question, () => {
      const open = Math.floor(ctx.random() * 3);
      const doors = [];
      let w = 0;
      for (let lane = 0; lane < 3; lane++) {
        doors.push(lane === open ? { text: t("g_restart"), short: t("g_restart_s"), ok: true, look: "quiz", restart: true } : Object.assign({ ok: false, look: "quiz" }, wrong[w++]));
      }
      return { doors, question: t(question), sign: t("signQuiz"), quiz: true };
    });
  }

  function portalGate() {
    return cached("portal", () => {
      const open = Math.floor(ctx.random() * 3);
      const wrong = [
        { text: t("g_recreate"), short: t("g_recreate_s"), tip: t("g_recreate_tip"), ok: false, look: "trap" },
        { text: t("g_testlogin"), short: t("g_testlogin_s"), tip: t("g_testlogin_tip"), ok: false, look: "closed" }
      ];
      const doors = [];
      let w = 0;
      for (let lane = 0; lane < 3; lane++) {
        doors.push(lane === open ? { text: t("g_setup"), short: t("g_setup_s"), ok: true, look: "open", portal: true } : wrong[w++]);
      }
      return { doors, question: t("q2"), sign: "Training: Level 1", coach: t("coachPortal"), quiz: true, portal: true };
    });
  }

  const runner = createRunner(ctx, config);

  /* ---------- The Setup panel at the top ---------- */

  const panel = document.createElement("div");
  panel.className = "gr-w0-panel";
  const title = document.createElement("strong");
  title.textContent = t("panelTitle");
  panel.appendChild(title);
  const cards = {};
  for (const id of REQUIRED) {
    const card = document.createElement("span");
    card.className = "gr-w0-card";
    card.textContent = TOOLS[id].label;
    panel.appendChild(card);
    cards[id] = card;
  }
  hud.extra.appendChild(panel);

  function render() {
    let green = 0;
    for (const id of REQUIRED) {
      cards[id].setAttribute("data-state", state[id]);
      cards[id].title = t(state[id] === "ok" ? "stateOk" : state[id] === "found" ? "stateFound" : "stateMissing");
      if (state[id] === "ok") {
        green += 1;
      }
    }
    ctx.setData("installed", green);
    ctx.setData("portal", green === REQUIRED.length ? "open" : "closed");
    return green;
  }
  render();

  /** The goal line: always the next thing to do. */
  function updateGoal() {
    if (finished) {
      hud.goal("");
      return;
    }
    if (owed) {
      hud.goal(t("goalRestart"));
      return;
    }
    if (nearGate) {
      hud.goal(nearGate.spec.portal ? t("goalPortal") : t("goalDoor"));
      return;
    }
    const index = Math.min(runner.sectionIndex, BY_SECTION.length - 1);
    const left = BY_SECTION[index].filter((id) => state[id] === "missing").length;
    hud.goal(left ? t("goal" + index, { n: left }) : t("goalReady"));
  }

  function spawnRequired(id, at) {
    const lane = PLACES[id][1];
    required[id] = runner.spawnItem(id, lane, at);
  }

  function restart() {
    const found = REQUIRED.filter((id) => state[id] === "found");
    for (const id of found) {
      state[id] = "ok";
    }
    restartsDone += 1;
    owed = false;
    checkGreen(render());
    if (found.length) {
      hud.toast(t("restarted", { tools: found.map((id) => TOOLS[id].label).join(", ") }), "good");
    }
  }

  /** The first time every card is green, a bigger cheer. */
  function checkGreen(green) {
    if (green === REQUIRED.length && !allGreen) {
      allGreen = true;
      ctx.fx.burst(0, 2, -1, { count: 60, speed: 6, up: 6, life: 1.5 });
      ctx.sound.play("happy");
      runner.coach(t("coachGreen"), 2000, true);
    }
  }

  function pendingTools() {
    return REQUIRED.filter((id) => state[id] !== "ok");
  }

  // Items already behind when the run starts further down the track (guinea-at)
  for (const id of REQUIRED) {
    if (PLACES[id][0] < runner.distance + 10) {
      state[id] = "ok";
    } else if (PLACES[id][0] - 80 < runner.distance) {
      spawnRequired(id, PLACES[id][0]);
    }
  }
  render();

  function onEvent(event) {
    switch (event.type) {
      case "script":
        if (event.step.spawn && !required[event.step.spawn] && state[event.step.spawn] === "missing") {
          spawnRequired(event.step.spawn, PLACES[event.step.spawn][0]);
        } else if (event.step.note) {
          runner.calm(event.step.at + 90);
          runner.spawnObstacle("trust", 0, event.step.at + 90);
          runner.spawnItem("note", 0, event.step.at + 90, 2.1, { label: false });
        }
        return;
      case "section":
        updateGoal();
        return;
      case "gateNear":
        nearGate = event.gate;
        updateGoal();
        return;
      case "item":
        if (event.kind === "note") {
          ctx.foundNote();
          return;
        }
        if (REQUIRED.includes(event.kind)) {
          state[event.kind] = NEEDS_RESTART.includes(event.kind) ? "found" : "ok";
          const green = render();
          ctx.collect(50, TOOLS[event.kind].label + (state[event.kind] === "found" ? " · " + t("stateFound") : ""));
          runner.hop();
          if (state[event.kind] === "found" && !foundTold) {
            foundTold = true;
            runner.coach(t("coachFound"), 2800, true);
          }
          checkGreen(green);
          updateGoal();
          return;
        }
        runner.handle(event);
        return;
      case "power":
        if (event.kind === "restart") {
          ctx.sound.play("power");
          ctx.fx.burst(event.object.x, 1.2, 0, { count: 30, speed: 4, up: 5 });
          restart();
          updateGoal();
          return;
        }
        runner.handle(event);
        return;
      case "gate": {
        nearGate = null;
        if (event.ok && event.door.restart) {
          runner.celebrate(event.lane, 100);
          restart();
          updateGoal();
          return;
        }
        if (event.ok && event.door.portal) {
          runner.celebrate(event.lane, 200);
          ctx.sound.play("fanfare");
          return;
        }
        runner.handle(event);
        if (!event.door.portal && event.gate.spec.quiz && REQUIRED.some((id) => state[id] === "found")) {
          // A restart is still owed: it comes down the track as a power-up
          owed = true;
          runner.spawnPower("restart", runner.lane, runner.distance + 45);
          hud.toast(t("stillNotFound"), "bad");
        }
        updateGoal();
        return;
      }
      case "end": {
        // Missing tools never keep anyone out: they cost points and are named
        // on the result, as the setup panel would still show them pending
        const missing = pendingTools();
        finished = true;
        hud.goal("");
        hud.toast(t("created"), "good");
        const info = missing.length ? t("missedTools", { tools: missing.map((id) => TOOLS[id].label).join(", ") }) : "";
        ctx.finish((restartsDone >= 2 ? 100 : 0) - missing.length * 40, info);
        return;
      }
      default:
        runner.handle(event);
    }
  }

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
        runner.coach(t(hud.touch ? "coachStartTouch" : "coachStart"), 2800, true);
      }
      const events = runner.update(dt, time);
      for (const event of events) {
        onEvent(event);
        if (!ctx.playing) {
          return;
        }
      }
      // A restart owed: once the red toast and the tip are read, say so big
      if (owed === true && runner.coach(t("coachRestart"), 2200)) {
        owed = "told";
      }
      // A required tool that went by uncollected comes back as a pending install
      for (const id of REQUIRED) {
        const object = required[id];
        if (object && !object.done && object.at < runner.distance - 4 && state[id] === "missing") {
          const at = Math.min(runner.distance + 60, runner.total - 25);
          required[id] = runner.spawnItem(id, Math.floor(ctx.random() * 3), at);
          hud.toast(t("pendingAgain", { tools: TOOLS[id].label }), "bad");
        }
      }
    },
    action(name) {
      runner.action(name);
    },
    dispose() {
      runner.dispose();
      panel.remove();
    }
  };
}

export const CSS =
  RUNNER_CSS +
  `
.guinea-run .gr-w0-panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
  max-width: 760px;
  padding: 6px 10px;
  border: 2px solid #ffffff;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 3px 0 rgba(3, 45, 96, 0.25);
  font-size: 13px;
  pointer-events: none;
}
.guinea-run .gr-w0-panel strong {
  margin-right: 4px;
  color: #032d60;
  font-size: 13px;
}
.guinea-run .gr-w0-card {
  padding: 3px 9px;
  border-radius: 999px;
  background: #e8edf3;
  color: #3e3e3c;
  font-weight: 700;
  white-space: nowrap;
  transition: background 0.2s, transform 0.2s;
}
.guinea-run .gr-w0-card[data-state="found"] {
  background: #fe9339;
  color: #181818;
  transform: scale(1.08);
}
.guinea-run .gr-w0-card[data-state="found"]::after {
  content: " ?";
}
.guinea-run .gr-w0-card[data-state="ok"] {
  background: #2e844a;
  color: #ffffff;
}
.guinea-run .gr-w0-card[data-state="ok"]::before {
  content: "\\2713  ";
}
@media (max-width: 600px) {
  .guinea-run .gr-w0-panel {
    gap: 3px;
    padding: 4px 6px;
    font-size: 11px;
  }
  .guinea-run .gr-w0-panel strong {
    display: none;
  }
  .guinea-run .gr-w0-card {
    padding: 2px 6px;
  }
}
`;
