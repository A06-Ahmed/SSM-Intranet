import contacts from '../data/contacts.json'

function normalize(value) {
  return (value || '').toString().toLowerCase()
}

// Build a normalized "employee view" from annuaire contacts
const employees = contacts.map((c) => ({
  id: c.id,
  name: c.name || '',
  email: c.email || '',
  phone: c.phone || '',
  department: c.department || '',
  position: c.affectation || c.department || '',
}))

export function searchEmployees(query) {
  const q = normalize(query).trim()
  if (!q) return []

  return employees.filter((emp) => {
    const haystack = [
      emp.name,
      emp.email,
      emp.phone,
      emp.department,
      emp.position,
    ]
      .map(normalize)
      .join(' ')

    return haystack.includes(q)
  })
}

export function getEmployeeById(id) {
  if (!id) return null
  return employees.find((e) => String(e.id) === String(id)) || null
}

