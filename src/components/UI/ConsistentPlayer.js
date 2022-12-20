import { useContext, useEffect } from 'react'
import { Text, View } from 'react-native'
import MusicPlayer from '../MusicPlayer'
import PlayerContext from '../PlayerContext'
import { State } from 'react-native-track-player'

export default function ConsistentPlayer() {
  const { track, playbackState } = useContext(PlayerContext)

  if (playbackState != State.Playing && playbackState != State.Paused) return null

  return (
    <View
      style={{
        // minHeight: 70,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 3.84,
        // elevation: 5,
        backgroundColor: '#fff',
        // padding: 10,
      }}
    >
      <MusicPlayer track={track} />
    </View>
  )
}
