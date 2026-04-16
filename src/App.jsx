import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import GMScreen from './pages/GMScreen'
import PlayerScreen from './pages/PlayerScreen'
import CharacterPage from './pages/CharacterPage'
import './styles/app.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gm/:sessionId" element={<GMScreen />} />
        <Route path="/player/:sessionId" element={<PlayerScreen />} />
        <Route path="/character" element={<CharacterPage />} />
      </Routes>
    </BrowserRouter>
  )
}
