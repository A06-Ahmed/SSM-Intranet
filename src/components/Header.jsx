import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { searchEmployees } from '../services/searchEmployees'
import SearchResults from './SearchResults.jsx'
import { getNewsDemo } from '../services/newsService'
import { getGalleryDemo } from '../services/galleryService'
import { getNotifications } from '../services/notificationService'

function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [searchValue, setSearchValue] = useState('')
  const [employeeResults, setEmployeeResults] = useState([])
  const [newsResults, setNewsResults] = useState([])
  const [galleryResults, setGalleryResults] = useState([])
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(true)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const roles = Array.isArray(user?.roles) ? user.roles.map((r) => r.name) : []
  const isAdmin = roles.includes('Admin') || roles.includes('SuperAdmin') || roles.includes('HR') || roles.includes('Manager')
  const adminUrl = import.meta.env.VITE_LARAVEL_ADMIN_URL || 'http://localhost:8000/admin'

  const displayName = user ? `${user.first_name} ${user.last_name}` : 'Utilisateur invité'
  const displayPosition = isAdmin ? 'Administrateur' : 'Collaborateur'
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const apps = [
    { id: 'ajirh', label: 'Ajirh', path: '/demo/ajirh' },
    { id: 'kelio', label: 'Kelio', path: '/demo/kelio' },
    { id: 'reporting', label: 'Reporting', path: '/demo/reporting' },
    { id: 'suivi', label: 'Suivi Armature', path: '/demo/suivi-armature' },
    ...(isAdmin ? [{ id: 'admin-dashboard', label: 'Admin', path: adminUrl, external: true }] : []),
  ]

    const [notifications, setNotifications] = useState([])
  const notificationCount = notifications.length

  const searchWrapperRef = useRef(null)
  const searchTimeoutRef = useRef(null)

  const [newsItems, setNewsItems] = useState([])
  const [galleryItems, setGalleryItems] = useState([])

    useEffect(() => {
    let isMounted = true

    async function loadNotifications() {
      try {
        const data = await getNotifications()
        if (!isMounted) return
        const mapped = (Array.isArray(data) ? data : []).map((n) => ({
          id: n.id,
          title: n.title,
          description: n.body || '',
          time: n.created_at,
        }))
        setNotifications(mapped)
      } catch {
        if (!isMounted) return
        setNotifications([])
      }
    }

    loadNotifications()
    const interval = setInterval(loadNotifications, 60000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])
  useEffect(() => {
    let isMounted = true

    async function loadContent() {
      try {
        const [news, gallery] = await Promise.all([getNewsDemo(), getGalleryDemo()])
        if (!isMounted) return
        setNewsItems(Array.isArray(news) ? news : [])
        setGalleryItems(Array.isArray(gallery) ? gallery : [])
      } catch {
        if (!isMounted) return
        setNewsItems([])
        setGalleryItems([])
      }
    }

    loadContent()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    const query = searchValue.trim()
    if (!query) {
      setEmployeeResults([])
      setNewsResults([])
      setGalleryResults([])
      setIsSearchLoading(false)
      return
    }

    setIsSearchLoading(true)
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const empRes = await searchEmployees(query)
        const q = query.toLowerCase()

        const newsRes = newsItems.filter((n) => {
          const hay = `${n.shortTitle || ''} ${n.title || ''} ${n.subtitle || ''}`.toLowerCase()
          return hay.includes(q)
        })

        const galRes = galleryItems.filter((g) =>
          (g.title || '').toLowerCase().includes(q),
        )

        setEmployeeResults(empRes)
        setNewsResults(newsRes)
        setGalleryResults(galRes)
        setShowSearchResults(true)
      } finally {
        setIsSearchLoading(false)
      }
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchValue])

  useEffect(() => {
    function handleClickOutside(event) {
      if (!searchWrapperRef.current) return
      if (!searchWrapperRef.current.contains(event.target)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  function handleSelectEmployee(emp) {
    setShowSearchResults(false)
    setSearchValue('')
    navigate(`/annuaire/${emp.id}`)
  }

  function handleSelectNews(item) {
    setShowSearchResults(false)
    setSearchValue('')
    navigate(`/news?id=${encodeURIComponent(item.id)}`)
  }

  function handleSelectGallery(item) {
    setShowSearchResults(false)
    setSearchValue('')
    navigate(`/gallery?id=${encodeURIComponent(item.id)}`)
  }

  return (
    <header className="top-header">
      <div className="header-bar">
        <div className="header-left">
          <div className="header-logo">
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="header-logo-button"
              aria-label="Aller à l'accueil"
            >
              <img src="src/assets/logo intranet white.svg" alt="SMM Socodam Davum Intranet" />
            </button>
          </div>
        </div>

        <div className="header-center">
          <div className="search-box" ref={searchWrapperRef}>
            <div className="search-content">
              <img src="src/assets/loop.svg" alt="Rechercher" className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Rechercher des personnes, des documents, des sites et plus..."
                value={searchValue}
                onChange={(e) => {
                  const value = e.target.value
                  setSearchValue(value)
                  if (value.trim()) {
                    setShowSearchResults(true)
                  } else {
                    setShowSearchResults(false)
                  }
                }}
              />
            </div>
            {showSearchResults && (
              <SearchResults
                employees={employeeResults}
                news={newsResults}
                gallery={galleryResults}
                isLoading={isSearchLoading}
                query={searchValue}
                onSelectEmployee={handleSelectEmployee}
                onSelectNews={handleSelectNews}
                onSelectGallery={handleSelectGallery}
              />
            )}
          </div>
        </div>

        <div className="header-right">
          <div
            className="header-icon-wrapper notification-wrapper"
            onClick={() => {
              setShowNotifications((prev) => !prev)
              setShowProfileMenu(false)
            }}
          >
            <img src="src/assets/notification.svg" alt="Notifications" className="header-icon" />
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </div>

          <button
            type="button"
            className="header-profile"
            onClick={() => {
              setShowProfileMenu((prev) => !prev)
              setShowNotifications(false)
            }}
          >
            <div className="profile-info">
              <span className="profile-name">{displayName}</span>
              <span className="profile-role">{displayPosition}</span>
            </div>
            <div className="profile-avatar">
              <span className="profile-avatar-initials">{initials}</span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="profile-menu">
              <button
                type="button"
                className="profile-menu-item"
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
              >
                Se déconnecter
              </button>
            </div>
          )}

          <button
            type="button"
            className="hamburger-button"
            onClick={() => setIsNavOpen((prev) => !prev)}
            aria-label="Basculer la navigation"
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </div>

      <nav className={`apps-bar ${isNavOpen ? 'apps-bar-visible' : 'apps-bar-hidden'}`}>
        {apps.map((app) => (
          <button
            key={app.id}
            type="button"
            className="app-pill"
            onClick={() => {
              if (app.external) {
                window.location.href = app.path
                return
              }
              navigate(app.path)
            }}
          >
            {app.label}
          </button>
        ))}
      </nav>

      {showNotifications && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <span className="notifications-title">Notifications</span>
            <button
              type="button"
              className="notifications-close"
              onClick={() => setShowNotifications(false)}
            >
              
            </button>
          </div>
          <ul className="notifications-list">
            {notifications.map((item) => (
              <li key={item.id} className="notification-item">
                <div className="notification-title">{item.title}</div>
                <div className="notification-description">{item.description}</div>
                <div className="notification-time">{item.time}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}

export default Header







