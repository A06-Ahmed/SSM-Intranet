import { useMemo, useState } from 'react'

function Assistance() {
  const siege = useMemo(
    () => ({
      title: 'Siège Social',
      address: 'Bd Ahl Loghlam Sidi Moumen, Casablanca 20250',
      phone1: '0522 763 700 (LG)',
      phone2: '0522 754 715',
      email: 'infocommercial@ssd.ma',
      hours: [
        { label: 'Du lundi au jeudi', value: '07:45 à 12:15 | 13:45 à 18:00' },
        { label: 'Vendredi', value: '07:45 à 12:15 | 14:30 à 18:45' },
      ],
    }),
    [],
  )

  const [fullName, setFullName] = useState('')
  const [fromEmail, setFromEmail] = useState('')
  const [subject, setSubject] = useState('Demande d’informations')
  const [message, setMessage] = useState('')

  const canSend =
    fullName.trim() &&
    fromEmail.trim() &&
    subject.trim() &&
    message.trim() &&
    fromEmail.includes('@')

  function handleSubmit(e) {
    e.preventDefault()
    if (!canSend) return

    const body = [
      `Nom: ${fullName.trim()}`,
      `Email: ${fromEmail.trim()}`,
      '',
      message.trim(),
    ].join('\n')

    const mailto = `mailto:${encodeURIComponent(siege.email)}?subject=${encodeURIComponent(
      subject.trim(),
    )}&body=${encodeURIComponent(body)}`

    window.location.href = mailto
  }

  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="info-hero-inner">
          <h2 className="info-hero-title">Assistance</h2>
          <p className="info-hero-subtitle">
            Contact du siège + formulaire de demande d’informations.
          </p>
        </div>
      </div>

      <div className="info-content">
        <div className="info-card">
          <h3 className="info-card-title">{siege.title}</h3>

          <div className="info-grid">
            <div className="info-mini-card">
              <div className="info-mini-title">Adresse</div>
              <div className="info-mini-text">{siege.address}</div>
            </div>
            <div className="info-mini-card">
              <div className="info-mini-title">Téléphone</div>
              <div className="info-mini-text">{siege.phone1}</div>
              <div className="info-mini-text">{siege.phone2}</div>
            </div>
            <div className="info-mini-card">
              <div className="info-mini-title">Email</div>
              <div className="info-mini-text">
                <a className="info-link" href={`mailto:${siege.email}`}>
                  {siege.email}
                </a>
              </div>
            </div>
          </div>

          <h3 className="info-card-title" style={{ marginTop: 14 }}>
            Horaires
          </h3>
          <div className="timeline">
            {siege.hours.map((h) => (
              <div key={h.label} className="timeline-row">
                <div className="timeline-year">{h.label}</div>
                <div className="timeline-text">{h.value}</div>
              </div>
            ))}
          </div>

          <h3 className="info-card-title" style={{ marginTop: 14 }}>
            Demande d’informations
          </h3>

          <form className="assist-form" onSubmit={handleSubmit}>
            <div className="assist-row">
              <label className="assist-label">
                Nom complet
                <input
                  className="assist-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Votre nom"
                />
              </label>
              <label className="assist-label">
                Votre email
                <input
                  className="assist-input"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                />
              </label>
            </div>

            <label className="assist-label">
              Sujet
              <input
                className="assist-input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </label>

            <label className="assist-label">
              Message
              <textarea
                className="assist-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Décrivez votre demande..."
                rows={6}
              />
            </label>

            <button type="submit" className="assist-submit" disabled={!canSend}>
              Envoyer au siège
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Assistance

