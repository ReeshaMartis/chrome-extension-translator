console.log("Extension loaded!");

const banner = document.createElement("div");
banner.style.position = "fixed";
banner.style.top = "10px";
banner.style.right = "10px";
banner.style.background = "#222";
banner.style.color = "white";
banner.style.padding = "10px";
banner.style.borderRadius = "8px";
banner.style.zIndex = "9999";
banner.style.cursor = "pointer";
document.body.appendChild(banner);

// 🧠 Step 1: Load or initialize scores
chrome.storage.local.get(["highScore"], (result) => {
  const highScore = result.highScore ?? 0;
  const currentScore = 0; // Always start fresh each time the page loads

  // Save this initial state
  chrome.storage.local.set({ score: currentScore, highScore }, () => {
    updateBanner(currentScore, highScore);
  });
});

// 🧩 Step 2: Add click handler to update score
banner.addEventListener("click", () => {
  chrome.storage.local.get(["score", "highScore"], (result) => {
    let newScore = (result.score || 0) + 1;
    let newHigh = result.highScore || 0;

    if (newScore > newHigh) {
      newHigh = newScore;
      console.log("🎉 New high score!");
    }

    chrome.storage.local.set({ score: newScore, highScore: newHigh }, () => {
      updateBanner(newScore, newHigh);
      console.log(`Updated → score: ${newScore}, highScore: ${newHigh}`);
    });
  });
});

// 🪄 Helper function to update text
function updateBanner(score, highScore) {
  banner.innerText = `🎯 Score: ${score} | 🏆 High: ${highScore}\n(Click to increase)`;
}
