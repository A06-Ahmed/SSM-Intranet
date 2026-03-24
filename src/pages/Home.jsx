import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AnnuaireSearch from '../components/AnnuaireSearch'
import { getAnnouncements } from '../services/announcementsService.js'
import { getNewsDemo } from '../services/newsService'
import { formatAbsoluteDateTime, formatTimeAgo } from '../utils/dateFormat'

function Home() {
  const navigate = useNavigate()
  const announcementsRef = useRef(null)

  const [announcements, setAnnouncements] = useState([])
  const [isAnnouncementsLoading, setIsAnnouncementsLoading] = useState(true)
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false)

  const [featuredPosts, setFeaturedPosts] = useState([])
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true)

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
    let isMounted = true

    async function fetchAnnouncements() {
      try {
        setIsAnnouncementsLoading(true)
        const items = await getAnnouncements()
        if (!isMounted) return
        setAnnouncements(items)
      } catch (err) {
        if (!isMounted) return
        console.error('Erreur lors du chargement des annonces', err)
        setAnnouncements([])
      } finally {
        if (!isMounted) return
        setIsAnnouncementsLoading(false)
      }
    }

    fetchAnnouncements()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function fetchFeaturedNews() {
      try {
        setIsFeaturedLoading(true)
        const items = await getNewsDemo()
        if (!isMounted) return
        const mapped = (items || []).slice(0, 6).map((item) => ({
          id: item.id,
          newsId: item.id,
          title: item.title,
          description: Array.isArray(item.content) ? item.content[0] || '' : '',
          date: item.publishedAt || item.created_at || item.createdAt,
          image: item.image || '',
        }))
        setFeaturedPosts(mapped)
      } catch (err) {
        if (!isMounted) return
        console.error('Erreur lors du chargement des actualités', err)
        setFeaturedPosts([])
      } finally {
        if (!isMounted) return
        setIsFeaturedLoading(false)
      }
    }

    fetchFeaturedNews()

    return () => {
      isMounted = false
    }
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
              name: translateHolidayToFrench(h.name),
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

  function translateHolidayToFrench(name) {
    const map = {
      "New Year's Day": "Jour de l’An",
      "Proclamation of Independence": "Manifeste de l’Indépendance",
      "Amazigh New Year": "Nouvel An Amazigh (Yennayer)",
      "Labour Day": "Fête du Travail",
      "Enthronement": "Fête du Trône",
      "Zikra Oued Ed-Dahab": "Anniversaire de la Récupération d’Oued Eddahab",
      "Revolution of the King and the People": "Révolution du Roi et du Peuple",
      "Youth Day": "Fête de la Jeunesse",
      "Green March": "Marche Verte",
      "Independence Day": "Fête de l’Indépendance",
  
      // sometimes API returns these variants
      "Eid Ash-Shughl": "Fête du Travail",
      "Eid Al-Ârch": "Fête du Trône",
      "Thawrat al malik wa shâab": "Révolution du Roi et du Peuple",
      "Eid Al Chabab": "Fête de la Jeunesse",
      "Eid Al Massira Al Khadra": "Marche Verte",
      "Eid Al Istiqulal": "Fête de l’Indépendance",
    }
  
    return map[name] || name
  }

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    const aTime = a?.date ? new Date(a.date).getTime() : 0
    const bTime = b?.date ? new Date(b.date).getTime() : 0
    return bTime - aTime
  })

  const visibleAnnouncements = showAllAnnouncements
    ? [...sortedAnnouncements].reverse()
    : sortedAnnouncements.slice(0, 3)

  const canShowMore = sortedAnnouncements.length > 3

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
        id="annonce"
        className="announcements-section announcements-hidden"
      >
        <h2 className="announcements-title-main">Annonce</h2>
        <div className="announcements-card">
          <ul className="announcements-list">
            {isAnnouncementsLoading && (
              <li className="announcement-row">
                <div className="announcement-skeleton">
                  <div className="skeleton skeleton-circle" />
                  <div className="announcement-skeleton-text">
                    <div className="skeleton skeleton-line" />
                    <div className="skeleton skeleton-line short" />
                    <div className="skeleton skeleton-line tiny" />
                  </div>
                  <div className="skeleton skeleton-badge" />
                </div>
              </li>
            )}
            {!isAnnouncementsLoading && visibleAnnouncements.map((item) => (
              <li key={item.id} className="announcement-row">
                <div className="announcement-left">
                  <div
                    className={`announcement-icon announcement-icon-${item.severity}`}
                  >
                    <img
                      src="src/assets/notification.svg"
                      alt="Ic??ne alerte"
                    />
                  </div>
                  <div className="announcement-text">
                    <div className="announcement-title">{item.title}</div>
                    <div className="announcement-description">
                      {item.description}
                    </div>
                    <div className="announcement-date">{formatTimeAgo(item.date)}</div>
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
          {!isAnnouncementsLoading && canShowMore && (
            <div className="announcements-more">
              <button
                type="button"
                className="announcements-more-btn"
                onClick={() => setShowAllAnnouncements((prev) => !prev)}
              >
                {showAllAnnouncements ? 'Voir moins' : 'Voir plus'}
              </button>
            </div>
          )}
        </div>
      </section>
      <section className="home-annuaire-section">
        <AnnuaireSearch />
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
              {isFeaturedLoading && (
                <div className="featured-card featured-skeleton-card">
                  <div className="skeleton skeleton-image" />
                  <div className="featured-content">
                    <div className="skeleton skeleton-line" />
                    <div className="skeleton skeleton-line short" />
                    <div className="skeleton skeleton-line tiny" />
                  </div>
                </div>
              )}
              {!isFeaturedLoading && featuredPosts.length === 0 && (
                <div className="featured-card" style={{ padding: 24 }}>Aucune actualit� disponible.</div>
              )}
              {!isFeaturedLoading && featuredPosts.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  className="featured-card"
                  onClick={() => {
                    const id = post.newsId
                    navigate(id ? `/news?id=${encodeURIComponent(id)}` : '/news')
                  }}
                >
                  <div className="featured-image-wrapper">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="featured-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="featured-image" style={{ background: '#e2e8f0' }} />
                    )}
                  </div>
                  <div className="featured-content">
                    <h3 className="featured-title">{post.title}</h3>
                    <p className="featured-description news-card-description">{post.description}</p>
                    <div className="featured-meta">
                      <img
                        src="src/assets/clock.svg"
                        alt="Date de publication"
                        className="featured-meta-icon"
                      />
                      <span className="featured-date">{formatAbsoluteDateTime(post.date)}</span>
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
              <span className="calendar-icon"><img src="src/assets/calender.svg" alt="" /></span>
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













