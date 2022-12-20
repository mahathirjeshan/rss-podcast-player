import { useEffect, useState, useContext } from 'react'
import { View, Text, Button, TouchableOpacity, ActivityIndicator } from 'react-native'
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome } from '@expo/vector-icons'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { PlayerContext } from '../PlayerContext'

const MusicPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState(null)
  const { playbackState, position, duration, togglePlayback, track } = useContext(PlayerContext)

  return (
    <View>
      <LinearGradient colors={['#f9310a', '#f9310a']} style={{ padding: 10, borderRadius: 0 }}>
        <View style={{ flexDirection: 'column' }}>
          <View style={{ marginBottom: 10 }}>
            <Text numberOfLines={2} style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>
              {track?.title}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ padding: 5, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  togglePlayback(track)
                }}
              >
                {playbackState == State.Buffering || playbackState == State.Connecting ? (
                  <ActivityIndicator size={24} color="white" />
                ) : (
                  <FontAwesome
                    name={playbackState == State.Playing ? 'pause' : 'play'}
                    size={24}
                    color="white"
                    style={{ top: -10 }}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View
              style={{ padding: 5, flex: 6, justifyContent: 'center', alignContent: 'flex-start' }}
            >
              <View>
                <MultiSlider
                  trackStyle={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
                  markerStyle={{ backgroundColor: 'white' }}
                  containerStyle={{ height: 20 }}
                  selectedStyle={{ backgroundColor: 'white' }}
                  values={[position]}
                  min={0}
                  sliderLength={250}
                  max={duration > 0 && isNaN(duration) == false ? duration : 100}
                  onValuesChangeFinish={async (values) => {
                    await TrackPlayer.seekTo(values[0])
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  marginTop: 5,
                  left: -20,
                }}
              >
                <Text style={{ color: 'white' }}>
                  {new Date(position * 1000).toISOString().substring(12, 19)}
                </Text>
                <Text style={{ color: 'white' }}>
                  {new Date((duration - position) * 1000).toISOString().substring(12, 19)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  )
}

export default MusicPlayer
