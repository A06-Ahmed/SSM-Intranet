import { Link } from 'react-router-dom'

function Footer() {
  const aPropos = [
    { label: "Infos d'entreprise", to: '/infos-entreprise' },
    { label: 'Histoire', to: '/histoire' },
    { label: 'Direction', to: '/direction' },
  ]

  const ressources = [
    { label: 'Portail RH', to: '/portail-rh' },
    { label: 'Support informatique', to: '/support-informatique' },
    { label: "Guide de l'employé", to: '/guide-employe' },
  ]

  const accesRapide = [
    { label: 'Annonce', to: '/home#annonce' },
    { label: 'À la une', to: '/news' },
    { label: 'Galerie', to: '/gallery' },
  ]

  const contact = [
    { label: 'Assistance', to: '/assistance' },
    { label: 'Commentaires', to: '/support-informatique' },
    { label: 'Suggestions', to: '/support-informatique' },
  ]

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-column">
          <div className="footer-column-title">À propos</div>
          {aPropos.map((item) => (
            <Link key={item.to} to={item.to} className="footer-link">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="footer-column">
          <div className="footer-column-title">Ressources</div>
          {ressources.map((item) => (
            <Link key={item.to} to={item.to} className="footer-link">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="footer-column">
          <div className="footer-column-title">Accès rapide</div>
          {accesRapide.map((item) => (
            <Link key={item.to} to={item.to} className="footer-link">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="footer-column">
          <div className="footer-column-title">Contact</div>
          {contact.map((item) => (
            <Link key={item.label} to={item.to} className="footer-link">
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} SMM SOCODAM DAVUM</span>
      </div>
    </footer>
  )
}

export default Footer


