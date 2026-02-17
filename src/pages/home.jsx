import React from 'react'
import { useState, useEffect } from 'react'

export function Home (){
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        async function fetchVideos(){
            try{
                const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&maxResults=12&key=${import.meta.env.media_api}`)

                setVideos(data);
                const data = await res.json();

                const formatedVideos = data.item.map(video=>({
                    id: video.id,
                    title: video.title,
                    channel: video.channel,
                    thumbnail: video.thumbnail
                }));
                setVideos(formatedVideos)
            }
            catch(error){
                console.error(error)
            }
            finally{
                setLoading(false);
            }
        }

        fetchVideos();
    },[])
} 