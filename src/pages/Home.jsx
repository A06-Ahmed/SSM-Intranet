import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  const announcementsRef = useRef(null)

  const announcements = [
    {
      id: 1,
      title: 'Maintenance Programmée du Système',
      description: "L'intranet sera en maintenance planifiée le 15 octobre de 02h00 à 04h00.",
      date: '2 Mar.',
      severity: 'high',
      severityLabel: 'Haute',
    },
    {
      id: 2,
      title: 'Nouveaux Avantages Santé Disponibles',
      description:
        "Les nouveaux plans d’assurance maladie sont disponibles. Consultez votre e-mail pour plus de détails.",
      date: '23 Jan.',
      severity: 'medium',
      severityLabel: 'Moyenne',
    },
    {
      id: 3,
      title: 'Réunion Générale la Semaine Prochaine',
      description:
        'Rejoignez-nous pour notre réunion trimestrielle le 14 mars à 10h00 dans le grand auditorium.',
      date: '4 Jan.',
      severity: 'medium',
      severityLabel: 'Moyenne',
    },
    {
      id: 4,
      title: 'Mise à Jour des Protocoles de Sécurité',
      description:
        "Veuillez consulter les nouvelles directives de sécurité informatique dans le guide de l’employé.",
      date: '22 Déc.',
      severity: 'high',
      severityLabel: 'Haute',
    },
    
  ]

  const featuredPosts = [
    {
      id: 1,
      title: 'Réalisation du Grand Stade Hassan II',
      description:
        "Nous avons eu l’honneur d’accompagner la réalisation de ce projet d’envergure nationale aux côtés de notre client, en fournissant un tonnage important d’acier façonné.",
      date: '25 février 2026',
      image: 'src/assets/Rectangle.jpg',
    },
    {
      id: 2,
      title: 'Projet Stratégique au Port de Safi',
      description:
        'Près de 3000 tonnes d’acier coupé, façonné et galvanisé ont été assemblées par nos équipes pour un nouveau quai, illustrant notre maîtrise technique et logistique.',
      date: '2 février 2026',
      image: 'src/assets/Rectangle3.jpg',
    },
    {
      id: 3,
      title: 'L’Excellence de nos Bureaux d’Études',
      description:
        'Partenaires de la performance, nos ingénieurs et techniciens conçoivent des solutions fiables et conformes aux normes les plus strictes pour garantir la durabilité des ouvrages.',
      date: '15 janvier 2026',
      image: 'src/assets/image 8.jpg',
    },
    {
      id: 3,
      title: 'L’Excellence de nos Bureaux d’Études',
      description:
        'Partenaires de la performance, nos ingénieurs et techniciens conçoivent des solutions fiables et conformes aux normes les plus strictes pour garantir la durabilité des ouvrages.',
      date: '15 janvier 2026',
      image: 'src/assets/image 8.jpg',
    },

    {
      id: 2,
      title: 'Projet Stratégique au Port de Safi',
      description:
        'Près de 3000 tonnes d’acier coupé, façonné et galvanisé ont été assemblées par nos équipes pour un nouveau quai, illustrant notre maîtrise technique et logistique.',
      date: '2 février 2026',
      image: 'src/assets/Rectangle3.jpg',
    },

    
    
    
  ]

  const [featuredIndex, setFeaturedIndex] = useState(0)
  const visibleCount = 3
  const maxIndex = Math.max(0, featuredPosts.length - visibleCount)

  const canSlidePrev = featuredIndex > 0
  const canSlideNext = featuredIndex < maxIndex

  const [holidays, setHolidays] = useState([])
  const [isHolidaysLoading, setIsHolidaysLoading] = useState(true)

  useEffect(() => {
    const el = announcementsRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('announcements-visible')
          el.classList.remove('announcements-hidden')
          observer.unobserve(el)
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function fetchHolidays() {
      try {
        setIsHolidaysLoading(true)

        const res = await fetch(
          'https://date.nager.at/api/v3/PublicHolidays/2026/MA',
          { signal: controller.signal }
        )

        if (!res.ok) {
          throw new Error('Erreur lors du chargement des jours fériés')
        }

        const data = await res.json()
        const all = Array.isArray(data) ? data : []

        const now = new Date()

        const upcoming = all
          .map((h) => {
            const dateObj = h.date ? new Date(h.date) : null
            const displayDate = dateObj
              ? dateObj.toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : h.date

            return {
              name: h.name,
              dateObj,
              displayDate,
            }
          })
          .filter((h) => h.name && h.dateObj && h.dateObj >= now)
          .sort((a, b) => a.dateObj - b.dateObj)
          .slice(0, 4)

        if (upcoming.length === 0) {
          // simple fallback sample data if API returns nothing useful
          setHolidays([
            { name: 'Fête du Travail', displayDate: '1 Mai 2026' },
            { name: 'Fête du Trône', displayDate: '30 Juillet 2026' },
            { name: 'Allégeance Oued Eddahab', displayDate: '14 Août 2026' },
            { name: 'Révolution du Roi et du Peuple', displayDate: '20 Août 2026' },
          ])
        } else {
          setHolidays(upcoming)
        }
      } catch (err) {
        if (err.name === 'AbortError') return
        console.error('Erreur lors du chargement des jours fériés', err)
        setHolidays([
          { name: 'Fête du Travail', displayDate: '1 Mai 2026' },
          { name: 'Fête du Trône', displayDate: '30 Juillet 2026' },
          { name: 'Allégeance Oued Eddahab', displayDate: '14 Août 2026' },
          { name: 'Révolution du Roi et du Peuple', displayDate: '20 Août 2026' },
        ])
      } finally {
        setIsHolidaysLoading(false)
      }
    }

    fetchHolidays()

    return () => controller.abort()
  }, [])

  return (
    <div className="home">
      <div className="home-wlcm">
        <div className="home-wlcm-img">
          <h1>Bienvenue sur notre intranet</h1>
          <p>Restez connecté, informé et engagé avec votre équipe</p>
        </div>
      </div>

      <section
        ref={announcementsRef}
        className="announcements-section announcements-hidden"
      >
        <h2 className="announcements-title-main">Annonce</h2>
        <div className="announcements-card">
          <ul className="announcements-list">
            {announcements.map((item) => (
              <li key={item.id} className="announcement-row">
                <div className="announcement-left">
                  <div
                    className={`announcement-icon announcement-icon-${item.severity}`}
                  >
                    <img
                      src="src/assets/notification.svg"
                      alt="Icône alerte"
                    />
                  </div>
                  <div className="announcement-text">
                    <div className="announcement-title">{item.title}</div>
                    <div className="announcement-description">
                      {item.description}
                    </div>
                    <div className="announcement-date">{item.date}</div>
                  </div>
                </div>
                <span
                  className={`announcement-badge announcement-badge-${item.severity}`}
                >
                  {item.severityLabel}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="featured-section">
        <h2 className="featured-title-main">À la une</h2>
        <div className="featured-grid-wrapper">
          {featuredPosts.length > 3 && (
            <button
              type="button"
              className="featured-arrow featured-arrow-left"
              onClick={() => canSlidePrev && setFeaturedIndex((prev) => Math.max(0, prev - 1))}
              disabled={!canSlidePrev}
              aria-label="Actualités précédentes"
            >
              ‹
            </button>
          )}

          <div className="featured-viewport">
            <div
              className="featured-grid featured-track"
              style={{ transform: `translateX(-${(featuredIndex * 100) / visibleCount}%)` }}
            >
              {featuredPosts.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  className="featured-card"
                  onClick={() => {
                    // Placeholder: redirect to news list for now
                    navigate('/news')
                  }}
                >
                  <div className="featured-image-wrapper">
                    <img src={post.image} alt={post.title} className="featured-image" />
                  </div>
                  <div className="featured-content">
                    <h3 className="featured-title">{post.title}</h3>
                    <p className="featured-description">{post.description}</p>
                    <div className="featured-meta">
                      <img
                        src="src/assets/clock.svg"
                        alt="Date de publication"
                        className="featured-meta-icon"
                      />
                      <span className="featured-date">{post.date}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {featuredPosts.length > 3 && (
            <button
              type="button"
              className="featured-arrow featured-arrow-right"
              onClick={() =>
                canSlideNext &&
                setFeaturedIndex((prev) => Math.min(maxIndex, prev + 1))
              }
              disabled={!canSlideNext}
              aria-label="Actualités suivantes"
            >
              ›
            </button>
          )}
        </div>
      </section>

      <section className="home-bottom-section">
        <div className="calendar-card">
          <div className="calendar-header">
            <div className="calendar-header-left">
              <span className="calendar-icon">📅</span>
              <span className="calendar-title">Jours Fériés à Venir</span>
            </div>
          </div>
          <div className="calendar-body">
            {isHolidaysLoading && (
              <div className="calendar-placeholder">Chargement des jours fériés...</div>
            )}
            {!isHolidaysLoading && (
              <ul className="calendar-list">
                {holidays.map((h, idx) => (
                  <li
                    key={`${h.name}-${idx}`}
                    className="calendar-row"
                  >
                    <span className="calendar-holiday-name">{h.name}</span>
                    <span className="calendar-holiday-date">{h.displayDate}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          type="button"
          className="home-gallery-card"
          onClick={() => navigate('/gallery')}
        >
          <div className="home-gallery-overlay" />
          <span className="home-gallery-title">Galerie</span>
        </button>
      </section>
    </div>
  )
}

export default Home

