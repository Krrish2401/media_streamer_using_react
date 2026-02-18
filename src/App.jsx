import { useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Home } from './pages/home.jsx'
import { Watch } from './pages/watch.jsx'
import { Search } from './pages/search.jsx'
import './App.css'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('searchHistory')
    return saved ? JSON.parse(saved) : []
  })
  const [showHistory, setShowHistory] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      saveToHistory(searchQuery.trim())
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowHistory(false)
    }
  }

  const saveToHistory = (query) => {
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== query.toLowerCase())
      const updated = [query, ...filtered].slice(0, 10)
      localStorage.setItem('searchHistory', JSON.stringify(updated))
      return updated
    })
  }

  const handleHistoryClick = (query) => {
    setSearchQuery(query)
    navigate(`/search?q=${encodeURIComponent(query)}`)
    setShowHistory(false)
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
  }

  return (
    <div className="app">
      <header className="navbar">
        <Link to="/" className="logo-link">
          <h1 className="logo-text">MediaStreamer</h1>
        </Link>
        <div className="search-container">
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            />
            <button type="submit" className="search-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </form>
          {showHistory && searchHistory.length > 0 && (
            <div className="search-history-dropdown">
              <div className="history-header">
                <span className="history-title">Search History</span>
                <button onClick={clearHistory} className="clear-history">Clear</button>
              </div>
              {searchHistory.map((item, index) => (
                <div
                  key={index}
                  className="history-item"
                  onClick={() => handleHistoryClick(item)}
                >
                  <span className="history-text">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
        </nav>
      </header>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
