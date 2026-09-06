/* =========================================================
   EASTER EGG — NODE_MODULES
   La taille du dossier augmente à l'infini toute seule.
   10 clics dessus déclenchent un faux écran bleu (BSOD).
========================================================= */

const NODE_MODULES_UNITS = [
  "Ko", "Mo", "Go", "To", "Po", "Eo", "Zo", "Yo",
  "bibliothèques d'Alexandrie", "systèmes solaires", "univers observables",
];

let nodeModulesValue = 128;
let nodeModulesUnitIndex = 0;

function growNodeModules() {
  const sizeLabel = document.getElementById("node-modules-size");
  if (!sizeLabel) return;

  nodeModulesValue += Math.random() * 40 + 10;

  if (nodeModulesValue >= 1024 && nodeModulesUnitIndex < NODE_MODULES_UNITS.length - 1) {
    nodeModulesValue = nodeModulesValue / 1024;
    nodeModulesUnitIndex++;
  }

  const unit = NODE_MODULES_UNITS[nodeModulesUnitIndex];
  sizeLabel.textContent = `${nodeModulesValue.toFixed(1)} ${unit}`;
}

setInterval(growNodeModules, 700);

/* =========================================================
   FAUX ÉCRAN BLEU (BSOD)
========================================================= */

const nodeModulesIcon = document.getElementById("node-modules-icon");
const bsodScreen = document.getElementById("bsod-screen");
const bsodPercent = document.getElementById("bsod-percent");

const CLICKS_BEFORE_CRASH = 10;
let nodeModulesClicks = 0;

if (nodeModulesIcon) {
  nodeModulesIcon.addEventListener("click", function () {
    nodeModulesClicks++;

    // On relance l'animation de secousse même si elle vient de jouer
    nodeModulesIcon.classList.remove("shake");
    void nodeModulesIcon.offsetWidth;
    nodeModulesIcon.classList.add("shake");

    if (nodeModulesClicks >= CLICKS_BEFORE_CRASH) {
      triggerBSOD();
      nodeModulesClicks = 0;
    }
  });
}

function triggerBSOD() {
  if (!bsodScreen) return;

  bsodScreen.classList.remove("hidden");
  bsodScreen.focus();

  let percent = 0;
  bsodPercent.textContent = "0";

  const progressInterval = setInterval(function () {
    percent = Math.min(100, percent + Math.round(Math.random() * 15) + 5);
    bsodPercent.textContent = percent;

    if (percent >= 100) {
      clearInterval(progressInterval);
    }
  }, 250);

  function dismissBSOD() {
    bsodScreen.classList.add("hidden");
    clearInterval(progressInterval);
    bsodScreen.removeEventListener("click", dismissBSOD);
    document.removeEventListener("keydown", dismissOnEscape);
  }

  function dismissOnEscape(event) {
    if (event.key === "Escape") dismissBSOD();
  }

  bsodScreen.addEventListener("click", dismissBSOD);
  document.addEventListener("keydown", dismissOnEscape);
}

/* =========================================================
   NOTIFICATIONS DU BUREAU (licence, à propos de ce bureau)
   Se ferment au clic, comme de vraies notifs Windows.
========================================================= */

document.querySelectorAll(".desktop-about").forEach(function (notification) {
  const closeButton = notification.querySelector(".desktop-about-close");
  if (!closeButton) return;

  closeButton.addEventListener("click", function () {
    notification.classList.add("is-dismissed");
    notification.addEventListener("animationend", function () {
      notification.style.display = "none";
    }, { once: true });
  });
});
