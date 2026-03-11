import React, { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

const LoginPage = lazy(() => import('../pages/Login.jsx'))
const HomePage = lazy(() => import('../pages/Home.jsx'))
const NewsPage = lazy(() => import('../pages/News.jsx'))
const GalleryPage = lazy(() => import('../pages/Gallery.jsx'))
const UserJsonPage = lazy(() => import('../pages/UserJson.jsx'))
const AjirhDemoPage = lazy(() => import('../pages/AjirhDemo.jsx'))
const KelioDemoPage = lazy(() => import('../pages/KelioDemo.jsx'))
const ReportingDemoPage = lazy(() => import('../pages/ReportingDemo.jsx'))
const SuiviArmatureDemoPage = lazy(() => import('../pages/SuiviArmatureDemo.jsx'))
const AdminDemoPage = lazy(() => import('../pages/AdminDemo.jsx'))
const AnnuairePage = lazy(() => import('../pages/Annuaire.jsx'))

function AppRoutes() {
  return (
    <Suspense fallback={<div className="route-loading">Chargement de la page...</div>}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* JSON / debug page */}
        <Route
          path="/user-json"
          element={
            <ProtectedRoute>
              <UserJsonPage />
            </ProtectedRoute>
          }
        />

        {/* Demo apps (protected) */}
        <Route
          path="/demo/ajirh"
          element={
            <ProtectedRoute>
              <AjirhDemoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/demo/kelio"
          element={
            <ProtectedRoute>
              <KelioDemoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/demo/reporting"
          element={
            <ProtectedRoute>
              <ReportingDemoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/demo/suivi-armature"
          element={
            <ProtectedRoute>
              <SuiviArmatureDemoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/demo/admin"
          element={
            <ProtectedRoute>
              <AdminDemoPage />
            </ProtectedRoute>
          }
        />

        {/* Main layout shell */}
        <Route element={<MainLayout />}>
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/news"
            element={
              <ProtectedRoute>
                <NewsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gallery"
            element={
              <ProtectedRoute>
                <GalleryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/annuaire/:id"
            element={
              <ProtectedRoute>
                <AnnuairePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/annuaire"
            element={
              <ProtectedRoute>
                <AnnuairePage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Default / catch-all */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes

