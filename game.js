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
  const totalPointsGeneratedDisplay = document.getElementById(
    "totalPointsGenerated"
  );
  const saveButton = document.getElementById("saveButton");
  const loadButton = document.getElementById("loadButton");
  const resetButton = document.getElementById("resetButton");
  const progressBar = document.querySelector(".progress-fill");
  const passiveProgressBar = document.querySelector(".passive-progress-fill");

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
  let clickCooldown = 1000;

  const UPGRADE_EXPONENTIALS = {
    upgrade1: 1.5,
    upgrade2: 2.3,
    upgrade3: 1.8,
    upgrade4: 2.3,
    upgrade5: 1.6,
    upgrade6: 1.9,
    upgrade7: 1.5,
    upgrade8: 1.7,
  };

  // Define base upgrade costs in a centralized object
  const UPGRADE_BASE_COSTS = {
    upgrade1: 15,
    upgrade2: 300,
    upgrade3: 200,
    upgrade4: 400,
    upgrade5: 60,
    upgrade6: 120,
    upgrade7: 20,
    upgrade8: 100,
  };

  // Define upgrade names in a centralized object
  const UPGRADE_NAMES = {
    upgrade1: "Click Boost",
    upgrade2: "Click Multiplier Surge",
    upgrade3: "Steady Income",
    upgrade4: "Idle Power",
    upgrade5: "Starter Income",
    upgrade6: "Rapid Clicks",
    upgrade7: "Tiny Income",
    upgrade8: "Budget Income",
  };

