import {
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  FlatList,
  Pressable,
  Animated,
  ImageBackground,
  TextInput,
  Keyboard,
  ScrollView,
  SafeAreaView,
} from 'react-native'
import { useState, useEffect, useContext, useRef } from 'react'
import * as rssParser from 'react-native-rss-parser'
import { LinearGradient } from 'expo-linear-gradient'
import TrackPlayer from 'react-native-track-player'
import { scaleAnimation } from '../../../animations/scale'
import { AntDesign } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons'
import SkeletonPlaceHolderPodcast from '../../../components/SkeletonPlaceHolderPodcast'
import { EpisodeCard } from '../../../components/UI'

const EpisodeList = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingPagination, setIsLoadingPagination] = useState(false)
  const [pageCurrent, setPageCurrent] = useState(1)
  const [errorMessage, setErrorMessage] = useState(null)

  const [searchText, setSearchText] = useState('')
  const [episodes, setEpisodes] = useState([])
  const [DATA, setDATA] = useState([])

  const animateX = useRef(new Animated.Value(1)).current

  const getPodcasts = async () => {
    // const RSS_URL = `https://anchor.fm/s/dea812c/podcast/rss`;
    const RSS_URL = `https://feeds.megaphone.fm/RSV2347142881`

    try {
      const response = await fetch(RSS_URL)
      const responseData = await response.text()
      const data = await rssParser.parse(responseData)

      // console.log(JSON.stringify(data, null, 2))

      setEpisodes(
        data.items.map((episode, index) => {
          return {
            key: episode.id,
            episodeObject: episode,
            episodeID: index,
            image: data.image.url,
          }
        })
      )

      setPlaylistPodcast(data.items)
      setDATA(
        data.items.map((episode, index) => {
          return {
            key: episode.id,
            episodeObject: episode,
            episodeID: index,
          }
        })
      )
    } catch (e) {
      console.log('Erro:', e)
    }
  }

  const setPlaylistPodcast = async (episodesData) => {
    let playlist = []
    // episodesData.map((episode, index) => {
    //   playlist.push({
    //     url: episode.enclosures[0].url,
    //     title: episode.title,
    //     artist: episode.itunes.authors[0].name,
    //     artwork: 'https://brffootball.com.br/wp-content/uploads/2022/02/cropped-logo.png',
    //     duration: (Number(episode.enclosures[0].length) / 1000).toFixed(0),
    //   })
    // })

    try {
      await TrackPlayer.add(playlist)
    } catch (error) {
      console.log('Error:', error)
    }
    // console.log(playlist.length, 'tracked')
    setIsLoading(false)
  }

  useEffect(() => {
    getPodcasts()
  }, [])

  useEffect(() => {
    if (searchText == '') {
      setEpisodes(DATA)
    } else {
      setEpisodes(
        DATA.filter((item) => {
          if (item.episodeObject.title.toLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1) {
            return true
          } else {
            return false
          }
        })
      )
    }
  }, [searchText])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        {errorMessage && <Text>{errorMessage}</Text>}
        <View style={{ padding: 10, alignItems: 'center', marginTop: 20 }}>
          {/* <View style={{padding:5, borderRadius: 5, backgroundColor: '#F6F7F2', width:200, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                    <FontAwesome name="search" style={{paddingLeft:5,paddingRight:10}} size={17} color="#323232" />
                    <TextInput
                        value={searchText}
                        onChangeText={setSearchText}
                        style={{width:150, color:'#323232'}}
                        placeholder='Pesquisar...'
                        placeholderTextColor={'#C1C1C1'}
                    />
                </View> */}
        </View>

        {!errorMessage && isLoading ? (
          <SkeletonPlaceHolderPodcast />
        ) : (
          <Animated.FlatList
            data={episodes}
            keyExtractor={(item) => item.key}
            contentContainerStyle={{
              padding: 10,
              paddingBottom: 80,
            }}
            removeClippedSubviews={false}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            getItemLayout={(data, index) => ({ length: 175, offset: 175 * index, index })}
            renderItem={({ item, index }) => {
              return <EpisodeCard item={item} key={index} DATA={DATA} navigation={navigation} />
            }}
          />
        )}
      </Pressable>
    </SafeAreaView>
  )
}

export default EpisodeList
