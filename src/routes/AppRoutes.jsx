import React, { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

const LoginPage = lazy(() => import('../pages/Login.jsx'))
const HomePage = lazy(() => import('../pages/Home.jsx'))
const NewsPage = lazy(() => import('../pages/News.jsx'))
const GalleryPage = lazy(() => import('../pages/Gallery.jsx'))
const UserJsonPage = lazy(() => import('../pages/UserJson.jsx'))
const AjirhDemoPage = lazy(() => import('../pages/AgirhDemo.jsx'))
const KelioDemoPage = lazy(() => import('../pages/KelioDemo.jsx'))
const ReportingDemoPage = lazy(() => import('../pages/ReportingDemo.jsx'))
const SuiviArmatureDemoPage = lazy(() => import('../pages/SuiviArmatureDemo.jsx'))
const AnnuairePage = lazy(() => import('../pages/Annuaire.jsx'))
const InfosEntreprisePage = lazy(() => import('../pages/InfosEntreprise.jsx'))
const HistoirePage = lazy(() => import('../pages/Histoire.jsx'))
const DirectionPage = lazy(() => import('../pages/Direction.jsx'))
const PortailRHPage = lazy(() => import('../pages/PortailRH.jsx'))
const SupportInformatiquePage = lazy(() => import('../pages/SupportInformatique.jsx'))
const GuideEmployePage = lazy(() => import('../pages/GuideEmploye.jsx'))
const AssistancePage = lazy(() => import('../pages/Assistance.jsx'))

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
          <Route
            path="/infos-entreprise"
            element={
              <ProtectedRoute>
                <InfosEntreprisePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/histoire"
            element={
              <ProtectedRoute>
                <HistoirePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/direction"
            element={
              <ProtectedRoute>
                <DirectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portail-rh"
            element={
              <ProtectedRoute>
                <PortailRHPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support-informatique"
            element={
              <ProtectedRoute>
                <SupportInformatiquePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guide-employe"
            element={
              <ProtectedRoute>
                <GuideEmployePage />
              </ProtectedRoute>
            }
          />
        <Route
          path="/assistance"
          element={
            <ProtectedRoute>
              <AssistancePage />
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
