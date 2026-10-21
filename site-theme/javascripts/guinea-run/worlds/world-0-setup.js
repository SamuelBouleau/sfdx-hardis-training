/*
 * World 0, Get set up (Lab 1.1): a runner where the guinea pig collects what
 * every sfdx-hardis project needs on a machine, until every card of the Setup
 * panel is green. Nothing of Lab 1.2 here: no org, no fork, no scratch org.
 *
 * The running gag of Lab 1.1: a tool you just installed stays "installed, not
 * found" in the Setup panel until VS Code is closed completely and opened
 * again, because VS Code only reads the PATH at startup. The gates at the end
 * of the first two sections are that restart, as a quiz; the last gate is
 * Re-check, which turns the last cards green.
 *
 * A missed install comes back down the track as a pending install, and what
 * is still missing at the end costs points, never the end of the world.
 * Vegetables (what guinea pigs like best) are bonus points all along.
 *
 * The goal line always says what is next (the tools of the section, the
 * restart that is owed, the green door), and the coach teaches each new
 * thing the first time it comes.
 */
import { createRunner, RUNNER_TEXTS, RUNNER_CSS } from "./runner.js";

export const PADS = ["left", "right", "jump", "duck"];
/** On a phone, toasts and tips sit above the pads: the track runs up the middle. */
export const PHONE_MESSAGES = "bottom";
// The Salesforce items of the track, the Kenney islands far away, the vegetables
export const MODELS = ["salesforce", "platform", "vegetables"];

// What VS Code only sees after a restart: they land on the PATH
const NEEDS_RESTART = ["git", "node", "cli"];
const REQUIRED = ["git", "vscode", "node", "pack", "cli", "plugin", "sfdmu", "sgd", "sfext"];
// The tools each section brings, for the goal line
const BY_SECTION = [
  ["git", "vscode", "node", "pack"],
  ["cli", "plugin", "sfdmu"],
  ["sgd", "sfext"]
];
// Where each required item comes down the track, and in which lane
const PLACES = {
  git: [40, 1],
  vscode: [105, 0],
  node: [175, 2],
  pack: [250, 1],
  cli: [385, 0],
  plugin: [460, 2],
  sfdmu: [535, 1],
  sgd: [665, 0],
  sfext: [760, 2]
};
// The bonus vegetables, one kind per model of the vegetables pack
const VEGETABLES = ["fennel", "carrot", "bellPepper", "cucumber", "romaine", "parsley"];
const VEGETABLE_MODELS = { fennel: "fennel", carrot: "carrot", bellPepper: "bell-pepper", cucumber: "cucumber", romaine: "romaine", parsley: "parsley" };
const VEGETABLE_COLORS = { fennel: "#7BC96F", carrot: "#FF8A3D", bellPepper: "#E8473B", cucumber: "#3E9B4F", romaine: "#8CD17D", parsley: "#2E844A" };
const VEGETABLE_POINTS = 15;

