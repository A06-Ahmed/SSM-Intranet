export function formatAbsoluteDateTime(value, locale = 'fr-FR') {
  if (!value) return ''
  const dateObj = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(dateObj.getTime())) return ''

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

export function formatTimeAgo(value, locale = 'fr-FR') {
  if (!value) return ''
  const dateObj = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(dateObj.getTime())) return ''

  const diffSeconds = Math.round((Date.now() - dateObj.getTime()) / 1000)
  const absSeconds = Math.abs(diffSeconds)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const thresholds = [
    { unit: 'year', seconds: 60 * 60 * 24 * 365 },
    { unit: 'month', seconds: 60 * 60 * 24 * 30 },
    { unit: 'week', seconds: 60 * 60 * 24 * 7 },
    { unit: 'day', seconds: 60 * 60 * 24 },
    { unit: 'hour', seconds: 60 * 60 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
  ]

  const found = thresholds.find((t) => absSeconds >= t.seconds) || thresholds[thresholds.length - 1]
  const valueForUnit = Math.round(diffSeconds / found.seconds)

  return rtf.format(-valueForUnit, found.unit)
}
