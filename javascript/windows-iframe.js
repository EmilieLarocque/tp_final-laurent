/* =========================================================
   SYSTÈME DE FENÊTRES
   Ouvre les liens ".open-page" dans une fenêtre flottante
   à l'intérieur de #home, avec une iframe qui charge la page.
   Chaque fenêtre a aussi un bouton dans la barre des tâches.
========================================================= */

let windowCount = 0;
let topZIndex = 100;

const taskbarWindows = document.getElementById("taskbar-windows");

// Ouvre une fenêtre quand on clique sur un lien ".open-page"
document.addEventListener("click", function (event) {
  const link = event.target.closest(".open-page");
  if (!link) return;

  event.preventDefault();

  const url = link.getAttribute("href");
  const title = link.dataset.title || "Fenêtre";
  createWindow(url, title);
});

function createWindow(url, title) {
  const desktop = document.getElementById("home");
  if (!desktop) return;

  windowCount++;

  // On construit toute la fenêtre en une fois avec un template HTML,
  // c'est plus simple à lire que de créer chaque élément un par un.
  const windowElement = document.createElement("div");
  windowElement.className = "window";
  windowElement.innerHTML = `
    <div class="window-header">
      <div class="window-title">${title}</div>
      <div class="window-controls">
        <button type="button" class="window-control window-control--minimize" title="Réduire">−</button>
        <button type="button" class="window-control window-control--maximize" title="Agrandir">□</button>
        <button type="button" class="window-control window-control--close" title="Fermer">×</button>
      </div>
    </div>
    <div class="window-content">
      <iframe src="${url}" title="${title}" loading="lazy"></iframe>
    </div>
  `;

  desktop.appendChild(windowElement);
  positionWindow(windowElement, desktop);
  createTaskbarButton(windowElement, title);
  bringToFront(windowElement);

  // Passer la fenêtre au premier plan dès qu'on clique dessus
  windowElement.addEventListener("mousedown", function () {
    bringToFront(windowElement);
  });

  const header = windowElement.querySelector(".window-header");
  const minimizeButton = windowElement.querySelector(".window-control--minimize");
  const maximizeButton = windowElement.querySelector(".window-control--maximize");
  const closeButton = windowElement.querySelector(".window-control--close");

  minimizeButton.addEventListener("click", function (event) {
    event.stopPropagation();
    windowElement.classList.toggle("window--minimized");
    syncTaskbar();
  });

  maximizeButton.addEventListener("click", function (event) {
    event.stopPropagation();
    windowElement.classList.toggle("window--maximized");
  });

  closeButton.addEventListener("click", function (event) {
    event.stopPropagation();
    windowElement.classList.add("window--closing");
    windowElement.taskbarButton.remove();

    // On attend la fin de l'animation CSS (0.22s) avant de retirer l'élément
    setTimeout(function () {
      windowElement.remove();
    }, 220);
  });

  makeDraggable(windowElement, header, desktop);
}

// Place la nouvelle fenêtre au centre de #home, avec un léger décalage
// en cascade pour que les fenêtres ne se superposent pas exactement.
function positionWindow(windowElement, desktop) {
  const cascadeOffset = ((windowCount - 1) % 5) * 30;

  let left = (desktop.clientWidth - windowElement.offsetWidth) / 2 + cascadeOffset;
  let top = (desktop.clientHeight - windowElement.offsetHeight) / 2 + cascadeOffset;

  const position = clampToDesktop(windowElement, desktop, left, top);
  windowElement.style.left = `${position.left}px`;
  windowElement.style.top = `${position.top}px`;
}

// Empêche une fenêtre de sortir de la zone #home
function clampToDesktop(windowElement, desktop, left, top) {
  const maxLeft = desktop.clientWidth - windowElement.offsetWidth;
  const maxTop = desktop.clientHeight - windowElement.offsetHeight;

  return {
    left: Math.max(0, Math.min(left, maxLeft)),
    top: Math.max(0, Math.min(top, maxTop)),
  };
}

function bringToFront(windowElement) {
  topZIndex++;
  windowElement.style.zIndex = topZIndex;

  document.querySelectorAll(".window").forEach(function (item) {
    item.classList.remove("window--active");
  });
  windowElement.classList.add("window--active");

  syncTaskbar();
}

function makeDraggable(windowElement, header, desktop) {
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  header.addEventListener("mousedown", function (event) {
    if (event.target.closest(".window-controls")) return;
    if (windowElement.classList.contains("window--maximized")) return;

    dragging = true;
    bringToFront(windowElement);

    const windowRect = windowElement.getBoundingClientRect();
    offsetX = event.clientX - windowRect.left;
    offsetY = event.clientY - windowRect.top;

    event.preventDefault();
  });

  document.addEventListener("mousemove", function (event) {
    if (!dragging) return;

    const desktopRect = desktop.getBoundingClientRect();
    const newLeft = event.clientX - desktopRect.left - offsetX;
    const newTop = event.clientY - desktopRect.top - offsetY;

    const position = clampToDesktop(windowElement, desktop, newLeft, newTop);
    windowElement.style.left = `${position.left}px`;
    windowElement.style.top = `${position.top}px`;
  });

  document.addEventListener("mouseup", function () {
    dragging = false;
  });
}

/* =========================================================
   BARRE DES TÂCHES
   Un bouton par fenêtre ouverte, pour la réduire/restaurer,
   plus une horloge qui se met à jour toutes les secondes.
========================================================= */

function createTaskbarButton(windowElement, title) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "taskbar-window";
  button.textContent = title;

  button.addEventListener("click", function () {
    handleTaskbarClick(windowElement);
  });

  taskbarWindows.appendChild(button);

  // On garde une référence directe vers le bouton sur la fenêtre,
  // pour pouvoir les garder synchronisés (état actif, suppression...).
  windowElement.taskbarButton = button;
}

function handleTaskbarClick(windowElement) {
  if (windowElement.classList.contains("window--minimized")) {
    windowElement.classList.remove("window--minimized");
    bringToFront(windowElement);
  } else if (windowElement.classList.contains("window--active")) {
    windowElement.classList.add("window--minimized");
    syncTaskbar();
  } else {
    bringToFront(windowElement);
  }
}

// Met en surbrillance le bouton de la fenêtre au premier plan
function syncTaskbar() {
  document.querySelectorAll(".window").forEach(function (windowItem) {
    const isFocused =
      windowItem.classList.contains("window--active") &&
      !windowItem.classList.contains("window--minimized");

    windowItem.taskbarButton.classList.toggle("taskbar-window--active", isFocused);
  });
}

const taskbarClock = document.getElementById("taskbar-clock");

function updateTaskbarClock() {
  taskbarClock.textContent = new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

updateTaskbarClock();
setInterval(updateTaskbarClock, 1000);
