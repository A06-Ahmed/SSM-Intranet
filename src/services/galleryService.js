const DEMO_GALLERY = [
  {
    id: 'escale-tanger',
    title: 'Escale à Tanger : Cohésion et Stratégie',
    date: '25 février 2026',
    coverImage: 'src/assets/bernd-dittrich-pYlBAu3de0w-unsplash.jpg',
    images: [
      'src/assets/bernd-dittrich-pYlBAu3de0w-unsplash.jpg',
      'src/assets/Annuaire asset/Frame 291.png',
      'src/assets/Annuaire asset/Frame 292.png',
      'src/assets/Annuaire asset/Frame 293.png',
    ],
  },
  {
    id: 'solidarite-smm',
    title: 'Solidarité SMM : Notre Action Don de Sang',
    date: '2 février 2026',
    coverImage: 'src/assets/Annuaire asset/Untitled-1.jpg',
    images: [
      'src/assets/Annuaire asset/Untitled-1.jpg',
      'src/assets/Annuaire asset/Group 38.png',
      'src/assets/Annuaire asset/Frame 294.png',
    ],
  },
  {
    id: 'innovation-cloud',
    title: 'Innovation & Cloud : Notre Transformation Digitale',
    date: '24 février 2026',
    coverImage: 'src/assets/mit-skills-integration-erp-odoo-entreprises.webp',
    images: [
      'src/assets/mit-skills-integration-erp-odoo-entreprises.webp',
      'src/assets/Annuaire asset/Frame 291.png',
      'src/assets/Annuaire asset/Frame 292.png',
    ],
  },
  {
    id: 'team-building',
    title: 'Team Building : Renforcer notre Cohésion Collective',
    date: '15 janvier 2026',
    coverImage: 'src/assets/Annuaire asset/Frame 293.png',
    images: [
      'src/assets/Annuaire asset/Frame 293.png',
      'src/assets/Annuaire asset/Frame 294.png',
      'src/assets/Annuaire asset/Group 38.png',
    ],
  },
  {
    id: '30-ans-engagement',
    title: "30 Ans d'Engagement : Hommage à nos Collaborateurs",
    date: '2 mars 2026',
    coverImage: 'src/assets/Annuaire asset/Frame 294.png',
    images: [
      'src/assets/Annuaire asset/Frame 294.png',
      'src/assets/Annuaire asset/Frame 291.png',
      'src/assets/Annuaire asset/Frame 292.png',
    ],
  },
]

const MONTHS_FR = {
  janvier: 0,
  février: 1,
  fevrier: 1,
  mars: 2,
  avril: 3,
  mai: 4,
  juin: 5,
  juillet: 6,
  août: 7,
  aout: 7,
  septembre: 8,
  octobre: 9,
  novembre: 10,
  décembre: 11,
  decembre: 11,
}

function parseFrenchDate(dateStr) {
  if (!dateStr) return null
  const parts = dateStr
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')

  if (parts.length < 3) return null
  const day = parseInt(parts[0], 10)
  const monthName = parts[1]
  const year = parseInt(parts[2], 10)
  const monthIndex = MONTHS_FR[monthName]

  if (Number.isNaN(day) || Number.isNaN(year) || monthIndex == null) return null
  return new Date(year, monthIndex, day)
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getGalleryDemo() {
  await delay(120)
  return [...DEMO_GALLERY]
    .map((g) => ({ ...g, dateObj: parseFrenchDate(g.date) }))
    .sort((a, b) => {
      if (a.dateObj && b.dateObj) return b.dateObj - a.dateObj
      if (a.dateObj && !b.dateObj) return -1
      if (!a.dateObj && b.dateObj) return 1
      return 0
    })
}

// Backend-ready API placeholders (to be wired to an admin page later)
export async function createGallery(_payload) {
  void _payload
  throw new Error('Backend not connected')
}

export async function updateGallery(_id, _payload) {
  void _id
  void _payload
  throw new Error('Backend not connected')
}

export async function deleteGallery(_id) {
  void _id
  throw new Error('Backend not connected')
}

