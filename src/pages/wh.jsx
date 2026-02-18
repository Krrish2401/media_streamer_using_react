import { useState } from 'react'
import { Link } from 'react-router-dom'
import './wh.css'

export function WatchHistory() {
    const [watchHistory, setWatchHistory] = useState(() => {
        const saved = localStorage.getItem('watchHistory')
        return saved ? JSON.parse(saved) : []
    })

    const clearHistory = () => {
        setWatchHistory([])
        localStorage.removeItem('watchHistory')
    }

    const removeItem = (id) => {
        const updated = watchHistory.filter(item => item.id !== id)
        setWatchHistory(updated)
        localStorage.setItem('watchHistory', JSON.stringify(updated))
    }

    const timeAgo = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const seconds = Math.floor((now - date) / 1000)

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
        }

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit)
            if (interval >= 1) {
                return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`
            }
        }
        return 'just now'
    }

    return (
        <div className="watch-history-page">
            <div className="wh-header">
                <h2 className="wh-title">Watch History</h2>
                {watchHistory.length > 0 && (
                    <button onClick={clearHistory} className="clear-all-btn">Clear All</button>
                )}
            </div>

            {watchHistory.length > 0 ? (
                <div className="wh-list">
                    {watchHistory.map((video) => (
                        <div key={video.id} className="wh-item">
                            <Link to={`/watch/${video.id}`} className="wh-link">
                                <div className="wh-thumb-wrapper">
                                    <img src={video.thumbnail} alt={video.title} className="wh-thumbnail" />
                                    <div className="wh-overlay">
                                        <span className="play-icon">&#9654;</span>
                                    </div>
                                </div>
                                <div className="wh-details">
                                    <h3 className="wh-video-title">{video.title}</h3>
                                    <p className="wh-channel">{video.channel}</p>
                                    <p className="wh-time">Watched {timeAgo(video.watchedAt)}</p>
                                </div>
                            </Link>
                            <button onClick={() => removeItem(video.id)} className="remove-btn">
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="wh-empty">
                    <p>No watch history yet</p>
                    <p className="wh-empty-sub">Videos you watch will appear here</p>
                    <Link to="/" className="back-home-btn">Go to Home</Link>
                </div>
            )}
        </div>
    )
}
