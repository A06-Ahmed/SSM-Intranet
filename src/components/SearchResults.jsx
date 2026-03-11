function SearchResults({
  employees,
  news,
  gallery,
  isLoading,
  query,
  onSelectEmployee,
  onSelectNews,
  onSelectGallery,
}) {
  const hasQuery = query.trim().length > 0
  const employeeLimited = Array.isArray(employees) ? employees.slice(0, 5) : []
  const newsLimited = Array.isArray(news) ? news.slice(0, 5) : []
  const galleryLimited = Array.isArray(gallery) ? gallery.slice(0, 5) : []

  return (
    <div className="search-results-dropdown">
      {isLoading && (
        <div className="search-results-item search-results-status">
          Recherche des employés...
        </div>
      )}

      {!isLoading && hasQuery && employeeLimited.length === 0 && (
        <div className="search-results-item search-results-empty">
          Aucun employé trouvé
        </div>
      )}

      {!isLoading && employeeLimited.length > 0 && (
        <>
          {employeeLimited.map((emp) => (
            <button
              key={`emp-${emp.id}`}
              type="button"
              className="search-results-item"
              onClick={() => onSelectEmployee?.(emp)}
            >
              <div className="search-results-avatar">
                <span>
                  {emp.name
                    .split(' ')
                    .filter(Boolean)
                    .map((p) => p[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>
              <div className="search-results-info">
                <div className="search-results-name">{emp.name}</div>
                <div className="search-results-meta">
                  <span className="search-results-position">{emp.position}</span>
                  {emp.department && (
                    <>
                      <span className="search-results-dot">•</span>
                      <span className="search-results-dept">{emp.department}</span>
                    </>
                  )}
                </div>
              </div>
            </button>
          ))}
        </>
      )}

      {!isLoading && newsLimited.length > 0 && (
        <>
          {newsLimited.map((item) => (
            <button
              key={`news-${item.id}`}
              type="button"
              className="search-results-item"
              onClick={() => onSelectNews?.(item)}
            >
              <div className="search-results-avatar">
                <span>AN</span>
              </div>
              <div className="search-results-info">
                <div className="search-results-name">{item.shortTitle || item.title}</div>
                <div className="search-results-meta">
                  <span className="search-results-position">Actualité</span>
                </div>
              </div>
            </button>
          ))}
        </>
      )}

      {!isLoading && galleryLimited.length > 0 && (
        <>
          {galleryLimited.map((item) => (
            <button
              key={`gal-${item.id}`}
              type="button"
              className="search-results-item"
              onClick={() => onSelectGallery?.(item)}
            >
              <div className="search-results-avatar">
                <span>GA</span>
              </div>
              <div className="search-results-info">
                <div className="search-results-name">{item.title}</div>
                <div className="search-results-meta">
                  <span className="search-results-position">Galerie</span>
                </div>
              </div>
            </button>
          ))}
        </>
      )}
    </div>
  )
}

export default SearchResults

