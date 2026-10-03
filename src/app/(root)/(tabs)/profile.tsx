import { useAuth, useUser } from '@clerk/expo'
import { useRouter } from 'expo-router'
import { Alert, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Profile = () => {

  const {user} = useUser()
  const {signOut} = useAuth()
  const router = useRouter()


  const handleSignout = async ()=>{
    Alert.alert(
      "Sign out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Sign out",
          style: "destructive",
          onPress: async () => {
            await signOut()
            router.replace('/sign-in')
          }
        }
      ]
    )

  }
  return (
    <SafeAreaView className={`flex-1 bg-brand-body edged={["top"]}`}>

      <TouchableOpacity >
        <Text onPress={handleSignout}>Log out</Text>
      </TouchableOpacity>

    </SafeAreaView>
  )
}

export default Profile