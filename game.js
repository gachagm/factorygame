//////////////////////////////
// 🏭 FACTORY GAME CORE
//////////////////////////////

let game = {
resources: {
iron: 100,
copper: 0,
steel: 0
},
machines: {},
lastTime: Date.now(),

multiplier: 1,

player: {
name: localStorage.getItem("playerName") || "",
level: 1,
xp: 0
},

shop: {
ironBoost: 0,
copperBoost: 0,
globalBoost: 0
}
};

//////////////////////////////
// ⚡ MACHINE LIST
//////////////////////////////

const machineList = [];

const names = [
"Neon Forge Reactor","Quantum Ore Extractor","Chrome Pulse Smelter","Void Crystal Harvester","Cyber Alloy Press",
"Hypersteel Infuser","Plasma Drill Core","Dark Matter Grinder","Ion Furnace X","Neural Ore Synthesizer",
"Quantum Forge Mk-II","Stellar Smelting Array","Photon Alloy Reactor","Voidsteel Compressor","Nano Ore Fabricator",
"Mecha Core Foundry","Gravity Forge Engine","Plasma Vein Extractor","Synthetic Metal Bloom","Neon Industrial Matrix",
"Omega Ore Reactor","Cyber Foundry Core","Quantum Steel Spire","Hyper Ion Crusher","Void Alloy Nexus",
"Dark Forge Singularity","Neon Titan Press","Plasma Core Distiller","Quantum Alloy Spawner","Cybernetic Ore Engine",
"Stellar Forge Rift","Nano Plasma Harvester","Void Reactor Cluster","Hyper Alloy Reactor","Quantum Drill Nexus",
"Neon Singularity Forge","Plasma Storm Foundry","Cyber Void Smelter","Omega Alloy Matrix","Quantum Industrial Heart",
"Dark Plasma Core","Neural Forge Network","Void Titan Smelter","Hyper Quantum Press","Stellar Alloy Engine",
"Neon Core Singularity","Cyber Plasma Foundry","Quantum Void Reactor","Omega Forge Titan","Dark Matter Alloy Core",
"Hyper Neon Engine","Quantum Steel Horizon","Void Plasma Matrix","Cyber Forge Singularity","Stellar Quantum Core",
"Neon Alloy Apocalypse","Omega Plasma Nexus","Void Industrial Godcore","Quantum Forge Infinity","Neon Singularity Engine"
];

for (let i = 0; i < 60; i++) {
machineList.push({
id: "mnx_" + (i + 1),
name: names[i],
produces: i % 3 === 0 ? "iron" : i % 3 === 1 ? "copper" : "steel",
rate: (i + 1) * 0.5,
cost: {
iron: Math.floor((i + 1) * 10),
copper: i > 5 ? Math.floor((i + 1) * 5) : 0,
steel: i > 15 ? Math.floor((i + 1) * 2) : 0
}
});
}

machineList.forEach(m => {
game.machines[m.id] = 0;
});

//////////////////////////////
// 🧠 LOGIN
//////////////////////////////

function login() {
const name = document.getElementById("name").value;
game.player.name = name;
localStorage.setItem("playerName", name);
document.getElementById("login").style.display = "none";
updatePlayerUI();
}

function updatePlayerUI() {
const div = document.getElementById("player");
div.innerHTML = `👤 ${game.player.name} | Lv.${game.player.level}`;
}

//////////////////////////////
// 🎁 CHEST
//////////////////////////////

function openChest() {
const roll = Math.random();

let rewardText = "";

if (roll < 0.6) {
game.resources.iron += 200;
rewardText = "+200 Iron";
} else if (roll < 0.9) {
game.resources.copper += 150;
rewardText = "+150 Copper";
} else {
game.resources.steel += 100;
rewardText = "🔥 +100 Steel (RARE)";
}

alert("Chest Reward: " + rewardText);

gainXP(10);
updateUI();
}

//////////////////////////////
// ⚡ BOOST
//////////////////////////////

function activateBoost() {
if (game.multiplier > 1) return;

game.multiplier = 2;

setTimeout(() => {
game.multiplier = 1;
}, 30000);
}

//////////////////////////////
// 🛒 SHOP
//////////////////////////////

