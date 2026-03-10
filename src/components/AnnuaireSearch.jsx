import React, { useEffect, useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import contactsFile from '../assets/Repertoire-telephoniqueACT22.xlsm'

// Build unique, sorted list of values for a given key
function buildUniqueList(data, key) {
  const set = new Set()
  data.forEach((item) => {
    const value = (item[key] || '').toString().trim()
    if (value) set.add(value)
  })
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }))
}

// Core filtering logic
function filterContacts(contacts, affectation, searchText) {
  const text = searchText.trim().toLowerCase()

  return contacts.filter((c) => {
    if (affectation && c.affectation !== affectation) return false

    if (text) {
      const name = (c.name || '').toString().toLowerCase()
      const email = (c.email || '').toString().toLowerCase()
      const department = (c.department || '').toString().toLowerCase()
      const affect = (c.affectation || '').toString().toLowerCase()
      const matricule =
        c.matricule !== undefined && c.matricule !== null
          ? String(c.matricule).toLowerCase()
          : ''
      const code = (c.code || '').toString().toLowerCase()
      const extension = (c.extension || '').toString().toLowerCase()

      const haystack = [name, email, department, affect, matricule, code, extension]
        .filter(Boolean)
        .join(' ')

      if (!haystack.includes(text)) return false
    }

    return true
  })
}

