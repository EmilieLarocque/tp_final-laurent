/* =========================================================
   QUEST LOG — page Services
   Clique sur une étape de la liste de gauche pour afficher
   son détail (tag, titre, description, checklist) à droite.
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const items = document.querySelectorAll(".quest-list-item");
  const detailTag = document.querySelector(".quest-detail-tag");
  const detailTitle = document.querySelector(".quest-detail-title");
  const detailDesc = document.querySelector(".quest-detail-desc");
  const detailChecklist = document.querySelector(".quest-checklist");

  if (!items.length || !detailTag || !detailTitle || !detailDesc || !detailChecklist) return;

  items.forEach(function (item) {
    item.addEventListener("click", function () {
      items.forEach(function (other) {
        other.classList.remove("is-active");
      });
      item.classList.add("is-active");

      detailTag.textContent = item.dataset.tag;
      detailTitle.textContent = item.dataset.title;
      detailDesc.textContent = item.dataset.desc;

      detailChecklist.innerHTML = "";
      item.dataset.checklist.split("|").forEach(function (step) {
        const li = document.createElement("li");
        li.textContent = step;
        detailChecklist.appendChild(li);
      });
    });
  });
});
