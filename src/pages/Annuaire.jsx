import { useParams } from 'react-router-dom'
import AnnuaireSearch from '../components/AnnuaireSearch.jsx'

function Annuaire() {
  const { id } = useParams()

  return (
    <div className="annuaire-page">
      <AnnuaireSearch initialSelectedId={id} />
    </div>
  )
}

export default Annuaire

