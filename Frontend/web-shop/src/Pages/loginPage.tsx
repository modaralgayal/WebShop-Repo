import { useState, useEffect, useContext } from 'react'
import userService from '../Services/users'
import {
  TextInput,
  PasswordInput,
  Fieldset,
  Button,
} from '@mantine/core'
import '@mantine/core/styles.css'
import './login.css'
import { AuthContext } from '../Services/authContext'
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
    e.preventDefault();
    try {
        const user = await userService.login({ email, password });
        const userToken = user.authentication.sessionToken;
        localStorage.setItem('userToken', userToken);
        setAuthToken(userToken); 
        login();
        return navigate('/shop');
    } catch (error: any) {
        console.log('Login Failed: ', error);
        return setError(error.toString());
    }
}


  return (
    <Fieldset
      legend={<span style={{ fontSize: '24px' }}>Personal information</span>}
      variant="filled"
      className="container"
      radius="md"
    >
      <TextInput
        label={<span style={{ fontSize: '24px' }}>Email</span>}
        placeholder="your@email.com"
        required
        value={email}
        onChange={event => setEmail(event.currentTarget.value)}
        style={{ width: '100%', padding: '25px' }}
      />
      <PasswordInput
        label={<span style={{ fontSize: '24px' }}>Password</span>}
        placeholder="Your password"
        required
        mt="md"
        value={password}
        onChange={event => setPassword(event.currentTarget.value)}
        style={{ width: '100%', padding: '25px' }} // Adjust width here
      />
      <Button
        onClick={e => handleLogin(e)}
        variant="filled"
        color="rgba(25, 91, 255, 1)"
        size="xl"
        style={{ width:"20%" }}
      >
        Log In
      </Button>
    </Fieldset>
  )
}

export default Login
