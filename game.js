window.points = 0;

document.addEventListener("DOMContentLoaded", () => {
  const pointsDisplay = document.getElementById("points");
  const passiveIncomeDisplay = document.getElementById("passiveIncome");
  const clickButton = document.getElementById("clickButton");
  const upgrade1 = document.getElementById("upgrade1");
  const upgrade2 = document.getElementById("upgrade2");
  const upgrade3 = document.getElementById("upgrade3");
  const upgrade4 = document.getElementById("upgrade4");
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
  let totalClicks = 0;
  let clickMultiplier = 1;
  let passiveIncomeMultiplier = 1;
  let isClickingAllowed = true;
  const clickCooldown = 1000;

  // Initialize upgrade costs with base prices and purchase counts
  let upgradeCosts = {
    upgrade1: { base: 20, count: 0 },
    upgrade2: { base: 200, count: 0 },
    upgrade3: { base: 100, count: 0 },
    upgrade4: { base: 500, count: 0 },
  };

  // Function to calculate new price for an upgrade
  function calculatePrice(base, count, exponential) {
    return Math.floor(base * Math.pow(exponential, count));
  }

  // Function to update upgrade cost display
  function updateUpgradeCostDisplay(upgradeId) {
    const button = document.getElementById(upgradeId);
    let exponential;
    switch (upgradeId) {
      case "upgrade1":
        exponential = 1.15;
        break;
      case "upgrade2":
        exponential = 1.25;
        break;
      case "upgrade3":
        exponential = 1.2;
        break;
      case "upgrade4":
        exponential = 1.3;
        break;
    }
    const newCost = calculatePrice(
      upgradeCosts[upgradeId].base,
      upgradeCosts[upgradeId].count,
      exponential
    );
    button.textContent = `Upgrade ${upgradeId.slice(
      -1
    )} (${newCost} points) - ${button.textContent.split("-")[1]}`;
  }

  // Function to save game state
  function saveGame() {
    const saveData = {
      points,
      totalPoints,
      clickValue,
      passiveIncome,
      totalClicks,
      clickMultiplier,
      passiveIncomeMultiplier,
      upgradeCosts,
      upgrade1Disabled: upgrade1.disabled,
      upgrade2Disabled: upgrade2.disabled,
      upgrade3Disabled: upgrade3.disabled,
      upgrade4Disabled: upgrade4.disabled,
    };
    localStorage.setItem("gameSave", JSON.stringify(saveData));
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
    totalClicks = saveData.totalClicks;
    clickMultiplier = saveData.clickMultiplier || 1;
    passiveIncomeMultiplier = saveData.passiveIncomeMultiplier || 1;
    upgradeCosts = saveData.upgradeCosts || {
      upgrade1: { base: 50, count: 0 },
      upgrade2: { base: 500, count: 0 },
      upgrade3: { base: 250, count: 0 },
      upgrade4: { base: 1800, count: 0 },
    };
    for (let id in upgradeCosts) {
      updateUpgradeCostDisplay(id);
    }
    upgrade1.disabled = saveData.upgrade1Disabled;
    upgrade2.disabled = saveData.upgrade2Disabled;
    upgrade3.disabled = saveData.upgrade3Disabled;
    upgrade4.disabled = saveData.upgrade4Disabled;
    updateStats();
    
    // Set the click cooldown bar to full immediately after loading
    progressBar.style.transition = 'none'; 
    progressBar.style.width = '100%'; 
    alert("Game loaded!");
  } else {
    // If there's no saved game, still set the bar to full
    progressBar.style.transition = 'none';
    progressBar.style.width = '100%';
    
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
      totalClicks = 0;
      clickMultiplier = 1;
      passiveIncomeMultiplier = 1;
      upgradeCosts = {
        upgrade1: { base: 50, count: 0 },
        upgrade2: { base: 500, count: 0 },
        upgrade3: { base: 250, count: 0 },
        upgrade4: { base: 1800, count: 0 },
      };
      for (let id in upgradeCosts) {
        updateUpgradeCostDisplay(id);
      }
      upgrade1.disabled = true;
      upgrade2.disabled = true;
      upgrade3.disabled = true;
      upgrade4.disabled = true;
      updateStats();
      alert("Game reset!");
    }
  }

  // Event listeners for save, load, and reset
  saveButton.addEventListener("click", saveGame);
  loadButton.addEventListener("click", loadGame);
  resetButton.addEventListener("click", resetGame);

  // Click event for the main game button with cooldown
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

      // Use setTimeout for exact timing of button enablement
      setTimeout(() => {
        isClickingAllowed = true;
        clickButton.disabled = false;
        progressBar.style.transition = "width 0.3s linear"; 
        progressBar.style.width = "100%"; 
      }, clickCooldown);
    }
  });

  // Upgrade event listeners (unchanged from your code)
  upgrade1.addEventListener("click", () => {
    const cost = calculatePrice(
      upgradeCosts.upgrade1.base,
      upgradeCosts.upgrade1.count,
      1.15
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
      1.25
    );
    if (points >= cost) {
      points -= cost;
      clickMultiplier *= 2;
      upgradeCosts.upgrade2.count++;
      updateUpgradeCostDisplay("upgrade2");
      updateStats();
    }
  });

  upgrade3.addEventListener("click", () => {
    const cost = calculatePrice(
      upgradeCosts.upgrade3.base,
      upgradeCosts.upgrade3.count,
      1.2
    );
    if (points >= cost) {
      points -= cost;
      passiveIncome++;
      upgradeCosts.upgrade3.count++;
      updateUpgradeCostDisplay("upgrade3");
      updateStats();
      if (passiveIncome === 1) {
        passiveIncomeContainer.style.display = "block";
      }
    }
  });

  upgrade4.addEventListener("click", () => {
    const cost = calculatePrice(
      upgradeCosts.upgrade4.base,
      upgradeCosts.upgrade4.count,
      1.3
    );
    if (points >= cost) {
      points -= cost;
      passiveIncomeMultiplier *= 2;
      upgradeCosts.upgrade4.count++;
      updateUpgradeCostDisplay("upgrade4");
      updateStats();
    }
  });

  function updateStats() {
    window.points = points;
    pointsDisplay.textContent = points;
    passiveIncomeDisplay.textContent = passiveIncome * passiveIncomeMultiplier;
    totalClicksDisplay.textContent = totalClicks;
    totalPointsGeneratedDisplay.textContent = totalPoints;

    document.getElementById("clickValue").textContent =
      "Current: " + clickValue;
    document.getElementById("clickMultiplier").textContent =
      "Current: x" + clickMultiplier;
    document.getElementById("passiveIncomeValue").textContent =
      "Current: " + passiveIncome + "/s";
    document.getElementById("passiveIncomeMultiplier").textContent =
      "Current: x" + passiveIncomeMultiplier;

    // Update upgrade buttons based on affordability with correct exponential growth
    upgrade1.disabled =
      points <
      calculatePrice(
        upgradeCosts.upgrade1.base,
        upgradeCosts.upgrade1.count,
        1.15
      );
    upgrade2.disabled =
      points <
      calculatePrice(
        upgradeCosts.upgrade2.base,
        upgradeCosts.upgrade2.count,
        1.25
      );
    upgrade3.disabled =
      points <
      calculatePrice(
        upgradeCosts.upgrade3.base,
        upgradeCosts.upgrade3.count,
        1.2
      );
    upgrade4.disabled =
      points <
      calculatePrice(
        upgradeCosts.upgrade4.base,
        upgradeCosts.upgrade4.count,
        1.3
      );
  }

  // Passive income every second
  let passiveIncomeAccumulator = 0;
  setInterval(() => {
    const passiveIncomePerSecond = passiveIncome * passiveIncomeMultiplier;
    passiveIncomeAccumulator += passiveIncomePerSecond;
    // When we reach a whole number, we add to points
    if (passiveIncomeAccumulator >= 1) {
      const pointsToAdd = Math.floor(passiveIncomeAccumulator);
      points += pointsToAdd;
      totalPoints += pointsToAdd;
      passiveIncomeAccumulator -= pointsToAdd;
    }
    updateStats();

    // Only animate if passive income is greater than 0
    // Only animate if passive income is greater than 0
    if (passiveIncome > 0) {
      // Use 'flex' instead of 'block' to ensure centering
      passiveIncomeContainer.style.display = "flex";
      // Reset and animate the passive income progress bar
      passiveProgressBar.style.transition = "none";
      passiveProgressBar.style.width = "0%";

      // Animate the progress bar over 1 second
      let startTime = Date.now();
      const animatePassiveProgress = () => {
        const elapsedTime = Date.now() - startTime;
        let progress = Math.min((elapsedTime / 1000) * 100, 100);
        passiveProgressBar.style.transition = "width 0s linear"; 
        passiveProgressBar.style.width = `${progress}%`;

        if (progress < 100) {
          requestAnimationFrame(animatePassiveProgress);
        } else {
          // Ensure the bar reaches 100% before the next cycle
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
