/* =========================================================
   ÉCRAN DE VERROUILLAGE
   Affiche une horloge en direct au chargement de la page.
   Un clic (ou Entrée/Espace) révèle le bureau en dessous.
========================================================= */

const lockScreen = document.getElementById("lock-screen");
const lockTime = document.getElementById("lock-time");
const lockDate = document.getElementById("lock-date");
const lockButton = document.getElementById("lock-button");

updateClock();
setInterval(updateClock, 1000);

function updateClock() {
  const now = new Date();

  lockTime.textContent = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  lockDate.textContent = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function unlock() {
  lockScreen.classList.add("hidden");
}

function lock() {
  lockScreen.classList.remove("hidden");
  lockScreen.focus();
}

lockScreen.addEventListener("click", unlock);

lockScreen.addEventListener("keydown", function (event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    unlock();
  }
});

// Bouton de la barre des tâches pour reverrouiller l'écran manuellement
lockButton.addEventListener("click", lock);

