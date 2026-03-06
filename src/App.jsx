import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import News from './pages/News.jsx'
import Gallery from './pages/Gallery.jsx'
import UserJson from './pages/UserJson.jsx'
import AjirhDemo from './pages/AjirhDemo.jsx'
import KelioDemo from './pages/KelioDemo.jsx'
import ReportingDemo from './pages/ReportingDemo.jsx'
import SuiviArmatureDemo from './pages/SuiviArmatureDemo.jsx'
import MainLayout from './layouts/MainLayout.jsx'

function ProtectedRoute({ children }) {
  const stored = localStorage.getItem('user')
  const user = stored ? JSON.parse(stored) : null

  if (!user) {
    return <Navigate to="/login" state={{ error: "Vous devez être connecté pour accéder à cette page." }} replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/user-json" element={<UserJson />} />

      <Route
          path="/demo/ajirh"
          element={
            <ProtectedRoute>
              <AjirhDemo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/demo/kelio"
          element={
            <ProtectedRoute>
              <KelioDemo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/demo/reporting"
          element={
            <ProtectedRoute>
              <ReportingDemo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/demo/suivi-armature"
          element={
            <ProtectedRoute>
              <SuiviArmatureDemo />
            </ProtectedRoute>
          }
        />
      <Route element={<MainLayout />}>
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/news"
          element={
            <ProtectedRoute>
              <News />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gallery"
          element={
            <ProtectedRoute>
              <Gallery />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
