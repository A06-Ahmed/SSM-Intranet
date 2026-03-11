const DEMO_NEWS = [
  {
    id: 'grand-stade-hassan-ii',
    shortTitle: 'Réalisation du Grand Stade Hassan II',
    title: 'PARTICIPATION STRATÉGIQUE : LE GRAND STADE HASSAN II',
    subtitle: '',
    image: 'src/assets/Rectangle.jpg',
    publishedAt: '2026-02-25',
    content: [
      "Smm Socodam Davum (SSD) est fière d'annoncer sa contribution majeure à l'un des projets d'infrastructure les plus ambitieux du Royaume : la construction du Grand Stade Hassan II à Benslimane. En collaboration étroite avec notre partenaire historique TGCC, nos équipes démontrent une nouvelle fois leur savoir-faire industriel unique.",
      "Pour ce chantier d'envergure internationale, destiné à devenir le plus grand stade au monde, SSD assure la fourniture et le façonnage d'un tonnage massif d'acier haute performance. Ce projet mobilise l'ensemble de notre chaîne logistique et nos unités de production de pointe pour garantir une précision millimétrée dans l'armature des structures porteuses.",
      "Au-delà de l'aspect technique, cette réalisation s'inscrit dans la vision de développement du Maroc pour la Coupe du Monde 2030. En fournissant des solutions d'acier coupé, façonné et assemblé répondant aux normes de sécurité et de durabilité les plus strictes, SSD confirme son rang de leader national dans le parachèvement des produits sidérurgiques. Nous sommes honorés de bâtir, ensemble, les monuments de demain.",
      
    ],
  },
  {
    id: 'cloud-hybride',
    shortTitle: 'Migration vers le Cloud Hybride',
    title: 'Migration vers le Cloud Hybride',
    subtitle: 'Modernisation de notre infrastructure IT.',
    image: '',
    publishedAt: '2026-03-02',
    content: [
      "Nous lançons une migration progressive vers une architecture cloud hybride afin d'améliorer la résilience, la sécurité et la performance des applications internes.",
      "La transition se fera par lots (services RH, reporting, intranet), avec une phase de cohabitation et des contrôles renforcés.",
    ],
  },
  {
    id: 'sites-industriels',
    shortTitle: 'Sécurisation des Sites Industriels',
    title: 'Sécurisation des Sites Industriels',
    subtitle: 'Renforcement des mesures et des audits.',
    image: '',
    publishedAt: '2026-02-24',
    content: [
      "Un programme de sécurisation des sites industriels démarre avec des audits, des mises à niveau des accès et une sensibilisation renforcée.",
      "Objectif : réduire les risques opérationnels et améliorer la conformité aux standards de sûreté.",
    ],
  },
  {
    id: 'erp-deploiement',
    shortTitle: 'Déploiement du Nouvel ERP',
    title: 'Déploiement du Nouvel ERP',
    subtitle: 'Unification des processus métiers.',
    image: '',
    publishedAt: '2026-02-15',
    content: [
      "Le nouvel ERP est déployé progressivement pour harmoniser les processus et améliorer la traçabilité des opérations.",
      "Des sessions de formation seront planifiées par département.",
    ],
  },
  {
    id: 'maintenance-ia',
    shortTitle: 'IA et Maintenance Préventive',
    title: 'IA et Maintenance Préventive',
    subtitle: 'Des alertes plus précoces, moins d’arrêts.',
    image: '',
    publishedAt: '2026-02-05',
    content: [
      "Nous expérimentons des modèles IA pour détecter les signaux faibles sur les équipements critiques.",
      "Les premiers résultats montrent une meilleure anticipation des interventions et une réduction des indisponibilités.",
    ],
  },
  {
    id: 'relation-client',
    shortTitle: 'Digitalisation de la Relation Client',
    title: 'Digitalisation de la Relation Client',
    subtitle: 'Nouveaux canaux et suivi unifié.',
    image: '',
    publishedAt: '2026-01-28',
    content: [
      "Un portail client enrichi est en préparation pour centraliser les demandes, documents et historiques d’échanges.",
      "Le but : plus de transparence et des délais de réponse mieux maîtrisés.",
    ],
  },
  {
    id: 'formation-cyber',
    shortTitle: 'Formation Cybersécurité pour tous',
    title: 'Formation Cybersécurité pour tous',
    subtitle: 'Un module court, obligatoire, et utile.',
    image: '',
    publishedAt: '2026-01-18',
    content: [
      "Une formation cybersécurité (phishing, mots de passe, bonnes pratiques) sera mise à disposition pour l’ensemble des collaborateurs.",
      "Chaque module dure moins de 20 minutes et se termine par un quiz.",
    ],
  },
  {
    id: 'reseau-inter-sites',
    shortTitle: 'Optimisation du Réseau Inter-Sites',
    title: 'Optimisation du Réseau Inter-Sites',
    subtitle: 'Amélioration du débit et de la stabilité.',
    image: '',
    publishedAt: '2026-01-10',
    content: [
      "Des optimisations réseau seront réalisées pour améliorer la qualité de service entre les sites.",
      "Des fenêtres de maintenance seront communiquées en amont.",
    ],
  },
  {
    id: 'application-mobile-interne',
    shortTitle: "Lancement de l'Application Mobile Interne",
    title: "Lancement de l'Application Mobile Interne",
    subtitle: 'Accès simplifié aux services intranet.',
    image: '',
    publishedAt: '2026-01-02',
    content: [
      "Une première version de l’application mobile interne sera disponible prochainement pour consulter les actualités et services clés.",
      "Plus d’informations seront partagées lors de la phase pilote.",
    ],
  },
  {
    id: 'port-safi',
    shortTitle: 'Projet Stratégique au Port de Safi',
    title: 'Projet Stratégique au Port de Safi',
    subtitle: 'Avancement et coordination des équipes.',
    image: 'src/assets/Rectangle3.jpg',
    publishedAt: '2026-02-02',
    content: [
      "Un projet stratégique est en cours au Port de Safi, mobilisant plusieurs équipes pour répondre aux exigences du calendrier.",
      "Les prochaines étapes incluent la consolidation logistique et l’alignement des jalons de production.",
    ],
  },
  {
    id: 'bureaux-etudes',
    shortTitle: "L'Excellence de nos Bureaux d'Études",
    title: "L'Excellence de nos Bureaux d'Études",
    subtitle: 'Méthodes, qualité, et innovation.',
    image: 'src/assets/Mask group.jpg',
    publishedAt: '2026-01-15',
    content: [
      "Nos bureaux d’études poursuivent l’amélioration continue des méthodes de conception et de contrôle qualité.",
      "Cette dynamique renforce la fiabilité des livrables et la performance sur chantier.",
    ],
  },
]

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getNewsDemo() {
  await delay(150)
  return [...DEMO_NEWS].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
}

export async function createNews(_payload) {
  void _payload
  throw new Error('Backend not connected')
}

export async function updateNews(_id, _payload) {
  void _id
  void _payload
  throw new Error('Backend not connected')
}

export async function deleteNews(_id) {
  void _id
  throw new Error('Backend not connected')
}

