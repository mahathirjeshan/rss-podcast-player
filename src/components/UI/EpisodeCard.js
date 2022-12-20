import { LinearGradient } from 'expo-linear-gradient'
import { Animated, Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { scaleAnimation } from '../../animations/scale'
import { useRef, useState } from 'react'
import { weekDay, secondsToHms } from '../../helpers'

export default function EpisodeCard({ item, navigation, DATA }) {
  const [itemAnimate, setItemAnimate] = useState(null)
  const animateX = useRef(new Animated.Value(1)).current

  return (
    <Animated.View
      style={{
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0)',
        transform: [{ scale: itemAnimate == item.key ? animateX : 1 }],
      }}
    >
      <Pressable
        onPressIn={() => setItemAnimate(item.key)}
        onPress={() => {
          scaleAnimation(animateX, () => {
            navigation.navigate('Episode', {
              episodeObject: item.episodeObject,
              episodeName: item.episodeObject.title,
              episodeID: item.episodeID,
              trackLength: DATA.length,
              episodeImage: item.image,
            })
          })
        }}
      >
        {/* <ImageBackground
          imageStyle={{ borderRadius: 12, resizeMode: 'center' }}
          style={styles.imageBackground}
          source={{ uri: item.image }}
        >
          <LinearGradient
            locations={[0, 0.8]}
            colors={['transparent', 'rgba(249, 49, 10, .9)']}
            style={styles.episodeContainer}
          > */}
        <View
          style={{
            height: '100%',
            flexDirection: 'row',
            paddingBottom: 5,
            backgroundColor: 'white',
            // marginBottom: 10,
            padding: 10,
            borderRadius: 12,
            flex: 1,
            minHeight: 100,
          }}
        >
          <View style={{ flex: 2, justifyContent: 'flex-start', marginRight: 0 }}>
            <Image
              style={styles.albumImage}
              source={{
                uri: item.image || 'https://reactnative.dev/img/tiny_logo.png',
              }}
            />
          </View>
          <View style={{ flex: 5, justifyContent: 'flex-start' }}>
            <Text
              numberOfLines={2}
              style={{ fontSize: 17, fontWeight: '700', color: 'black', marginBottom: 10 }}
            >
              {item.episodeObject.title || `Episode ${item.episodeID}`}
            </Text>
            <Text style={{ fontSize: 12, color: 'black' }}>
              {weekDay(item.episodeObject.published)}
            </Text>
            <Text style={{ fontSize: 12, color: 'black' }}>
              {secondsToHms(item.episodeObject.itunes.duration)}
            </Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'flex-end', padding: 10 }}>
            <AntDesign name="play" size={36} color="red" />
          </View>
        </View>
        {/* </LinearGradient>
        </ImageBackground> */}
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  imageBackground: {
    height: 170,
    backgroundColor: 'black',
    borderRadius: 12,
  },
  episodeContainer: {
    padding: 10,
    height: '100%',
    borderRadius: 12,
  },
  albumImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    resizeMode: 'cover',
  },
})
