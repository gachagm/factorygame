//////////////////////////////
// 🏭 FACTORY GAME CORE
//////////////////////////////

// ===== GAME STATE =====

let game = {
  resources: {
    iron: 100,
    copper: 0,
    steel: 0,
    titanium: 0,
    plasma: 0,
    quantum: 0
  },
  machines: {},
  lastTime: Date.now()
};

//////////////////////////////
// ⚡ MACHINE LIST (60 UNITS)
//////////////////////////////

const machineList = [];

const names = [
  "Neon Forge Reactor",
  "Quantum Ore Extractor",
  "Chrome Pulse Smelter",
  "Void Crystal Harvester",
  "Cyber Alloy Press",
  "Hypersteel Infuser",
  "Plasma Drill Core",
  "Dark Matter Grinder",
  "Ion Furnace X",
  "Neural Ore Synthesizer",
  "Quantum Forge Mk-II",
  "Stellar Smelting Array",
  "Photon Alloy Reactor",
  "Voidsteel Compressor",
  "Nano Ore Fabricator",
  "Mecha Core Foundry",
  "Gravity Forge Engine",
  "Plasma Vein Extractor",
  "Synthetic Metal Bloom",
  "Neon Industrial Matrix",
  "Omega Ore Reactor",
  "Cyber Foundry Core",
  "Quantum Steel Spire",
  "Hyper Ion Crusher",
  "Void Alloy Nexus",
  "Dark Forge Singularity",
  "Neon Titan Press",
  "Plasma Core Distiller",
  "Quantum Alloy Spawner",
  "Cybernetic Ore Engine",
  "Stellar Forge Rift",
  "Nano Plasma Harvester",
  "Void Reactor Cluster",
  "Hyper Alloy Reactor",
  "Quantum Drill Nexus",
  "Neon Singularity Forge",
  "Plasma Storm Foundry",
  "Cyber Void Smelter",
  "Omega Alloy Matrix",
  "Quantum Industrial Heart",
  "Dark Plasma Core",
  "Neural Forge Network",
  "Void Titan Smelter",
  "Hyper Quantum Press",
  "Stellar Alloy Engine",
  "Neon Core Singularity",
  "Cyber Plasma Foundry",
  "Quantum Void Reactor",
  "Omega Forge Titan",
  "Dark Matter Alloy Core",
  "Hyper Neon Engine",
  "Quantum Steel Horizon",
  "Void Plasma Matrix",
  "Cyber Forge Singularity",
  "Stellar Quantum Core",
  "Neon Alloy Apocalypse",
  "Omega Plasma Nexus",
  "Void Industrial Godcore",
  "Quantum Forge Infinity",
  "Neon Singularity Engine",
  [
  "Plasma Rift Generator",
  "Titan Core Refinery",
  "Nano Flux Compressor",
  "Solarium Reactor Matrix",
  "Iron Nova Extractor",
  "Quantum Steel Crucible",
  "Cryo Pulse Refinery",
  "Omega Alloy Fabricator",
  "Stellar Core Harvester",
  "Photon Ore Synthesizer",
  "Darkmatter Smeltery",
  "Fusion Grid Extractor",
  "Voidsteel Catalyst",
  "Inferno Crystal Reactor",
  "Arcadium Forge Unit",
  "Hyperion Smelter Prime",
  "Electro Core Infuser",
  "Nano Plasma Press",
  "Astral Iron Reactor",
  "Cyberium Refinery",
  "Eclipse Ore Converter",
  "Gravity Flux Smelter",
  "Plasma Crystal Matrix",
  "Neon Titan Extractor",
  "Ionsteel Harvester",
  "Pulsecore Generator",
  "Solar Flux Forge",
  "Quantum Ember Refinery",
  "Void Pulse Reactor",
  "Cryonite Alloy Press",
  "Titanwave Smelter",
  "Hypercore Fabricator",
  "Omega Crystal Extractor",
  "Photonsteel Infuser",
  "Nova Alloy Reactor",
  "Arc Pulse Harvester",
  "Cyber Nova Crucible",
  "Darksteel Generator",
  "Stellar Flux Press",
  "Plasma Core Distillery",
  "Infernal Ore Extractor",
  "Nano Rift Smelter",
  "Quantum Blaze Infuser",
  "Astrosteel Refinery",
  "Neon Core Synthesizer",
  "Eclipse Alloy Matrix",
  "Hyper Plasma Reactor",
  "Cryo Nova Press",
  "Titan Crystal Forge",
  "Voidforge Extractor",
  "Electrosteel Harvester",
  "Solarion Smelter",
  "Fluxcore Infuser",
  "Omega Rift Reactor",
  "Arcsteel Refinery",
  "Photon Pulse Generator",
  "Nova Crystal Press",
  "Cyber Flux Fabricator",
  "Astral Pulse Extractor",
  "Darkmatter Alloy Forge"
]
];

