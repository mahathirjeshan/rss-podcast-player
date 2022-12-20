import { useContext, useEffect, useState } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import PlayerContext, { usePlayerContext } from '../PlayerContext'
import { AntDesign } from '@expo/vector-icons'
import { State } from 'react-native-track-player'

export default function RecentlyPlayed() {
  const { fetchRecentlyPlayed, track, playbackState } = useContext(PlayerContext)
  const [recentlyPlayed, setRecentlyPlayed] = useState([])

  useEffect(() => {
    console.log(track)
    const fetch = async () => {
      const recentlyPlayed = await fetchRecentlyPlayed()
      // console.log(recentlyPlayed)
      setRecentlyPlayed(recentlyPlayed)
    }
    fetch()
  }, [playbackState])

  return (
    <View>
      <Text style={{ fontSize: 16, fontWeight: '500', paddingBottom: 5 }}>Recently Played</Text>
      <FlatList
        data={recentlyPlayed}
        renderItem={({ item }) => <Episode episode={item} />}
        keyExtractor={(item) => item?.episodeId}
      />
    </View>
  )
}

function Episode(episode) {
  const { track, playbackState, togglePlayback } = useContext(PlayerContext)
  // console.log(track)

  return (
    <View
      style={{
        padding: 2,
        borderTopColor: '#ddd',
        borderTopWidth: 1,
        flexDirection: 'row',
        width: '100%',
      }}
    >
      <View style={{ flex: 1.5 }}>
        <Image source={{ uri: episode.episode.artwork }} style={{ width: 50, height: 50 }} />
      </View>
      <View style={{ paddingLeft: 10, flex: 8 }}>
        <Text style={{ fontSize: 12, color: '#666' }}>{episode.episode.artist}</Text>
        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }} numberOfLines={1}>
          {episode.episode.title}
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <TouchableOpacity
          onPress={() => {
            togglePlayback(episode.episode)
          }}
        >
          {playbackState == State.Playing && track?.episodeId == episode.episode.episodeId ? (
            <AntDesign name="pause" size={25} color="red" />
          ) : (
            <AntDesign name="play" size={25} color="red" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}
