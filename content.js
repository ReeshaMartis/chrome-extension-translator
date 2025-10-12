console.log("Extension loaded!");

// ----------------------
// Banner setup
// ----------------------
const banner = document.createElement("div");
banner.style.position = "fixed";
banner.style.display = "flex";
banner.style.alignItems = "center";
banner.style.gap = "6px";
banner.style.top = "10px";
banner.style.right = "10px";
banner.style.background = "#222";
banner.style.color = "white";
banner.style.padding = "10px";
banner.style.borderRadius = "8px";
banner.style.zIndex = "9999";
banner.style.cursor = "default"; // not clickable now
document.body.appendChild(banner);

// --- Add Close Button ---
const closeBtn = document.createElement("span");
closeBtn.innerText = "❌";
closeBtn.style.marginLeft = "8px";
closeBtn.style.cursor = "pointer";
closeBtn.style.fontWeight = "bold";
closeBtn.style.color = "#ff5555";
banner.appendChild(closeBtn);

// --- Handle close button click ---
closeBtn.addEventListener("click", (event) => {
  event.stopPropagation(); // prevent any other click effects
  banner.remove();
});

// ----------------------
// Score management
// ----------------------
chrome.storage.local.get(["highScore"], (result) => {
  const highScore = result.highScore ?? 0;
  const currentScore = 0; // always start fresh per page load

  chrome.storage.local.set({ score: currentScore, highScore }, () => {
    updateBanner(currentScore, highScore);
  });
});

function updateBanner(score, highScore) {
  banner.innerText = `🎯 Score: ${score} | 🏆 High: ${highScore}`;
  banner.appendChild(closeBtn); // keep close button
}

// ----------------------
// Helper: collect text nodes
// ----------------------
function getTextNodes() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  const textNodes = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    
    // Skip if the text node is inside a link
    if (node.parentNode.closest("a")) continue;
    
    if (node.nodeValue.trim().split(/\s+/).length < 3) { // only small words/phrases
      textNodes.push(node);
    }
  }
  return textNodes;
}

// ----------------------
// Phase 1: Game word functions
// ----------------------

// Pick random words for the game
function pickGameWords(textNodes) {
  const maxWords = 10;
  const numWords = Math.min(Math.floor(textNodes.length / 2), maxWords);

  const picked = [];
  const usedIndices = new Set();

  while (picked.length < numWords && picked.length < textNodes.length) {
    const randIndex = Math.floor(Math.random() * textNodes.length);
    if (!usedIndices.has(randIndex)) {
      picked.push(textNodes[randIndex]);
      usedIndices.add(randIndex);
    }
  }

  return picked;
}

// Highlight a single word
function highlightWord(node) {
  const span = document.createElement("span");
  span.innerText = node.nodeValue;
  span.style.backgroundColor = "#ffeb3a";
  span.style.cursor = "pointer";

  node.parentNode.replaceChild(span, node);
  return span;
}

// Enable game mode
function gameModeWords() {
  const textNodes = getTextNodes();
  const gameNodes = pickGameWords(textNodes);

  gameNodes.forEach(node => {
    const span = highlightWord(node);
    span.addEventListener("click", () => {
      const userTranslation = prompt(`Translate this word: "${span.innerText}"`);
      console.log("User entered:", userTranslation);

      // --- Increment score ---
      chrome.storage.local.get(["score", "highScore"], (result) => {
        let newScore = (result.score || 0) + 1;
        let newHigh = result.highScore || 0;
        if (newScore > newHigh) newHigh = newScore;

        chrome.storage.local.set({ score: newScore, highScore: newHigh }, () => {
          updateBanner(newScore, newHigh);
        });
      });
    });
  });
}

// ----------------------
// Start game mode
// ----------------------
gameModeWords();
