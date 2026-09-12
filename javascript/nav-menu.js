/* =========================================================
   MENU HAMBURGER (nav-menu)
   Ouvre/ferme le panneau de navigation plein écran sous 768px.
   Délégation d'événements sur document, même style que
   windows-iframe.js / lock-screen.js.
========================================================= */

function getPanelForToggle(toggle) {
  const panelId = toggle.getAttribute("aria-controls");
  return panelId ? document.getElementById(panelId) : null;
}

function getFocusableElements(panel) {
  const closeButton = panel.querySelector(".nav-menu__close");
  const elements = closeButton ? [closeButton] : [];
  return elements.concat(Array.from(panel.querySelectorAll(".nav-menu__link")));
}

function openMenu(toggle, panel) {
  toggle.setAttribute("aria-expanded", "true");
  panel.classList.add("nav-menu__panel--open");

  const focusable = getFocusableElements(panel);
  focusable.forEach(function (el) {
    el.removeAttribute("tabindex");
  });

  if (focusable[0]) focusable[0].focus();
}

function closeMenu(toggle, panel) {
  toggle.setAttribute("aria-expanded", "false");
  panel.classList.remove("nav-menu__panel--open");

  getFocusableElements(panel).forEach(function (el) {
    el.setAttribute("tabindex", "-1");
  });

  toggle.focus();
}

function getOpenMenu() {
  const panel = document.querySelector(".nav-menu__panel--open");
  if (!panel) return null;

  const toggle = document.querySelector('.nav-menu__toggle[aria-expanded="true"]');
  return toggle ? { toggle: toggle, panel: panel } : null;
}

// Toggle au clic sur le bouton hamburger
document.addEventListener("click", function (event) {
  const toggle = event.target.closest(".nav-menu__toggle");
  if (!toggle) return;

  const panel = getPanelForToggle(toggle);
  if (!panel) return;

  const isOpen = toggle.getAttribute("aria-expanded") === "true";
  if (isOpen) {
    closeMenu(toggle, panel);
  } else {
    openMenu(toggle, panel);
  }
});

// Fermeture au clic sur un lien du panneau (laisse la navigation,
// ou l'interception .open-page de windows-iframe.js, s'exécuter)
document.addEventListener("click", function (event) {
  const link = event.target.closest(".nav-menu__link");
  if (!link) return;

  const open = getOpenMenu();
  if (open) closeMenu(open.toggle, open.panel);
});

// Fermeture au clic sur le bouton X du panneau
document.addEventListener("click", function (event) {
  if (!event.target.closest(".nav-menu__close")) return;

  const open = getOpenMenu();
  if (open) closeMenu(open.toggle, open.panel);
});

// Fermeture au clic en dehors du panneau ouvert
document.addEventListener("click", function (event) {
  const open = getOpenMenu();
  if (!open) return;

  if (event.target.closest(".nav-menu__panel") || event.target.closest(".nav-menu__toggle")) {
    return;
  }

  closeMenu(open.toggle, open.panel);
});

// Échap ferme le panneau ouvert ; Tab/Shift+Tab restent piégés dedans
document.addEventListener("keydown", function (event) {
  const open = getOpenMenu();
  if (!open) return;

  if (event.key === "Escape") {
    closeMenu(open.toggle, open.panel);
    return;
  }

  if (event.key !== "Tab") return;

  const focusable = [open.toggle].concat(getFocusableElements(open.panel));
  const currentIndex = focusable.indexOf(document.activeElement);

  if (event.shiftKey && (currentIndex === 0 || currentIndex === -1)) {
    event.preventDefault();
    focusable[focusable.length - 1].focus();
  } else if (!event.shiftKey && currentIndex === focusable.length - 1) {
    event.preventDefault();
    focusable[0].focus();
  }
});

// Repassage en desktop pendant que le panneau est ouvert : on referme
// pour éviter un panneau plein écran "collé" au-dessus du layout desktop
const desktopQuery = window.matchMedia("(min-width: 768px)");
desktopQuery.addEventListener("change", function (event) {
  if (!event.matches) return;

  const open = getOpenMenu();
  if (open) closeMenu(open.toggle, open.panel);
});

// État initial : liens et bouton de fermeture non focusables tant que le panneau est fermé
document.querySelectorAll(".nav-menu__panel").forEach(function (panel) {
  getFocusableElements(panel).forEach(function (el) {
    el.setAttribute("tabindex", "-1");
  });
});
