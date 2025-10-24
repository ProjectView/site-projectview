export const charadPool = [
  {
    id: 1,
    type: 'charade',
    content: "🧩 Charade du jour :\nMon premier est tactile 👆,\nMon deuxième attire les passants 👀,\nMon tout fait vivre ton expérience client.\nJe suis… ? 😄",
    difficulty: 'medium',
    category: 'experience'
  },
  {
    id: 2,
    type: 'anecdote',
    content: "💡 Saviez-vous ?\nUn écran interactif augmente l'engagement client de 340%... sans effort supplémentaire ! 🚀",
    difficulty: 'easy',
    category: 'stats'
  },
  {
    id: 3,
    type: 'charade',
    content: "🧩 Charade du jour :\nMon premier partage sans câble 📡,\nMon deuxième divertit le public 🎥,\nMon tout transforme les réunions.\nJe suis… ? 🤔",
    difficulty: 'medium',
    category: 'technology'
  },
  {
    id: 4,
    type: 'anecdote',
    content: "📊 Statistique du jour :\n98% des clients restent plus longtemps dans un espace avec affichage dynamique. Impressionnant, non ? 👀",
    difficulty: 'easy',
    category: 'stats'
  },
  {
    id: 5,
    type: 'charade',
    content: "🧩 Charade du jour :\nMon premier détecte les mouvements 👋,\nMon deuxième communique sans contact 📱,\nMon tout crée de la magie interactive.\nJe suis… ? ✨",
    difficulty: 'hard',
    category: 'innovation'
  },
  {
    id: 6,
    type: 'anecdote',
    content: "🎯 Bon à savoir :\nLes tables tactiles augmentent les ventes de 250%+ en showroom automobile. C'est du vrai ! 🚗💨",
    difficulty: 'easy',
    category: 'success_story'
  },
  {
    id: 7,
    type: 'charade',
    content: "🧩 Charade du jour :\nMon premier affiche en haute résolution 4K 🎬,\nMon deuxième illumine avec des couleurs éclatantes 🌈,\nMon tout crée un impact visuel irrésistible.\nJe suis… ? 💫",
    difficulty: 'medium',
    category: 'technology'
  },
  {
    id: 8,
    type: 'anecdote',
    content: "✨ Fait intéressant :\nLa réalité virtuelle en immobilier augmente les pré-ventes de 40%... pendant ce temps, les brochures papier prennent la poussière ! 📄👻",
    difficulty: 'easy',
    category: 'success_story'
  },
  {
    id: 9,
    type: 'charade',
    content: "🧩 Charade du jour :\nMon premier est une salle de conférence 🏢,\nMon deuxième connecte les gens partout 🌍,\nMon tout crée l'équité entre présentiels et distants.\nJe suis… ? 🎤",
    difficulty: 'hard',
    category: 'collaboration'
  },
  {
    id: 10,
    type: 'anecdote',
    content: "🔥 Le savais-tu ?\nLes réunions sans câbles (Miracast, AirPlay) réduisent le temps de configuration de 80%. Plus de prises perdues ! 🔌",
    difficulty: 'easy',
    category: 'productivity'
  },
  {
    id: 11,
    type: 'challenge',
    content: "🎯 Défi du jour :\nQuelle technologie transforme un espace de vente statique en expérience immersive inoubliable ? 🚀",
    difficulty: 'medium',
    category: 'challenge'
  },
  {
    id: 12,
    type: 'anecdote',
    content: "💰 Retour sur investissement :\nUn écran collaboratif se rembourse en moins de 2 ans grâce à l'augmentation de productivité. C'est de l'or ! 🏆",
    difficulty: 'easy',
    category: 'stats'
  }
];

/**
 * Récupère une charade/anecdote aléatoire du pool
 * @returns {Object} Un objet charade aléatoire
 */
export const getRandomCharad = () => {
  return charadPool[Math.floor(Math.random() * charadPool.length)];
};

/**
 * Récupère une charade/anecdote par ID
 * @param {number} id - L'ID de la charade
 * @returns {Object|undefined} L'objet charade ou undefined
 */
export const getCharadById = (id) => {
  return charadPool.find(c => c.id === id);
};

/**
 * Récupère plusieurs charads aléatoires sans doublons
 * @param {number} count - Nombre de charads à récupérer
 * @returns {Array} Tableau de charads
 */
export const getRandomCharads = (count = 3) => {
  const shuffled = [...charadPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, charadPool.length));
};

/**
 * Récupère les charads par catégorie
 * @param {string} category - La catégorie (experience, stats, innovation, etc.)
 * @returns {Array} Tableau de charads filtrés
 */
export const getCharadsByCategory = (category) => {
  return charadPool.filter(c => c.category === category);
};

/**
 * Récupère les charads par type
 * @param {string} type - Le type (charade, anecdote, challenge)
 * @returns {Array} Tableau de charads filtrés
 */
export const getCharadsByType = (type) => {
  return charadPool.filter(c => c.type === type);
};
