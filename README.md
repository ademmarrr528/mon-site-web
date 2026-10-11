# Mon site web : portfolio

Portfolio de graphiste et direction artistique (BUT MMI), pensé pour décrocher un stage en agence de communication.

**Inspirations :**
- structure et animations : [ownitt.fr](https://ownitt.fr/) ;
- couleurs, menu et ambiance : le [lookbook Quechua SS25](https://quechua-lookbook.com/ss25/fr/) (papier crème avec grain, charbon, vert sauge, rouille, coins arrondis, annotations manuscrites, menu en pastille de verre dépoli) ;
- élément 3D après l'accueil : l'esprit de [landonorris.com](https://landonorris.com/) ;
- galerie « Et ce n'est qu'un aperçu » : [duda.works](https://www.duda.works/) ;
- univers : sport (foot, F1), musique (rap, R&B), jeux vidéo, affiche et pub.

**Identité :** le symbole est un *macaron* (le badge à bords festonnés des stickers « Nouveau ! » en pub). Il sert de logo avec « AM » découpé dedans, et il reprend les animations de l'accueil, du manifeste et du pied de page. Le nom complet « Adem Marine » n'apparaît qu'à l'accueil et dans le pied de page.

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
| Écran de chargement | Pile de photos qui s'empilent, compteur en %, puis bouton « Entrer » : la musique et l'animation du nom démarrent ensemble (ou « Entrer sans le son ») |
| Accueil | Comme ownitt.fr : le contour de chaque lettre d'« Adem Marine » se dessine l'une après l'autre, les lettres se remplissent, puis « Étudiant en communication » s'écrit et un trait se tire dessous ; macaron, disciplines qui défilent |
| Sphère | Au scroll, le macaron grossit jusqu'à remplir l'écran de vert, puis une sphère 3D d'affiches apparaît et tourne longuement (souris + scroll) |
| Parcours | Frise chronologique en défilement horizontal : chaque niveau se « débloque » quand il arrive à l'écran |
| Sélection | Le cadre arrondi grandit au scroll et fait défiler les affiches jusqu'à prendre tout l'écran, puis un macaron vert grossit et fait la transition vers le manifeste |
| Manifeste | Fond vert sauge, trois phrases qui s'allument mot par mot, grand macaron qui tourne ; à la fin la phrase remonte et le fond passe au noir |
| Définition | Comme ownitt.fr : écran noir avec « Cette définition a un auteur : moi », le fond passe au crème, les crochets arrivent des côtés, « ADEM » monte, la définition s'allume mot par mot, puis « Ils m'ont fait confiance » et les marques qui défilent |
| IMPACT | Le mot rempli d'une photo de bureau de graphiste, puis une question |
| Projets | Une diapositive par projet, chacune recouvre la précédente |
| Et ce n'est qu'un aperçu | Espace sombre rempli d'affiches qu'on explore en faisant glisser (souris ou doigt), clic pour agrandir |
| Méthode | Cinq terrains ; au survol, le mot défile et les détails apparaissent |
| Encore un doute ? | Photo qui s'assombrit, question |
| Contact | Formulaire, sticker « Dispo stage 2027 », téléphone, réseaux, liens |

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

Polices (Google Fonts, gratuites) : **Big Shoulders Display Black** pour le nom de l'accueil (converti en tracés SVG, avec le point du i rendu carré), **Figtree** pour les textes, **Instrument Sans** condensée pour les grands mots (IMPACT, années de la frise) et **Covered By Your Grace** pour les annotations manuscrites.

**Musique d'ambiance** (`js/son.js`) : il n'y a pas de fichier audio, la musique est générée en direct par le navigateur (Web Audio API) : nappes douces, basse ronde et petites notes avec écho sur une boucle d'accords « chill » à 72 BPM. Elle démarre avec l'animation du nom quand on clique sur « Entrer » (les navigateurs interdisent le son sans un clic), et le bouton « Son » en haut à droite permet de la couper. Pour la remplacer par un vrai morceau libre de droits, il suffira d'ajouter un fichier `.mp3`.

Couleurs : crème `#f4f2ec`, charbon `#252422`, gris pierre `#dad6cd`, vert sauge `#546a55` et une seule couleur d'accent, la rouille `#c4512f`, utilisée par petites touches.

## Crédits des images provisoires

Les photos de `assets/img/` viennent de [Lorem Picsum](https://picsum.photos/), qui diffuse des images d'[Unsplash](https://unsplash.com/) (licence Unsplash : utilisation libre). Elles sont là en attendant tes propres visuels. Les affiches de `assets/projets/` sont des exemples créés pour remplir le site.

## Reste à faire

- [ ] Vérifier les dates et les textes de la frise (bac, BUT, stage)
- [ ] Ajouter les vrais logos des marques (Bureau Vallée, Diapart, Coccinelle, Coccimarket) en SVG ou PNG
- [ ] Réécrire les textes provisoires avec tes mots
- [ ] Remplacer les affiches d'exemple par tes vrais projets
- [ ] Remplacer les photos d'ambiance (idéalement par tes propres photos ou visuels)
- [ ] Ajouter ton e-mail, ton téléphone, tes liens et ton CV
- [ ] Personnaliser : ce qu'on garde, ce qu'on change, ce qu'on ajoute (Lando Norris, Aengel…)
- [ ] Mettre le site en ligne (GitHub Pages, gratuit)
