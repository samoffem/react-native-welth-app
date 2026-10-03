import { CodeFormValues, codeSchema, SigninFormValues, signinSchema } from '@/lib/schema/auth'
import { useAuth, useSignIn } from '@clerk/expo'
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useRouter } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { useState } from 'react'
import { Controller, useForm, } from 'react-hook-form'
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'

const SignIn = () => {

  const {signIn, fetchStatus, errors} = useSignIn()
  const {isSignedIn} = useAuth()
  const router = useRouter()
   const [showPassword, setShowPassword] = useState(false)

    const isLoading = fetchStatus === 'fetching'

  const {control, handleSubmit, formState: {errors: formErrors}} = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: ""}
  })
  
  const {control: codeControl, handleSubmit: handleCodeSubmit, formState: {errors: codeErrors}} = useForm<CodeFormValues>({
    resolver: zodResolver(codeSchema),
    mode: "onBlur",
    defaultValues: {code: ""}
  })

  const onSigninPress = async (values: SigninFormValues)=>{
    console.log("Signing in with values:", values)


    const {error} = await signIn.password({
        emailAddress: values.email,
        password: values.password
    })
    if(error) return

    if(signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({session, decorateUrl})=>{
          if(session?.currentTask) return
          const url = decorateUrl('/')
          router.replace(url as any)
        }
      })
    }else if(signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        factor=> factor.strategy === "email_code"
      )
      if(emailCodeFactor) {
        await signIn.mfa.sendEmailCode()
      }
    }else{
      console.error("Sign in attempt not complete")
    }
  }

  const onVerifyCodePress = async ({code}: {code: string}) => {
    await signIn.mfa.verifyEmailCode({code})

    if(signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({session, decorateUrl})=>{
          if(session?.currentTask) return;
          const url = decorateUrl("/")
          router.replace(url as any)
        }
      })
    }else{
      console.log("signup attempt not complete")
    }


  }
  if(signIn.status === "needs_client_trust") {
  
        return (
          <KeyboardAvoidingView
      
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className='flex-1 bg-brand-body'
          >
           <View className='flex-1 justify-center px-6 -mt-16'>
              <Image 
                source={require('@/assets/images/welth.png')}
                className='w-32 h-16 mb-8'
                resizeMode='contain'
              />
              <Text className="text-3xl font-bold text-[1A1D26] mb-2 leading-tight">
                 Verify you account
              </Text>
              
  
              <View className='flex-row gap-3 mb-1'>
              <Controller
                control={codeControl}
                name='code'
                render={({field: {onChange, value}}) => (
                  <TextInput 
                    placeholder='Code'
                    onChangeText={onChange}
                    value={value}
                    className="flex-1 border border-[#e8e6df] bg-white rounded-xl px-4
                       py-3 text-[1A1D26]"
                       placeholderTextColor='#A8A8D96'
                       autoCapitalize='none'
                    
                  />
                )}
              />
              {
                (codeErrors.code) && (
                  <Text className='text-brand-coral text-sm mb-4'>
                    {codeErrors.code?.message}
                  </Text>
                )
              }
              {
                errors.fields.code && (
                  <Text className='text-brand-coral text-sm mb-4'>
                    {errors.fields.code.message}
                  </Text>
                )
              }
              </View>
  
              <TouchableOpacity
                className="w-full bg-brand-blue py-4 rounded-xl items-center my-4"
                onPress={handleCodeSubmit(onVerifyCodePress)}
              >
                {
                  isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className='text-white font-semibold font-base'>Verify</Text>
                  )
                }
              </TouchableOpacity>
              <TouchableOpacity
                className="py-2"
                onPress={async () => {
                  const {error} = await signIn.mfa.sendEmailCode()
                  if(error){
                    console.error(JSON.stringify(error, null, 2))
                    return
                  }
                }}
              >
                <Text className='text-brand-blue font-semibold text-center'>Resend code</Text>
              </TouchableOpacity>
  
              <TouchableOpacity
                className="py-2"
                onPress={async () => {
                  await signIn.reset()
                }}
              >
                <Text className='text-brand-blue font-semibold text-center'>Start over</Text>
              </TouchableOpacity>
  
             
              
            </View>
  
          </KeyboardAvoidingView>
  
        )
  
    }
  return (
    (
        <KeyboardAvoidingView
        
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className='flex-1 bg-brand-body'
        >
            <View className='flex-1 justify-center px-6 -mt-16'>
              <Image 
                source={require('@/assets/images/welth.png')}
                className='w-32 h-16 mb-8'
                resizeMode='contain'
              />
              <Text className="text-3xl font-bold text-[1A1D26] mb-2 leading-tight">
                 Welcome back
              </Text>
              <Text className="text-brand-text-muted text-base mb-8">
                Sign in to your account
              </Text>
  
              <Controller
                control={control}
                name='email'
                render={({field: {onChange, value}}) => (
                  <TextInput 
                    placeholder='Email'
                    onChangeText={onChange}
                    value={value}
                    className="border border-[#e8e6df] mb-1 bg-white rounded-xl px-4
                      py-3 text-[1A1D26]"
                      placeholderTextColor='#A8A8D96'
                      autoCapitalize='none'
                    
                  />
                )}  
              /> 
               {
                (formErrors.email) && (
                  <Text className='text-brand-coral text-sm mb-4'>
                    {formErrors.email?.message}
                  </Text>
                )}
                {
                  errors.fields.identifier && (
                    <Text className='text-brand-coral text-sm mb-4'>
                      {errors.fields.identifier.message}
                    </Text>
                  )
                }
    
              <Controller
                control={control}
                name='password'
                
                render={({field: {onChange, value}}) => (
                  <View className="flex-row items-center border border-[#e8e6df] mb-1 bg-white rounded-xl">
                    <TextInput
                      secureTextEntry={!showPassword}
                      placeholder='Password'
                      onChangeText={onChange}
                      value={value}
                      className="flex-1 py-3 pl-4 text-[1A1D26]"
                      placeholderTextColor='#A8A8D96'
                      autoCapitalize='none'
                    />
                    <TouchableOpacity
                      className="px-4 py-3"
                      onPress={() => setShowPassword((visible) => !visible)}
                      accessibilityRole="button"
                      accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <SymbolView
                        name={{
                          ios: showPassword ? 'eye.slash' : 'eye',
                          android: showPassword ? 'visibility_off' : 'visibility',
                          web: showPassword ? 'visibility_off' : 'visibility',
                        }}
                        size={20}
                        tintColor="#7A7F8C"
                      />
                    </TouchableOpacity>
                  </View>
                )}  
              /> 
               {
                (formErrors.password) && (
                  <Text className='text-brand-coral text-sm mb-4'>
                    {formErrors.password?.message}
                  </Text>
                )}
                {
                  errors.fields.password && (
                    <Text className='text-brand-coral text-sm mb-4'>
                      {errors.fields.password.message}
                    </Text>
                  )
                }
    
                <TouchableOpacity
                  className="w-full bg-brand-blue py-4 rounded-xl items-center my-4"
                  onPress={handleSubmit(onSigninPress)}
                >
                  {
                    isLoading ? ( 
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className='text-white font-semibold font-base'>Sign In</Text>
                    )
                  }
                </TouchableOpacity>
    
                <View className="flex-row justify-center">
                  <Text className="text-brand-text-muted">Don't have an account?{" "}
                    <Link href="/sign-up">
                      <Text className='text-brand-blue font-semibold'>Sign Up</Text>
                    </Link>
                  </Text>
                </View>
    
              
            </View>
        </KeyboardAvoidingView>
      )
    )
}

export default SignIn