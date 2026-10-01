import { CodeFormValues, codeSchema, SignupFormValues, signupSchema } from '@/lib/schema/auth'
import { useAuth, useSignUp } from '@clerk/expo'
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'


const SignUp = () => {
  const {signUp, errors, fetchStatus} = useSignUp()
  const {isSignedIn} = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')

  const isLoading = fetchStatus === 'fetching'

  const {control, handleSubmit, formState: {errors: formErrors}} = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: {firstName: "", lastName: "", email: "", password: ""}
  })

  const {control: codeControl, handleSubmit: handleCodeSubmit, formState: {errors: codeErrors}} = useForm<CodeFormValues>({
    resolver: zodResolver(codeSchema),
    mode: "onBlur",
    defaultValues: {code: ""}
  })

  const onSignUpPress = async (data: SignupFormValues) => {

    setEmail(data.email)

    const {error,} = await signUp.password({
      firstName: data.firstName,
      lastName: data.lastName,
      emailAddress: data.email,
      password: data.password
    })

    if(error){
      console.error(JSON.stringify(error, null, 2))
      return
    }
    if(!error){
      await signUp.verifications.sendEmailCode()
    }
  }
  const onVerifyCodePress = async (data: CodeFormValues) => {

  }

  if(signUp.status === "missing_requirements" && signUp.unverifiedFields.includes("email_address")
    && signUp.missingFields.length === 0) {

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
            <Text className="text-brand-text-muted text-base mb-8">
              we sent a code to {email}.
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
                const {error} = await signUp.verifications.sendEmailCode()
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
                await signUp.reset()
              }}
            >
              <Text className='text-brand-blue font-semibold text-center'>Start over</Text>
            </TouchableOpacity>

           
            
          </View>

        </KeyboardAvoidingView>

      )

  }
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
              Create account
          </Text>
          <Text className="text-brand-text-muted text-base mb-8">
            Track your money, powered by AI
          </Text>
          <View className='flex-row gap-3 mb-1'>
            <Controller
              control={control}
              name='firstName'
              render={({field: {onChange, value}}) => (
                <TextInput 
                  placeholder='First Name'
                  onChangeText={onChange}
                  value={value}
                  className="flex-1 border border-[#e8e6df] bg-white rounded-xl px-4
                     py-3 text-[1A1D26]"
                     placeholderTextColor='#A8A8D96'
                  
                />
              )}
            />

            <Controller
                control={control}
                name='lastName'
                render={({field: {onChange, value}}) => (
                  <TextInput 
                    placeholder='Last Name'
                    onChangeText={onChange}
                    value={value}
                    className="flex-1 border border-[#e8e6df] bg-white rounded-xl px-4
                      py-3 text-[1A1D26]"
                      placeholderTextColor='#A8A8D96'
                    
                  />
                )}  
              
              /> 
             
          </View>
          {
            (formErrors.firstName || formErrors.lastName) && (
              <Text className='text-brand-coral text-sm mb-4'>
                {formErrors.firstName?.message || formErrors.lastName?.message}
              </Text>
            )
          }

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
              errors.fields.emailAddress && (
                <Text className='text-brand-coral text-sm mb-4'>
                  {errors.fields.emailAddress.message}
                </Text>
              )
            }

          <Controller
            control={control}
            name='password'
            
            render={({field: {onChange, value}}) => (
              <TextInput 
                secureTextEntry={true}
                placeholder='Password'
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
              onPress={handleSubmit(onSignUpPress)}
            >
              {
                isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className='text-white font-semibold font-base'>Sign Up</Text>
                )
              }
            </TouchableOpacity>

            <View className="flex-row justify-center">
              <Text className="text-brand-text-muted">Already have an account?{" "}
                <Link href="/sign-in">
                  <Text className='text-brand-blue font-semibold'>Sign In</Text>
                </Link>
              </Text>
            </View>

            <View nativeID='clerk-captcha '/>
          
        </View>
    </KeyboardAvoidingView>
  )
}

export default SignUp