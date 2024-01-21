import { useState, useEffect, useContext } from 'react'
import userService from '../Services/users'
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from '@mantine/core'
import "../../"
import { AuthContext } from '../Services/authContext'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router'
import { useToken } from '../Services/currentUser'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [caughtError, setError] = useState('')
  // @ts-ignore
  const { isLoggedIn, login, logout } = useContext(AuthContext)
  const { setAuthToken, clearToken } = useToken()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn) {
      console.log(
        'check inside it if its going at the wrong time, true expected:',
        isLoggedIn,
      )
      console.log('Logging out user')
      userService.logOut()
      clearToken()
      logout()
      console.log('User logged out')
    }
  }, [])

  useEffect(() => {
    let timer: any
    if (caughtError) {
      timer = setTimeout(() => {
        setError('')
      }, 7500)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [caughtError])

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    try {
      const user = await userService.login({ email, password })
      console.log(user)
      const userToken = user.authentication.sessionToken
      setAuthToken(userToken)
      login()
      console.log(userToken)
      console.log('Logged in:', user)
      return navigate('/shop')
    } catch (error: any) {
      console.log('Login Failed: ', error)
      return setError(error.toString())
    }
  }

  return (
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput label="Email" placeholder="you@mantine.dev" required />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
        />
        <Button variant="filled" color="rgba(25, 91, 255, 1)" size="lg">Button</Button>
      </Paper>
    </Container>
  )
}

export default Login
