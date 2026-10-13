# Mon site web : portfolio

Portfolio de graphiste et direction artistique (BUT MMI), pensé pour décrocher un stage en agence de communication.

**Inspirations :**
- structure et animations : [ownitt.fr](https://ownitt.fr/) ;
- couleurs, menu et ambiance : le [lookbook Quechua SS25](https://quechua-lookbook.com/ss25/fr/) (papier crème avec grain, charbon, vert sauge, rouille, coins arrondis, annotations manuscrites, menu en pastille de verre dépoli) ;
- élément 3D après l'accueil, section « Quoi de neuf sur mes réseaux » et pied de page : [landonorris.com](https://landonorris.com/) ;
- galerie « Et ce n'est qu'un aperçu » : [duda.works](https://www.duda.works/) ;
- univers : sport (foot, F1), musique (rap, R&B), jeux vidéo, affiche et pub.

**Identité :** le symbole est un *macaron* (le badge à bords festonnés des stickers « Nouveau ! » en pub). Il sert de logo avec « AM » découpé dedans, et il reprend les animations de l'accueil, de la frise et de la définition. Le nom complet « Adem Marine » n'apparaît qu'à l'accueil et dans le pied de page.

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
js/son.js           → la musique d'ambiance (générée en direct)
assets/projets/     → les visuels des projets (affiches provisoires)
assets/img/         → les photos d'ambiance (provisoires)
archives/           → mon premier exercice de grille CSS
```

## Les sections de la page (dans l'ordre)

| Section | Ce qui se passe |
| --- | --- |
| Écran de chargement | Pile de photos qui s'empilent, compteur en %, annotations manuscrites |
| Accueil | Comme ownitt.fr, sur fond noir : le contour de chaque lettre d'« Adem Marine » se dessine en blanc l'une après l'autre, les lettres se remplissent, « Étudiant en communication » s'écrit et un trait se tire dessous ; puis un flash et les couleurs s'inversent (fond crème, texte noir) ; macaron, disciplines qui défilent |
| Sphère | Au scroll, le macaron grossit jusqu'à remplir l'écran de vert, puis une sphère 3D d'affiches apparaît et tourne (scroll + souris) ; on peut aussi l'attraper et la faire tourner en glissant |
| Parcours | Frise chronologique en défilement horizontal : chaque niveau se « débloque » quand il arrive à l'écran |
| Sélection | Le cadre arrondi grandit au scroll et fait défiler les affiches jusqu'à prendre tout l'écran |
| Réseaux | Comme « What's up on socials » de landonorris.com : petite icône qui change (manette, ballon, casque, crayon), titre en gras + serif, éventail de cartes qui s'ouvre en remontant au scroll ; au survol la carte grossit et les voisines s'écartent, clic pour agrandir |
| Définition | Comme ownitt.fr : grands crochets qui arrivent des côtés, « ADEM » géant et étoile qui tourne, définition en serif qui s'allume mot par mot, « Vu dans » avec des logos qui défilent (provisoires) |
| IMPACT | Le mot rempli d'une photo de bureau de graphiste, puis une question |
| Projets | Une diapositive par projet, chacune recouvre la précédente |
| Et ce n'est qu'un aperçu | Espace sombre rempli d'affiches qu'on explore en faisant glisser (souris ou doigt), clic pour agrandir |
| Méthode | Cinq terrains ; au survol, le mot défile et les détails apparaissent |
| Encore un doute ? | Photo qui s'assombrit, question |
| Pied de page | Comme celui de landonorris.com : le fond passe du crème au vert sauge, grande plaque sombre avec languette et courbes de niveau, signature manuscrite, titre « Toujours dans le jeu. », photo détourée au centre (provisoire), liens à gauche et réseaux à droite, bandeau qui défile derrière la photo, bouton « Proposer un stage » |

Le menu (en haut à droite) affiche le nom de la section en cours et se déplie au survol, comme sur le lookbook Quechua.

## Ajouter ou modifier un projet

1. Mets ton visuel dans `assets/projets/` (format portrait 2:3 idéal, en `.webp` ou `.jpg`).
2. Ouvre `js/projets.js`, copie un bloc `{ ... }` et change les infos.
3. Enregistre : les diapositives, la sélection, la sphère et la galerie se mettent à jour toutes seules.

Les diapositives alternent crème et gris pierre ; la `couleur` du projet sert de fond au cadre du visuel.

## Les outils utilisés (à savoir expliquer en entretien)

| Outil | À quoi il sert |
| --- | --- |
| [GSAP](https://gsap.com/) | La bibliothèque d'animation |
| ScrollTrigger (plugin GSAP) | Épingle les sections et pilote les animations avec le scroll |
| SplitText (plugin GSAP) | Découpe les textes en lettres, mots ou lignes pour les animer |
| [Lenis](https://lenis.darkroom.engineering/) | Défilement fluide |

Polices (Google Fonts, gratuites) : **Big Shoulders Display Black** pour le nom de l'accueil (converti en tracés SVG, avec le point du i rendu carré) et « ADEM » de la définition, **Instrument Serif** pour le texte de la définition, **Figtree** pour les textes, **Instrument Sans** condensée pour les grands mots (IMPACT, années de la frise) et **Covered By Your Grace** pour les annotations manuscrites.

**Musique d'ambiance** (`js/son.js`) : il n'y a pas de fichier audio, la musique est générée en direct par le navigateur (Web Audio API) : nappes douces, basse ronde et petites notes avec écho sur une boucle d'accords « chill » à 72 BPM. Elle est coupée par défaut et démarre avec le bouton « Son » en haut à droite (les navigateurs interdisent le son automatique). Pour la remplacer par un vrai morceau libre de droits, il suffira d'ajouter un fichier `.mp3`.

Couleurs : crème `#f4f2ec`, charbon `#252422`, gris pierre `#dad6cd`, vert sauge `#546a55` et une seule couleur d'accent, la rouille `#c4512f`, utilisée par petites touches. Le pied de page ajoute un vert sauge clair `#b3bd9c` et une plaque vert très sombre `#262922`.

## Crédits des images provisoires

Les photos de `assets/img/` viennent de [Lorem Picsum](https://picsum.photos/), qui diffuse des images d'[Unsplash](https://unsplash.com/) (licence Unsplash : utilisation libre). Elles sont là en attendant tes propres visuels. Les affiches de `assets/projets/` sont des exemples créés pour remplir le site.

## Reste à faire

- [ ] Vérifier les dates et les textes de la frise (bac, BUT, stage)
- [ ] Remplacer les logos provisoires de « Vu dans » (L'Équipe, LCI, BBC…) par les vraies marques : à faire avant la mise en ligne
- [ ] Réécrire les textes provisoires avec tes mots
- [ ] Remplacer les affiches d'exemple par tes vrais projets
- [ ] Remplacer les photos d'ambiance (idéalement par tes propres photos ou visuels)
- [ ] Ajouter ton e-mail, ton téléphone, tes liens et ton CV (liens des réseaux dans la section Réseaux et dans le pied de page)
- [ ] Mettre ta photo détourée dans le pied de page : un PNG sans fond, à mettre dans `assets/img/` à la place de `portrait-provisoire.svg` (et changer le nom dans `index.html`)
- [ ] Personnaliser : ce qu'on garde, ce qu'on change, ce qu'on ajoute (Lando Norris, Aengel…)
- [x] Mettre le site en ligne (GitHub Pages, gratuit) : https://ademmarrr528.github.io/mon-site-web/
