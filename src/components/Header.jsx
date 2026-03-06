import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(true)

  const apps = [
    { id: 'ajirh', label: 'Ajirh', path: '/demo/ajirh' },
    { id: 'kelio', label: 'Kelio', path: '/demo/kelio' },
    { id: 'reporting', label: 'Reporting', path: '/demo/reporting' },
    { id: 'suivi', label: 'Suivi Armature', path: '/demo/suivi-armature' },
  ]

  const notificationCount = 3

  const notifications = [
    {
      id: 1,
      title: 'Congés collectifs d’été',
      description: 'Les bureaux seront fermés du 12 au 18 août pour congés.',
      time: 'Il y a 2 jours',
    },
    {
      id: 2,
      title: 'Maintenance planifiée',
      description: 'Interruption de l’intranet samedi de 22h à minuit.',
      time: 'Il y a 5 jours',
    },
    {
      id: 3,
      title: 'Nouvelle politique IT',
      description: 'Merci de lire la nouvelle charte d’utilisation des outils.',
      time: 'Il y a 1 semaine',
    },
  ]

  return (
    <header className="top-header">
      <div className="header-bar">
        <div className="header-left">
          <div className="header-logo">
            <img src="src/assets/logo intranet white.svg" alt="SMM Socodam Davum Intranet" />
          </div>
        </div>

        <div className="header-center">
          <div className="search-box">
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
                }}
              />
            </div>
          </div>
        </div>

        <div className="header-right">
          <div
            className="header-icon-wrapper notification-wrapper"
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            <img src="src/assets/notification.svg" alt="Notifications" className="header-icon" />
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </div>

          <button
            type="button"
            className="header-profile"
            onClick={() => {}}
          >
            <div className="profile-info">
              <span className="profile-name">Atoubi Ahmed</span>
              <span className="profile-role">Stagiaire</span>
            </div>
            <div className="profile-avatar">
              <span className="profile-avatar-initials">AA</span>
            </div>
          </button>

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
            onClick={() => navigate(app.path)}
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
              ×
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

