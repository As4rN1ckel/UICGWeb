document.addEventListener("DOMContentLoaded", () => {
    const submitScoreButton = document.getElementById("submitScore");
    const refreshLeaderboardButton = document.getElementById("refreshLeaderboard");
    const resetLeaderboardButton = document.getElementById("resetLeaderboard");
    const playerNameInput = document.getElementById("playerName");
    const leaderboardDisplay = document.getElementById("leaderboardDisplay");
  
    // Function to submit score
    function submitScore() {
        const playerName = playerNameInput.value.trim();
        const score = window.points;
      
        if (playerName && score > 0) {
            let scores = JSON.parse(localStorage.getItem('leaderboardScores')) || [];
            
            scores.push({ player_id: playerName, score: score });
            
            localStorage.setItem('leaderboardScores', JSON.stringify(scores));
            
            alert('Score submitted!');
            refreshLeaderboard();
        } else {
            alert('Please enter a name and ensure you have points to submit.');
        }
    }
  
    // Function to refresh leaderboard
    function refreshLeaderboard() {
        let scores = JSON.parse(localStorage.getItem('leaderboardScores')) || [];
        
        if (scores.length > 0) {
            let leaderboardHTML = '<ul>';
            scores.sort((a, b) => b.score - a.score).forEach(player => {
                leaderboardHTML += `<li>${player.player_id}: ${player.score}</li>`;
            });
            leaderboardHTML += '</ul>';
            leaderboardDisplay.innerHTML = leaderboardHTML;
        } else {
            leaderboardDisplay.innerHTML = '<p>No scores have been submitted yet.</p>';
        }
    }
    
    // Function to reset leaderboard
    function resetLeaderboard() {
        localStorage.removeItem('leaderboardScores');
        refreshLeaderboard();
        alert('Leaderboard has been reset!');
    }
  
    // Event listeners
    submitScoreButton.addEventListener('click', submitScore);
    refreshLeaderboardButton.addEventListener('click', refreshLeaderboard);
    resetLeaderboardButton.addEventListener('click', resetLeaderboard);
  
    refreshLeaderboard();
});