export const TEXTS = {
  en: {
    ...RUNNER_TEXTS.en,
    intro: "Your first morning on any Salesforce team: five things to install before anyone gives you a ticket. The Setup panel at the top turns green as you go.",
    how1: "Collect Git, Node.js, VS Code and the extension pack",
    how2: "Arrows or swipe: change lane, Up to jump, Down to duck",
    how3: "Grab vegetables for bonus points, and pick the right doors",
    note: "Your first morning on any Salesforce team. Five things before anyone gives you a ticket. - V.",
    s0: "Install",
    s1: "Setup panel",
    s2: "Re-check",
    panelTitle: "Setup panel",
    stateMissing: "missing",
    stateFound: "installed, not found",
    stateOk: "ready",
    goal0: "Install the 4 tools: {{n}} left",
    goal1: "Run pending installs: Salesforce CLI, sfdx-hardis, SFDMU: {{n}} left",
    goal2: "Last cards: sfdx-git-delta and Salesforce Extension Pack: {{n}} left",
    goalReady: "All collected: get ready for the door",
    goalDoor: "Read the question, steer into the right door",
    goalRestart: "Restart VS Code: grab the restart power-up",
    goalFinish: "Take the green door: Re-check, and every card is green",
    coachStart: "Collect the tools! Left and Right to change lane",
    coachStartTouch: "Collect the tools! Swipe left or right",
    coachFound: "Installed, not found: see the orange card?",
    coachRestart: "Grab the restart power-up!",
    coachGreen: "Setup panel all green!",
    coachFinish: "Green door: Re-check!",
    coachVeg: "Yum! Vegetables are bonus points",
    q0: "Git and Node.js are installed, but VS Code says they are missing. What do you do?",
    q1: "The Setup panel installed the Salesforce CLI, then says it is missing. What now?",
    q2: "VS Code restarted. How do the last cards of the Setup panel turn green?",
    signQuiz: "Which door?",
    signFinish: "Setup panel",
    o_path: "Installed, but VS Code does not see it",
    o_path_tip: "Close VS Code completely, windows and all, and open it again: VS Code only reads the PATH at startup.",
    o_path_s: "PATH",
    o_trust: "Do you trust the publishers of these extensions?",
    o_trust_tip: "Answer Trust Publishers & Install, or the install of the pack stops.",
    o_trust_s: "Trust?",
    o_gitbash: "Errors that look like nothing to do with Git",
    o_gitbash_tip: "Reinstall Git and keep every default, with the Git Bash components ticked.",
    o_gitbash_s: "No Git Bash",
    o_node: "Node.js too old",
    o_node_tip: "Take the LTS version of Node.js, 22 at the least, 24 recommended.",
    o_node_s: "Node.js 20",
    o_checking: "Check in progress",
    o_checking_tip: "Wait for the check to finish, then click the button: it opens the Setup panel.",
    o_checking_s: "Checking...",
    o_cli: "The Setup panel says the Salesforce CLI is missing",
    o_cli_tip: "Close VS Code completely and open it again: the CLI landed on a PATH the open VS Code does not know yet.",
    o_cli_s: "CLI missing",
    o_noext: "The extension does not appear",
    o_noext_tip: "View > Command Palette, then Developer: Reload Window.",
    o_noext_s: "No extension",
    o_redline: "A red line you cannot clear",
    o_redline_tip: "Click the line: the panel says what it tried and what it got back, and that message is nearly always the answer.",
    o_redline_s: "Red line",
    o_outdated: "A panel does not look like its screenshot",
    o_outdated_tip: "Tick Auto Update on the extension pack: an outdated extension is the most common cause.",
    o_outdated_s: "Outdated",
    p_pending: "Run pending installs: every missing tool comes to you",
    p_pending_s: "Pending installs",
    p_reload: "Developer: Reload Window: one more attempt",
    p_reload_s: "Reload Window",
    p_vibes: "Agentforce Vibes: Git, Node.js and the editor come with it, nothing can stop you",
    p_vibes_s: "Agentforce Vibes",
    p_single: "The single extension, not the pack",
    p_single_tip: "Take the pack rather than the single extension above it: the pack brings the tools the later levels use.",
    p_single_s: "Single extension",
    p_restart: "VS Code restarted: it sees every tool now",
    p_restart_s: "Restart VS Code",
    g_restart: "Close VS Code completely and open it again",
    g_restart_s: "Restart VS Code",
    g_keep: "Keep VS Code open and wait",
    g_keep_s: "Wait",
    g_keep_tip: "Waiting changes nothing: VS Code only reads the PATH when it starts.",
    g_terminal: "Open a new terminal in VS Code",
    g_terminal_s: "New terminal",
    g_terminal_tip: "A new terminal of the same VS Code still has the old PATH. Close VS Code completely.",
    g_again: "Click Run pending installs again",
    g_again_s: "Run again",
    g_again_tip: "It is installed already. VS Code just cannot see it until it restarts.",
    g_reinstall: "Reinstall the Salesforce CLI",
    g_reinstall_s: "Reinstall CLI",
    g_reinstall_tip: "Reinstalling lands it in the same place, and VS Code still has the old PATH.",
    g_recheck: "Press Re-check on the Setup panel",
    g_recheck_s: "Re-check",
    g_pendingAgain: "Click Run pending installs once more",
    g_pendingAgain_s: "Install again",
    g_pendingAgain_tip: "Everything is installed already: Re-check reads every version again, and what was red for the PATH turns green.",
    g_upgrade: "Treat the amber Upgrade as a failure",
    g_upgrade_s: "Fix Upgrade",
    g_upgrade_tip: "An amber Upgrade is not a failure: a newer version exists, and the button fetches it whenever you like. Missing is the only state that stops you.",
    restarted: "VS Code restarted: {{tools}} found",
    pendingAgain: "Pending installs: {{tools}}",
    stillNotFound: "Still not found: VS Code needs a restart",
    missedTools: "Still pending at the end: {{tools}}. On a real machine, each missing tool is a command that fails later in the labs, so each one cost you points.",
    vegetablesCount: "Vegetables: {{n}}.",
    allGreen: "Dependencies up to date: every card is green",
    veg_fennel: "Fennel",
    veg_carrot: "Carrot",
    veg_bellPepper: "Bell pepper",
    veg_cucumber: "Cucumber",
    veg_romaine: "Romaine",
    veg_parsley: "Parsley"
  },
  fr: {
    ...RUNNER_TEXTS.fr,
    intro: "Votre premier matin dans une équipe Salesforce : cinq choses à installer avant qu'on vous confie un ticket. Le panneau Setup en haut passe au vert à mesure.",
    how1: "Récupérez Git, Node.js, VS Code et le pack d'extensions",
    how2: "Flèches ou swipe : changez de voie, Haut saute, Bas baisse",
    how3: "Attrapez des légumes pour des points bonus, prenez les bonnes portes",
    note: "Votre premier matin dans une équipe Salesforce. Cinq choses avant qu'on vous confie un ticket. - V.",
    s0: "Installer",
    s1: "Panneau Setup",
    s2: "Re-check",
    panelTitle: "Panneau Setup",
    stateMissing: "manquant",
    stateFound: "installé, introuvable",
    stateOk: "prêt",
    goal0: "Installez les 4 outils : encore {{n}}",
    goal1: "Run pending installs : Salesforce CLI, sfdx-hardis, SFDMU : encore {{n}}",
    goal2: "Dernières cartes : sfdx-git-delta et Salesforce Extension Pack : encore {{n}}",
    goalReady: "Tout est récupéré : préparez-vous pour la porte",
    goalDoor: "Lisez la question, prenez la bonne porte",
    goalRestart: "Redémarrez VS Code : attrapez le bonus de redémarrage",
    goalFinish: "Prenez la porte verte : Re-check, et chaque carte est verte",
    coachStart: "Récupérez les outils ! Gauche et Droite pour changer de voie",
    coachStartTouch: "Récupérez les outils ! Swipe à gauche ou à droite",
    coachFound: "Installé, introuvable : vous voyez la carte orange ?",
    coachRestart: "Attrapez le bonus de redémarrage !",
    coachGreen: "Panneau Setup tout vert !",
    coachFinish: "Porte verte : Re-check !",
    coachVeg: "Miam ! Les légumes, ce sont des points bonus",
    q0: "Git et Node.js sont installés, mais VS Code dit qu'ils manquent. Que faites-vous ?",
    q1: "Le panneau Setup a installé la CLI Salesforce, puis dit qu'elle manque. Et maintenant ?",
    q2: "VS Code a redémarré. Comment les dernières cartes du panneau Setup passent-elles au vert ?",
    signQuiz: "Quelle porte ?",
    signFinish: "Panneau Setup",
    o_path: "Installé, mais VS Code ne le voit pas",
    o_path_tip: "Fermez VS Code complètement, toutes fenêtres comprises, et rouvrez-le : VS Code ne lit le PATH qu'au démarrage.",
    o_path_s: "PATH",
    o_trust: "Do you trust the publishers of these extensions?",
    o_trust_tip: "Répondez Trust Publishers & Install, sinon l'installation du pack s'arrête.",
    o_trust_s: "Trust ?",
    o_gitbash: "Des erreurs qui n'ont l'air d'avoir aucun rapport avec Git",
    o_gitbash_tip: "Relancez l'installeur Git et gardez toutes les valeurs par défaut, composants Git Bash cochés.",
    o_gitbash_s: "Pas de Git Bash",
    o_node: "Node.js trop ancien",
    o_node_tip: "Prenez la version LTS de Node.js, 22 au minimum, 24 recommandée.",
    o_node_s: "Node.js 20",
    o_checking: "Check in progress",
    o_checking_tip: "Attendez la fin du contrôle, puis cliquez sur le bouton : il ouvre le panneau Setup.",
    o_checking_s: "Contrôle...",
    o_cli: "Le panneau Setup dit que la CLI Salesforce manque",
    o_cli_tip: "Fermez VS Code complètement et rouvrez-le : la CLI a atterri sur un PATH que le VS Code ouvert ne connaît pas encore.",
    o_cli_s: "CLI manquante",
    o_noext: "L'extension n'apparaît pas",
    o_noext_tip: "View > Command Palette, puis Developer: Reload Window.",
    o_noext_s: "Pas d'extension",
    o_redline: "Une ligne rouge que vous n'arrivez pas à faire passer",
    o_redline_tip: "Cliquez sur la ligne : le panneau dit ce qu'il a tenté et ce qu'on lui a répondu, et ce message est presque toujours la réponse.",
    o_redline_s: "Ligne rouge",
    o_outdated: "Un panneau ne ressemble pas à sa capture",
    o_outdated_tip: "Cochez Auto Update sur le pack d'extensions : une extension en retard est la cause la plus fréquente.",
    o_outdated_s: "Pas à jour",
    p_pending: "Run pending installs : chaque outil manquant vient à vous",
    p_pending_s: "Installations",
    p_reload: "Developer: Reload Window : un essai de plus",
    p_reload_s: "Reload Window",
    p_vibes: "Agentforce Vibes : Git, Node.js et l'éditeur viennent avec, rien ne vous arrête",
    p_vibes_s: "Agentforce Vibes",
    p_single: "L'extension seule, pas le pack",
    p_single_tip: "Prenez le pack plutôt que l'extension seule juste au-dessus : le pack apporte les outils dont les niveaux suivants se servent.",
    p_single_s: "Extension seule",
    p_restart: "VS Code redémarré : il voit tous les outils",
    p_restart_s: "Redémarrer VS Code",
    g_restart: "Fermer complètement VS Code et le rouvrir",
    g_restart_s: "Redémarrer VS Code",
    g_keep: "Garder VS Code ouvert et attendre",
    g_keep_s: "Attendre",
    g_keep_tip: "Attendre ne change rien : VS Code ne lit le PATH qu'à son démarrage.",
    g_terminal: "Ouvrir un nouveau terminal dans VS Code",
    g_terminal_s: "Nouveau terminal",
    g_terminal_tip: "Un nouveau terminal du même VS Code a toujours l'ancien PATH. Fermez complètement VS Code.",
    g_again: "Cliquer encore sur Run pending installs",
    g_again_s: "Relancer",
    g_again_tip: "C'est déjà installé. VS Code ne peut juste pas le voir avant de redémarrer.",
    g_reinstall: "Réinstaller la CLI Salesforce",
    g_reinstall_s: "Réinstaller la CLI",
    g_reinstall_tip: "La réinstaller la pose au même endroit, et VS Code a toujours l'ancien PATH.",
    g_recheck: "Appuyer sur Re-check dans le panneau Setup",
    g_recheck_s: "Re-check",
    g_pendingAgain: "Cliquer encore une fois sur Run pending installs",
    g_pendingAgain_s: "Réinstaller",
    g_pendingAgain_tip: "Tout est déjà installé : Re-check relit chaque version, et ce qui était rouge à cause du PATH passe au vert.",
    g_upgrade: "Prendre l'Upgrade orange pour un échec",
    g_upgrade_s: "Corriger Upgrade",
    g_upgrade_tip: "Un Upgrade orange n'est pas un échec : une version plus récente existe, et le bouton ira la chercher quand vous voudrez. Manquant est le seul état qui vous bloque.",
    restarted: "VS Code redémarré : {{tools}} trouvés",
    pendingAgain: "Installations en attente : {{tools}}",
    stillNotFound: "Toujours introuvable : VS Code doit redémarrer",
    missedTools: "Encore en attente à la fin : {{tools}}. Sur une vraie machine, chaque outil manquant est une commande qui échoue plus tard dans les labs : chacun vous a coûté des points.",
    vegetablesCount: "Légumes : {{n}}.",
    allGreen: "Dependencies up to date : chaque carte est verte",
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
  { lab: "1.1", text: "Run pending installs" },
  { lab: "1.1", text: "Developer: Reload Window" },
  { lab: "1.1", text: "View > Command Palette" },
  { lab: "1.1", text: "Do you trust the publishers of these extensions?" },
  { lab: "1.1", text: "Auto Update" },
  { lab: "1.1", text: "Re-check" },
  { lab: "1.1", text: "Check in progress" },
  { lab: "1.1", text: "Dependencies up to date" },
  { lab: "1.1", text: "Salesforce Extension Pack" },
  { lab: "1.1", text: "SFDMU" },
  { lab: "1.1", text: "sfdx-git-delta" },
  { lab: "1.1", text: "Agentforce Vibes" },
  { lab: "1.1", text: "LTS" },
  { lab: "1.1", text: "Close VS Code completely, windows and all, and open it again", locales: ["en"] },
  { lab: "1.1", text: "Fermez VS Code complètement, toutes fenêtres comprises", locales: ["fr"] }
];

const TOOLS = {
  git: { glyph: "branch", color: "#F05032", label: "Git" },
  vscode: { glyph: "code", color: "#0176D3", label: "VS Code" },
  node: { glyph: "hexagon", color: "#3C873A", label: "Node.js" },
  pack: { glyph: "puzzle", color: "#0B5CAB", label: "Extension pack" },
  cli: { glyph: "cloud", color: "#032D60", label: "Salesforce CLI" },
  plugin: { glyph: "infinity", color: "#9050E9", label: "sfdx-hardis" },
  sfdmu: { glyph: "box", color: "#0D9DDA", label: "SFDMU" },
  sgd: { glyph: "delta", color: "#DD7A01", label: "sfdx-git-delta" },
  sfext: { glyph: "cloud", color: "#06A59A", label: "Salesforce Extension Pack" }
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
  let vegTold = false;
  let vegetables = 0;
  const eaten = new Set();
  // The tip of a wrong finish door, for the result's "Good to know"
  let finishTip = "";

  const items = {};
  for (const [id, tool] of Object.entries(TOOLS)) {
    // The tools that count are big, with a halo and their name always shown
    items[id] = { glyph: tool.glyph, color: tool.color, label: tool.label, points: 50, big: true };
  }
  for (const id of VEGETABLES) {
    // Instanced models when the vegetables pack is there, a green tile otherwise
    items[id] = { glyph: "star", color: VEGETABLE_COLORS[id], label: t("veg_" + id), points: VEGETABLE_POINTS, model: VEGETABLE_MODELS[id], instanced: true, glowIntensity: 0.3, vegetable: true };
  }
  items.note = { glyph: "note", color: "#F2C94C", label: "?", points: 0, model: "note", glow: 0xffd84d, glowIntensity: 0.8 };

  const ob = (move, key, theme, detail) => ({ move, title: "o_" + key, tip: "o_" + key + "_tip", short: "o_" + key + "_s", theme: theme || "error", detail });
  const config = {
    sections: [
      { name: t("s0"), color: 0x2e844a, length: 330, speed: 7.5, obstacles: ["path", "trust", "gitbash", "node"], items: VEGETABLES, powers: ["reload", "vibes", "single"] },
      { name: t("s1"), color: 0x0176d3, length: 270, obstacles: ["checking", "cli", "noext", "outdated"], items: VEGETABLES, powers: ["pending", "reload", "single"], doubles: 0.1 },
      { name: t("s2"), color: 0x9050e9, length: 250, obstacles: ["redline", "outdated", "noext", "path"], items: VEGETABLES, powers: ["pending", "vibes", "reload"], doubles: 0.15 }
    ],
    // A vegetable's name shows on the first one of its kind only
    labelOnce: VEGETABLES,
    obstacles: {
      path: ob("lane", "path", "warning", "PATH"),
      trust: ob("jump", "trust", "info"),
      gitbash: ob("duck", "gitbash", "warning", "Git Bash"),
      node: ob("jump", "node", "lock", "LTS"),
      checking: ob("duck", "checking", "info", "Check in progress"),
      cli: ob("lane", "cli", "warning", "@salesforce/cli"),
      noext: ob("jump", "noext", "info", "Developer: Reload Window"),
      redline: ob("duck", "redline", "error"),
      outdated: ob("jump", "outdated", "warning", "Auto Update")
    },
    items,
    powers: {
      pending: { glyph: "loop", color: "#0176D3", label: "Run pending installs", short: "p_pending_s", effect: "magnet", metres: 200, kinds: REQUIRED, toast: "p_pending" },
      reload: { glyph: "loop", color: "#2E844A", label: "Reload Window", short: "p_reload_s", effect: "attempt", toast: "p_reload" },
      vibes: { glyph: "bolt", color: "#9050E9", label: "Agentforce Vibes", short: "p_vibes_s", model: "lwc", glow: 0xffb400, effect: "shield", seconds: 5, toast: "p_vibes" },
      single: { glyph: "error", color: "#BA0517", label: "Single extension", short: "p_single_s", effect: "trap", toast: "p_single", tip: "p_single_tip" },
      restart: { glyph: "loop", color: "#0176D3", label: "Restart VS Code", short: "p_restart_s", model: "check-pass", glow: 0x45c65a, effect: "custom" }
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
      return finishGate();
    },
    script: [
      ...REQUIRED.map((id) => ({ at: PLACES[id][0] - 80, spawn: id })),
      // Victor's note: high above a hurdle, in the lane nobody takes
      { at: 520, note: true }
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

  /** The finish: Re-check is the green door, and every card turns green. */
  function finishGate() {
    return cached("finish", () => {
      const open = Math.floor(ctx.random() * 3);
      const wrong = [
        { text: t("g_pendingAgain"), short: t("g_pendingAgain_s"), tip: t("g_pendingAgain_tip"), ok: false, look: "closed" },
        { text: t("g_upgrade"), short: t("g_upgrade_s"), tip: t("g_upgrade_tip"), ok: false, look: "trap" }
      ];
      const doors = [];
      let w = 0;
      for (let lane = 0; lane < 3; lane++) {
        doors.push(lane === open ? { text: t("g_recheck"), short: t("g_recheck_s"), ok: true, look: "open", finish: true } : wrong[w++]);
      }
      return { doors, question: t("q2"), sign: t("signFinish"), coach: t("coachFinish"), quiz: true, finish: true };
    });
  }

  // Harder than the first version: the install stays calm, then it runs
  config.paceCalm = 0.18;
  config.paceGain = 0.5;
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
  // The vegetables eaten so far, at the end of the panel
  const vegCard = document.createElement("span");
  vegCard.className = "gr-w0-veg";
  panel.appendChild(vegCard);
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

  function renderVegetables() {
    vegCard.textContent = t("vegetablesCount", { n: vegetables }).replace(/\.$/, "");
    ctx.setData("vegetables", vegetables);
  }
  renderVegetables();

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
      hud.goal(nearGate.spec.finish ? t("goalFinish") : t("goalDoor"));
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
          runner.spawnObstacle("noext", 0, event.step.at + 90);
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
        if (event.def.vegetable) {
          // A vegetable: bonus points and a happy wheek
          vegetables += 1;
          renderVegetables();
          // Its name in the toast the first time each kind is eaten, then just the points
          ctx.collect(VEGETABLE_POINTS, eaten.has(event.kind) ? "" : event.def.label);
          eaten.add(event.kind);
          ctx.sound.play("wheek");
          if (!vegTold) {
            vegTold = true;
            runner.coach(t("coachVeg"), 2000);
          }
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
        if (event.ok && event.door.finish) {
          runner.celebrate(event.lane, 200);
          ctx.sound.play("fanfare");
          return;
        }
        if (event.gate.spec.finish) {
          // The last door is the finish line: a wrong one costs points and
          // says why, never the attempt that would fail the whole world
          ctx.sound.play("wrong");
          ctx.points(-60);
          runner.breakStreak();
          hud.toast(event.door.short || event.door.text, "bad");
          if (event.door.tip) {
            hud.tip(event.door.tip);
            finishTip = event.door.tip;
          }
          return;
        }
        runner.handle(event);
        if (event.gate.spec.quiz && REQUIRED.some((id) => state[id] === "found")) {
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
        // on the result, as the Setup panel would still show them pending
        const missing = pendingTools();
        finished = true;
        hud.goal("");
        if (!missing.length) {
          hud.toast(t("allGreen"), "good");
        }
        const info = [t("vegetablesCount", { n: vegetables }), missing.length ? t("missedTools", { tools: missing.map((id) => TOOLS[id].label).join(", ") }) : "", finishTip].filter(Boolean).join(" ");
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
.guinea-run .gr-w0-veg {
  padding: 3px 9px;
  border-radius: 999px;
  background: #fff1d6;
  color: #8a4b00;
  font-weight: 800;
  white-space: nowrap;
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
  .guinea-run .gr-w0-card,
  .guinea-run .gr-w0-veg {
    padding: 2px 6px;
  }
}
`;
