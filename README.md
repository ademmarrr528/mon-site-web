# Mon site web : portfolio

Portfolio de graphiste et direction artistique (BUT MMI), pensé pour décrocher un stage en agence de communication.

Inspirations : [Ownitt](https://ownitt.fr/) pour la typo et l'ambiance d'agence, [Lando Norris](https://landonorris.com/) pour le texte qui s'allume au scroll, [Aengel](https://aengel.io/lite) pour l'écran de chargement, [K95](https://k95.it/en) et [Duda Lima](https://www.duda.works/) pour les projets en 3D.

## Voir le site sur ton ordi

Le site n'a besoin d'aucune installation : c'est du HTML, du CSS et du JavaScript.

1. Ouvre le dossier dans **VS Code**.
2. Installe l'extension **Live Server**, si tu ne l'as pas déjà.
3. Fais un clic droit sur `index.html`, puis **Open with Live Server**.

Une connexion internet est nécessaire, car les polices et les bibliothèques d'animation sont chargées en ligne.

## Comment c'est organisé

```
index.html          → la structure de la page (les textes sont ici)
css/style.css       → toute la mise en forme (couleurs, typos, mise en page)
js/projets.js       → LA LISTE DE TES PROJETS (le fichier à modifier le plus souvent)
js/main.js          → les animations et les interactions
assets/projets/     → les visuels des projets
archives/           → mon premier exercice de grille CSS
```

## Ajouter ou modifier un projet

1. Mets ton visuel dans `assets/projets/`. Le format portrait 2:3 est idéal, par exemple 1280 × 1920 px, en `.webp` ou en `.jpg`.
2. Ouvre `js/projets.js`, copie un bloc `{ ... }` et change les infos : titre, catégorie, année, image, couleur au survol, description.
3. Enregistre. La liste, les filtres, l'anneau 3D et la visionneuse se mettent à jour tout seuls.

Les 10 projets actuels sont des **exemples provisoires**, à remplacer.

## Les outils utilisés (à savoir expliquer en entretien)

| Outil | À quoi il sert |
| --- | --- |
| [GSAP](https://gsap.com/) | La bibliothèque d'animation : apparitions, écran de chargement, menu… |
| ScrollTrigger (plugin GSAP) | Déclenche ou pilote les animations en fonction du scroll |
| SplitText (plugin GSAP) | Découpe un texte en lettres, mots ou lignes pour les animer un par un |
| [Lenis](https://lenis.darkroom.engineering/) | Rend le défilement fluide |
| CSS 3D (`perspective`, `preserve-3d`) | L'anneau d'affiches en 3D, sans bibliothèque 3D |

L'anneau 3D : chaque affiche est tournée de `360° ÷ nombre d'affiches` autour d'un axe vertical (`rotateY`), puis poussée vers l'extérieur (`translateZ`). Le JavaScript fait ensuite tourner tout l'anneau selon le temps, la souris et le scroll. Le nom est placé au centre et tourne en sens inverse pour toujours rester face à l'écran.

## Accessibilité

- Si la personne a activé « réduire les animations » dans son système, le site s'affiche sans animation.
- Sur mobile et tablette, l'aperçu au survol est remplacé par une vignette dans chaque ligne.
- Le site reste lisible même si les animations ne chargent pas.

## Reste à faire

- [ ] Mettre ton prénom et ton nom (ou ton pseudo) à la place de « Adem » partout
- [ ] Ajouter ton e-mail, tes liens LinkedIn, Instagram, Behance et ton CV
- [ ] Compléter le parcours (nom de l'IUT, dates du stage) et vérifier la liste des outils
- [ ] Remplacer les projets d'exemple par tes vrais projets
- [ ] Choisir la couleur d'accent, puis retirer le bloc « Essai de couleur »
- [ ] Créer une page détaillée (étude de cas) pour les 3 ou 4 meilleurs projets
- [ ] Mettre le site en ligne (GitHub Pages, gratuit)
