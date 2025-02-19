document.addEventListener("DOMContentLoaded", () => {
    const submitScoreButton = document.getElementById("submitScore");
    const refreshLeaderboardButton = document.getElementById("refreshLeaderboard");
    const resetLeaderboardButton = document.getElementById("resetLeaderboard");
    const playerNameInput = document.getElementById("playerName");
    const leaderboardDisplay = document.getElementById("leaderboardDisplay");
  
    // Function to submit score
    function submitScore() {
        const playerName = playerNameInput.value.trim(); // Trim any whitespace
        const score = window.points;
      
        if (playerName && score > 0) {
            // Retrieve existing scores or initialize an empty array
            let scores = JSON.parse(localStorage.getItem('leaderboardScores')) || [];
            
            // Add new score to the array
            scores.push({ player_id: playerName, score: score });
            
            // Save the updated scores back to local storage
            localStorage.setItem('leaderboardScores', JSON.stringify(scores));
            
            alert('Score submitted!');
            // Refresh the leaderboard after submitting a score
            refreshLeaderboard();
        } else {
            alert('Please enter a name and ensure you have points to submit.');
        }
    }
  
    // Function to refresh leaderboard
    function refreshLeaderboard() {
        // Retrieve scores from local storage
        let scores = JSON.parse(localStorage.getItem('leaderboardScores')) || [];
        
        if (scores.length > 0) {
            let leaderboardHTML = '<ul>';
            // Sort the scores array by score in descending order
            scores.sort((a, b) => b.score - a.score).forEach(player => {
                // Use player_id for the name and score for the score
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
        // Clear the leaderboard scores from local storage
        localStorage.removeItem('leaderboardScores');
        // Refresh the leaderboard to show it's empty
        refreshLeaderboard();
        alert('Leaderboard has been reset!');
    }
  
    // Event listeners
    submitScoreButton.addEventListener('click', submitScore);
    refreshLeaderboardButton.addEventListener('click', refreshLeaderboard);
    resetLeaderboardButton.addEventListener('click', resetLeaderboard);
  
    // Refresh the leaderboard when the page loads
    refreshLeaderboard();
});