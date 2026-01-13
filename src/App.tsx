import { Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { InfoPage } from './pages/InfoPage'
import { Header } from './components/Header'
import { HistoryPage } from './pages/HistrotyPage'
import { getAccessTokenCookie } from './utils/authToken'

function ProtectedRoute() {
  const token = getAccessTokenCookie()

  if (!token) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

function PublicRoute() {
  const token = getAccessTokenCookie()

  if (token) {
    return <Navigate to="/info" replace />
  }

return <Outlet />
}

function App() {
  const location = useLocation();
  const showHeader = location.pathname !== '/';

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        {/* 로그인 전용 */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LoginPage />} />
        </Route>

        {/* 로그인 필요 */}
        <Route element={<ProtectedRoute />}>
          <Route path="/info" element={<InfoPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>

        {/* 없는 경로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App