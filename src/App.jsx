import { Routes, Route, Link } from 'react-router-dom'
import { Home } from './pages/home.jsx'
import { Watch } from './pages/watch.jsx'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <Link to="/" className="logo-link">
          <h1 className="logo-text">MediaStreamer</h1>
        </Link>
        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
        </nav>
      </header>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:id" element={<Watch />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
