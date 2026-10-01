import { useAuth } from '@clerk/expo'
import { Redirect, Stack } from 'expo-router'

const RootLayout = () => {
  const {isSignedIn, isLoaded} = useAuth()

  if(!isLoaded) return null

  if(isSignedIn){
    return <Redirect href={'/'}/>
  }

  return (
    <Stack  screenOptions={{headerShown: false}}/>
  )
}

export default RootLayout