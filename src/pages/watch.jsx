import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Watch.css'

export function Watch() {
    const { id } = useParams()
    const [video, setVideo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [recommendations, setRecommendations] = useState([])
    const [loadingRecs, setLoadingRecs] = useState(false)

    useEffect(() => {
        async function fetchVideo() {
            try {
                const apiKey = import.meta.env.VITE_MEDIA_API
                if (!apiKey || id.startsWith('demo-')) {
                    setVideo({
                        id,
                        title: 'Demo Video — Configure your API key to see real content',
                        channel: 'MediaStreamer',
                        description: 'Add VITE_MEDIA_API to your .env file with a valid YouTube Data API v3 key to load real videos.',
                        embedUrl: null,
                    })
                    return
                }

                const res = await fetch(
                    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${apiKey}`
                )
                const data = await res.json()
                console.log(data)
                if (data.items && data.items.length > 0) {
                    const v = data.items[0]
                    const videoData = {
                        id: v.id,
                        title: v.snippet.title,
                        channel: v.snippet.channelTitle,
                        description: v.snippet.description,
                        views: v.statistics?.viewCount,
                        likes: v.statistics?.likeCount,
                        publishedAt: new Date(v.snippet.publishedAt).toLocaleDateString(),
                        embedUrl: `https://www.youtube.com/embed/${v.id}`,
                        thumbnail: v.snippet.thumbnails?.medium?.url || v.snippet.thumbnails?.default?.url,
                        watchedAt: new Date().toISOString(),
                    }
                    setVideo(videoData)
                    saveToWatchHistory(videoData)
                    fetchRecommendations(videoData.title, apiKey)
                }
            } catch (err) {
                console.error('Error loading video:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchVideo()
    }, [id])

    const fetchRecommendations = async (videoTitle, apiKey) => {
        setLoadingRecs(true)
        try {
            if (!apiKey) {
                // Fallback: use watch history
                const history = JSON.parse(localStorage.getItem('watchHistory') || '[]')
                const filtered = history.filter(item => item.id !== id).slice(0, 8)
                setRecommendations(filtered)
                return
            }

            const res = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(videoTitle)}&type=video&maxResults=10&key=${apiKey}`
            )
            const data = await res.json()

            if (data.items) {
                const formattedRecs = data.items
                    .filter(item => item.id.videoId !== id)
                    .map(item => ({
                        id: item.id.videoId,
                        title: item.snippet.title,
                        channel: item.snippet.channelTitle,
                        thumbnail: item.snippet.thumbnails.medium.url,
                    }))
                setRecommendations(formattedRecs)
            }
        } catch (err) {
            console.error('Error fetching recommendations:', err)
            // Fallback to watch history on error
            const history = JSON.parse(localStorage.getItem('watchHistory') || '[]')
            const filtered = history.filter(item => item.id !== id).slice(0, 8)
            setRecommendations(filtered)
        } finally {
            setLoadingRecs(false)
        }
    }

    const saveToWatchHistory = (videoData) => {
        const history = JSON.parse(localStorage.getItem('watchHistory') || '[]')
        const filtered = history.filter(item => item.id !== videoData.id)
        const updated = [{
            id: videoData.id,
            title: videoData.title,
            channel: videoData.channel,
            thumbnail: videoData.thumbnail,
            watchedAt: videoData.watchedAt,
        }, ...filtered].slice(0, 50) 
        localStorage.setItem('watchHistory', JSON.stringify(updated))
    }

    if (loading) {
        return (
            <div className="watch-loading">
                <div className="spinner" />
                <p>Loading video...</p>
            </div>
        )
    }

    if (!video) {
        return (
            <div className="watch-error">
                <h2>Video not found</h2>
                <Link to="/" className="back-link">Back to Home</Link>
            </div>
        )
    }

    return (
        <div className="watch-page">
            <div className="player-section">
                {video.embedUrl ? (
                    <iframe
                        className="video-player"
                        src={video.embedUrl}
                        title={video.title}
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; gyroscope; picture-in-picture"
                    />
                ) : (
                    <div className="video-placeholder">
                        <span className="placeholder-icon">&#9654;</span>
                        <p>Video preview unavailable</p>
                    </div>
                )}
            </div>
            <div className="video-details">
                <h1 className="watch-title">{video.title}</h1>
                <div className="watch-meta">
                    <span className="watch-channel">{video.channel}</span>
                    {video.views && <span className="watch-views">{parseInt(video.views).toLocaleString()} views</span>}
                    {video.publishedAt && <span className="watch-date">{video.publishedAt}</span>}
                </div>
                {video.description && (
                    <div className="watch-description">
                        <p>{video.description}</p>
                    </div>
                )}
                <Link to="/" className="back-link">← Back to Home</Link>
            </div>

            {/* Recommendations Section */}
            <div className="recommendations-section">
                <h2 className="recommendations-title">Recommended Videos</h2>
                {loadingRecs ? (
                    <div className="recs-loading">
                        <div className="spinner" />
                    </div>
                ) : recommendations.length > 0 ? (
                    <div className="recommendations-grid">
                        {recommendations.map((rec) => (
                            <Link to={`/watch/${rec.id}`} key={rec.id} className="rec-card">
                                <div className="rec-thumb-wrapper">
                                    <img src={rec.thumbnail} alt={rec.title} className="rec-thumbnail" />
                                    <div className="rec-overlay">
                                        <span className="play-icon">&#9654;</span>
                                    </div>
                                </div>
                                <div className="rec-info">
                                    <h3 className="rec-title">{rec.title}</h3>
                                    <p className="rec-channel">{rec.channel}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="no-recs">No recommendations available</p>
                )}
            </div>
        </div>
    )
}