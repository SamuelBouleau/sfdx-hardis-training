/*
 * World 5, Resolve the conflict: VS Code's merge editor, three rounds, while
 * the guinea pig sits at its desk in front of the monitor.
 *
 * Round 1 is the Sales_Manager permission set: US-014 granted
 * Account.Customer_Tier__c and Mariia's US-018 granted Account.Region__c at
 * the same place. Mechanical, take both, then read the Result, because git
 * merges lines, not permissions. Round 2 is the Account record page: each side
 * added one field at the same place, and keeping both is plainly right.
 * Round 3: three Pull Requests on a Friday afternoon, put in the order a
 * release manager picks.
 *
 * Everything is HTML in ctx.hud.layer, one list of rows for the keyboard
 * (up and down pick a row, left and right a button, Enter presses it), and
 * the same buttons for a finger. A timer bar per round only gives a bonus.
 */
import { SLDS, glyph, fitText, rounded } from "../core/painter.js";

export const PADS = ["left", "right", "jump", "duck", "confirm"];

// The office furniture of the story, and the Salesforce things on the desks
export const MODELS = ["office", "salesforce"];

const PERMSET_FILE = "Sales_Manager.permissionset-meta.xml";
const PAGE_FILE = "Account_Record_Page.flexipage-meta.xml";
// Mariia's field comes in from the integration branch, yours is the current one
const FIELD_HERS = "    <field>Account.Region__c</field>";
const FIELD_YOURS = "    <field>Account.Customer_Tier__c</field>";
const HEAD = "<<<<<<< HEAD";
const SPLIT = "=======";
const THEIRS = ">>>>>>> origin/integration";
// What a round is worth, and the seconds that still give a time bonus
const ROUND_SECONDS = [65, 40, 50];
const TIME_BONUS = 150;
// Mistakes shown with their tip and a few points less, never an attempt
const FREE_MISTAKES = ["marker", "oneSide", "page", "failing", "smaller"];
const SLIP_POINTS = 30;
const DESK_SCALE = 1.45;
// Where the camera sits from what it looks at, on a wide and on a tall screen
const CAMERA_WIDE = { x: 4.5, y: 2.0, z: 3.8 };
const CAMERA_TALL = { x: 3.0, y: 2.3, z: 7.6 };

export const TEXTS = {
  en: {
    intro:
      "Mariia merged first, on the files you touched. Merge your work with hers, then put three Pull Requests in order as release manager.",
    how1: "Take both sides: tap Accept Current, then Accept Incoming",
    how2: "On the record page, keep both fields: Accept Incoming and Accept Current",
    how3: "Arrows move, Enter presses, drag the cards to order them",
    g_r1_take: "Accept Incoming and Accept Current",
    g_r1_split: "Add the four lines: two blocks",
    g_r1_sort: "Sort the blocks, then merge",
    g_complete: "Click Complete Merge",
    g_r3: "Order the 3 Pull Requests, then merge",
    g_r3_merge: "Watch the merges go in",
    co_r1: "Round 1: take both sides!",
    co_r2: "Round 2: two fields, one page. Keep both!",
    co_r3: "Round 3: you are the release manager!",
    co_read: "Now read the Result!",
    fix_marker: "Accept a side first",
    fix_oneSide: "Take both sides!",
    fix_dup: "Add the four lines: two blocks",
    fix_failing: "Send US-062 back to Mariia",
    fix_smaller: "The smaller one goes first",
    screenConflict: "Conflict",
    screenMerged: "Merged",
    screenDup: "Duplicated",
    screenReleased: "Released",
    note: "Before Complete Merge, read the Result as if somebody else wrote it. Git merges lines, not permissions. - V.",
    noteLine: "<!-- V. left something here -->",
    round: "Round {{n}} / 3",
    r1_task:
      "Mariia merged this morning. You did not. Build the Result from both sides, read it, then Complete Merge.",
    r2_task: "You added Customer_Tier__c to the Account record page. Mariia added Region__c at the same place. The page has room for both.",
    r3_task:
      "Friday afternoon. Three stories were planned for this week's release. Put them in the order you would merge them.",
    accepted: "Accepted",
    split: "Add the four lines: two blocks",
    sort: "Sort: Customer_Tier__c first",
    slot1: "Merge first",
    slot2: "Merge second",
    slot3: "Send back to its author",
    checksGreen: "checks green",
    checksFailing: "checks failing",
    sizeSmall: "small: one <fieldPermissions> block",
    sizeBig: "bigger: a field, a layout, a grant",
    sizeFail: "KeyAccountsServiceTest does not compile",
    mergeOrder: "Merge in this order",
    moveUp: "Move up",
    moveDown: "Move down",
    merged: "Merged",
    backToAuthor: "Back to Mariia",
    keys: "Up/Down: move · Left/Right: choose · Enter: apply",
    keysR3: "Enter: pick up a card, Up/Down: move it, Enter: drop it",
    touch: "Tap a button",
    touchR3: "Drag a card, or use its arrows",
    stampMerge: "Merge complete",
    stampRelease: "Released: US-056, then US-052",
    timeBonus: "Time bonus +{{n}}",
    c_r1: "Morning! US-018 is in the integration branch. I granted Region__c on Sales_Manager, one line from yours, I think.",
    c_mariia2: "Sorry, I put Region__c on the Account record page too, right where you put yours.",
    c_romain3:
      "Green, small, nothing in its way. Thanks for taking mine first.",
    c_mariia3:
      "Fair. I will fix KeyAccountsServiceTest, it lands on Monday.",
    ok_both: "Both grants kept",
    ok_r1: "Two complete blocks, in alphabetical order",
    ok_r1_unsorted: "Two blocks, but not in alphabetical order",
    ok_r3: "US-056, then US-052, and US-062 back to Mariia",
    e_marker: "The check fails on a conflict marker.",
    e_marker_tip:
      "Search the whole repository for <<<<<<<, ======= and >>>>>>>. A marker in an XML file is sometimes syntactically tolerated by git and always fatal to Salesforce.",
    e_lostYours: "Your Customer_Tier__c grant quietly disappeared",
    e_lostHers: "Mariia's Region__c grant quietly disappeared",
    e_oneSide_tip:
      "Take both is the right answer for almost every permission set conflict. Choosing one side is how a teammate's permission quietly disappears, and nobody notices until somebody cannot see a field.",
    e_dup:
      "Element field is duplicated at this location in type PermissionSetFieldPermissions",
    e_dup_tip:
      "One <fieldPermissions> block names one field: the fix is two blocks, not one block with two <field> lines.",
    e_failing: "US-062 is failing, and it is in the release",
    e_failing_tip:
      "A failing Pull Request is not a decision, it is a task for its author. Send it back with one comment, and leave it open.",
    e_smaller: "The bigger one went first",
    e_smaller_tip:
      "All else equal, merge the smaller one first: its author has less to redo if the other one lands badly.",
    info_unsorted:
      "Your two blocks were not in alphabetical order: Salesforce writes Customer_Tier__c first, then Region__c.",
    tickMerged: "Merged #{{n}} {{title}} into the integration branch",
    tickDeployed: "Deployed to the integration org: both grants are there",
    tickBack:
      "Comment on #3: KeyAccountsServiceTest does not compile, addManagers returns a Set, not a List",
    screenBad: "Not deployable",
    fix_page: "Take both fields!",
    ok_page: "Both fields on the record page",
    e_pageLostYours: "Customer Tier is gone from the record page",
    e_pageLostHers: "Mariia's Region field is gone from the record page",
    e_page_tip: "Each side added one complete field block. Accept Incoming alone drops your field, Accept Current alone drops Mariia's: click both, and the page shows the two fields.",
    prList: "Pull Requests · integration branch",
  },
  fr: {
    intro:
      "Mariia a mergé avant vous, sur les fichiers que vous avez touchés. Fusionnez votre travail avec le sien, puis mettez trois Pull Requests dans l'ordre en release manager.",
    how1: "Prenez les deux : Accept Current, puis Accept Incoming",
    how2: "Sur la page d'enregistrement, gardez les deux champs : Accept Incoming et Accept Current",
    how3: "Flèches pour bouger, Entrée pour valider, glissez les cartes",
    g_r1_take: "Accept Incoming et Accept Current",
    g_r1_split: "Ajoutez les quatre lignes : deux blocs",
    g_r1_sort: "Triez les blocs, puis mergez",
    g_complete: "Cliquez sur Complete Merge",
    g_r3: "Ordonnez les 3 Pull Requests, puis mergez",
    g_r3_merge: "Regardez les merges passer",
    co_r1: "Manche 1 : prenez les deux côtés !",
    co_r2: "Manche 2 : deux champs, une page. Gardez les deux !",
    co_r3: "Manche 3 : vous êtes release manager !",
    co_read: "Lisez maintenant le Result !",
    fix_marker: "Acceptez d'abord un côté",
    fix_oneSide: "Prenez les deux côtés !",
    fix_dup: "Ajoutez les quatre lignes : deux blocs",
    fix_failing: "Renvoyez US-062 à Mariia",
    fix_smaller: "La plus petite passe d'abord",
    screenConflict: "Conflit",
    screenMerged: "Mergé",
    screenDup: "En double",
    screenReleased: "En release",
    note: "Avant Complete Merge, lisez le Result comme si quelqu'un d'autre l'avait écrit. Git merge des lignes, pas des permissions. - V.",
    noteLine: "<!-- V. a laissé quelque chose ici -->",
    round: "Manche {{n}} / 3",
    r1_task:
      "Mariia a mergé ce matin. Pas vous. Construisez le Result avec les deux côtés, lisez-le, puis Complete Merge.",
    r2_task: "Vous avez ajouté Customer_Tier__c à la page d'enregistrement Compte. Mariia a ajouté Region__c au même endroit. La page a de la place pour les deux.",
    r3_task:
      "Vendredi après-midi. Trois stories étaient prévues pour la release de la semaine. Mettez-les dans l'ordre où vous les mergeriez.",
    accepted: "Accepté",
    split: "Ajouter les quatre lignes : deux blocs",
    sort: "Trier : Customer_Tier__c en premier",
    slot1: "Merger en premier",
    slot2: "Merger en second",
    slot3: "Renvoyer à son auteur",
    checksGreen: "contrôles verts",
    checksFailing: "contrôles en échec",
    sizeSmall: "petite : un bloc <fieldPermissions>",
    sizeBig: "plus grosse : un champ, un layout, un accès",
    sizeFail: "KeyAccountsServiceTest ne compile pas",
    mergeOrder: "Merger dans cet ordre",
    moveUp: "Monter",
    moveDown: "Descendre",
    merged: "Mergée",
    backToAuthor: "Repart chez Mariia",
    keys: "Haut/Bas : se déplacer · Gauche/Droite : choisir · Entrée : appliquer",
    keysR3:
      "Entrée : prendre une carte, Haut/Bas : la déplacer, Entrée : la poser",
    touch: "Touchez un bouton",
    touchR3: "Faites glisser une carte, ou utilisez ses flèches",
    stampMerge: "Merge terminé",
    stampRelease: "En release : US-056, puis US-052",
    timeBonus: "Bonus de temps +{{n}}",
    c_r1: "Salut ! US-018 est dans la branch integration. J'ai donné Region__c sur Sales_Manager, à une ligne du tien, je crois.",
    c_mariia2: "Désolée, j'ai aussi mis Region__c sur la page d'enregistrement Compte, juste là où tu as mis le tien.",
    c_romain3:
      "Verte, petite, rien sur son chemin. Merci d'avoir pris la mienne en premier.",
    c_mariia3:
      "D'accord. Je répare KeyAccountsServiceTest, elle passera lundi.",
    ok_both: "Les deux accès gardés",
    ok_r1: "Deux blocs complets, par ordre alphabétique",
    ok_r1_unsorted: "Deux blocs, mais pas par ordre alphabétique",
    ok_r3: "US-056, puis US-052, et US-062 repart chez Mariia",
    e_marker: "Le contrôle échoue sur un marqueur de conflit.",
    e_marker_tip:
      "Cherchez <<<<<<<, ======= et >>>>>>> dans tout le repository. Un marqueur dans un fichier XML est parfois toléré syntaxiquement par git et toujours fatal pour Salesforce.",
    e_lostYours: "Votre accès Customer_Tier__c a disparu en silence",
    e_lostHers: "L'accès Region__c de Mariia a disparu en silence",
    e_oneSide_tip:
      "Prendre les deux est la bonne réponse pour presque tous les conflits de permission set. Choisir un côté est la façon dont la permission d'un collègue disparaît en silence, sans que personne s'en aperçoive avant que quelqu'un ne voie plus un champ.",
    e_dup:
      "Element field is duplicated at this location in type PermissionSetFieldPermissions",
    e_dup_tip:
      "Un bloc <fieldPermissions> nomme un champ : la correction est deux blocs, pas un bloc avec deux lignes <field>.",
    e_failing: "US-062 est en échec, et elle est dans la release",
    e_failing_tip:
      "Une Pull Request en échec n'est pas une décision, c'est une tâche pour son auteur. Renvoyez-la avec un commentaire, et laissez-la ouverte.",
    e_smaller: "La plus grosse est passée en premier",
    e_smaller_tip:
      "Toutes choses égales par ailleurs, mergez la plus petite d'abord : son auteur a moins à refaire si l'autre atterrit mal.",
    info_unsorted:
      "Vos deux blocs n'étaient pas par ordre alphabétique : Salesforce écrit Customer_Tier__c en premier, puis Region__c.",
    tickMerged: "#{{n}} {{title}} mergée dans la branch integration",
    tickDeployed: "Déployé sur l'org d'integration : les deux accès sont là",
    tickBack:
      "Commentaire sur #3 : KeyAccountsServiceTest ne compile pas, addManagers renvoie un Set, pas une List",
    screenBad: "Pas déployable",
    fix_page: "Prenez les deux champs !",
    ok_page: "Les deux champs sur la page d'enregistrement",
    e_pageLostYours: "Customer Tier a disparu de la page d'enregistrement",
    e_pageLostHers: "Le champ Region de Mariia a disparu de la page d'enregistrement",
    e_page_tip: "Chaque côté a ajouté un bloc de champ complet. Accept Incoming seul retire votre champ, Accept Current seul retire celui de Mariia : cliquez sur les deux, et la page montre les deux champs.",
    prList: "Pull Requests · branch integration",
  },
};

