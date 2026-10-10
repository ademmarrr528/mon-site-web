/* =========================================================
   TES PROJETS
   ---------------------------------------------------------
   C'est le seul fichier à modifier pour gérer tes projets.
   L'ordre ici = l'ordre sur le site (mets les meilleurs en premier).

   Pour ajouter un projet : copie un bloc { ... }, colle-le
   à la suite (sans oublier la virgule) et change les infos.

   - titre       : le nom du projet
   - type        : petite étiquette affichée à côté du titre
   - categorie   : "affiche", "print" ou "web" (sert aux filtres)
   - annee       : l'année de réalisation
   - image       : chemin vers ton visuel (format portrait 2:3 idéal,
                   par exemple 1280 × 1920 px en .webp ou .jpg)
   - couleur     : couleur qui remplit la ligne au survol
   - encre       : couleur du texte par-dessus cette couleur
   - description : 1 à 3 phrases (le contexte, l'idée, le résultat)

   ⚠️ Les 10 projets ci-dessous sont des EXEMPLES PROVISOIRES,
   à remplacer par tes vrais projets.
   ========================================================= */

window.PROJETS = [
  {
    titre: 'Dernier tour',
    type: 'Affiche · F1',
    categorie: 'affiche',
    annee: 2026,
    image: 'assets/projets/dernier-tour.webp',
    couleur: '#D7140F',
    encre: '#FFFFFF',
    description: "Affiche pour le dernier tour d'un Grand Prix. Le chiffre 58 prend toute la place pour faire sentir la tension des derniers kilomètres.",
  },
  {
    titre: 'Derby Night',
    type: 'Affiche · Football',
    categorie: 'affiche',
    annee: 2025,
    image: 'assets/projets/derby-night.webp',
    couleur: '#0E4D2C',
    encre: '#EFEBDD',
    description: "Affiche de match pour un derby en nocturne. Le terrain sert de grille de mise en page et le score devient le titre.",
  },
  {
    titre: 'Overtime',
    type: 'Affiche · Jeu vidéo',
    categorie: 'affiche',
    annee: 2025,
    image: 'assets/projets/overtime.webp',
    couleur: '#1F4BFF',
    encre: '#FFFFFF',
    description: "Affiche inspirée des prolongations de Rocket League : deux équipes, deux couleurs, une balle au centre et un chrono à +0:00.",
  },
  {
    titre: 'Boss Fight',
    type: 'Affiche · Jeu vidéo',
    categorie: 'affiche',
    annee: 2025,
    image: 'assets/projets/boss-fight.webp',
    couleur: '#C9A94E',
    encre: '#0B0B0C',
    description: "Affiche dans l'esprit des grands jeux d'aventure en solo. Peu d'éléments, une typo classique et beaucoup de noir pour l'ambiance.",
  },
  {
    titre: 'Nuit Blanche Tour',
    type: 'Affiche · Concert',
    categorie: 'affiche',
    annee: 2026,
    image: 'assets/projets/nuit-blanche.webp',
    couleur: '#6A2BF2',
    encre: '#FF5FC8',
    description: "Affiche de tournée pour un artiste rap. Le titre est découpé en trois blocs pour remplir le format et les dates se lisent d'un coup d'œil.",
  },
  {
    titre: 'Late Night R&B',
    type: 'Affiche · Musique',
    categorie: 'affiche',
    annee: 2026,
    image: 'assets/projets/late-night-rnb.webp',
    couleur: '#101A3D',
    encre: '#F2E6CF',
    description: "Affiche pour une soirée R&B. Une lune, une typo italique et une palette de nuit pour une ambiance douce.",
  },
  {
    titre: 'Kick-Off',
    type: 'Affiche · Football',
    categorie: 'affiche',
    annee: 2024,
    image: 'assets/projets/kick-off.webp',
    couleur: '#FFD400',
    encre: '#0B0B0C',
    description: "Affiche de coup d'envoi en jaune et noir. Le titre penché donne le mouvement du premier ballon joué.",
  },
  {
    titre: 'Campagne print',
    type: 'Print · Stage en agence',
    categorie: 'print',
    annee: 2026,
    image: 'assets/projets/campagne-print.webp',
    couleur: '#FF5A1F',
    encre: '#0B0B0C',
    description: "Déclinaisons print réalisées pendant le stage en agence : affiche grand format, flyer et kakémono.",
  },
  {
    titre: 'Bannières web',
    type: 'Bannières · Stage en agence',
    categorie: 'print',
    annee: 2026,
    image: 'assets/projets/bannieres-web.webp',
    couleur: '#2D6BFF',
    encre: '#FFFFFF',
    description: "Déclinaison d'une campagne dans les formats publicitaires web standards (300×250, 728×90, 160×600…).",
  },
  {
    titre: 'Concept de site',
    type: 'Concept web · Figma',
    categorie: 'web',
    annee: 2026,
    image: 'assets/projets/concept-site.webp',
    couleur: '#00B37E',
    encre: '#0B0B0C',
    description: "Maquette de refonte pour un complexe de foot à cinq : une page d'accueil directe, centrée sur la réservation d'un terrain.",
  },
];