const GAME_CONFIG = {
  minClickCooldown: 200,
};

  // Initialize upgrade costs with base prices and purchase counts
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

  // Function to calculate new price for an upgrade
  function calculatePrice(base, count, upgradeId) {
    const exponential = UPGRADE_EXPONENTIALS[upgradeId];
    return Math.floor(base * Math.pow(exponential, count));
  }

  // Function to update upgrade cost display
  function updateUpgradeCostDisplay(upgradeId) {
    const button = document.getElementById(upgradeId);
    const newCost = calculatePrice(
      upgradeCosts[upgradeId].base,
      upgradeCosts[upgradeId].count,
      upgradeId
    );
    const description = button.textContent.split("-")[1] || "";
    button.textContent =
      `${UPGRADE_NAMES[upgradeId]} (${newCost} points) - ${description}`.trim();
  }

  // Function to save game state
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
      upgrade1Disabled: upgrade1.disabled,
      upgrade2Disabled: upgrade2.disabled,
      upgrade3Disabled: upgrade3.disabled,
      upgrade4Disabled: upgrade4.disabled,
      upgrade5Disabled: upgrade5.disabled,
      upgrade6Disabled: upgrade6.disabled,
      upgrade7Disabled: upgrade7.disabled,
      upgrade8Disabled: upgrade8.disabled,
    };
    localStorage.setItem("gameSave", JSON.stringify(saveData));
    console.log('Saved data:', saveData);
    alert("Game saved!");
  }

  // Function to load game state
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
      clickCooldown = Math.max(saveData.clickCooldown || 1000, GAME_CONFIG.minClickCooldown);
      upgradeCosts = saveData.upgradeCosts || {
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
      upgrade1.disabled = saveData.upgrade1Disabled;
      upgrade2.disabled = saveData.upgrade2Disabled;
      upgrade3.disabled = saveData.upgrade3Disabled;
      upgrade4.disabled = saveData.upgrade4Disabled;
      upgrade5.disabled = saveData.upgrade5Disabled;
      upgrade6.disabled = saveData.upgrade6Disabled;
      upgrade7.disabled = saveData.upgrade7Disabled;
      upgrade8.disabled = saveData.upgrade8Disabled;
      updateStats();
      progressBar.style.transition = "none";
      progressBar.style.width = "100%";
      alert("Game loaded!");
    } else {
      clickCooldown = 1000;
      progressBar.style.transition = "none";
      progressBar.style.width = "100%";
      alert("No saved game found!");
    }
  }

  // Function to reset game state
  function resetGame() {
    if (confirm("Are you sure you want to reset the game?")) {
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
      clickCooldown = 1000;
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
      [upgrade1, upgrade2, upgrade3, upgrade4, upgrade5, upgrade6].forEach(
        (btn) => (btn.disabled = true)
      );
      updateStats();
      alert("Game reset!");
    }
  }

  // Event listeners for save, load, and reset
  saveButton.addEventListener("click", saveGame);
  loadButton.addEventListener("click", loadGame);
  resetButton.addEventListener("click", resetGame);

  // Click event for the main game button with cooldown
  clickButton.addEventListener("click", () => {
    if (isClickingAllowed) {
      points += clickValue * clickMultiplier;
      totalPoints += clickValue * clickMultiplier;
      totalClicks++;
      updateStats();
  
      // Start cooldown
      isClickingAllowed = false;
      clickButton.disabled = true;
      progressBar.style.transition = "none";
      progressBar.style.width = "0%";
  
      // Animate the progress bar
      let startTime = Date.now();
      const animateProgress = () => {
        const elapsedTime = Date.now() - startTime;
        let progress = Math.min((elapsedTime / clickCooldown) * 100, 100);
        progressBar.style.transition = "width 0s linear";
        progressBar.style.width = `${progress}%`;
  
        if (progress < 100) {
          requestAnimationFrame(animateProgress);
        }
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

  // Upgrade event listeners
  upgrade1.addEventListener("click", () => {
    const cost = calculatePrice(
      upgradeCosts.upgrade1.base,
      upgradeCosts.upgrade1.count,
      "upgrade1"
    );
    if (points >= cost) {
      points -= cost;
      clickValue++;
      upgradeCosts.upgrade1.count++;
      updateUpgradeCostDisplay("upgrade1");
      updateStats();
    }
  });

  upgrade2.addEventListener("click", () => {
    const cost = calculatePrice(
      upgradeCosts.upgrade2.base,
      upgradeCosts.upgrade2.count,
      "upgrade2"
    );
    if (points >= cost) {
      points -= cost;
      clickMultiplier *= 1.5;
      upgradeCosts.upgrade2.count++;
      updateUpgradeCostDisplay("upgrade2");
      updateStats();
    }
  });

  upgrade3.addEventListener("click", () => {
    const cost = calculatePrice(
      upgradeCosts.upgrade3.base,
      upgradeCosts.upgrade3.count,
      "upgrade3"
    );
    if (points >= cost) {
      points -= cost;
      passiveIncome += 1;
      upgradeCosts.upgrade3.count++;
      updateUpgradeCostDisplay("upgrade3");
      updateStats();
    }
  });

  upgrade4.addEventListener("click", () => {
    const cost = calculatePrice(
      upgradeCosts.upgrade4.base,
      upgradeCosts.upgrade4.count,
      "upgrade4"
    );
    if (points >= cost) {
      points -= cost;
      passiveIncomeMultiplier *= 1.5;
      upgradeCosts.upgrade4.count++;
      updateUpgradeCostDisplay("upgrade4");
      updateStats();
    }
  });

  upgrade5.addEventListener("click", () => {
    const cost = calculatePrice(
      upgradeCosts.upgrade5.base,
      upgradeCosts.upgrade5.count,
      "upgrade5"
    );
    if (points >= cost) {
      points -= cost;
      smallPassiveIncome += 0.2;
      upgradeCosts.upgrade5.count++;
      updateUpgradeCostDisplay("upgrade5");
      updateStats();
    }
  });

  upgrade6.addEventListener("click", () => {
    const cost = calculatePrice(
      upgradeCosts.upgrade6.base,
      upgradeCosts.upgrade6.count,
      "upgrade6"
    );
    if (points >= cost && clickCooldown > GAME_CONFIG.minClickCooldown) {
      points -= cost;
      clickCooldown -= 100;
      upgradeCosts.upgrade6.count++;
      updateUpgradeCostDisplay("upgrade6");
      updateStats();
    }
  });

  upgrade7.addEventListener("click", () => {
    const cost = calculatePrice(
      upgradeCosts.upgrade7.base,
      upgradeCosts.upgrade7.count,
      "upgrade7"
    );
    if (points >= cost) {
      points -= cost;
      tinyPassiveIncome += 0.1;
      upgradeCosts.upgrade7.count++;
      updateUpgradeCostDisplay("upgrade7");
      updateStats();
    }
  });

  upgrade8.addEventListener("click", () => {
    const cost = calculatePrice(
      upgradeCosts.upgrade8.base,
      upgradeCosts.upgrade8.count,
      "upgrade8"
    );
    if (points >= cost) {
      points -= cost;
      mediumPassiveIncome += 0.5;
      upgradeCosts.upgrade8.count++;
      updateUpgradeCostDisplay("upgrade8");
      updateStats();
    }
  });

  function updateStats() {
    window.points = points;
    pointsDisplay.textContent = points;
    const totalPassiveIncome = (tinyPassiveIncome + smallPassiveIncome + mediumPassiveIncome + passiveIncome) * passiveIncomeMultiplier;
    passiveIncomeDisplay.textContent = totalPassiveIncome.toFixed(1);
    totalClicksDisplay.textContent = totalClicks;
    totalPointsGeneratedDisplay.textContent = totalPoints;
  
    document.getElementById("clickValue").textContent = "Current: " + clickValue;
    document.getElementById("clickMultiplier").textContent = "Current: x" + clickMultiplier;
    document.getElementById("passiveIncomeValue").textContent = "Current: " + passiveIncome + "/s";
    document.getElementById("passiveIncomeValueMedium").textContent = "Current: " + mediumPassiveIncome.toFixed(1) + "/s";
    document.getElementById("passiveIncomeValueTiny").textContent = "Current: " + tinyPassiveIncome.toFixed(1) + "/s";
    document.getElementById("passiveIncomeValueSmall").textContent = "Current: " + smallPassiveIncome.toFixed(1) + "/s";
    document.getElementById("passiveIncomeMultiplier").textContent = "Current: x" + passiveIncomeMultiplier;
    document.getElementById("clickCooldownValue").textContent = "Current: " + clickCooldown + "ms";
  
    // Update upgrade buttons based on affordability with safeguards
    upgrade1.disabled = points < (upgradeCosts.upgrade1 ? calculatePrice(upgradeCosts.upgrade1.base, upgradeCosts.upgrade1.count, "upgrade1") : 0);
    upgrade2.disabled = points < (upgradeCosts.upgrade2 ? calculatePrice(upgradeCosts.upgrade2.base, upgradeCosts.upgrade2.count, "upgrade2") : 0);
    upgrade3.disabled = points < (upgradeCosts.upgrade3 ? calculatePrice(upgradeCosts.upgrade3.base, upgradeCosts.upgrade3.count, "upgrade3") : 0);
    upgrade4.disabled = points < (upgradeCosts.upgrade4 ? calculatePrice(upgradeCosts.upgrade4.base, upgradeCosts.upgrade4.count, "upgrade4") : 0);
    upgrade5.disabled = points < (upgradeCosts.upgrade5 ? calculatePrice(upgradeCosts.upgrade5.base, upgradeCosts.upgrade5.count, "upgrade5") : 0);
    upgrade6.disabled = points < (upgradeCosts.upgrade6 ? calculatePrice(upgradeCosts.upgrade6.base, upgradeCosts.upgrade6.count, "upgrade6") : 0) || clickCooldown <= GAME_CONFIG.minClickCooldown;
    upgrade7.disabled = points < (upgradeCosts.upgrade7 ? calculatePrice(upgradeCosts.upgrade7.base, upgradeCosts.upgrade7.count, "upgrade7") : 0);
    upgrade8.disabled = points < (upgradeCosts.upgrade8 ? calculatePrice(upgradeCosts.upgrade8.base, upgradeCosts.upgrade8.count, "upgrade8") : 0);
  }

  // Passive income every second
  let passiveIncomeAccumulator = 0;
  setInterval(() => {
    const passiveIncomePerSecond =
      (tinyPassiveIncome+ smallPassiveIncome + mediumPassiveIncome + passiveIncome) * passiveIncomeMultiplier;
    passiveIncomeAccumulator += Math.round(passiveIncomePerSecond * 10) / 10;
    if (passiveIncomeAccumulator >= 1) {
      const pointsToAdd = Math.floor(passiveIncomeAccumulator);
      points += pointsToAdd;
      totalPoints += pointsToAdd;
      passiveIncomeAccumulator -= pointsToAdd;
    }
    updateStats();

    // Only animate if passive income is greater than 0
    if (passiveIncome > 0 || smallPassiveIncome > 0 || tinyPassiveIncome > 0 || mediumPassiveIncome > 0) {
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
  }, 1000);

  // Load game on page load if a save exists
  loadGame();
});