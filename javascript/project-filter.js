// Filtre les cartes de projets par catégorie et/ou par technologie.
// Un clic sur un bouton actif le désactive et réinitialise ce filtre.
// Les deux filtres (catégorie, technologie) se combinent : une carte doit
// correspondre aux deux pour rester visible.

(function () {
  const categoryButtons = document.querySelectorAll(".explorer__legend-item[data-filter]");
  const techButtons = document.querySelectorAll(".explorer__legend-item[data-filter-tech]");
  const projectLinks = document.querySelectorAll("[data-category]");
  const groups = document.querySelectorAll(".explorer__group[data-project-group]");

  if (!projectLinks.length) return;

  let activeCategory = null;
  let activeTech = null;

  function applyFilters() {
    projectLinks.forEach(function (link) {
      const categoryMatches = !activeCategory || link.dataset.category === activeCategory;
      const techList = (link.dataset.tech || "").split(",");
      const techMatches = !activeTech || techList.includes(activeTech);
      link.style.display = categoryMatches && techMatches ? "" : "none";
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

  function setupToggleGroup(buttons, valueAttr, onChange) {
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        const isActive = button.getAttribute("aria-pressed") === "true";

        buttons.forEach(function (btn) {
          btn.setAttribute("aria-pressed", "false");
        });

        onChange(isActive ? null : button.dataset[valueAttr]);
        if (!isActive) button.setAttribute("aria-pressed", "true");

        applyFilters();
      });
    });
  }

  setupToggleGroup(categoryButtons, "filter", function (value) {
    activeCategory = value;
  });

  setupToggleGroup(techButtons, "filterTech", function (value) {
    activeTech = value;
  });
})();
