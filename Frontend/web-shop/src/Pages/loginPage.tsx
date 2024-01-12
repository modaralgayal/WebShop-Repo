import { useState, useEffect, useContext } from 'react'
import userService from '../Services/users'
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
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
    <div className="App Header d-flex justify-content-center align-items-center vh-100">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <h2>Login</h2>
            <Form>
              <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  id="email"
                  type="email"
                  value={email}
                  placeholder="example@email.com"
                  size="lg"
                  onChange={e => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  id="password"
                  type="password"
                  value={password}
                  placeholder="password"
                  size="lg"
                  onChange={e => setPassword(e.target.value)}
                />
              </Form.Group>
              {caughtError && (
                <Row className="mb-3">
                  <Col>
                    <Alert variant="danger">{caughtError}</Alert>
                  </Col>
                </Row>
              )}
              <Button variant="primary" type="submit" onClick={handleLogin}>
                Log In
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login
