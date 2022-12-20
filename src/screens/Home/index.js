import { View, Text, ScrollView } from 'react-native'
import { Favourite, RecentlyPlayed } from '../../components/UI'
// import { ScrollView } from 'react-native-gesture-handler'

const Home = () => {
  return (
    <ScrollView style={{ padding: 10, backgroundColor: '#fff', paddingBottom: 30 }}>
      <RecentlyPlayed />
      <Favourite />
    </ScrollView>
  )
}

export default Home
