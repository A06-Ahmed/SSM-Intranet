function SupportInformatique() {
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="info-hero-inner">
          <h2 className="info-hero-title">Support informatique</h2>
          <p className="info-hero-subtitle">Assistance, demandes et dépannage.</p>
        </div>
      </div>

      <div className="info-content">
        <div className="info-card">
          <h3 className="info-card-title">Comment obtenir de l’aide</h3>
          <div className="info-grid">
            <div className="info-mini-card">
              <div className="info-mini-title">Incidents</div>
              <div className="info-mini-text">
                Problème bloquant, accès, panne matériel/logiciel.
              </div>
            </div>
            <div className="info-mini-card">
              <div className="info-mini-title">Demandes</div>
              <div className="info-mini-text">
                Nouvel accès, équipement, installation, compte, droits.
              </div>
            </div>
            <div className="info-mini-card">
              <div className="info-mini-title">Bonnes pratiques</div>
              <div className="info-mini-text">
                Sécurité, mots de passe, phishing, mises à jour.
              </div>
            </div>
          </div>

          <p className="info-paragraph">
            Remplissez cette page avec vos contacts internes (mail, téléphone, horaires,
            procédure de ticketing) selon votre organisation.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SupportInformatique

