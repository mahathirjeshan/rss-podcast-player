import { useState, createContext, useRef, useEffect, useContext } from 'react'
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player'
import { useAsyncStorage } from '@react-native-async-storage/async-storage'

export const PlayerContext = createContext()

export const PlayerContextProvider = ({ children }) => {
  const { getItem, setItem } = useAsyncStorage('@recentlyPlayed')
  const { getItem: getFavorite, setItem: setFavorite, removeItem } = useAsyncStorage('@favorite')
  const [track, setTrack] = useState(null)
  const [trackIndex, setTrackIndex] = useState(null)
  const playbackState = usePlaybackState()
  const { position, duration } = useProgress()

  useEffect(() => {
    console.log(playbackState)
  }, [playbackState])

  const addRecentlyPlayed = async (newTrack) => {
    const recentlyPlayed = await getItem()
    if (recentlyPlayed) {
      const parsedRecentlyPlayed = JSON.parse(recentlyPlayed)
      const filteredRecentlyPlayed = parsedRecentlyPlayed.filter(
        (item) => item.episodeId != newTrack.episodeId
      )
      const newRecentlyPlayed = [newTrack, ...filteredRecentlyPlayed]
      if (newRecentlyPlayed.length > 5) {
        newRecentlyPlayed.length = 5
      }
      await setItem(JSON.stringify(newRecentlyPlayed))
    } else {
      await setItem(JSON.stringify([newTrack]))
    }
  }

  const fetchRecentlyPlayed = async () => {
    const recentlyPlayed = await getItem()
    if (recentlyPlayed) {
      const parsedRecentlyPlayed = JSON.parse(recentlyPlayed)
      return parsedRecentlyPlayed
    } else {
      return []
    }
  }

  const addFavourite = async (newTrack) => {
    console.log(newTrack)
    const favourite = await getFavorite()
    if (favourite) {
      const parsedFavourite = JSON.parse(favourite)
      const filteredFavourite = parsedFavourite.filter(
        (item) => item.episodeId != newTrack.episodeId
      )
      const newFavourite = [newTrack, ...filteredFavourite]
      await setFavorite(JSON.stringify(newFavourite))
    } else {
      await setFavorite(JSON.stringify([newTrack]))
    }
  }

  const fetchFavourite = async () => {
    const favourite = await getFavorite()
    if (favourite) {
      const parsedFavourite = JSON.parse(favourite)
      return parsedFavourite
    } else {
      return []
    }
  }

  // const removeFavourites = async (episodeId) => {
  //   const favourite = await removeItem()
  // }

  // removeFavourites()

  const togglePlayback = async (newTrack) => {
    if (track?.episodeId == newTrack.episodeId) {
      if (playbackState == State.Paused) {
        await TrackPlayer.play()
      } else {
        await TrackPlayer.pause()
      }
    } else {
      setTrack(newTrack)
      await TrackPlayer.reset()
      await TrackPlayer.add([newTrack])
      await TrackPlayer.play()
      await addRecentlyPlayed(newTrack)
    }
  }

  return (
    <PlayerContext.Provider
      value={{
        playbackState,
        position,
        duration,
        track,
        trackIndex,
        addFavourite,
        fetchFavourite,
        fetchRecentlyPlayed,
        addRecentlyPlayed,
        togglePlayback,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export default PlayerContext

export const usePlayerContext = () => {
  const playerContext = useContext(PlayerContext)
  return playerContext
}
