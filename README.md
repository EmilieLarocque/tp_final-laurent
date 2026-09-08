# Composantes Tailwind

Ce document liste les composantes construites avec des utilitaires Tailwind CSS sur le portfolio, leur emplacement dans le code, et le modèle de référence (Flowbite) dont elles s'inspirent pour la structure/le nommage du composant. Le code n'a pas été copié tel quel : chaque composante a été adaptée aux couleurs et à l'identité visuelle existantes du site (thème « bureau Windows ») via des valeurs Tailwind arbitraires (`bg-[var(--...)]`, `rounded-[var(--...)]`, etc.) qui référencent les variables CSS déjà définies dans [css/style.css](css/style.css).

## 1. Navbar

- **Emplacement** : [index.html:120](index.html#L120) — `<nav aria-label="Navigation du bureau">`, les icônes de dossiers du bureau (Accueil, À propos, Projets, Services, Contact, node_modules).
- **Modèle de référence** : [Flowbite — Navbar](https://flowbite.com/docs/components/navbar/)

## 2. Modal

- **Emplacement** : [index.html:37](index.html#L37) — `#bsod-screen` (`role="alertdialog"`), le faux écran bleu déclenché par l'easter egg `node_modules`.
- **Modèle de référence** : [Flowbite — Modal](https://flowbite.com/docs/components/modal/)

## 3. Card

- **Emplacement** : [pages/projet.html:100](pages/projet.html#L100) — les 4 `<article>` de la grille de projets (`explorer-grid`).
- **Modèle de référence** : [Flowbite — Card](https://flowbite.com/docs/components/card/)

## 4. Badge / tuile

- **Emplacement** : [pages/services.html:77](pages/services.html#L77) et [pages/services.html:192](pages/services.html#L192) — les 12 tuiles pilule des sections « Ce que je fais » et « Secteurs d'activité ».
- **Modèle de référence** : [Flowbite — Badge](https://flowbite.com/docs/components/badge/)

## 5. Breadcrumb

- **Emplacement** : fil d'Ariane (`<nav aria-label="Chemin">`) répété sur 4 pages :
  - [pages/a-propos.html:45](pages/a-propos.html#L45)
  - [pages/contact.html:46](pages/contact.html#L46)
  - [pages/projet.html:46](pages/projet.html#L46)
  - [pages/services.html:46](pages/services.html#L46)
- **Modèle de référence** : [Flowbite — Breadcrumb](https://flowbite.com/docs/components/breadcrumb/)
