import { useContext, useEffect, useState } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import PlayerContext, { usePlayerContext } from '../PlayerContext'
import { AntDesign } from '@expo/vector-icons'
import { State } from 'react-native-track-player'

export default function RecentlyPlayed() {
  const { fetchFavourite, playbackState } = useContext(PlayerContext)
  const [favourites, setFavourites] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const favs = await fetchFavourite()
      console.log(favs)
      setFavourites(favs)
    }
    fetch()
  })

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: '500', paddingBottom: 5 }}>Favourites</Text>
      {favourites.length > 0 && (
        <FlatList
          data={favourites}
          renderItem={({ item }) => <Episode episode={item} />}
          keyExtractor={(item) => item?.episodeId}
        />
      )}
    </View>
  )
}

function Episode(episode) {
  const { track, playbackState, togglePlayback } = useContext(PlayerContext)
  // console.log(episode)

  if (!episode.episode) return null

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
