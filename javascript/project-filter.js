// Filtre les cartes de projets par catégorie en cliquant sur la légende.
// Un clic sur une catégorie active n'affiche que ses cartes ; recliquer dessus
// réinitialise et affiche tout.

(function () {
  const legendButtons = document.querySelectorAll(".explorer-legend-item[data-filter]");
  const projectLinks = document.querySelectorAll("[data-category]");
  const groups = document.querySelectorAll(".explorer-group[data-project-group]");

  if (!legendButtons.length || !projectLinks.length) return;

  function applyFilter(activeFilter) {
    projectLinks.forEach(function (link) {
      const matches = !activeFilter || link.dataset.category === activeFilter;
      link.style.display = matches ? "" : "none";
    });

    groups.forEach(function (group) {
      const hasVisibleCard = Array.prototype.some.call(
        group.querySelectorAll("[data-category]"),
        function (link) {
          return link.style.display !== "none";
        }
      );
      group.style.display = hasVisibleCard ? "" : "none";
    });
  }

  legendButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const isActive = button.getAttribute("aria-pressed") === "true";

      legendButtons.forEach(function (btn) {
        btn.setAttribute("aria-pressed", "false");
      });

      if (isActive) {
        applyFilter(null);
      } else {
        button.setAttribute("aria-pressed", "true");
        applyFilter(button.dataset.filter);
      }
    });
  });
})();
