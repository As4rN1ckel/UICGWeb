window.points = 0;

document.addEventListener("DOMContentLoaded", () => {
  const pointsDisplay = document.getElementById("points");
  const passiveIncomeDisplay = document.getElementById("passiveIncome");
  const clickButton = document.getElementById("clickButton");
  const upgrade1 = document.getElementById("upgrade1");
  const upgrade2 = document.getElementById("upgrade2");
  const upgrade3 = document.getElementById("upgrade3");
  const upgrade4 = document.getElementById("upgrade4");
  const upgrade5 = document.getElementById("upgrade5");
  const upgrade6 = document.getElementById("upgrade6");
  const upgrade7 = document.getElementById("upgrade7");
  const upgrade8 = document.getElementById("upgrade8");
  const totalClicksDisplay = document.getElementById("totalClicks");
  const totalPointsGeneratedDisplay = document.getElementById("totalPointsGenerated");
  const saveButton = document.getElementById("saveButton");
  const loadButton = document.getElementById("loadButton");
  const resetButton = document.getElementById("resetButton");
  const progressBar = document.querySelector(".progress-fill");
  const passiveProgressBar = document.querySelector(".passive-progress-fill");

  // Audio elements
  const mineSound = document.getElementById("mineSound");
  const upgradeSound = document.getElementById("upgradeSound");

  let points = 0;
  let totalPoints = 0;
  let clickValue = 1;
  let passiveIncome = 0;
  let smallPassiveIncome = 0;
  let tinyPassiveIncome = 0;
  let mediumPassiveIncome = 0;
  let totalClicks = 0;
  let clickMultiplier = 1;
  let passiveIncomeMultiplier = 1;
  let isClickingAllowed = true;
  let clickCooldown = 500;

  const UPGRADE_EXPONENTIALS = {
    upgrade1: 1.3,
    upgrade2: 2.0,
    upgrade3: 1.5,
    upgrade4: 2.0,
    upgrade5: 1.4,
    upgrade6: 1.6,
    upgrade7: 1.3,
    upgrade8: 1.45,
  };

  const UPGRADE_BASE_COSTS = {
    upgrade1: 10,
    upgrade2: 250,
    upgrade3: 150,
    upgrade4: 350,
    upgrade5: 40,
    upgrade6: 80,
    upgrade7: 15,
    upgrade8: 75,
  };

  const UPGRADE_NAMES = {
    upgrade1: "Laser Drill",
    upgrade2: "Graviton Booster",
    upgrade3: "Orbital Station",
    upgrade4: "Dark Matter Core",
    upgrade5: "Drone Swarm",
    upgrade6: "Quantum Extractor",
    upgrade7: "Nano Probes",
    upgrade8: "Solar Harvester",
  };

  const GAME_CONFIG = {
    minClickCooldown: 100,
  };

  let upgradeCosts = {
    upgrade1: { base: UPGRADE_BASE_COSTS.upgrade1, count: 0 },
    upgrade2: { base: UPGRADE_BASE_COSTS.upgrade2, count: 0 },
    upgrade3: { base: UPGRADE_BASE_COSTS.upgrade3, count: 0 },
    upgrade4: { base: UPGRADE_BASE_COSTS.upgrade4, count: 0 },
    upgrade5: { base: UPGRADE_BASE_COSTS.upgrade5, count: 0 },
    upgrade6: { base: UPGRADE_BASE_COSTS.upgrade6, count: 0 },
    upgrade7: { base: UPGRADE_BASE_COSTS.upgrade7, count: 0 },
    upgrade8: { base: UPGRADE_BASE_COSTS.upgrade8, count: 0 },
  };

  function calculatePrice(base, count, upgradeId) {
    const exponential = UPGRADE_EXPONENTIALS[upgradeId];
    return Math.floor(base * Math.pow(exponential, count));
  }

  function updateUpgradeCostDisplay(upgradeId) {
    const button = document.getElementById(upgradeId);
    const newCost = calculatePrice(upgradeCosts[upgradeId].base, upgradeCosts[upgradeId].count, upgradeId);
    const description = button.textContent.split("-")[1] || "";
    button.textContent = `${UPGRADE_NAMES[upgradeId]} (${newCost} Stardust) - ${description}`.trim();
  }

  function saveGame() {
    const saveData = {
      points,
      totalPoints,
      clickValue,
      passiveIncome,
      smallPassiveIncome,
      tinyPassiveIncome,
      mediumPassiveIncome,
      totalClicks,
      clickMultiplier,
      passiveIncomeMultiplier,
      clickCooldown,
      upgradeCosts,
    };
    localStorage.setItem("gameSave", JSON.stringify(saveData));
    alert("Mission data transmitted to Galactic Command!");
  }

  function loadGame() {
    const saveData = JSON.parse(localStorage.getItem("gameSave"));
    if (saveData) {
      points = saveData.points;
      totalPoints = saveData.totalPoints;
      clickValue = saveData.clickValue;
      passiveIncome = saveData.passiveIncome;
      smallPassiveIncome = saveData.smallPassiveIncome || 0;
      tinyPassiveIncome = saveData.tinyPassiveIncome || 0;
      mediumPassiveIncome = saveData.mediumPassiveIncome || 0;
      totalClicks = saveData.totalClicks;
      clickMultiplier = saveData.clickMultiplier || 1;
      passiveIncomeMultiplier = saveData.passiveIncomeMultiplier || 1;
      clickCooldown = Math.max(saveData.clickCooldown || 500, GAME_CONFIG.minClickCooldown);
      upgradeCosts = saveData.upgradeCosts || { ...upgradeCosts };
      for (let id in upgradeCosts) {
        updateUpgradeCostDisplay(id);
      }
      updateStats();
      progressBar.style.transition = "none";
      progressBar.style.width = "100%";
      alert("Mission data retrieved from hyperspace!");
    } else {
      clickCooldown = 500;
      progressBar.style.transition = "none";
      progressBar.style.width = "100%";
      alert("No mission logs detected in the cosmos!");
    }
  }

  function resetGame() {
    if (confirm("Abandon current mission and initiate a new galactic expedition?")) {
      localStorage.removeItem("gameSave");
      points = 0;
      totalPoints = 0;
      clickValue = 1;
      passiveIncome = 0;
      smallPassiveIncome = 0;
      tinyPassiveIncome = 0;
      mediumPassiveIncome = 0;
      totalClicks = 0;
      clickMultiplier = 1;
      passiveIncomeMultiplier = 1;
      clickCooldown = 500;
      upgradeCosts = {
        upgrade1: { base: UPGRADE_BASE_COSTS.upgrade1, count: 0 },
        upgrade2: { base: UPGRADE_BASE_COSTS.upgrade2, count: 0 },
        upgrade3: { base: UPGRADE_BASE_COSTS.upgrade3, count: 0 },
        upgrade4: { base: UPGRADE_BASE_COSTS.upgrade4, count: 0 },
        upgrade5: { base: UPGRADE_BASE_COSTS.upgrade5, count: 0 },
        upgrade6: { base: UPGRADE_BASE_COSTS.upgrade6, count: 0 },
        upgrade7: { base: UPGRADE_BASE_COSTS.upgrade7, count: 0 },
        upgrade8: { base: UPGRADE_BASE_COSTS.upgrade8, count: 0 },
      };
      for (let id in upgradeCosts) {
        updateUpgradeCostDisplay(id);
      }
      updateStats();
      alert("New mission launched into the void!");
    }
  }

  saveButton.addEventListener("click", saveGame);
  loadButton.addEventListener("click", loadGame);
  resetButton.addEventListener("click", resetGame);

  clickButton.addEventListener("click", () => {
    if (isClickingAllowed) {
      mineSound.play();
      const pointsEarned = clickValue * clickMultiplier;
      points += pointsEarned;
      totalPoints += pointsEarned;
      totalClicks++;
      updateStats();

      isClickingAllowed = false;
      clickButton.disabled = true;
      progressBar.style.transition = "none";
      progressBar.style.width = "0%";

      let startTime = Date.now();
      const animateProgress = () => {
        const elapsedTime = Date.now() - startTime;
        let progress = Math.min((elapsedTime / clickCooldown) * 100, 100);
        progressBar.style.transition = "width 0s linear";
        progressBar.style.width = `${progress}%`;
        if (progress < 100) requestAnimationFrame(animateProgress);
      };
      requestAnimationFrame(animateProgress);

      setTimeout(() => {
        isClickingAllowed = true;
        clickButton.disabled = false;
        progressBar.style.transition = "width 0.3s linear";
        progressBar.style.width = "100%";
      }, clickCooldown);
    }
  });

  // Upgrade Effects
  upgrade1.addEventListener("click", () => {
    const cost = calculatePrice(upgradeCosts.upgrade1.base, upgradeCosts.upgrade1.count, "upgrade1");
    if (points >= cost) {
      points -= cost;
      clickValue += 2;
      upgradeCosts.upgrade1.count++;
      upgradeSound.play(); 
      updateUpgradeCostDisplay("upgrade1");
      updateStats();
    }
  });

  upgrade2.addEventListener("click", () => {
    const cost = calculatePrice(upgradeCosts.upgrade2.base, upgradeCosts.upgrade2.count, "upgrade2");
    if (points >= cost) {
      points -= cost;
      clickMultiplier *= 1.75;
      upgradeCosts.upgrade2.count++;
      upgradeSound.play(); 
      updateUpgradeCostDisplay("upgrade2");
      updateStats();
    }
  });

  upgrade3.addEventListener("click", () => {
    const cost = calculatePrice(upgradeCosts.upgrade3.base, upgradeCosts.upgrade3.count, "upgrade3");
    if (points >= cost) {
      points -= cost;
      passiveIncome += 2;
      upgradeCosts.upgrade3.count++;
      upgradeSound.play(); 
      updateUpgradeCostDisplay("upgrade3");
      updateStats();
    }
  });

  upgrade4.addEventListener("click", () => {
    const cost = calculatePrice(upgradeCosts.upgrade4.base, upgradeCosts.upgrade4.count, "upgrade4");
    if (points >= cost) {
      points -= cost;
      passiveIncomeMultiplier *= 1.75;
      upgradeCosts.upgrade4.count++;
      upgradeSound.play(); 
      updateUpgradeCostDisplay("upgrade4");
      updateStats();
    }
  });

  upgrade5.addEventListener("click", () => {
    const cost = calculatePrice(upgradeCosts.upgrade5.base, upgradeCosts.upgrade5.count, "upgrade5");
    if (points >= cost) {
      points -= cost;
      smallPassiveIncome += 0.5;
      upgradeCosts.upgrade5.count++;
      upgradeSound.play();
      updateUpgradeCostDisplay("upgrade5");
      updateStats();
    }
  });

  upgrade6.addEventListener("click", () => {
    const cost = calculatePrice(upgradeCosts.upgrade6.base, upgradeCosts.upgrade6.count, "upgrade6");
    if (points >= cost && clickCooldown > GAME_CONFIG.minClickCooldown) {
      points -= cost;
      clickCooldown = Math.max(clickCooldown - 50, GAME_CONFIG.minClickCooldown);
      upgradeCosts.upgrade6.count++;
      upgradeSound.play();
      updateUpgradeCostDisplay("upgrade6");
      updateStats();
    }
  });

  upgrade7.addEventListener("click", () => {
    const cost = calculatePrice(upgradeCosts.upgrade7.base, upgradeCosts.upgrade7.count, "upgrade7");
    if (points >= cost) {
      points -= cost;
      tinyPassiveIncome += 0.2;
      upgradeCosts.upgrade7.count++;
      upgradeSound.play();
      updateUpgradeCostDisplay("upgrade7");
      updateStats();
    }
  });

  upgrade8.addEventListener("click", () => {
    const cost = calculatePrice(upgradeCosts.upgrade8.base, upgradeCosts.upgrade8.count, "upgrade8");
    if (points >= cost) {
      points -= cost;
      mediumPassiveIncome += 1;
      upgradeCosts.upgrade8.count++;
      upgradeSound.play();
      updateUpgradeCostDisplay("upgrade8");
      updateStats();
    }
  });

  function updateStats() {
    window.points = points;
    pointsDisplay.textContent = Math.floor(points);
    const totalPassiveIncome = (tinyPassiveIncome + smallPassiveIncome + mediumPassiveIncome + passiveIncome) * passiveIncomeMultiplier;
    passiveIncomeDisplay.textContent = totalPassiveIncome.toFixed(1);
    totalClicksDisplay.textContent = totalClicks;
    totalPointsGeneratedDisplay.textContent = Math.floor(totalPoints);

    document.getElementById("clickValue").textContent = "Current: " + clickValue;
    document.getElementById("clickMultiplier").textContent = "Current: x" + clickMultiplier.toFixed(2);
    document.getElementById("passiveIncomeValue").textContent = "Current: " + passiveIncome + "/s";
    document.getElementById("passiveIncomeValueMedium").textContent = "Current: " + mediumPassiveIncome.toFixed(1) + "/s";
    document.getElementById("passiveIncomeValueTiny").textContent = "Current: " + tinyPassiveIncome.toFixed(1) + "/s";
    document.getElementById("passiveIncomeValueSmall").textContent = "Current: " + smallPassiveIncome.toFixed(1) + "/s";
    document.getElementById("passiveIncomeMultiplier").textContent = "Current: x" + passiveIncomeMultiplier.toFixed(2);
    document.getElementById("clickCooldownValue").textContent = "Current: " + clickCooldown + "ms";

    upgrade1.disabled = points < calculatePrice(upgradeCosts.upgrade1.base, upgradeCosts.upgrade1.count, "upgrade1");
    upgrade2.disabled = points < calculatePrice(upgradeCosts.upgrade2.base, upgradeCosts.upgrade2.count, "upgrade2");
    upgrade3.disabled = points < calculatePrice(upgradeCosts.upgrade3.base, upgradeCosts.upgrade3.count, "upgrade3");
    upgrade4.disabled = points < calculatePrice(upgradeCosts.upgrade4.base, upgradeCosts.upgrade4.count, "upgrade4");
    upgrade5.disabled = points < calculatePrice(upgradeCosts.upgrade5.base, upgradeCosts.upgrade5.count, "upgrade5");
    upgrade6.disabled = points < calculatePrice(upgradeCosts.upgrade6.base, upgradeCosts.upgrade6.count, "upgrade6") || clickCooldown <= GAME_CONFIG.minClickCooldown;
    upgrade7.disabled = points < calculatePrice(upgradeCosts.upgrade7.base, upgradeCosts.upgrade7.count, "upgrade7");
    upgrade8.disabled = points < calculatePrice(upgradeCosts.upgrade8.base, upgradeCosts.upgrade8.count, "upgrade8");
  }

  let passiveIncomeAccumulator = 0;
  setInterval(() => {
    const passiveIncomePerSecond = (tinyPassiveIncome + smallPassiveIncome + mediumPassiveIncome + passiveIncome) * passiveIncomeMultiplier;
    passiveIncomeAccumulator += passiveIncomePerSecond * 0.1;
    if (passiveIncomeAccumulator >= 1) {
      const pointsToAdd = Math.floor(passiveIncomeAccumulator);
      points += pointsToAdd;
      totalPoints += pointsToAdd;
      passiveIncomeAccumulator -= pointsToAdd;
    }
    updateStats();

    if (passiveIncomePerSecond > 0) {
      passiveIncomeContainer.style.display = "flex";
      passiveProgressBar.style.transition = "none";
      passiveProgressBar.style.width = "0%";

      let startTime = Date.now();
      const animatePassiveProgress = () => {
        const elapsedTime = Date.now() - startTime;
        let progress = Math.min((elapsedTime / 1000) * 100, 100);
        passiveProgressBar.style.transition = "width 0s linear";
        passiveProgressBar.style.width = `${progress}%`;
        if (progress < 100) {
          requestAnimationFrame(animatePassiveProgress);
        } else {
          setTimeout(() => {
            passiveProgressBar.style.transition = "width 1s linear";
            passiveProgressBar.style.width = "100%";
          }, 0);
        }
      };
      requestAnimationFrame(animatePassiveProgress);
    } else {
      passiveIncomeContainer.style.display = "none";
    }
  }, 100);

  loadGame();
});