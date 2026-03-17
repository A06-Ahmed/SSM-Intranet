import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getGalleryDemo } from '../services/galleryService'
import { formatAbsoluteDateTime } from '../utils/dateFormat'

function Gallery() {
  const [searchParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(null)
  const [activeImage, setActiveImage] = useState('')
  const [loadedImages, setLoadedImages] = useState({})

  useEffect(() => {
    let isMounted = true
    async function load() {
      try {
        setIsLoading(true)
        setError('')
        const data = await getGalleryDemo()
        if (!isMounted) return
        const all = Array.isArray(data) ? data : []
        setItems(all)

        const idFromUrl = searchParams.get('id')
        if (idFromUrl) {
          const found = all.find((g) => g.id === idFromUrl)
          if (found) {
            setActive(found)
            const first =
              Array.isArray(found.images) && found.images[0]
                ? found.images[0]
                : found.coverImage
            setActiveImage(first || '')
          }
        }
      } catch (e) {
        if (!isMounted) return
        setError(e?.message || 'Erreur lors du chargement de la galerie')
      } finally {
        if (!isMounted) return
        setIsLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  const activeImages = useMemo(() => {
    const arr = active?.images
    return Array.isArray(arr) ? arr.filter(Boolean) : []
  }, [active])

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items

    return items.filter((item) => {
      const hay = `${item?.title || ''} ${item?.date || ''}`.toLowerCase()
      return hay.includes(q)
    })
  }, [items, query])

  function openItem(item) {
    setActive(item)
    const first = Array.isArray(item?.images) && item.images[0] ? item.images[0] : item?.coverImage
    setActiveImage(first || '')
  }

  function closeModal() {
    setActive(null)
    setActiveImage('')
  }

  function markLoaded(src) {
    if (!src) return
    setLoadedImages((prev) => ({ ...prev, [src]: true }))
  }

  return (
    <div className="gallery-page">
      <div className="gallery-container">
        <header className="gallery-header">
          <div className="gallery-header-main">
            <h1 className="gallery-title">Galerie</h1>
            <p className="gallery-subtitle">
              Retrouvez ici les temps forts, moments de cohésion et événements marquants de la vie de
              SMM Socodam Davum.
            </p>
          </div>
          <div className="gallery-search-shell">
            <div className="gallery-search-box">
              <img
                className="gallery-search-icon"
                src="src/assets/loop.svg"
                alt=""
                aria-hidden="true"
              />
              <input
                className="gallery-search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher (titre, date)..."
                aria-label="Rechercher dans la galerie"
              />
              {query.trim() && (
                <button
                  type="button"
                  className="gallery-search-clear"
                  onClick={() => setQuery('')}
                  aria-label="Effacer la recherche"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </header>

        <section aria-label="Galerie des événements" className="gallery-grid-section">
          <div className="gallery-grid">
            {isLoading && (
              <div className="gallery-status">
                <div className="spinner" aria-label="Chargement" role="status" />
              </div>
            )}
            {!isLoading && error && <div className="gallery-error">{error}</div>}

            {!isLoading &&
              !error &&
              (filteredItems.length === 0 ? (
                <div className="gallery-status">Aucun résultat pour “{query.trim()}”.</div>
              ) : (
                filteredItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="gallery-card"
                    onClick={() => openItem(item)}
                  >
                    <div className="gallery-card-cover" aria-hidden="true">
                      <div
                        className={`gallery-img-container ${
                          loadedImages[item.coverImage] ? 'is-loaded' : 'is-loading'
                        }`}
                      >
                        {item.coverImage ? (
                          <img
                            src={item.coverImage}
                            alt=""
                            className="gallery-card-img"
                            onLoad={() => markLoaded(item.coverImage)}
                            onError={() => markLoaded(item.coverImage)}
                            loading="lazy"
                          />
                        ) : (
                          <div className="gallery-img-placeholder" />
                        )}
                      </div>
                      <div className="gallery-card-overlay" />
                    </div>
                    <div className="gallery-card-body">
                      <div className="gallery-card-date">{formatAbsoluteDateTime(item.date)}</div>
                      <h2 className="gallery-card-title">{item.title}</h2>
                    </div>
                  </button>
                ))
              ))}
          </div>
        </section>
      </div>

      {active && (
        <div className="gallery-modal" role="dialog" aria-modal="true">
          <button type="button" className="gallery-modal-backdrop" onClick={closeModal} />
          <div className="gallery-modal-card">
            <div className="gallery-modal-header">
              <div className="gallery-modal-meta">
                <div className="gallery-modal-date">{formatAbsoluteDateTime(active.date)}</div>
                <div className="gallery-modal-title">{active.title}</div>
              </div>
              <button type="button" className="gallery-modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="gallery-modal-body">
              <div className="gallery-modal-main">
                <div
                  className={`gallery-img-container ${
                    loadedImages[activeImage] ? 'is-loaded' : 'is-loading'
                  }`}
                >
                  {activeImage ? (
                    <img
                      src={activeImage}
                      alt={active.title}
                      className="gallery-modal-main-image"
                      onLoad={() => markLoaded(activeImage)}
                      onError={() => markLoaded(activeImage)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="gallery-modal-main-placeholder" />
                  )}
                </div>
              </div>
              {activeImages.length > 0 && (
                <div className="gallery-modal-thumbs" aria-label="Miniatures">
                  {activeImages.map((src, idx) => (
                    <button
                      key={`${src}-${idx}`}
                      type="button"
                      className={`gallery-modal-thumb ${
                        activeImage === src ? 'is-active' : ''
                      }`}
                      onClick={() => setActiveImage(src)}
                    >
                      <img src={src} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery

