console.log("Extension loaded!");

// ====================
// 🧱 Banner Setup
// ====================
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
banner.style.cursor = "default";
banner.style.fontFamily = "Arial, sans-serif";
banner.style.fontSize = "14px";
document.body.appendChild(banner);

// ❌ Close Button
const closeBtn = document.createElement("span");
closeBtn.innerText = "❌";
closeBtn.style.marginLeft = "8px";
closeBtn.style.cursor = "pointer";
closeBtn.style.fontWeight = "bold";
closeBtn.style.color = "#ff5555";
banner.appendChild(closeBtn);

closeBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  banner.remove();
});

// ====================
// 🎮 Game Functions
// ====================

// 🔍 Get visible, non-link, non-clickable text nodes
function getTextNodes() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  const textNodes = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const parent = node.parentNode;
    const text = node.nodeValue.trim();

    // skip empty, punctuation-only, or weird texts
    if (!text || /^[\W_]+$/.test(text)) continue;
    if (/http|www|@|\.com/i.test(text)) continue;

    // skip invisible
    const style = window.getComputedStyle(parent);
    if (
      parent.offsetParent === null ||
      style.visibility === "hidden" ||
      style.display === "none"
    ) continue;

    // skip links, buttons, etc.
    const skipTags = ["A", "BUTTON", "INPUT", "TEXTAREA", "NAV", "HEADER", "FOOTER", "SVG"];
    if (skipTags.includes(parent.nodeName)) continue;

    // skip clickable or dropdown elements
    let clickable = false;
    let current = parent;
    while (current && current !== document.body) {
      const cs = window.getComputedStyle(current);
      if (
        current.onclick ||
        current.getAttribute("role") === "button" ||
        cs.cursor === "pointer"
      ) {
        clickable = true;
        break;
      }
      current = current.parentElement;
    }
    if (clickable) continue;

    // Only short phrases (1–3 words)
    const wordCount = text.split(/\s+/).length;
    if (wordCount < 1 || wordCount > 3) continue;

    textNodes.push(node);
  }

  return textNodes;
}

// 🎲 Pick random words
function pickGameWords(textNodes) {
  const maxWords = 10;
  const numWords = Math.min(textNodes.length, maxWords);
  const picked = [];
  const used = new Set();

  while (picked.length < numWords && picked.length < textNodes.length) {
    const rand = Math.floor(Math.random() * textNodes.length);
    if (!used.has(rand)) {
      picked.push(textNodes[rand]);
      used.add(rand);
    }
  }

  return picked;
}

// 💡 Highlight a word
function highlightWord(node) {
  const span = document.createElement("span");
  span.innerText = node.nodeValue;
  span.style.backgroundColor = "#ffeb3a";
  span.style.cursor = "pointer";
  span.style.borderRadius = "4px";
  span.style.padding = "1px 3px";
  span.style.transition = "background-color 0.3s ease";

  node.parentNode.replaceChild(span, node);
  return span;
}

// ====================
// 🧩 Game Mode
// ====================
function gameModeWords() {
  const textNodes = getTextNodes();
  const gameNodes = pickGameWords(textNodes);

  let currentScore = 0;
  const totalWords = gameNodes.length;

  updateBanner(currentScore, totalWords);

  gameNodes.forEach((node) => {
    const span = highlightWord(node);

    span.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();

      const userTranslation = prompt(`Translate this word: "${span.innerText}"`);
      if (userTranslation && userTranslation.trim() !== "") {
        currentScore++;
        updateBanner(currentScore, totalWords);
      }

      span.style.backgroundColor = "#c3ffc3"; // mark as done
      span.style.pointerEvents = "none";
    });
  });
}

// ====================
// 🪄 Banner Update
// ====================
function updateBanner(score, totalWords) {
  banner.innerText = `🎯 Score: ${score}/${totalWords} | 🏆 High: TBD`;
  banner.appendChild(closeBtn);
}

// 🚀 Start the game
gameModeWords();