/** The strings taken word for word from the labs, checked by scripts/verify/check-easter-egg.mjs. */
export const QUOTES = [
  { lab: "2.7", text: "Accept Incoming" },
  { lab: "2.7", text: "Accept Current" },
  { lab: "2.7", text: "Complete Merge" },
  { lab: "2.7", text: "<<<<<<< HEAD" },
  { lab: "2.7", text: ">>>>>>> origin/integration" },
  { lab: "2.7", text: "<fieldPermissions>" },
  { lab: "2.7", text: "</fieldPermissions>" },
  { lab: "2.7", text: "<editable>true</editable>" },
  { lab: "2.7", text: "<readable>true</readable>" },
  {
    lab: "2.7",
    text: "Element field is duplicated at this location in type PermissionSetFieldPermissions",
  },
  { lab: "3.4", text: "Mariia Pyvovarchuk" },
  { lab: "3.4", text: "Romain Panda" },
];

// The three Pull Requests of the Friday release: the two green ones share Sales_Manager
const PRS = {
  "052": {
    n: 1,
    title: "US-052 Delivery date on opportunities",
    author: "Mariia Pyvovarchuk",
    ok: true,
    touches: "Opportunity Layout, Sales_Manager",
    size: "sizeBig",
  },
  "056": {
    n: 2,
    title: "US-056 Case escalation email",
    author: "Romain Panda",
    ok: true,
    touches: "Sales_Manager",
    size: "sizeSmall",
  },
  "062": {
    n: 3,
    title: "US-062 Key accounts group",
    author: "Mariia Pyvovarchuk",
    ok: false,
    touches: "KeyAccountsService",
    size: "sizeFail",
  },
};

// The record page: each side added one field block at the same place
const PAGE_FIELDS = {
  in: [
    "<itemInstances>",
    "    <fieldInstance>",
    "        <fieldItem>Record.Region__c</fieldItem>",
    "    </fieldInstance>",
    "</itemInstances>",
  ],
  cur: [
    "<itemInstances>",
    "    <fieldInstance>",
    "        <fieldItem>Record.Customer_Tier__c</fieldItem>",
    "    </fieldInstance>",
    "</itemInstances>",
  ],
};

