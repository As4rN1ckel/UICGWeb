window.points = 0;

document.addEventListener("DOMContentLoaded", () => {
    const pointsDisplay = document.getElementById("points");
    const passiveIncomeDisplay = document.getElementById("passiveIncome");
    const planet = document.getElementById("planet");
    const clickEffect = document.getElementById("clickEffect");
    const upgrade1 = document.getElementById("upgrade1");
    const upgrade2 = document.getElementById("upgrade2");
    const upgrade3 = document.getElementById("upgrade3");
    const upgrade4 = document.getElementById("upgrade4");
    const upgrade5 = document.getElementById("upgrade5");
    const achievementList = document.getElementById("achievementList");
    const saveButton = document.getElementById("saveButton");
    const loadButton = document.getElementById("loadButton");
    const resetButton = document.getElementById("resetButton");
    const progressBar = document.querySelector(".progress-fill");
    const passiveProgressBar = document.querySelector(".passive-progress-fill");
    const communicator = document.getElementById("communicator");
    const communicatorMessage = document.getElementById("communicatorMessage");

    const mineSound = document.getElementById("mineSound");
    const upgradeSound = document.getElementById("upgradeSound");
    const jackpotSound = document.getElementById("jackpotSound");

    let points = 0;
    let totalClicks = 0;
    let clickValueBase = 1;
    let clickMultiplier = 1;
    let passiveIncomeBase = 0;
    let passiveMultiplier = 1;
    let jackpotChance = 0.02;
    let jackpotMultiplier = 10;
    let isClickingAllowed = true;
    let clickCooldown = 500;

    const UPGRADE_EXPONENTIALS = {
        upgrade1: 1.3,
        upgrade2: 1.5,
        upgrade3: 1.4,
        upgrade4: 1.6,
        upgrade5: 1.5,
    };

    const UPGRADE_BASE_COSTS = {
        upgrade1: 10,
        upgrade2: 50,
        upgrade3: 15,
        upgrade4: 75,
        upgrade5: 50,
    };

    let upgradeCosts = {
        upgrade1: { base: UPGRADE_BASE_COSTS.upgrade1, count: 0 },
        upgrade2: { base: UPGRADE_BASE_COSTS.upgrade2, count: 0 },
        upgrade3: { base: UPGRADE_BASE_COSTS.upgrade3, count: 0 },
        upgrade4: { base: UPGRADE_BASE_COSTS.upgrade4, count: 0 },
        upgrade5: { base: UPGRADE_BASE_COSTS.upgrade5, count: 0 },
    };

    const achievements = [
        { id: "click50", name: "🌠 Stellar Tapper", condition: () => totalClicks >= 50, reward: 50 },
        { id: "points500", name: "💎 Dust Collector", condition: () => points >= 500, reward: 100 },
        { id: "upgrade10", name: "🛠️ Tech Initiate", condition: () => Object.values(upgradeCosts).reduce((sum, u) => sum + u.count, 0) >= 10, reward: 200 },
    ];
    let achieved = new Set();

    function calculatePrice(base, count, upgradeId) {
        return Math.floor(base * Math.pow(UPGRADE_EXPONENTIALS[upgradeId], count));
    }

    function updateUpgradeCostDisplay(upgradeId) {
        const button = document.getElementById(upgradeId);
        const newCost = calculatePrice(upgradeCosts[upgradeId].base, upgradeCosts[upgradeId].count, upgradeId);
        const description = button.textContent.split("-")[1] || "";
        button.textContent = button.id === "upgrade5" 
            ? `🔍 Cosmic Sensors (${newCost} 🌟) - ${description}`
            : button.textContent.split("(")[0] + `(${newCost} 🌟) - ${description}`;
    }

    function showNotification(message) {
        communicatorMessage.textContent = message;
        communicator.style.display = "block";
        setTimeout(() => communicator.style.display = "none", 3000);
    }

    function checkAchievements() {
        achievements.forEach(ach => {
            if (!achieved.has(ach.id) && ach.condition()) {
                achieved.add(ach.id);
                points += ach.reward;
                const li = document.createElement("li");
                li.textContent = `${ach.name} - +${ach.reward} 🌟`;
                achievementList.appendChild(li);
                showNotification(`${ach.name} Earned! +${ach.reward} 🌟`);
            }
        });
    }

    function saveGame() {
        const saveData = { 
            points, totalClicks, clickValueBase, clickMultiplier, passiveIncomeBase, passiveMultiplier, 
            jackpotChance, jackpotMultiplier, upgradeCosts, achieved: Array.from(achieved) 
        };
        localStorage.setItem("gameSave", JSON.stringify(saveData));
        showNotification("💾 Expedition Saved!");
    }

    function loadGame() {
        const saveData = JSON.parse(localStorage.getItem("gameSave"));
        if (saveData) {
            points = saveData.points;
            totalClicks = saveData.totalClicks;
            clickValueBase = saveData.clickValueBase;
            clickMultiplier = saveData.clickMultiplier;
            passiveIncomeBase = saveData.passiveIncomeBase;
            passiveMultiplier = saveData.passiveMultiplier;
            jackpotChance = saveData.jackpotChance;
            jackpotMultiplier = saveData.jackpotMultiplier;
            upgradeCosts = saveData.upgradeCosts;
            achieved = new Set(saveData.achieved);
            achievementList.innerHTML = "";
            achieved.forEach(id => {
                const ach = achievements.find(a => a.id === id);
                const li = document.createElement("li");
                li.textContent = `${ach.name} - +${ach.reward} 🌟`;
                achievementList.appendChild(li);
            });
            updateStats();
            progressBar.style.transition = "none";
            progressBar.style.width = "100%";
            showNotification("📡 Expedition Loaded!");
        } else {
            showNotification("❌ No Data in Hyperspace!");
        }
    }

    function resetGame() {
        if (confirm("🌌 Start a New Galactic Journey?")) {
            localStorage.removeItem("gameSave");
            points = 0;
            totalClicks = 0;
            clickValueBase = 1;
            clickMultiplier = 1;
            passiveIncomeBase = 0;
            passiveMultiplier = 1;
            jackpotChance = 0.02;
            jackpotMultiplier = 10;
            upgradeCosts = { 
                upgrade1: { base: 10, count: 0 }, 
                upgrade2: { base: 50, count: 0 }, 
                upgrade3: { base: 15, count: 0 }, 
                upgrade4: { base: 75, count: 0 }, 
                upgrade5: { base: 50, count: 0 } 
            };
            achieved.clear();
            achievementList.innerHTML = "";
            updateStats();
            showNotification("🌍 New Journey Begun!");
        }
    }

    saveButton.addEventListener("click", saveGame);
    loadButton.addEventListener("click", loadGame);
    resetButton.addEventListener("click", resetGame);

    planet.addEventListener("click", (e) => {
        if (isClickingAllowed) {
            mineSound.play();
            const clickValue = clickValueBase * clickMultiplier;
            const isJackpot = Math.random() < jackpotChance;
            const pointsEarned = isJackpot ? clickValue * jackpotMultiplier : clickValue;
            points += pointsEarned;
            totalClicks++;
            if (isJackpot) {
                jackpotSound.play();
                showNotification(`💎 Nebula Vein Hit! +${pointsEarned} 🌟`);
                clickEffect.textContent = "💰";
            } else {
                clickEffect.textContent = "🔫";
            }
            clickEffect.style.left = `${e.offsetX}px`;
            clickEffect.style.top = `${e.offsetY}px`;
            clickEffect.style.animation = "clickBurst 0.5s ease-out";
            setTimeout(() => clickEffect.style.animation = "none", 500);

            isClickingAllowed = false;
            progressBar.style.transition = "none";
            progressBar.style.width = "0%";
            let startTime = Date.now();
            const animateProgress = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min((elapsed / clickCooldown) * 100, 100);
                progressBar.style.width = `${progress}%`;
                if (progress < 100) requestAnimationFrame(animateProgress);
            };
            requestAnimationFrame(animateProgress);
            setTimeout(() => {
                isClickingAllowed = true;
                progressBar.style.transition = "width 0.3s linear";
                progressBar.style.width = "100%";
            }, clickCooldown);

            checkAchievements();
            updateStats();
        }
    });

    upgrade1.addEventListener("click", () => {
        const cost = calculatePrice(upgradeCosts.upgrade1.base, upgradeCosts.upgrade1.count, "upgrade1");
        if (points >= cost) {
            points -= cost;
            clickValueBase += 2;
            upgradeCosts.upgrade1.count++;
            upgradeSound.play();
            updateUpgradeCostDisplay("upgrade1");
            showNotification("🔫 Laser Cannons Upgraded!");
            updateStats();
        }
    });

    upgrade2.addEventListener("click", () => {
        const cost = calculatePrice(upgradeCosts.upgrade2.base, upgradeCosts.upgrade2.count, "upgrade2");
        if (points >= cost) {
            points -= cost;
            clickMultiplier *= 1.5;
            upgradeCosts.upgrade2.count++;
            upgradeSound.play();
            updateUpgradeCostDisplay("upgrade2");
            showNotification("🔋 Quantum Booster Activated!");
            updateStats();
        }
    });

    upgrade3.addEventListener("click", () => {
        const cost = calculatePrice(upgradeCosts.upgrade3.base, upgradeCosts.upgrade3.count, "upgrade3");
        if (points >= cost) {
            points -= cost;
            passiveIncomeBase += 0.5;
            upgradeCosts.upgrade3.count++;
            upgradeSound.play();
            updateUpgradeCostDisplay("upgrade3");
            showNotification("🚀 Stellar Bots Deployed!");
            updateStats();
        }
    });

    upgrade4.addEventListener("click", () => {
        const cost = calculatePrice(upgradeCosts.upgrade4.base, upgradeCosts.upgrade4.count, "upgrade4");
        if (points >= cost) {
            points -= cost;
            passiveMultiplier *= 1.5;
            upgradeCosts.upgrade4.count++;
            upgradeSound.play();
            updateUpgradeCostDisplay("upgrade4");
            showNotification("💫 Nebula Core Powered Up!");
            updateStats();
        }
    });

    upgrade5.addEventListener("click", () => {
        const cost = calculatePrice(upgradeCosts.upgrade5.base, upgradeCosts.upgrade5.count, "upgrade5");
        if (points >= cost) {
            points -= cost;
            jackpotChance += 0.02;
            jackpotMultiplier += 5;
            upgradeCosts.upgrade5.count++;
            upgradeSound.play();
            updateUpgradeCostDisplay("upgrade5");
            showNotification("🔍 Cosmic Sensors Enhanced!");
            updateStats();
        }
    });

    function updateStats() {
        window.points = points;
        pointsDisplay.textContent = Math.floor(points);
        const effectivePassiveIncome = passiveIncomeBase * passiveMultiplier;
        passiveIncomeDisplay.textContent = effectivePassiveIncome.toFixed(1);
        document.getElementById("clickValue").textContent = `🔫 Clicks: ${clickValueBase} (x${clickMultiplier.toFixed(1)})`;
        document.getElementById("clickMultiplier").textContent = `🔋 Multiplier: x${clickMultiplier.toFixed(1)}`;
        document.getElementById("passiveIncomeValue").textContent = `🚀 Yield: ${passiveIncomeBase.toFixed(1)}/s (x${passiveMultiplier.toFixed(1)})`;
        document.getElementById("passiveMultiplier").textContent = `💫 Multiplier: x${passiveMultiplier.toFixed(1)}`;
        document.getElementById("jackpotInfo").textContent = `🔍 Nebula Odds: ${(jackpotChance * 100).toFixed(0)}% | 💎 Loot: x${jackpotMultiplier}`;
        upgrade1.disabled = points < calculatePrice(upgradeCosts.upgrade1.base, upgradeCosts.upgrade1.count, "upgrade1");
        upgrade2.disabled = points < calculatePrice(upgradeCosts.upgrade2.base, upgradeCosts.upgrade2.count, "upgrade2");
        upgrade3.disabled = points < calculatePrice(upgradeCosts.upgrade3.base, upgradeCosts.upgrade3.count, "upgrade3");
        upgrade4.disabled = points < calculatePrice(upgradeCosts.upgrade4.base, upgradeCosts.upgrade4.count, "upgrade4");
        upgrade5.disabled = points < calculatePrice(upgradeCosts.upgrade5.base, upgradeCosts.upgrade5.count, "upgrade5");
    }

    let passiveIncomeAccumulator = 0;
    setInterval(() => {
        passiveIncomeAccumulator += (passiveIncomeBase * passiveMultiplier) * 0.1;
        if (passiveIncomeAccumulator >= 1) {
            const pointsToAdd = Math.floor(passiveIncomeAccumulator);
            points += pointsToAdd;
            passiveIncomeAccumulator -= pointsToAdd;
            checkAchievements();
            updateStats();
        }
        if (passiveIncomeBase > 0) {
            passiveIncomeContainer.style.display = "flex";
            passiveProgressBar.style.transition = "none";
            passiveProgressBar.style.width = "0%";
            let startTime = Date.now();
            const animatePassiveProgress = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min((elapsed / 1000) * 100, 100);
                passiveProgressBar.style.width = `${progress}%`;
                if (progress < 100) requestAnimationFrame(animatePassiveProgress);
            };
            requestAnimationFrame(animatePassiveProgress);
        } else {
            passiveIncomeContainer.style.display = "none";
        }
    }, 100);

    loadGame();
});