function getShopMultiplier(res) {
let multi = 1;

multi += game.shop.globalBoost * 0.1;

if (res === "iron") multi += game.shop.ironBoost * 0.2;
if (res === "copper") multi += game.shop.copperBoost * 0.2;

return multi;
}

function buyUpgrade(type) {
const cost = (game.shop[type] + 1) * 200;

if (game.resources.iron >= cost) {
game.resources.iron -= cost;
game.shop[type]++;
updateUI();
renderShop();
}
}

function renderShop() {
const div = document.getElementById("shop");

div.innerHTML = ` <div class="machine"> <h3>Iron Boost</h3> <p>Level: ${game.shop.ironBoost}</p> <button onclick="buyUpgrade('ironBoost')">Buy</button> </div>

```
<div class="machine">
  <h3>Copper Boost</h3>
  <p>Level: ${game.shop.copperBoost}</p>
  <button onclick="buyUpgrade('copperBoost')">Buy</button>
</div>

<div class="machine">
  <h3>Global Boost</h3>
  <p>Level: ${game.shop.globalBoost}</p>
  <button onclick="buyUpgrade('globalBoost')">Buy</button>
</div>
```

`;
}

//////////////////////////////
// 💀 PRESTIGE
//////////////////////////////

function prestige() {
if (game.resources.iron < 10000) {
alert("Need 10k iron!");
return;
}

const bonus = Math.floor(game.resources.iron / 10000);
game.multiplier += bonus * 0.2;

game.resources = { iron: 100, copper: 0, steel: 0 };

for (let id in game.machines) {
game.machines[id] = 0;
}

alert("Prestige! Permanent Boost gained!");

updateUI();
renderMachines();
}

//////////////////////////////
// ⭐ XP
//////////////////////////////

function gainXP(amount) {
game.player.xp += amount;

if (game.player.xp >= 100) {
game.player.xp = 0;
game.player.level++;
}

updatePlayerUI();
}

//////////////////////////////
// 🔢 FORMAT
//////////////////////////////

function format(num) {
if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
return Math.floor(num);
}

//////////////////////////////
// 🖥️ UI
//////////////////////////////

function updateUI() {
const resDiv = document.getElementById("resources");
resDiv.innerHTML = "";

for (let r in game.resources) {
resDiv.innerHTML += `<p>${r.toUpperCase()}: ${format(game.resources[r])}</p>`;
}
}

function renderMachines() {
const container = document.getElementById("machines");
container.innerHTML = "";

machineList.forEach(m => {
container.innerHTML += `       <div class="machine">         <h3>${m.name}</h3>         <p>→ ${m.produces}</p>         <p>Rate: ${m.rate}/s</p>         <p>Owned: ${game.machines[m.id]}</p>         <button onclick="buyMachine('${m.id}')">
          Buy (${m.cost.iron} iron, ${m.cost.copper} copper, ${m.cost.steel} steel)         </button>       </div>
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
game.resources.steel >= m.cost.steel
) {
game.resources.iron -= m.cost.iron;
game.resources.copper -= m.cost.copper;
game.resources.steel -= m.cost.steel;

```
game.machines[id]++;

saveGame();
updateUI();
renderMachines();
```

}
}

//////////////////////////////
// ⚙️ PRODUCTION
//////////////////////////////

function produce(seconds) {
machineList.forEach(m => {
const count = game.machines[m.id];
const output = count * m.rate * seconds * game.multiplier * getShopMultiplier(m.produces);
game.resources[m.produces] += output;
});
}

//////////////////////////////
// 🔁 LOOP
//////////////////////////////

setInterval(() => {
produce(1);
updateUI();
}, 1000);

//////////////////////////////
// 💾 SAVE
//////////////////////////////

function saveGame() {
game.lastTime = Date.now();
localStorage.setItem("factoryGame", JSON.stringify(game));
}

function loadGame() {
const save = JSON.parse(localStorage.getItem("factoryGame"));

if (save) {
game = save;

```
const now = Date.now();
if (now < game.lastTime) return;

let diff = (now - game.lastTime) / 1000;
if (diff > 60 * 60 * 8) diff = 60 * 60 * 8;

produce(diff);
```

}
}

//////////////////////////////
// 🚀 START
//////////////////////////////

loadGame();
updateUI();
renderMachines();
renderShop();
updatePlayerUI();

setInterval(saveGame, 5000);
