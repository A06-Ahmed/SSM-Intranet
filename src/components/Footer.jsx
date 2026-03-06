function Footer() {
  const aPropos = [
    "Infos d'entreprise",
    'Mission et valeurs',
    'Direction',
  ]

  const ressources = [
    "Guide de l'employé",
    'Support informatique',
    'Portail RH',
  ]

  const accesRapide = [
    'Annonce',
    'À la une',
    'Galerie',
  ]

  const contact = [
    'Assistance',
    'Commentaires',
    'Suggestions',
  ]

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-column">
          <div className="footer-column-title">À propos</div>
          {aPropos.map((item) => (
            <a key={item} href="#" className="footer-link">
              {item}
            </a>
          ))}
        </div>

        <div className="footer-column">
          <div className="footer-column-title">Ressources</div>
          {ressources.map((item) => (
            <a key={item} href="#" className="footer-link">
              {item}
            </a>
          ))}
        </div>

        <div className="footer-column">
          <div className="footer-column-title">Accès rapide</div>
          {accesRapide.map((item) => (
            <a key={item} href="#" className="footer-link">
              {item}
            </a>
          ))}
        </div>

        <div className="footer-column">
          <div className="footer-column-title">Contact</div>
          {contact.map((item) => (
            <a key={item} href="#" className="footer-link">
              {item}
            </a>
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