function AffectationSelector({ affectations, selectedAffectation, onChange }) {
  return (
    <div className="annuaire-field">
      <label className="annuaire-label">Affectation</label>
      <select
        className="annuaire-select"
        value={selectedAffectation}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Toutes les affectations</option>
        {affectations.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </div>
  )
}

function PersonCard({ contact, onClick }) {
  return (
    <div className="annuaire-person-card" onClick={onClick}>
      <div className="annuaire-person-name">{contact.name || 'Sans nom'}</div>
      <div className="annuaire-person-dept">{contact.department}</div>
      <div className="annuaire-person-email">
        {contact.email ? (
          <a href={`mailto:${contact.email}`} onClick={(e) => e.stopPropagation()}>
            {contact.email}
          </a>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

function ResultsList({ contacts, onSelectPerson }) {
  if (!contacts.length) {
    return <div className="annuaire-no-results">Aucun résultat.</div>
  }

  return (
    <div className="annuaire-results-list">
      {contacts.map((c) => (
        <PersonCard key={c.id} contact={c} onClick={() => onSelectPerson(c)} />
      ))}
    </div>
  )
}

export default function AnnuaireSearch() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [selectedAffectation, setSelectedAffectation] = useState('')
  const [showResults, setShowResults] = useState(false)

  // Helper to map flexible Excel column names
  function getFirstMatchingValue(row, keywords) {
    const lowerKeys = Object.keys(row).map((key) => ({
      key,
      lower: key.toLowerCase(),
    }))

    for (const keyword of keywords) {
      const lowerKeyword = keyword.toLowerCase()
      const found = lowerKeys.find((k) => k.lower.includes(lowerKeyword))
      if (found) {
        const value = row[found.key]
        if (value !== undefined && value !== null) {
          return value
        }
      }
    }

    return ''
  }

  useEffect(() => {
    async function loadExcel() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(contactsFile)
        if (!response.ok) {
          throw new Error('Impossible de charger le fichier Excel.')
        }

        const arrayBuffer = await response.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const allRows = []

        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName]
          const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })
          allRows.push(...rows)
        })

        const normalized = allRows.map((row, index) => {
          const name = getFirstMatchingValue(row, [
            'nom',
            'prénom',
            'prenom',
            'nom et prénom',
            'interlocuteur',
          ])

          const affectation = getFirstMatchingValue(row, ['affectation'])

          const email = getFirstMatchingValue(row, ['email', 'courriel', 'mail'])

          const phone = getFirstMatchingValue(row, ['téléphone', 'telephone', 'portable'])

          const department = getFirstMatchingValue(row, [
            'département',
            'departement',
            'service',
            'site',
            'organisation',
          ])

          const matricule = getFirstMatchingValue(row, ['matricule'])
          const code = getFirstMatchingValue(row, ['code'])
          const extension = getFirstMatchingValue(row, ['extension', 'poste', 'ext'])

          const typeRaw = getFirstMatchingValue(row, ['type', 'nature'])
          const type =
            (typeof typeRaw === 'string' && typeRaw.toLowerCase().includes('exter'))
              ? 'externe'
              : 'interne'

          return {
            id: String(index),
            name,
            affectation,
            email,
            phone,
            department,
            matricule,
            code,
            extension,
            type,
            ...row,
          }
        })

        setContacts(normalized)
      } catch (err) {
        console.error(err)
        setError(err.message || 'Erreur lors du chargement des contacts.')
      } finally {
        setLoading(false)
      }
    }

    loadExcel()
  }, [])

  const affectations = useMemo(
    () => buildUniqueList(contacts, 'affectation'),
    [contacts]
  )

  const filteredContacts = useMemo(
    () =>
      filterContacts(contacts, selectedAffectation, searchText),
    [contacts, selectedAffectation, searchText]
  )

  const handleSearchClick = () => {
    if (!loading && !error && searchText.trim()) {
      setShowResults(true)
    }
  }

  const handleSelectPerson = (person) => {
    setSelectedPerson(person)
    setShowResults(true)
  }

  useEffect(() => {
    const hasText = searchText.trim().length > 0
    if (!loading && !error) {
      setShowResults(hasText)
    }
    if (!hasText) {
      setSelectedPerson(null)
    }
  }, [searchText, loading, error])

  return (
    <div className="annuaire-container">
      <div className="annuaire-hero">
        <div className="annuaire-hero-inner">
          <h2 className="annuaire-hero-title">Annuaire des employés</h2>
          <p className="annuaire-hero-subtitle">
            Consultez les coordonnées et informations des employés.
          </p>

          <div className="annuaire-search-bar">
            <input
              type="text"
              className="annuaire-search-input"
              placeholder="Nom, prénom ou matricule"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <div className="annuaire-search-divider" />

            <select
              className="annuaire-search-select"
              value={selectedAffectation}
              onChange={(e) => setSelectedAffectation(e.target.value)}
            >
              <option value="">Affectation</option>
              {affectations.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="annuaire-search-button"
              onClick={handleSearchClick}
              disabled={loading || !!error}
            >
              Rechercher
            </button>
          </div>

          {loading && <div className="annuaire-status">Chargement des contacts...</div>}
          {error && <div className="annuaire-error">{error}</div>}
        </div>
      </div>

      {showResults && !loading && !error && (
        <div className="annuaire-results-shell">
          <div className="annuaire-results-header-top">
            <div className="annuaire-results-line">
              <span className="annuaire-results-label">Affectation :</span>
              <span className="annuaire-results-value">
                {selectedAffectation || 'Toutes'}
              </span>
            </div>
            <div className="annuaire-results-count">
              {filteredContacts.length} résultat(s)
            </div>
          </div>

          <div className="annuaire-results-section">
            <div className="annuaire-results-title">Nom et prénom :</div>
            <ResultsList contacts={filteredContacts} onSelectPerson={handleSelectPerson} />
          </div>
        </div>
      )}

      {selectedPerson && (
        <div className="annuaire-detail-card">
          <div className="annuaire-detail-header">
            <h3 className="annuaire-detail-title">
              {selectedPerson.type && selectedPerson.type.toLowerCase() === 'interne'
                ? "Informations de l'employé"
                : 'Informations du contact'}
            </h3>
          </div>

          <div className="annuaire-detail-grid">
            <div className="annuaire-detail-col">
              <div className="annuaire-detail-label">Nom et prénom</div>
              <div className="annuaire-detail-value annuaire-detail-strong">
                {selectedPerson.name}
              </div>
            </div>
            <div className="annuaire-detail-col">
              <div className="annuaire-detail-label">Affectation</div>
              <div className="annuaire-detail-value">{selectedPerson.affectation}</div>
            </div>
            <div className="annuaire-detail-col">
              <div className="annuaire-detail-label">
                {selectedPerson.type && selectedPerson.type.toLowerCase() === 'interne'
                  ? 'Département'
                  : 'Organisation'}
              </div>
              <div className="annuaire-detail-value">{selectedPerson.department}</div>
            </div>
            <div className="annuaire-detail-col">
              <div className="annuaire-detail-label">Code</div>
              <div className="annuaire-detail-value">
                {selectedPerson.code || 'N/A'}
              </div>
            </div>
            <div className="annuaire-detail-col">
              <div className="annuaire-detail-label">Matricule</div>
              <div className="annuaire-detail-value">
                {selectedPerson.matricule || 'N/A'}
              </div>
            </div>
            <div className="annuaire-detail-col">
              <div className="annuaire-detail-label">Extension</div>
              <div className="annuaire-detail-value">
                {selectedPerson.extension || 'N/A'}
              </div>
            </div>
            <div className="annuaire-detail-col">
              <div className="annuaire-detail-label">Téléphone portable</div>
              <div className="annuaire-detail-value annuaire-detail-strong">
                {selectedPerson.phone || 'N/A'}
              </div>
            </div>
            <div className="annuaire-detail-col">
              <div className="annuaire-detail-label">Courriel</div>
              <div className="annuaire-detail-value">
                {selectedPerson.email ? (
                  <a href={`mailto:${selectedPerson.email}`}>{selectedPerson.email}</a>
                ) : (
                  'N/A'
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