for (let i = 0; i < 60; i++) {
  const level = i + 1;

  machineList.push({
    id: "mnx_" + level,
    name: names[i],
    produces: i % 3 === 0 ? "iron" : i % 3 === 1 ? "copper" : "steel",
    rate: level * 0.5,

    // 🔥 TEURERE PREISE + 3 NEUE RESSOURCEN
    cost: {
      iron: Math.floor(100 * Math.pow(1.45, level)),

      copper:
        level > 5
          ? Math.floor(75 * Math.pow(1.42, level))
          : 0,

      steel:
        level > 12
          ? Math.floor(50 * Math.pow(1.4, level))
          : 0,

      titanium:
        level > 20
          ? Math.floor(25 * Math.pow(1.38, level))
          : 0,

      plasma:
        level > 30
          ? Math.floor(10 * Math.pow(1.36, level))
          : 0,

      quantum:
        level > 45
          ? Math.floor(5 * Math.pow(1.34, level))
          : 0
    }
  });
}

//////////////////////////////
// 🧱 INIT MACHINE STATE
//////////////////////////////

machineList.forEach(m => {
  game.machines[m.id] = 0;
});

//////////////////////////////
// 🖥️ UI
//////////////////////////////

function updateUI() {
  const resDiv = document.getElementById("resources");
  resDiv.innerHTML = "";

  for (let r in game.resources) {
    resDiv.innerHTML += `<p>${r.toUpperCase()}: ${Math.floor(game.resources[r])}</p>`;
  }
}

function renderMachines() {
  const container = document.getElementById("machines");
  container.innerHTML = "";

  machineList.forEach(m => {
    container.innerHTML += `
      <div class="machine">
        <h3>${m.name}</h3>
        <p>→ ${m.produces}</p>
        <p>Rate: ${m.rate}/s</p>
        <p>Owned: ${game.machines[m.id]}</p>
        <button onclick="buyMachine('${m.id}')">
          Buy (
            ${m.cost.iron} iron,
            ${m.cost.copper} copper,
            ${m.cost.steel} steel,
            ${m.cost.titanium} titanium,
            ${m.cost.plasma} plasma,
            ${m.cost.quantum} quantum
          )
        </button>
      </div>
    `;
  });
}

//////////////////////////////
// 🛒 BUY MACHINE
//////////////////////////////

function buyMachine(id) {
  const m = machineList.find(x => x.id === id);

  if (
    game.resources.iron >= m.cost.iron &&
    game.resources.copper >= m.cost.copper &&
    game.resources.steel >= m.cost.steel &&
    game.resources.titanium >= m.cost.titanium &&
    game.resources.plasma >= m.cost.plasma &&
    game.resources.quantum >= m.cost.quantum
  ) {
    game.resources.iron -= m.cost.iron;
    game.resources.copper -= m.cost.copper;
    game.resources.steel -= m.cost.steel;
    game.resources.titanium -= m.cost.titanium;
    game.resources.plasma -= m.cost.plasma;
    game.resources.quantum -= m.cost.quantum;

    game.machines[id]++;

    saveGame();
    updateUI();
    renderMachines();
  }
}

//////////////////////////////
// ⚙️ PRODUCTION SYSTEM
//////////////////////////////

function produce(seconds) {
  machineList.forEach(m => {
    const count = game.machines[m.id];
    const output = count * m.rate * seconds;

    game.resources[m.produces] += output;
  });
}

//////////////////////////////
// 🔁 GAME LOOP
//////////////////////////////

setInterval(() => {
  produce(1);
  updateUI();
}, 1000);

//////////////////////////////
// 💾 SAVE / LOAD
//////////////////////////////

function saveGame() {
  game.lastTime = Date.now();
  localStorage.setItem("factoryGame", JSON.stringify(game));
}

function loadGame() {
  const save = JSON.parse(localStorage.getItem("factoryGame"));

  if (save) {
    game = save;

    const now = Date.now();
    let diff = (now - game.lastTime) / 1000;

    // max 8h offline
    const max = 60 * 60 * 8;
    if (diff > max) diff = max;

    produce(diff);
  }
}

//////////////////////////////
// 🚀 START GAME
//////////////////////////////

loadGame();
updateUI();
renderMachines();

setInterval(saveGame, 5000);
