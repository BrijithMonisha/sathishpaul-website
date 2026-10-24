import Header from './components/Header'
import ParticlesBackground from './components/ParticlesBackground'
import FloatingShapes from './components/FloatingShapes'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import Home from './pages/Home'
import GospelToonsEng from './pages/GospelToonsEng'
import GospelToonsTamil from './pages/GospelToonsTamil'
import GospelToonsEngNew from './pages/GospelToonsEngNew'
import GospelToonsTamilNew from './pages/GospelToonsTamilNew'
import CatholicDesigns from './pages/CatholicDesigns'
import Strokes from './pages/Strokes'
import Search from './pages/Search'
import BibleVerseDetail from './pages/BibleVerseDetail'
import { Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div className="App">
      <ParticlesBackground />
      <FloatingShapes />
      <Header />

      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bible-verses/:slug" element={<BibleVerseDetail />} />
          <Route path="/gospeltoons-eng-new" element={<GospelToonsEngNew />} />
          <Route path="/gospeltoons-tamil-new" element={<GospelToonsTamilNew />} />
          <Route path="/gospeltoons-eng" element={<GospelToonsEng />} />
          <Route path="/gospeltoons-tamil" element={<GospelToonsTamil />} />
          <Route path="/catholic-designs" element={<CatholicDesigns />} />
          <Route path="/strokes" element={<Strokes />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>

      <Footer />
      <BackToTop />
    </div>
  )
}

export default App
