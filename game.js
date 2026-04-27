//////////////////////////////
// 🏭 FACTORY GAME CORE
//////////////////////////////

// ===== GAME STATE =====

let game = {
  resources: {
    iron: 100,
    copper: 0,
    steel: 0
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
  "Neon Singularity Engine"
];

for (let i = 0; i < 60; i++) {
  machineList.push({
    id: "mnx_" + (i + 1),
    name: names[i],
    produces: i % 3 === 0 ? "iron" : i % 3 === 1 ? "copper" : "steel",
    rate: (i + 1) * 0.5,
    cost: Math.floor((i + 1) * 12.5)
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
          Buy (${m.cost} iron)
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

  if (game.resources.iron >= m.cost) {
    game.resources.iron -= m.cost;
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