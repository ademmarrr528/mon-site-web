# Mon site web : portfolio

Portfolio de graphiste et direction artistique (BUT MMI), pensé pour décrocher un stage en agence de communication.

**Base de travail :** une reproduction de la structure et des animations de [ownitt.fr](https://ownitt.fr/), avec mes propres textes provisoires, mes visuels et mon nom. Les prochaines étapes consistent à la personnaliser (éléments de [Lando Norris](https://landonorris.com/), [Aengel](https://aengel.io/lite), [Duda Lima](https://www.duda.works/)…).

## Voir le site sur ton ordi

Le site n'a besoin d'aucune installation : c'est du HTML, du CSS et du JavaScript.

1. Ouvre le dossier dans **VS Code**.
2. Installe l'extension **Live Server**.
3. Clic droit sur `index.html`, puis **Open with Live Server**.

Il faut une connexion internet (polices et bibliothèques d'animation chargées en ligne).

## Comment c'est organisé

```
index.html          → la structure de la page et tous les textes
css/style.css       → la mise en forme (couleurs, typos, mise en page)
js/projets.js       → LA LISTE DE TES PROJETS (les 8 premiers sont affichés)
js/main.js          → les animations et les interactions
assets/projets/     → les visuels des projets (affiches provisoires)
assets/img/         → les photos d'ambiance (provisoires)
archives/           → mon premier exercice de grille CSS
```

## Les sections de la page (dans l'ordre)

| Section | Ce qui se passe |
| --- | --- |
| Écran de chargement | Grille de photos, nom dessiné au trait puis rempli, ouverture en rideau |
| Accueil | Nom, étoile, disciplines qui défilent ; au scroll l'étoile grossit jusqu'à remplir l'écran |
| Image + accroche | Grande photo, phrase d'accroche, mot qui change en bas |
| Paragraphe | Présentation, les lignes montent une à une |
| Showreel | Le cadre grandit au scroll, le fond passe du noir au crème |
| Manifeste | Trois phrases qui s'allument mot par mot, grande étoile qui tourne |
| Définition | « Adem* », parenthèses qui se referment, bandeau des outils |
| Nom géant | Le nom rempli d'une photo, puis une question |
| Projets | Une diapositive par projet, chacune recouvre la précédente |
| Aperçu | Noms qui défilent dans les deux sens |
| Et concrètement ? | Nom géant sur photo, question |
| Méthode | Cinq terrains ; au survol, le mot défile et les détails apparaissent |
| Encore un doute ? | Photo qui s'assombrit, question |
| Confiance, Journal, Témoignage | Liste qui défile, articles, appel à l'action |
| Pied de page | Contact, téléphone, réseaux, liens |

## Ajouter ou modifier un projet

1. Mets ton visuel dans `assets/projets/` (format portrait 2:3 idéal, en `.webp` ou `.jpg`).
2. Ouvre `js/projets.js`, copie un bloc `{ ... }` et change les infos.
3. Enregistre : les diapositives et l'index à droite se mettent à jour tout seuls.

La couleur de fond de chaque diapositive est calculée à partir de la `couleur` du projet (version très sombre).

## Les outils utilisés (à savoir expliquer en entretien)

| Outil | À quoi il sert |
| --- | --- |
| [GSAP](https://gsap.com/) | La bibliothèque d'animation |
| ScrollTrigger (plugin GSAP) | Épingle les sections et pilote les animations avec le scroll |
| SplitText (plugin GSAP) | Découpe les textes en lettres, mots ou lignes pour les animer |
| [Lenis](https://lenis.darkroom.engineering/) | Défilement fluide |

Polices (Google Fonts, gratuites) : **Barlow Condensed** pour les titres et **Fraunces** pour le texte. Elles remplacent les polices payantes d'Ownitt (Elza Condensed et IvyPresto).

## Crédits des images provisoires

Les photos de `assets/img/` viennent de [Lorem Picsum](https://picsum.photos/), qui diffuse des images d'[Unsplash](https://unsplash.com/) (licence Unsplash : utilisation libre). Elles sont là en attendant tes propres visuels. Les affiches de `assets/projets/` sont des exemples créés pour remplir le site.

## Reste à faire

- [ ] Mettre ton vrai nom (ou ton pseudo) à la place de « Adem »
- [ ] Réécrire les textes provisoires avec tes mots
- [ ] Remplacer les affiches d'exemple par tes vrais projets
- [ ] Remplacer les photos d'ambiance (idéalement par tes propres photos ou visuels)
- [ ] Ajouter ton e-mail, ton téléphone, tes liens et ton CV
- [ ] Personnaliser : ce qu'on garde, ce qu'on change, ce qu'on ajoute (Lando Norris, Aengel…)
- [ ] Mettre le site en ligne (GitHub Pages, gratuit)
