function Direction() {
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="info-hero-inner">
          <h2 className="info-hero-title">Direction</h2>
          <p className="info-hero-subtitle">Organisation et contacts utiles.</p>
        </div>
      </div>

      <div className="info-content">
        <div className="info-card">
          <h3 className="info-card-title">Notre direction</h3>
          <p className="info-paragraph">
            Cette page regroupe les informations de direction, les pôles et les
            interlocuteurs clés. Vous pouvez l’adapter avec vos noms, rôles et
            contacts internes.
          </p>

          <div className="info-grid">
            <div className="info-mini-card">
              <div className="info-mini-title">Direction Générale</div>
              <div className="info-mini-text">Stratégie • Gouvernance • Pilotage</div>
            </div>
            <div className="info-mini-card">
              <div className="info-mini-title">Ressources Humaines</div>
              <div className="info-mini-text">Recrutement • Formation • Carrières</div>
            </div>
            <div className="info-mini-card">
              <div className="info-mini-title">Systèmes d’Information</div>
              <div className="info-mini-text">Support • Sécurité • Outils</div>
            </div>
            <div className="info-mini-card">
              <div className="info-mini-title">QHSE</div>
              <div className="info-mini-text">Qualité • Sécurité • Environnement</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Direction

