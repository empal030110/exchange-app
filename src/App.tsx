import { Routes, Route, useLocation } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { InfoPage } from './pages/InfoPage'
import { Header } from './components/Header'
import { HistoryPage } from './pages/HistrotyPage'

function App() {
  const location = useLocation()
  const showHeader = location.pathname !== '/'

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </>
  )
}

export default App