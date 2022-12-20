import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Animated,
  ImageBackground,
  SafeAreaView,
} from 'react-native'
import { useRef, useState, useEffect } from 'react'
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view'
import MusicPlayer from '../../../components/MusicPlayer'
import { LinearGradient } from 'expo-linear-gradient'
import { secondsToHms, weekDay } from '../../../helpers'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { usePlayerContext } from '../../../components/PlayerContext'
import { usePlaybackState, State } from 'react-native-track-player'

const MAX_HEIGHT = 300
const MIN_HEIGHT = 0
const WIDTH = Dimensions.get('window').width

const Episode = ({ navigation, route }) => {
  const playbackState = usePlaybackState()
  const {
    togglePlayback,
    isCurrentlyPlaying,
    track: currentTrack,
    loading,
    addFavourite,
    fetchFavourite,
  } = usePlayerContext()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFavourite, setIsFavourite] = useState(false)

  const episode = route.params?.episodeObject
  const episodeID = route.params?.episodeID
  const episodeImage = route.params?.episodeImage
  const episodeDescription = episode.description
    .replace(/<p>/g, '')
    .replace(/<br>/g, ``)
    .replace(/<\/p>/g, '')
  const trackLength = route.params?.trackLength
  const track = {
    url: episode.enclosures[0].url,
    title: episode.title,
    artist: episode.itunes.authors[0].name,
    episodeId: episode.id,
    artwork: episodeImage,
    duration: (Number(episode.enclosures[0].length) / 1000).toFixed(0),
  }

  const opacity = useRef(new Animated.Value(0)).current

  const fadeIn = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  const fadeOut = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start()
  }

  useEffect(() => {
    const fetch = async () => {
      const favs = await fetchFavourite()
      console.log(favs)
      if (favs.some((f) => f.episodeID == track.episodeId)) {
        setIsFavourite(true)
      }
    }
    fetch()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderImageScrollView
        maxHeight={MAX_HEIGHT}
        minHeight={MIN_HEIGHT}
        maxOverlayOpacity={0.6}
        minOverlayOpacity={0}
        fadeOutForeground
        renderForeground={() => (
          <View style={styles.titleContainer}>
            <Text style={styles.imageTitle}> #{trackLength - episodeID}</Text>
            <Text style={styles.imageTitle}>{episode.title}</Text>
            <View style={styles.sectionPlayer}>
              {/* <MusicPlayer
                trackIndex={episodeID}
                track={{
                  url: episode.enclosures[0].url,
                  title: episodeName,
                  artist: episode.itunes.authors[0].name,
                  artwork: episodeImage,
                  duration: (Number(episode.enclosures[0].length) / 1000).toFixed(0),
                }}
              /> */}
              <View style={{ flex: 8 }}>
                <Text style={{ fontSize: 12, color: 'white' }}>{weekDay(episode.published)}</Text>
                <Text style={{ fontSize: 12, color: 'white' }}>
                  {secondsToHms(episode.itunes.duration)}
                </Text>
              </View>
              <View style={{ flex: 4, flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => {
                    addFavourite(track)
                  }}
                >
                  {isFavourite ? (
                    <MaterialIcons
                      name="favorite"
                      size={36}
                      color="white"
                      style={{ marginRight: 15 }}
                    />
                  ) : (
                    <MaterialIcons
                      name="favorite-border"
                      size={36}
                      color="white"
                      style={{ marginRight: 15 }}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    try {
                      togglePlayback(track)
                    } catch (error) {
                      console.log(error)
                    }
                  }}
                >
                  {currentTrack?.episodeId == track.episodeId && playbackState == State.Playing && (
                    <AntDesign name="pause" size={36} color="white" />
                  )}
                  {currentTrack?.episodeId == track.episodeId && playbackState == State.Paused && (
                    <AntDesign name="play" size={36} color="white" />
                  )}
                  {/* {playbackState == State.Buffering && (
                    <AntDesign name="loading1" size={36} color="white" />
                  )} */}
                  {/* {loading && <AntDesign name="loading1" size={36} color="white" />} */}
                  {currentTrack?.episodeId != track.episodeId && (
                    <AntDesign name="play" size={36} color="white" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        renderFixedForeground={() => (
          <Animated.View style={[styles.navTitleView, { opacity }]}>
            <Text style={styles.navTitle}>
              {episode.title.indexOf('-') != -1 ? episode.title.split('- ')[1] : episode.title}
            </Text>
          </Animated.View>
        )}
        renderHeader={() => (
          <ImageBackground
            imageStyle={{ resizeMode: 'cover' }}
            style={styles.imageHeader}
            source={{ uri: episodeImage }}
          >
            <LinearGradient
              locations={[0, 0.8]}
              colors={['transparent', 'rgba(0, 0, 0, 0.6)' /*rgba(0, 128, 55, .6)*/]}
              style={styles.episodeContainer}
            ></LinearGradient>
          </ImageBackground>
        )}
      >
        <TriggeringView
          onDisplay={() => fadeOut()}
          onBeginHidden={() => {
            fadeIn()
          }}
        >
          {/* <View style={styles.sectionPlayer}>
            <MusicPlayer
              trackIndex={episodeID}
              track={{
                url: episode.enclosures[0].url,
                title: episodeName,
                artist: episode.itunes.authors[0].name,
                artwork: episodeImage,
                duration: (Number(episode.enclosures[0].length) / 1000).toFixed(0),
              }}
            />
            <View style={{ flex: 10 }}>
              <Text style={{ fontSize: 12, color: 'black' }}>{weekDay(episode.published)}</Text>
              <Text style={{ fontSize: 12, color: 'black' }}>
                {secondsToHms(episode.itunes.duration)}
              </Text>
            </View>
            <View style={{ flex: 2 }}>
              <AntDesign name="play" size={36} color="red" />
            </View>
          </View> */}
        </TriggeringView>
        <View style={[styles.section, styles.sectionLarge]}>
          <Text>{episodeDescription}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionInfo}>Publicado em: {episode.published}</Text>
          <Text style={styles.sectionInfo}>{episode.id}</Text>
        </View>
      </HeaderImageScrollView>
    </SafeAreaView>
  )
}

export default Episode

const styles = StyleSheet.create({
  imageHeader: {
    height: MAX_HEIGHT,
    width: WIDTH,
    resizeMode: 'cover',
    backgroundColor: 'black',
  },
  episodeContainer: {
    height: '100%',
  },
  title: {
    fontSize: 20,
    paddingRight: 10,
    paddingLeft: 10,
  },
  sectionPlayer: {
    // backgroundColor: '#008037',
    flexDirection: 'row',
    paddingTop: 30,
    paddingBottom: 10,
  },
  section: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    backgroundColor: 'white',
  },
  navTitle: {
    color: 'white',
    fontSize: 18,
    backgroundColor: 'transparent',
  },
  navTitleView: {
    height: MIN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
    opacity: 0,
    display: 'none',
  },
  sectionLarge: {
    height: 600,
  },
  titleContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    flexDirection: 'column',
    paddingLeft: 10,
    paddingTop: 0,
  },
  imageTitle: {
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: 27,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginTop: 10,
  },
  sectionInfo: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontStyle: 'italic',
  },
})
