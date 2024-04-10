import { useState, useEffect } from 'react'
import {
  TextInput,
  PasswordInput,
  Fieldset,
  Container,
  Button,
} from '@mantine/core'
import userService from '../Services/users'

const CreateUserForm = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [caughtError, setError] = useState('')

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

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    try {
      await userService.create({ email, username, password })
      //console.log('trying to create')
      setEmail('')
      setUsername('')
      setPassword('')
    } catch (error: any) {
      console.error('User creation failed:', error)
      setError(error.toString())
    }
  }

  return (
    <div className='flex-container'>
      <Container size={500} my={150}>
        <Fieldset legend="Registration" variant="filled" radius="lg">
          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            value={email}
            onChange={event => setEmail(event.currentTarget.value)}
          />
          <TextInput
            label="Username"
            placeholder="Your Username"
            required
            value={username}
            onChange={event => setUsername(event.currentTarget.value)}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            value={password}
            onChange={event => setPassword(event.currentTarget.value)}
          />
          <Button
            onClick={e => handleSubmit(e)}
            variant="filled"
            color="rgba(25, 91, 255, 1)"
            size="lg"
            mt={20}
          >
            Create User
          </Button>
        </Fieldset>
      </Container>

    </div>
  )
}

export default CreateUserForm
