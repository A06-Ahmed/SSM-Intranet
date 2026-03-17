import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getNewsDemo } from '../services/newsService.js'
import { formatAbsoluteDateTime } from '../utils/dateFormat'


function News() {
  const [searchParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await getNewsDemo()
        if (!isMounted) return
        setItems(data)
        setActiveId((prev) => prev ?? data?.[0]?.id ?? null)
      } catch (e) {
        if (!isMounted) return
        setError(e?.message || 'Erreur lors du chargement des actualités.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const idFromUrl = searchParams.get('id')
    if (!idFromUrl) return

    const exists = items.some((n) => n.id === idFromUrl)
    if (exists) setActiveId(idFromUrl)
  }, [searchParams, items])

  const activeItem = useMemo(
    () => items.find((n) => n.id === activeId) || items[0] || null,
    [items, activeId],
  )

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
  }, [items])

  const topItems = useMemo(() => sortedItems.slice(0, 6), [sortedItems])
  const listItems = useMemo(() => sortedItems.slice(0, 12), [sortedItems])

  return (
    <div className="news-page">
      <div className="news-container">
        <div className="news-header">
          <h2 className="news-title">À la une</h2>
          <div className="news-header-spacer" />
        </div>

        {loading && (
          <div className="news-status">
            <div className="spinner" aria-label="Chargement" role="status" />
          </div>
        )}
        {error && <div className="news-error">{error}</div>}

        {!loading && !error && (
          <div className="news-shell">
            <section className="news-top-grid" aria-label="Actualités à la une">
              {topItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`news-mini-card ${item.id === activeItem?.id ? 'is-active' : ''}`}
                  onClick={() => setActiveId(item.id)}
                >
                  <div className="news-mini-title">{item.shortTitle || item.title}</div>
                  <div className="news-mini-date">{formatAbsoluteDateTime(item.publishedAt)}</div>
                </button>
              ))}
            </section>

            <section className="news-main" aria-label="Détail de l’actualité">
              <div className="news-main-card">
                <div
                  className="news-main-cover"
                  aria-hidden="true"
                  style={{
                    '--news-cover-image': activeItem?.image ? `url(${activeItem.image})` : 'none',
                  }}
                />

                <div className="news-main-body">
                  <h3 className="news-main-title">{activeItem?.title}</h3>
                  {activeItem?.subtitle && <div className="news-main-subtitle">{activeItem.subtitle}</div>}

                  <div className="news-main-meta">
                    <span className="news-main-date">{formatAbsoluteDateTime(activeItem?.publishedAt)}</span>
                  </div>

                  <div className="news-main-content">
                    {(activeItem?.content || []).map((p, idx) => (
                      <p key={idx} className="news-paragraph">
                        {p}
                      </p>
                    ))}
                  </div>

                  <div className="news-main-footer">© {new Date().getFullYear()} SMM SOCODAM DAVUM</div>
                </div>
              </div>

              <aside className="news-list" aria-label="Liste des actualités">
                {listItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`news-row ${item.id === activeItem?.id ? 'is-active' : ''}`}
                    onClick={() => setActiveId(item.id)}
                  >
                    <div className="news-row-title">{item.shortTitle || item.title}</div>
                    <div className="news-row-date">{formatAbsoluteDateTime(item.publishedAt)}</div>
                  </button>
                ))}
              </aside>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

export default News