export function createWorld(ctx) {
  const { THREE, t, hud, pig, paint } = ctx;
  const camera = ctx.camera;
  const disposables = [];

  /* ---------- The office, in 3D ---------- */

  const box = paint.geometry("w5-box", () => new THREE.BoxGeometry(1, 1, 1));
  const plane = paint.geometry("w5-plane", () => new THREE.PlaneGeometry(1, 1));
  const cylinder = paint.geometry(
    "w5-cyl",
    () => new THREE.CylinderGeometry(0.5, 0.5, 1, 20),
  );
  const wood = paint.plain(0xf5d7a1);
  const dark = paint.plain(0x2b2b2b, { roughness: 0.4 });
  const steel = paint.plain(0x0176d3, { roughness: 0.5 });

  function block(material, w, h, d, x, y, z, parent) {
    const mesh = new THREE.Mesh(box, material);
    mesh.scale.set(w, h, d);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    (parent || ctx.root).add(mesh);
    return mesh;
  }

  /**
   * A model of the office pack at a place, or null when the pack did not load
   * (the world then draws its own shapes). Small things cast no shadow.
   */
  function model(name, options, x, y, z, turn, parent) {
    const copy = ctx.models ? ctx.models.get(name, options) : null;
    if (!copy) {
      return null;
    }
    copy.position.set(x, y, z);
    copy.rotation.y = turn || 0;
    (parent || ctx.root).add(copy);
    return copy;
  }

  const floor = new THREE.Mesh(
    plane,
    paint.plain(0xfdf6e9, { roughness: 0.9 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.scale.set(14, 10, 1);
  floor.position.set(1, 0, -1);
  floor.receiveShadow = true;
  ctx.root.add(floor);
  const wall = new THREE.Mesh(
    plane,
    paint.plain(0xdff1ff, { roughness: 0.95 }),
  );
  wall.scale.set(14, 4, 1);
  wall.position.set(1, 2, -2.2);
  wall.receiveShadow = true;
  ctx.root.add(wall);
  // Colour on the wall: a Lightning banner of stripes, and rugs on the floor
  const stripeColors = [0x0176d3, 0x06a59a, 0xffb400, 0xe3066a, 0x9050e9];
  stripeColors.forEach((color, i) => {
    const stripe = new THREE.Mesh(
      plane,
      paint.plain(color, { roughness: 0.7 }),
    );
    stripe.scale.set(1.3, 0.22, 1);
    stripe.position.set(-4.4 + i * 1.35, 3.05, -2.19);
    stripe.rotation.z = i % 2 ? 0.04 : -0.04;
    ctx.root.add(stripe);
  });
  if (!model("rugRound", { width: 3.2, shadows: false }, 0.1, 0.005, -0.6)) {
    const rug = new THREE.Mesh(
      cylinder,
      paint.plain(0x7fd6cf, { roughness: 0.95 }),
    );
    rug.scale.set(3, 0.02, 2.4);
    rug.position.set(0.1, 0.01, -0.6);
    rug.receiveShadow = true;
    ctx.root.add(rug);
  }
  if (
    !model("rugRounded", { width: 3, shadows: false }, -3.1, 0.006, -0.8, 0.35)
  ) {
    const herRug = new THREE.Mesh(
      cylinder,
      paint.plain(0xffc7e2, { roughness: 0.95 }),
    );
    herRug.scale.set(2.6, 0.02, 2.2);
    herRug.position.set(-3.1, 0.011, -0.8);
    herRug.receiveShadow = true;
    ctx.root.add(herRug);
  }
  // Two plants: a pot and three round leaves each
  const sphere = paint.geometry(
    "w5-sphere",
    () => new THREE.SphereGeometry(0.5, 16, 12),
  );
  const leaf = paint.plain(0x3ba755, { roughness: 0.7 });
  const pot = paint.plain(0xff5d2d, { roughness: 0.6 });
  for (const [px, pz] of [
    [1.9, -1.8],
    [-5.2, -1.6],
  ]) {
    if (model("pottedPlant", { height: 1.4 }, px, 0, pz)) {
      continue;
    }
    const plant = new THREE.Group();
    plant.position.set(px, 0, pz);
    ctx.root.add(plant);
    const base = new THREE.Mesh(cylinder, pot);
    base.scale.set(0.5, 0.5, 0.5);
    base.position.y = 0.25;
    plant.add(base);
    for (const [lx, ly, lz, r] of [
      [0, 0.85, 0, 0.6],
      [0.22, 1.2, 0.05, 0.42],
      [-0.2, 1.1, -0.05, 0.4],
    ]) {
      const ball = new THREE.Mesh(sphere, leaf);
      ball.scale.setScalar(r);
      ball.position.set(lx, ly, lz);
      plant.add(ball);
    }
  }
  model("sideTable", { height: 0.7 }, 2.3, 0, -1.6);
  model(
    "kitchenCoffeeMachine",
    { height: 0.55, shadows: false },
    2.3,
    0.7,
    -1.6,
    -0.4,
  );
  model("loungeSofa", { width: 2.6 }, -6.4, 0, -1.4, 0.5);
  if (!model("cloudity-logo", { height: 0.95 }, -1.8, 2.15, -2.1, Math.PI)) {
    const plaque = new THREE.Mesh(plane, paint.plaque());
    plaque.scale.set(1.1, 0.53, 1);
    plaque.position.set(1.8, 1.75, -2.18);
    ctx.root.add(plaque);
  }

  /** A desk with its monitor, facing +Z. Returns the screen mesh. */
  function desk(x, z, screenMaterial) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    // Built at a person's size, then grown: the guinea pig is the hero, not to scale
    group.scale.setScalar(DESK_SCALE);
    ctx.root.add(group);
    const top = model("desk", { width: 1.8 }, 0, 0, 0, 0, group);
    if (top) {
      const height = new THREE.Box3().setFromObject(top).max.y;
      const monitor = ctx.models.get("computerScreen", { width: 1.2 });
      if (monitor) {
        monitor.position.set(0, height, -0.15);
        // The picture sits in front of the model's own screen, on its upper part
        const frame = new THREE.Box3().setFromObject(monitor);
        const size = frame.getSize(new THREE.Vector3());
        group.add(monitor);
        const screen = new THREE.Mesh(plane, screenMaterial);
        screen.scale.set(size.x * 0.88, size.y * 0.62, 1);
        screen.position.set(0, frame.min.y + size.y * 0.6, frame.max.z + 0.01);
        group.add(screen);
        model(
          "computerKeyboard",
          { width: 0.62, shadows: false },
          0,
          height,
          0.2,
          0,
          group,
        );
        return { group, screen, top: height };
      }
    }
    block(wood, 1.7, 0.06, 0.7, 0, 0.5, 0, group);
    for (const [lx, lz] of [
      [-0.78, -0.28],
      [0.78, -0.28],
      [-0.78, 0.28],
      [0.78, 0.28],
    ]) {
      block(steel, 0.05, 0.5, 0.05, lx, 0.25, lz, group);
    }
    block(dark, 0.08, 0.3, 0.08, 0, 0.66, -0.18, group);
    block(dark, 0.36, 0.03, 0.2, 0, 0.545, -0.18, group);
    block(dark, 1.12, 0.7, 0.05, 0, 1.08, -0.2, group);
    const screen = new THREE.Mesh(plane, screenMaterial);
    screen.scale.set(1.04, 0.62, 1);
    screen.position.set(0, 1.08, -0.172);
    group.add(screen);
    block(paint.plain(0xdddddd), 0.6, 0.025, 0.18, 0, 0.545, 0.17, group);
    return { group, screen, top: 0.53 };
  }

  // The guinea pig's monitor shows where the merge stands
  const screens = {};
  function screenMaterial(kind) {
    if (!screens[kind]) {
      const texture = paint.texture(
        "w5-screen-" + kind + ctx.lang,
        512,
        304,
        (c, w, h) => drawScreen(c, w, h, kind, t),
      );
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        toneMapped: false,
      });
      disposables.push(material);
      screens[kind] = material;
    }
    return screens[kind];
  }
  const mine = desk(0, -1.5, screenMaterial("permset"));
  const mug = new THREE.Mesh(cylinder, paint.plain(0x0176d3));
  mug.scale.set(0.1, 0.13, 0.1);
  mug.position.set(0.62, mine.top + 0.07, 0.1);
  mine.group.add(mug);

  // Mariia's desk, to the right: her US-018 on screen, her chair, her name
  const herCard = new THREE.MeshBasicMaterial({
    map: paint.texture("w5-her-screen", 512, 304, (c, w, h) =>
      drawBig(c, w, h, SLDS.purple, "branch", "US-018"),
    ),
    toneMapped: false,
  });
  disposables.push(herCard);
  const hers = desk(-3.4, -1.5, herCard);
  hers.group.rotation.y = 0.35;
  const chair = new THREE.Group();
  chair.position.set(-3.1, 0, -0.45);
  chair.rotation.y = 0.35;
  chair.scale.setScalar(DESK_SCALE);
  ctx.root.add(chair);
  if (!model("chairDesk", { height: 1.0 }, 0, 0, 0, Math.PI, chair)) {
    const purple = paint.plain(0x9050e9);
    block(purple, 0.5, 0.07, 0.5, 0, 0.42, 0, chair);
    block(purple, 0.5, 0.55, 0.07, 0, 0.72, 0.24, chair);
    block(steel, 0.06, 0.4, 0.06, 0, 0.2, 0, chair);
  }
  // Mariia herself, on her chair: she turns to the guinea pig when she talks
  const mariia = new THREE.Group();
  mariia.position.set(0, 0.46, 0.02);
  chair.add(mariia);
  const capsule = paint.geometry(
    "w5-capsule",
    () => new THREE.CapsuleGeometry(0.15, 0.26, 6, 12),
  );
  const torso = new THREE.Mesh(
    capsule,
    paint.plain(0xe3066a, { roughness: 0.6 }),
  );
  torso.position.y = 0.3;
  mariia.add(torso);
  const head = new THREE.Group();
  head.position.y = 0.66;
  mariia.add(head);
  const face = new THREE.Mesh(
    sphere,
    paint.plain(0xf1c8a8, { roughness: 0.7 }),
  );
  face.scale.setScalar(0.25);
  head.add(face);
  const hairMaterial = paint.plain(0x4a2a1a, { roughness: 0.8 });
  const hair = new THREE.Mesh(sphere, hairMaterial);
  hair.scale.set(0.27, 0.22, 0.27);
  hair.position.set(0, 0.04, 0.03);
  head.add(hair);
  const bun = new THREE.Mesh(sphere, hairMaterial);
  bun.scale.setScalar(0.12);
  bun.position.set(0, 0.1, 0.13);
  head.add(bun);
  const herSign = paint.sign("w5-mariia", "Mariia", {
    color: SLDS.purple,
    height: 0.42,
  });
  herSign.position.set(-3.1, 2.6, -0.5);
  ctx.root.add(herSign);
  let talking = 0;
  let herTurn = 0;
  let clockHead = 0;

  /* ---------- The Salesforce things on the desks ---------- */

  // The items of the salesforce pack face -Z: turned to the camera, at +X +Z
  const TO_CAMERA = Math.atan2(CAMERA_WIDE.x, CAMERA_WIDE.z);
  const deskTop = mine.top * DESK_SCALE;

  function item(name, height, x, y, z, turn) {
    const node = model(
      name,
      { height, shadows: false },
      x,
      y,
      z,
      turn === undefined ? TO_CAMERA : turn,
    );
    if (node) {
      node.userData.base = node.scale.x;
    }
    return node;
  }

  // What each conflict is about, on both desks: the permission set, then the record page
  const roundItems = {
    1: [
      item("permission-set", 0.7, 0.95, deskTop, -1.15),
      item("permission-set", 0.7, -2.75, deskTop, -1.1),
    ],
    2: [
      item("record", 0.7, 0.95, deskTop, -1.15),
      item("record", 0.7, -2.75, deskTop, -1.1),
    ],
  };
  // Round 3: the three Pull Requests over the desk, in the order the player sets
  const prItems = {};
  for (const id of Object.keys(PRS)) {
    const node = item("pull-request", 0.42, 0, deskTop + 0.3, -1.15);
    if (node) {
      const sign = paint.sign("w5-pr-" + id, "US-" + id, {
        color: PRS[id].ok ? SLDS.success : SLDS.error,
        height: 0.24,
      });
      ctx.root.add(sign);
      prItems[id] = { node, sign, x: 0, z: -1.15 };
    }
  }
  // Victor's sticky note on the desk, until it is found in the editor
  const noteItem = item("note", 0.32, -0.95, deskTop, -1.2);
  let notePop = -1;
  // A big tick or cross over the monitor when a merge goes right or wrong
  const marks = {
    pass: item("check-pass", 0.6, 1.0, 2.0, -1.2),
    fail: item("check-fail", 0.6, 1.0, 2.0, -1.2),
  };
  let markNode = null;
  let markTime = 0;

  for (const node of [marks.pass, marks.fail]) {
    if (node) {
      node.visible = false;
    }
  }
  let itemClock = 0;

  function showMark(kind) {
    if (markNode) {
      markNode.visible = false;
    }
    markNode = marks[kind];
    markTime = 1.4;
  }

  function animateItems(dt) {
    itemClock += dt;
    for (const [n, list] of Object.entries(roundItems)) {
      for (const node of list) {
        if (node) {
          node.visible = Number(n) === round;
        }
      }
    }
    r3.order.forEach((id, i) => {
      const pr = prItems[id];
      if (!pr) {
        return;
      }
      const shown = round === 3;
      pr.node.visible = shown;
      pr.sign.visible = shown;
      const back = r3.back && id === "062";
      const ease = Math.min(1, dt * 5);
      pr.x += ((back ? -2.3 : -0.8 + i * 0.8) - pr.x) * ease;
      pr.z += ((back ? -0.6 : -1.15) - pr.z) * ease;
      const y =
        deskTop +
        0.3 +
        Math.sin(itemClock * 2 + i) * 0.04 +
        (r3.merged.includes(id) ? 0.3 : 0);
      pr.node.position.set(pr.x, y, pr.z);
      pr.sign.position.set(pr.x, y + 0.62, pr.z);
    });
    if (noteItem && noteItem.visible) {
      if (notePop >= 0) {
        notePop += dt;
        noteItem.scale.setScalar(noteItem.userData.base * (1 + notePop * 4));
        noteItem.position.y = deskTop + notePop * 2;
        noteItem.visible = notePop < 0.35;
      } else {
        noteItem.rotation.z = Math.sin(itemClock * 3) * 0.08;
      }
    }
    if (markNode) {
      markTime -= dt;
      const pop = Math.min(1, (1.4 - markTime) * 7);
      markNode.visible = markTime > 0;
      markNode.scale.setScalar(markNode.userData.base * pop);
      markNode.rotation.y = TO_CAMERA + Math.sin(itemClock * 5) * 0.2;
      if (markTime <= 0) {
        markNode = null;
      }
    }
  }

  const HOME = new THREE.Vector3(0, 0, 0);
  // Turned a little to the camera: from straight behind it is only a coat
  const HOME_FACE = -0.8;
  pig.setSitting(true);
  pig.object.position.copy(HOME);
  pig.object.rotation.y = HOME_FACE;
  pig.state = {
    running: false,
    airborne: false,
    ducking: false,
    speed: 0,
    height: 0,
  };

  /* ---------- The merge editor, in HTML ---------- */

  const win = el("div", "gr-w5", hud.layer);
  const titlebar = el("div", "gr-w5-titlebar", win);
  el("span", "gr-w5-dots", titlebar, "● ● ●");
  const fileName = el("span", "gr-w5-file", titlebar);
  const roundPill = el("span", "gr-w5-roundpill", titlebar);
  const timer = el("div", "gr-w5-timer", win);
  const timerFill = el("i", "", timer);
  const toolbar = el("div", "gr-w5-toolbar", win);
  const body = el("div", "gr-w5-body gr-scroll", win);
  const footer = el("div", "gr-w5-footer", win);
  const stamp = el("div", "gr-w5-stamp", win);
  stamp.setAttribute("aria-live", "polite");

  /* ---------- State ---------- */

  // The mistakes already paid for, and what was done differently from the best path
  const mistakes = new Set();
  const missed = [];

  let round = 1;
  let step = "merge";
  let resolved = 0;
  let noteFound = false;
  let busy = false;
  let clock = 0;
  let roundTime = 0;
  const timers = [];
  // Round 1: which sides were accepted, in the order they were, and the split
  const r1 = { accepted: [], split: false };
  // Round 2: which sides of the record page were accepted, in order
  const r2 = { accepted: [] };
  // Round 3: the order of the cards, and the one picked up with the keyboard
  const r3 = {
    order: ["052", "056", "062"],
    grabbed: null,
    merged: [],
    back: false,
  };

  // The keyboard: rows of buttons, and where the cursor is
  let rows = [];
  let cursor = { row: 0, col: 0 };

  // The guinea pig: a hop when right, a shake when wrong
  let hop = 0;
  let wobble = 0;

  function later(seconds, fn) {
    timers.push({ at: clock + seconds, fn });
  }

  // Where the confetti of a good move goes: the guinea pig's monitor
  const MONITOR = new THREE.Vector3(0, 1.6, -1.7);
  let shake = 0;
  let lastGoal = null;

  function happy(big) {
    ctx.sound.play(big ? "happy" : "wheek");
    hop = 0.4;
    ctx.fx.burst(MONITOR.x, MONITOR.y, MONITOR.z, {
      count: big ? 60 : 18,
      speed: big ? 4 : 2.5,
      up: big ? 4 : 2.5,
      life: big ? 1.4 : 0.9,
    });
  }

  function spark(count) {
    ctx.fx.burst(MONITOR.x, MONITOR.y, MONITOR.z, {
      count,
      speed: 2.2,
      up: 2.2,
      life: 0.8,
    });
  }

  function coach(key) {
    hud.coach(t(key), 2400);
  }

  /** The goal line: always the next thing to do, set only when it changes. */
  function setGoal(key) {
    if (key !== lastGoal) {
      lastGoal = key;
      hud.goal(key ? t(key) : "");
    }
  }

  function goalKey() {
    if (round === 1) {
      if (r1.accepted.length < 2) {
        return "g_r1_take";
      }
      if (!r1.split) {
        return "g_r1_split";
      }
      return r1.accepted[0] === "cur" ? "g_complete" : "g_r1_sort";
    }
    if (round === 2) {
      return r2.accepted.length < 2 ? "g_r1_take" : "g_complete";
    }
    return r3.merged.length || busy ? "g_r3_merge" : "g_r3";
  }

  /** The buttons that move the merge on glow, so nobody wonders what to press. */
  function markNext() {
    const buttons = [...win.querySelectorAll(".gr-w5-btn")];
    const byText = (text) => buttons.filter((b) => b.textContent === text);
    let next = [];
    if (round < 3) {
      next = buttons.filter((b) => b.classList.contains("gr-w5-lensbtn"));
      if (round === 1 ? r1.split : r2.accepted.length === 2) {
        next.push(...byText("Complete Merge"));
      }
    }
    for (const b of next) {
      b.classList.add("is-next");
    }
  }

  /**
   * A mistake costs one attempt the first time only: the same mistake again
   * shakes the guinea pig and shows the tip, and the tip stays on screen.
   * The slips that teach nothing new (a file left with its markers, one side
   * forgotten, an order to fix) cost a few points and never an attempt, so a
   * player who reads the tips always finishes.
   */
  function wrong(key, title, tip, screen) {
    wobble = 1;
    if (ctx.engine.motion) {
      shake = 0.35;
    }
    coach("fix_" + key);
    showMark("fail");
    showScreen(screen || "bad");
    if (mistakes.has(key) || FREE_MISTAKES.includes(key)) {
      ctx.sound.play("wrong");
      hud.toast(title, "bad");
      hud.tip(tip);
      ctx.points(-SLIP_POINTS);
      mistakes.add(key);
    } else {
      mistakes.add(key);
      ctx.loseAttempt(title, tip);
    }
    // The cursor goes back to what needs fixing, never stays on the button that failed
    cursorOn(round === 1 && !noteFound ? 1 : 0);
    if (ctx.playing) {
      later(1.4, () => showScreen(currentScreen()));
    }
  }

  function showScreen(kind) {
    mine.screen.material = screenMaterial(kind);
  }

  function currentScreen() {
    if (round === 1) {
      return "permset";
    }
    if (round === 2) {
      return "pageconflict";
    }
    return "prs";
  }

  function publish() {
    ctx.setData("resolved", resolved);
    ctx.setData("round", round);
    ctx.setData("step", step);
  }

  /* ---------- Rendering ---------- */

  function render() {
    rows = [];
    body.replaceChildren();
    toolbar.replaceChildren();
    footer.replaceChildren();
    roundPill.textContent = t("round", { n: round });
    win.setAttribute("data-round", String(round));
    if (round === 1) {
      renderPermissionSet();
    } else if (round === 2) {
      renderPage();
    } else {
      renderPullRequests();
    }
    const hint = el(
      "span",
      "gr-w5-hint",
      footer,
      hud.touch
        ? t(round === 3 ? "touchR3" : "touch")
        : t(round === 3 ? "keysR3" : "keys"),
    );
    hint.setAttribute("aria-hidden", "true");
    footer.appendChild(footerButtons);
    markNext();
    setGoal(goalKey());
    clampCursor();
    paintCursor();
    publish();
  }

  // The footer buttons of the step being rendered (Complete Merge...)
  let footerButtons = document.createElement("div");

  function newFooter() {
    footerButtons = document.createElement("div");
    footerButtons.className = "gr-w5-footer-buttons";
    return footerButtons;
  }

  function task(text, extra) {
    el("p", "gr-w5-task", toolbar, text);
    if (extra) {
      toolbar.appendChild(extra);
    }
  }

  function button(parent, label, className, onPress) {
    const node = el(
      "button",
      "gr-button gr-w5-btn " + (className || ""),
      parent,
      label,
    );
    node.type = "button";
    node.tabIndex = -1;
    node.addEventListener("click", (event) => {
      event.preventDefault();
      node.blur();
      if (node.__dragged) {
        node.__dragged = false;
        return;
      }
      if (busy || !ctx.playing) {
        return;
      }
      moveCursorTo(node);
      onPress();
    });
    node.__press = onPress;
    return node;
  }

  function pane(parent, kind, title, detail) {
    const section = el("section", "gr-w5-pane gr-w5-pane--" + kind, parent);
    const head = el("header", "", section);
    el("strong", "", head, title);
    if (detail) {
      el("code", "", head, detail);
    }
    return el("div", "gr-w5-code", section);
  }

  let lineNumber = 0;
  function line(parent, text, kind) {
    lineNumber += 1;
    const node = el("div", "gr-w5-line" + (kind ? " is-" + kind : ""), parent);
    el("span", "gr-w5-ln", node, String(lineNumber));
    codeText(node, text);
    return node;
  }

  function lines(parent, list, kind) {
    for (const text of list) {
      line(parent, text, kind);
    }
  }

  function lens(parent) {
    return el("div", "gr-w5-lens", parent);
  }

  function done(parent, text) {
    return el("span", "gr-w5-done", parent, text || t("accepted"));
  }

  /** Victor's line, at the top of the Incoming file: a row above the first conflict. */
  function noteRow(parent) {
    if (noteFound) {
      return;
    }
    lineNumber += 1;
    const node = button(parent, "", "gr-w5-line gr-w5-noteline", () => {
      noteFound = true;
      notePop = 0;
      ctx.foundNote();
      ctx.sound.play("wheek");
      render();
    });
    node.replaceChildren();
    el("span", "gr-w5-ln", node, String(lineNumber));
    codeText(node, t("noteLine"));
    rows.push([node]);
  }

  function renderPermissionSet() {
    fileName.textContent = PERMSET_FILE;
    task(t("r1_task"));
    const grid = el("div", "gr-w5-grid", body);
    const accept = [];
    const hasIn = r1.accepted.includes("in");
    const hasCur = r1.accepted.includes("cur");

    const incoming = pane(grid, "in", "Incoming", "origin/integration");
    lineNumber = 0;
    noteRow(incoming);
    lines(incoming, ["<fieldPermissions>", "    <editable>true</editable>"]);
    const lensIn = lens(incoming);
    if (hasIn) {
      done(lensIn);
    } else {
      accept.push(
        button(lensIn, "Accept Incoming", "gr-w5-lensbtn", () =>
          acceptPermission("in"),
        ),
      );
    }
    line(incoming, FIELD_HERS, "in");
    lines(incoming, ["    <readable>true</readable>", "</fieldPermissions>"]);

    const current = pane(grid, "cur", "Current", "HEAD");
    lineNumber = 0;
    lines(current, ["<fieldPermissions>", "    <editable>true</editable>"]);
    const lensCur = lens(current);
    if (hasCur) {
      done(lensCur);
    } else {
      accept.push(
        button(lensCur, "Accept Current", "gr-w5-lensbtn", () =>
          acceptPermission("cur"),
        ),
      );
    }
    line(current, FIELD_YOURS, "cur");
    lines(current, ["    <readable>true</readable>", "</fieldPermissions>"]);
    if (accept.length) {
      rows.push(accept);
    }

    const result = pane(grid, "res", "Result", PERMSET_FILE);
    lineNumber = 0;
    lines(result, ["<fieldPermissions>", "    <editable>true</editable>"]);
    if (!r1.accepted.length) {
      line(result, HEAD, "marker");
      line(result, FIELD_YOURS, "cur");
      line(result, SPLIT, "marker");
      line(result, FIELD_HERS, "in");
      line(result, THEIRS, "marker");
    } else {
      const fieldOf = (side) => (side === "in" ? FIELD_HERS : FIELD_YOURS);
      line(result, fieldOf(r1.accepted[0]), r1.accepted[0]);
      if (r1.split) {
        lines(
          result,
          [
            "    <readable>true</readable>",
            "</fieldPermissions>",
            "<fieldPermissions>",
            "    <editable>true</editable>",
          ],
          "add",
        );
      }
      if (r1.accepted[1]) {
        line(result, fieldOf(r1.accepted[1]), r1.accepted[1]);
      }
    }
    lines(result, ["    <readable>true</readable>", "</fieldPermissions>"]);
    if (r1.accepted.length === 2) {
      const fix = lens(result);
      fix.classList.add("gr-w5-lens--result");
      if (!r1.split) {
        rows.push([button(fix, t("split"), "gr-w5-lensbtn", splitBlocks)]);
      } else if (r1.accepted[0] !== "cur") {
        rows.push([button(fix, t("sort"), "gr-w5-lensbtn", sortBlocks)]);
      }
    }
    const buttons = newFooter();
    rows.push([
      button(buttons, "Complete Merge", "gr-w5-primary", completePermissionSet),
    ]);
  }

  function renderPage() {
    fileName.textContent = PAGE_FILE;
    task(t("r2_task"));
    const grid = el("div", "gr-w5-grid", body);
    const accept = [];
    for (const [side, title, detail, label] of [
      ["in", "Incoming", "origin/integration", "Accept Incoming"],
      ["cur", "Current", "HEAD", "Accept Current"],
    ]) {
      const code = pane(grid, side, title, detail);
      lineNumber = 0;
      const box = lens(code);
      if (r2.accepted.includes(side)) {
        done(box);
      } else {
        accept.push(
          button(box, label, "gr-w5-lensbtn", () => acceptPage(side)),
        );
      }
      lines(code, PAGE_FIELDS[side], side);
    }
    if (accept.length) {
      rows.push(accept);
    }
    const result = pane(grid, "res", "Result", PAGE_FILE);
    lineNumber = 0;
    if (!r2.accepted.length) {
      line(result, HEAD, "marker");
      lines(result, PAGE_FIELDS.cur, "cur");
      line(result, SPLIT, "marker");
      lines(result, PAGE_FIELDS.in, "in");
      line(result, THEIRS, "marker");
    } else {
      for (const side of r2.accepted) {
        lines(result, PAGE_FIELDS[side], side);
      }
    }
    const buttons = newFooter();
    rows.push([
      button(buttons, "Complete Merge", "gr-w5-primary", completePage),
    ]);
  }

  function renderPullRequests() {
    fileName.textContent = t("prList");
    task(t("r3_task"));
    const list = el("ol", "gr-w5-prs", body);
    r3.order.forEach((id, i) => {
      const pr = PRS[id];
      const item = el("li", "gr-w5-pritem", list);
      el(
        "span",
        "gr-w5-slot" + (i === 2 ? " is-back" : ""),
        item,
        t("slot" + (i + 1)),
      );
      const card = button(
        item,
        "",
        "gr-w5-pr" +
          (r3.grabbed === id ? " is-grabbed" : "") +
          (r3.merged.includes(id) ? " is-merged" : "") +
          (r3.back && id === "062" ? " is-back" : ""),
        () => grabCard(id),
      );
      card.replaceChildren();
      card.setAttribute("data-pr", id);
      const head = el("span", "gr-w5-prhead", card);
      el("span", "gr-w5-prnum", head, "#" + pr.n);
      el("strong", "", head, pr.title);
      const meta = el("span", "gr-w5-prmeta", card);
      el(
        "span",
        "gr-w5-check " + (pr.ok ? "is-ok" : "is-ko"),
        meta,
        pr.ok ? t("checksGreen") : t("checksFailing"),
      );
      el("span", "", meta, pr.author);
      el("span", "gr-w5-prtouch", card, pr.touches + " · " + t(pr.size));
      if (r3.merged.includes(id)) {
        el("span", "gr-w5-prstate is-merged", card, t("merged"));
      } else if (r3.back && id === "062") {
        el("span", "gr-w5-prstate is-back", card, t("backToAuthor"));
      }
      const arrows = el("span", "gr-w5-arrows", item);
      const up = button(arrows, "▲", "gr-w5-move", () => moveCard(id, -1));
      up.setAttribute("aria-label", t("moveUp"));
      const down = button(arrows, "▼", "gr-w5-move", () => moveCard(id, 1));
      down.setAttribute("aria-label", t("moveDown"));
      card.addEventListener("pointerdown", (event) =>
        startDrag(event, card, id, list),
      );
      rows.push([card, up, down]);
    });
    const buttons = newFooter();
    rows.push([
      button(buttons, t("mergeOrder"), "gr-w5-primary", mergeInOrder),
    ]);
  }

  /* ---------- The keyboard cursor ---------- */

  function clampCursor() {
    if (!rows.length) {
      cursor = { row: 0, col: 0 };
      return;
    }
    cursor.row = Math.max(0, Math.min(cursor.row, rows.length - 1));
    cursor.col = Math.max(0, Math.min(cursor.col, rows[cursor.row].length - 1));
  }

  function paintCursor() {
    for (const node of win.querySelectorAll(".is-cursor")) {
      node.classList.remove("is-cursor");
    }
    const node = rows[cursor.row] && rows[cursor.row][cursor.col];
    if (node) {
      node.classList.add("is-cursor");
      if (node.scrollIntoView) {
        node.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    }
  }

  function moveCursorTo(node) {
    rows.forEach((row, r) => {
      const c = row.indexOf(node);
      if (c >= 0) {
        cursor = { row: r, col: c };
      }
    });
  }

  /** Puts the cursor on the first row holding a button with this class, or on a row. */
  function cursorOn(rowIndex) {
    cursor = { row: rowIndex, col: 0 };
    clampCursor();
    paintCursor();
  }

  /* ---------- Round 1: the permission set ---------- */

  function acceptPermission(side) {
    if (r1.accepted.includes(side)) {
      return;
    }
    r1.accepted.push(side);
    ctx.sound.play("click");
    if (r1.accepted.length === 2) {
      ctx.collect(60, t("ok_both"));
      happy();
      coach("co_read");
    } else {
      spark(10);
    }
    render();
    // The cursor goes where the eye should go next: the Result
    cursorOn(rows.length - 2);
  }

  function splitBlocks() {
    r1.split = true;
    ctx.sound.play("pickup");
    spark(14);
    render();
    cursorOn(rows.length - (r1.accepted[0] === "cur" ? 1 : 2));
  }

  function sortBlocks() {
    r1.accepted.reverse();
    ctx.sound.play("pickup");
    render();
    cursorOn(rows.length - 1);
  }

  function completePermissionSet() {
    const n = r1.accepted.length;
    if (n === 0) {
      wrong("marker", t("e_marker"), t("e_marker_tip"));
      return;
    }
    if (n === 1) {
      wrong(
        "oneSide",
        r1.accepted[0] === "in" ? t("e_lostYours") : t("e_lostHers"),
        t("e_oneSide_tip"),
      );
      return;
    }
    if (!r1.split) {
      wrong("dup", t("e_dup"), t("e_dup_tip"), "dup");
      return;
    }
    const sorted = r1.accepted[0] === "cur";
    if (!sorted) {
      missed.push("info_unsorted");
    }
    resolved += 1;
    ctx.collect(sorted ? 200 : 80, t(sorted ? "ok_r1" : "ok_r1_unsorted"));
    endRound();
  }

  /* ---------- Round 2: the record page ---------- */

  function acceptPage(side) {
    if (r2.accepted.includes(side)) {
      return;
    }
    r2.accepted.push(side);
    ctx.sound.play("click");
    if (r2.accepted.length === 2) {
      ctx.collect(60, t("ok_page"));
      happy();
      coach("co_read");
    } else {
      spark(10);
    }
    render();
    // Both taken: the cursor goes to Complete Merge, else to the other side
    cursorOn(r2.accepted.length === 2 ? rows.length - 1 : 0);
  }

  function completePage() {
    const n = r2.accepted.length;
    if (n === 0) {
      wrong("marker", t("e_marker"), t("e_marker_tip"));
      return;
    }
    if (n === 1) {
      wrong(
        "page",
        r2.accepted[0] === "in" ? t("e_pageLostYours") : t("e_pageLostHers"),
        t("e_page_tip"),
      );
      return;
    }
    resolved += 1;
    ctx.collect(150, "Complete Merge");
    endRound();
  }

  /* ---------- Round 3: three Pull Requests ---------- */

  function grabCard(id) {
    r3.grabbed = r3.grabbed === id ? null : id;
    ctx.sound.play("click");
    render();
  }

  function moveCard(id, delta) {
    const i = r3.order.indexOf(id);
    const j = i + delta;
    if (j < 0 || j >= r3.order.length) {
      return;
    }
    r3.order.splice(i, 1);
    r3.order.splice(j, 0, id);
    ctx.sound.play("click");
    const col = cursor.col;
    render();
    cursor = { row: j, col };
    clampCursor();
    paintCursor();
  }

  // Dragging a card with a finger or a mouse: the list is reordered in place
  function startDrag(event, card, id, list) {
    if (busy || !ctx.playing || event.button > 0) {
      return;
    }
    const startY = event.clientY;
    let dragging = false;
    const item = card.parentNode;
    const move = (e) => {
      if (!dragging && Math.abs(e.clientY - startY) < 8) {
        return;
      }
      if (!dragging) {
        dragging = true;
        item.classList.add("is-dragging");
      }
      e.preventDefault();
      // The new place is the number of other cards whose middle is above the finger
      const items = [...list.children];
      let target = 0;
      for (const other of items) {
        if (other !== item) {
          const rect = (
            other.querySelector(".gr-w5-pr") || other
          ).getBoundingClientRect();
          if (rect.top + rect.height / 2 < e.clientY) {
            target += 1;
          }
        }
      }
      const from = r3.order.indexOf(id);
      if (target !== from) {
        r3.order.splice(from, 1);
        r3.order.splice(target, 0, id);
        const rest = items.filter((other) => other !== item);
        list.insertBefore(item, rest[target] || null);
        ctx.sound.play("click");
      }
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      dragCleanup = null;
      if (dragging) {
        card.__dragged = true;
        window.setTimeout(() => {
          card.__dragged = false;
        }, 50);
        render();
        cursorOn(r3.order.indexOf(id));
      }
    };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    dragCleanup = up;
  }
  let dragCleanup = null;

  function mergeInOrder() {
    r3.grabbed = null;
    if (r3.order[2] !== "062") {
      render();
      wrong("failing", t("e_failing"), t("e_failing_tip"));
      return;
    }
    if (r3.order[0] !== "056") {
      render();
      wrong("smaller", t("e_smaller"), t("e_smaller_tip"));
      return;
    }
    resolved += 1;
    ctx.collect(200, t("ok_r3"));
    happy();
    busy = true;
    win.classList.add("is-busy");
    addTimeBonus();
    publish();
    setGoal("g_r3_merge");
    // One at a time, each deployment finished before the next merge
    later(0.8, () => {
      r3.merged.push("056");
      hud.tick(t("tickMerged", { n: 2, title: PRS["056"].title }));
      hud.chat("romain", t("c_romain3"), 4000);
      ctx.sound.play("gate");
      render();
    });
    later(1.8, () => hud.tick(t("tickDeployed")));
    later(2.6, () => {
      r3.merged.push("052");
      hud.tick(t("tickMerged", { n: 1, title: PRS["052"].title }));
      ctx.sound.play("gate");
      render();
    });
    later(3.5, () => {
      r3.back = true;
      hud.tick(t("tickBack"));
      hud.chat("mariia", t("c_mariia3"), 4000);
      render();
    });
    later(4.6, () => {
      flashStamp(t("stampRelease"), true);
      showScreen("released");
      happy(true);
      ctx.fx.burst(pig.object.position.x, 1.2, pig.object.position.z, {
        count: 80,
        speed: 5,
        up: 6,
        life: 1.8,
      });
    });
    later(6.2, () => {
      stamp.classList.remove("is-shown");
      ctx.finish(0, missed.map((key) => t(key)).join(" "));
    });
  }

  /* ---------- Rounds ---------- */

  function addTimeBonus() {
    const left = Math.max(0, 1 - roundTime / ROUND_SECONDS[round - 1]);
    const bonus = Math.round(TIME_BONUS * left);
    if (bonus > 0) {
      ctx.points(bonus);
      later(1.1, () => hud.toast(t("timeBonus", { n: bonus }), "power"));
    }
  }

  function flashStamp(text, stay) {
    stamp.textContent = text;
    stamp.classList.remove("is-shown");
    void stamp.offsetWidth;
    stamp.classList.add("is-shown");
    if (!stay) {
      later(1.3, () => stamp.classList.remove("is-shown"));
    }
  }

  function endRound() {
    happy(true);
    showMark("pass");
    addTimeBonus();
    busy = true;
    win.classList.add("is-busy");
    flashStamp(t("stampMerge"));
    showScreen("ok");
    publish();
    later(1.6, () => startRound(round + 1));
  }

  function startRound(n) {
    round = n;
    step = n === 3 ? "triage" : "merge";
    roundTime = 0;
    busy = false;
    win.classList.remove("is-busy");
    showScreen(currentScreen());
    render();
    cursorOn(0);
    coach("co_r" + n);
    if (n === 1) {
      // The cursor starts on the conflict, not on Victor's line above it
      cursorOn(noteFound ? 0 : 1);
    }
    if (n === 2) {
      talking = 4;
      hud.chat("mariia", t("c_mariia2"), 5000);
    }
  }

  /* ---------- Camera ---------- */

  const focus = new THREE.Vector3();
  const eye = new THREE.Vector3();
  const wantedFocus = new THREE.Vector3();
  const wantedEye = new THREE.Vector3();
  let cameraReady = false;
  function placeCamera(idle, time, dt) {
    // setViewOffset sets the aspect from its own sizes: it is given the real
    // one every frame, so the engine's portrait test stays right
    const canvas = ctx.engine.renderer.domElement;
    const aspect =
      canvas.clientWidth && canvas.clientHeight
        ? canvas.clientWidth / canvas.clientHeight
        : camera.aspect;
    camera.aspect = aspect;
    const portrait = aspect < 1;
    if (idle) {
      camera.clearViewOffset();
      const a = Math.sin(time * 0.25) * 0.35;
      camera.fov = portrait ? 66 : 52;
      camera.position.set(
        -1.2 + Math.sin(a + 0.5) * 5.5,
        portrait ? 3.2 : 2.7,
        -0.9 + Math.cos(a + 0.5) * 5.5,
      );
      focus.set(-1.2, 0.9, -0.9);
      cameraReady = false;
    } else {
      camera.fov = portrait ? 60 : 50;
      // The editor covers the left of a wide screen and the top of a tall
      // one is free: the picture is shifted so the desk stays in what is left.
      // It follows the guinea pig when it goes over to Mariia's desk.
      if (portrait) {
        camera.setViewOffset(100 * aspect, 100, 0, 25, 100 * aspect, 100);
      } else {
        camera.setViewOffset(
          100 * aspect,
          100,
          -30 * aspect,
          0,
          100 * aspect,
          100,
        );
      }
      if (portrait) {
        wantedFocus.set(pig.object.position.x * 0.9 - 0.1, 0.75, -0.6);
      } else {
        wantedFocus.set(pig.object.position.x * 0.8 - 0.1, 0.85, -0.9);
      }
      const offset = portrait ? CAMERA_TALL : CAMERA_WIDE;
      wantedEye.set(
        wantedFocus.x + offset.x,
        wantedFocus.y + offset.y,
        wantedFocus.z + offset.z,
      );
      const ease = cameraReady ? Math.min(1, dt * 3) : 1;
      focus.lerp(wantedFocus, ease);
      eye.lerp(wantedEye, ease);
      cameraReady = true;
      camera.position.copy(eye);
      if (shake > 0) {
        shake = Math.max(0, shake - dt);
        camera.position.x += (Math.random() - 0.5) * shake * 0.4;
        camera.position.y += (Math.random() - 0.5) * shake * 0.4;
      }
    }
    camera.updateProjectionMatrix();
    camera.lookAt(focus);
    ctx.engine.aimSun(focus.x, focus.z);
  }

  function animatePig(dt) {
    animateItems(dt);
    const state = {
      running: false,
      airborne: false,
      ducking: false,
      speed: 0,
      height: 0,
    };
    hop = Math.max(0, hop - dt);
    const lift = hop > 0 ? Math.sin((hop / 0.4) * Math.PI) * 0.16 : 0;
    pig.object.position.y = lift;
    state.height = lift;
    if (wobble > 0) {
      wobble = Math.max(0, wobble - dt * 1.5);
      pig.hitWobble(wobble);
    }
    // Mariia turns to the guinea pig and nods while she talks
    talking = Math.max(0, talking - dt);
    herTurn += ((talking > 0 ? 1.2 : 0) - herTurn) * Math.min(1, dt * 4);
    mariia.rotation.y = herTurn;
    clockHead += dt;
    head.rotation.x =
      talking > 0
        ? Math.sin(clockHead * 9) * 0.12
        : Math.sin(clockHead * 1.5) * 0.03;
    pig.shadow.position.set(
      pig.object.position.x,
      0.012,
      pig.object.position.z + 0.05,
    );
    pig.state = state;
  }

  // Ready for the intro card
  render();
  cursorOn(1);
  placeCamera(true, 0);

  return {
    start() {
      // guinea-at=N in the page URL starts at round N, for checks
      const first = Math.min(
        3,
        Math.max(1, Math.floor(ctx.params.startAt) || 1),
      );
      startRound(first);
      if (first === 1) {
        hud.chat("mariia", t("c_r1"), 6000);
      }
    },
    update(dt, time) {
      clock += dt;
      if (!busy) {
        roundTime += dt;
      }
      const left = Math.max(0, 1 - roundTime / ROUND_SECONDS[round - 1]);
      timerFill.style.transform = "scaleX(" + left.toFixed(3) + ")";
      timer.classList.toggle("is-low", left < 0.25);
      for (let i = timers.length - 1; i >= 0; i--) {
        if (timers[i].at <= clock) {
          const fn = timers[i].fn;
          timers.splice(i, 1);
          if (ctx.playing) {
            fn();
          }
        }
      }
      animatePig(dt);
      placeCamera(false, time, dt);
    },
    action(name) {
      if (busy || !ctx.playing || !rows.length) {
        return;
      }
      if (name === "jump" || name === "duck") {
        const delta = name === "jump" ? -1 : 1;
        if (round === 3 && r3.grabbed) {
          moveCard(r3.grabbed, delta);
          return;
        }
        cursor.row += delta;
        cursor.col = Math.min(cursor.col, 0);
        ctx.sound.play("click");
      } else if (name === "left" || name === "right") {
        cursor.col += name === "left" ? -1 : 1;
        ctx.sound.play("click");
      } else if (name === "confirm") {
        const node = rows[cursor.row] && rows[cursor.row][cursor.col];
        if (node && node.__press) {
          node.__press();
        }
        return;
      } else {
        return;
      }
      clampCursor();
      paintCursor();
    },
    idleCamera(time) {
      animatePig(0);
      placeCamera(true, time);
    },
    dispose() {
      if (dragCleanup) {
        dragCleanup();
      }
      camera.clearViewOffset();
      camera.fov = 60;
      camera.updateProjectionMatrix();
      pig.hitWobble(0);
      win.remove();
      for (const thing of disposables) {
        thing.dispose();
      }
    },
  };
}

/**
 * A line of XML, with half its indentation, as a hanging indent, and break
 * points after the dots and before closing tags: a long API name wraps on a
 * phone at a place that still reads, and never scrolls sideways.
 */
function codeText(parent, text) {
  const indent = text.length - text.trimStart().length;
  const node = el(
    "span",
    "gr-w5-tx",
    parent,
    text
      .trimStart()
      .replace(/\./g, ".​")
      .replace(/(.)<\//g, "$1​</"),
  );
  node.style.paddingLeft = indent / 2 + 2 + "ch";
  node.style.textIndent = "-2ch";
  return node;
}

function el(tag, className, parent, text) {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  if (text !== undefined && text !== null) {
    node.textContent = text;
  }
  if (parent) {
    parent.appendChild(node);
  }
  return node;
}

/** One glyph and a word or two, big enough to read on the monitor. */
function drawBig(c, w, h, color, icon, word) {
  c.fillStyle = "#1F1F1F";
  c.fillRect(0, 0, w, h);
  c.fillStyle = color;
  rounded(c, 22, 22, w - 44, h - 44, 30);
  c.fill();
  c.beginPath();
  c.arc(w / 2, h * 0.38, 62, 0, Math.PI * 2);
  c.fillStyle = "rgba(255, 255, 255, 0.25)";
  c.fill();
  glyph(c, icon, w / 2, h * 0.38, 110, SLDS.white);
  c.fillStyle = SLDS.white;
  c.textAlign = "center";
  c.textBaseline = "middle";
  fitText(c, word, w / 2, h * 0.76, w - 90, 72, "800");
}

/** The guinea pig's monitor: where the merge stands, in one glyph and a word. */
function drawScreen(c, w, h, kind, t) {
  if (kind === "permset" || kind === "pageconflict") {
    drawBig(c, w, h, SLDS.error, "warning", t("screenConflict"));
  } else if (kind === "ok") {
    drawBig(c, w, h, SLDS.success, "check", t("screenMerged"));
  } else if (kind === "bad") {
    drawBig(c, w, h, SLDS.errorDark, "error", t("screenBad"));
  } else if (kind === "dup") {
    drawBig(c, w, h, SLDS.warningDark, "warning", t("screenDup"));
  } else if (kind === "released") {
    drawBig(c, w, h, SLDS.success, "star", t("screenReleased"));
  } else {
    drawBig(c, w, h, SLDS.navy, "branch", "3 PR");
  }
}

export const CSS = `
/* On a wide screen the editor fills the left: the "Why?" box sits on the right, off its buttons */
@media (min-width: 761px) {
  .guinea-run:has(.gr-w5) .gr-tipbar {
    left: calc(min(60vw, 860px) + 24px + (100% - min(60vw, 860px) - 36px) / 2);
    max-width: calc(100% - min(60vw, 860px) - 48px);
  }
}

.guinea-run .gr-w5 {
  position: absolute;
  top: calc(env(safe-area-inset-top, 0px) + 104px);
  left: calc(env(safe-area-inset-left, 0px) + 12px);
  bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
  display: flex;
  flex-direction: column;
  width: min(60vw, 860px);
  overflow: hidden;
  border: 1px solid #c9c9c9;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 6px 24px rgba(3, 45, 96, 0.3);
  color: #181818;
  font-size: 13px;
  line-height: 1.4;
}
.guinea-run.gr-show-buttons .gr-w5 {
  bottom: calc(env(safe-area-inset-bottom, 0px) + 88px);
}
.guinea-run .gr-w5-titlebar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-bottom: 1px solid #e5e5e5;
  background: #f3f3f3;
}
.guinea-run .gr-w5-dots {
  color: #c9c9c9;
  font-size: 10px;
  letter-spacing: -1px;
}
.guinea-run .gr-w5-file {
  font-variant-ligatures: none;
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.guinea-run .gr-w5-roundpill {
  flex: 0 0 auto;
  padding: 2px 10px;
  border-radius: 999px;
  background: #032d60;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
}
.guinea-run .gr-w5-timer {
  height: 5px;
  background: #e5e5e5;
}
.guinea-run .gr-w5-timer i {
  display: block;
  height: 100%;
  background: #0176d3;
  transform-origin: left center;
  transition: background 0.3s;
}
.guinea-run .gr-w5-timer.is-low i {
  background: #fe9339;
}
.guinea-run .gr-w5-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-bottom: 1px solid #e5e5e5;
}
.guinea-run .gr-w5-task {
  flex: 1 1 260px;
  margin: 0;
  color: #444444;
  font-size: 13px;
}
.guinea-run .gr-w5-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  padding: 8px;
  background: #fafafa;
  overscroll-behavior: contain;
  transition: opacity 0.3s;
}
.guinea-run .gr-w5.is-busy .gr-w5-body {
  opacity: 0.75;
}
.guinea-run .gr-w5-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 8px;
}
.guinea-run .gr-w5-pane {
  min-width: 0;
  border: 1px solid #d8dde6;
  border-radius: 4px;
  background: #ffffff;
}
.guinea-run .gr-w5-pane--res {
  grid-column: 1 / -1;
}
.guinea-run .gr-w5-pane header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  padding: 4px 8px;
  border-bottom: 1px solid #e5e5e5;
  border-left: 4px solid #706e6b;
  font-size: 12px;
}
.guinea-run .gr-w5-pane--in header {
  border-left-color: #0176d3;
}
.guinea-run .gr-w5-pane--cur header {
  border-left-color: #2e844a;
}
.guinea-run .gr-w5-pane header code {
  overflow: hidden;
  color: #706e6b;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.guinea-run .gr-w5-code {
  padding: 4px 0;
  font-variant-ligatures: none;
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 12px;
  line-height: 1.55;
}
.guinea-run .gr-w5-line {
  display: flex;
  width: 100%;
  min-height: 0;
  margin: 0;
  padding: 0 6px 0 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: #181818;
  font: inherit;
  text-align: left;
}
.guinea-run .gr-w5-ln {
  flex: 0 0 26px;
  padding-right: 6px;
  color: #a0a0a0;
  text-align: right;
  user-select: none;
}
.guinea-run .gr-w5-tx {
  flex: 1 1 auto;
  min-width: 0;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}
.guinea-run .gr-w5-line.is-in {
  background: #dcecfc;
}
.guinea-run .gr-w5-line.is-cur {
  background: #dff3e4;
}
.guinea-run .gr-w5-line.is-marker {
  background: #fde7e9;
  color: #ba0517;
  font-weight: 700;
}
.guinea-run .gr-w5-line.is-add {
  background: #fff1dc;
}
.guinea-run .gr-w5-btn.gr-w5-noteline {
  min-height: 0;
  padding: 0 6px 0 0;
  border: 0;
  font-size: 12px;
  font-family: 'JetBrains Mono', Consolas, monospace;
  color: #8a8a8a;
  font-style: italic;
  font-weight: 400;
  cursor: pointer;
}
.guinea-run .gr-w5-btn.gr-w5-noteline:hover {
  background: #fff8c5;
  color: #444444;
}
.guinea-run .gr-w5-lens {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 2px 6px 2px 32px;
}
.guinea-run .gr-w5-lens:empty {
  display: none;
}
.guinea-run .gr-w5-lens--result {
  padding-top: 6px;
}
.guinea-run .gr-w5-btn {
  min-height: 34px;
  padding: 4px 12px;
  font-size: 13px;
  font-family: 'Open Sans', 'Segoe UI', Arial, sans-serif;
}
.guinea-run .gr-w5-lensbtn {
  min-height: 30px;
  padding: 2px 10px;
  font-size: 12px;
}
.guinea-run .gr-w5-btn.is-next {
  border-color: #ff9a00;
  animation: gr-w5-glow 1.1s ease-in-out infinite;
}
@keyframes gr-w5-glow {
  50% {
    box-shadow: 0 0 0 5px rgba(255, 180, 0, 0.55);
    transform: scale(1.04);
  }
}
.guinea-run .gr-w5-primary {
  border-color: #0176d3;
  background: #0176d3;
  color: #ffffff;
}
.guinea-run .gr-w5-primary:hover {
  background: #014486;
}
.guinea-run .gr-w5-done {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  color: #2e844a;
  font-family: 'Open Sans', 'Segoe UI', Arial, sans-serif;
  font-size: 12px;
  font-weight: 700;
}
.guinea-run .gr-w5-done::before {
  content: "\\2713";
  margin-right: 5px;
}
.guinea-run .gr-w5 .is-cursor {
  outline: 3px solid #fe9339;
  outline-offset: 1px;
  box-shadow: 0 0 0 5px rgba(254, 147, 57, 0.25);
}
.guinea-run .gr-w5-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border-top: 1px solid #e5e5e5;
  background: #ffffff;
}
.guinea-run .gr-w5-hint {
  color: #706e6b;
  font-size: 12px;
}
.guinea-run .gr-w5-footer-buttons {
  display: flex;
  gap: 8px;
  margin-left: auto;
}
.guinea-run .gr-w5-stamp {
  position: absolute;
  top: 45%;
  left: 50%;
  z-index: 3;
  padding: 12px 22px;
  border: 3px solid #ffffff;
  border-radius: 12px;
  background: #2e844a;
  box-shadow: 0 8px 30px rgba(3, 45, 96, 0.35);
  color: #ffffff;
  font-size: 22px;
  font-weight: 800;
  text-align: center;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(0.4) rotate(-8deg);
}
.guinea-run .gr-w5-stamp.is-shown {
  animation: gr-w5-stamp 0.45s cubic-bezier(0.2, 1.6, 0.4, 1) forwards;
}
.guinea-run .gr-w5-stamp::before {
  content: "\\2713  ";
}
.guinea-run .gr-w5-prs {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.guinea-run .gr-w5-pritem {
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
}
.guinea-run .gr-w5-pritem.is-dragging .gr-w5-pr {
  box-shadow: 0 8px 20px rgba(3, 45, 96, 0.3);
  transform: scale(1.02);
}
.guinea-run .gr-w5-slot {
  color: #032d60;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}
.guinea-run .gr-w5-slot.is-back {
  color: #ba0517;
}
.guinea-run .gr-w5-pr {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 3px;
  min-width: 0;
  padding: 8px 10px;
  color: #181818;
  font-weight: 400;
  text-align: left;
  cursor: grab;
  touch-action: none;
  user-select: none;
}
.guinea-run .gr-w5-pr.is-grabbed {
  border-color: #fe9339;
  background: #fff6ee;
  transform: scale(1.02);
}
.guinea-run .gr-w5-pr.is-merged {
  border-color: #2e844a;
  background: #eef8f0;
}
.guinea-run .gr-w5-pr.is-back {
  border-color: #ba0517;
  background: #fdf0f1;
}
.guinea-run .gr-w5-prhead {
  display: flex;
  align-items: baseline;
  gap: 6px;
}
.guinea-run .gr-w5-prnum {
  color: #706e6b;
  font-weight: 700;
}
.guinea-run .gr-w5-prmeta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: #444444;
  font-size: 12px;
}
.guinea-run .gr-w5-prtouch {
  color: #706e6b;
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 12px;
  overflow-wrap: anywhere;
}
.guinea-run .gr-w5-check {
  font-weight: 700;
}
.guinea-run .gr-w5-check::before {
  content: "\\25CF  ";
}
.guinea-run .gr-w5-check.is-ok {
  color: #2e844a;
}
.guinea-run .gr-w5-check.is-ko {
  color: #ba0517;
}
.guinea-run .gr-w5-prstate {
  align-self: flex-start;
  padding: 1px 8px;
  border-radius: 999px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
}
.guinea-run .gr-w5-prstate.is-merged {
  background: #8250df;
}
.guinea-run .gr-w5-prstate.is-back {
  background: #ba0517;
}
.guinea-run .gr-w5-arrows {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.guinea-run .gr-w5-move {
  min-width: 44px;
  min-height: 34px;
  padding: 0;
  font-size: 14px;
}
@keyframes gr-w5-stamp {
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) rotate(-4deg);
  }
}
@media (pointer: coarse) {
  .guinea-run .gr-w5-btn,
  .guinea-run .gr-w5-lensbtn {
    min-height: 44px;
  }
  .guinea-run .gr-w5-move {
    min-height: 44px;
  }
}
@media (max-aspect-ratio: 1/1) {
  .guinea-run .gr-w5 {
    top: 42vh;
    top: 42dvh;
    right: calc(env(safe-area-inset-right, 0px) + 8px);
    left: calc(env(safe-area-inset-left, 0px) + 8px);
    width: auto;
  }
  .guinea-run .gr-w5-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .guinea-run .gr-w5-pane--res {
    grid-column: auto;
  }
  .guinea-run .gr-w5-pritem {
    grid-template-columns: minmax(0, 1fr) auto;
  }
  .guinea-run .gr-w5-slot {
    grid-column: 1 / -1;
  }
  .guinea-run .gr-w5-task {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .guinea-run .gr-w5-stamp.is-shown {
    animation-duration: 0.01s;
  }
}
`;
