console.log("Extension loaded on this page!");

const banner = document.createElement("div");
banner.innerText = "Hello from Quick Translate Extension 🚀";
banner.style.position = "fixed";
banner.style.top = "10px";
banner.style.right = "10px";
banner.style.background = "yellow";
banner.style.padding = "10px";
banner.style.zIndex = "9999";
document.body.appendChild(banner);
