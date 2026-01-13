import { Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { InfoPage } from './pages/InfoPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/info" element={<InfoPage />} />
    </Routes>
  )
}

export default App