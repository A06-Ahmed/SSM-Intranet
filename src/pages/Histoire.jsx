function Histoire() {
  const timeline = [
    { year: '1912', text: 'Fondation des “Etablissements Bouvier & Alexandre”.' },
    {
      year: '1919',
      text:
        'Création de la “Société Marocaine Métallurgique” (groupement de sociétés industrielles françaises dont Davum). Reprise du fonds de commerce des Etablissements Bouvier & Alexandre.',
    },
    { year: '1945', text: 'Création de la société Socodam.' },
    {
      year: '1949',
      text:
        'La Société Marocaine Métallurgique dispose de plusieurs sites couvrant le territoire.',
    },
  ]

  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="info-hero-inner">
          <h2 className="info-hero-title">Histoire</h2>
          <p className="info-hero-subtitle">Quelques dates clés de SSD.</p>
        </div>
      </div>

      <div className="info-content">
        <div className="info-card">
          <h3 className="info-card-title">Historique</h3>
          <div className="timeline">
            {timeline.map((item) => (
              <div key={item.year} className="timeline-row">
                <div className="timeline-year">{item.year}</div>
                <div className="timeline-text">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Histoire

