import { useState, useEffect } from 'react'
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap'
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
      }, 7500) // 7.5 seconds
    }

    return () => {
      clearTimeout(timer)
    }
  }, [caughtError])

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    try {
      await userService.create({ email, username, password })
      // Reset form fields after submission
      console.log('trying to create')
      setEmail('')
      setUsername('')
      setPassword('')
    } catch (error: any) {
      console.error('User creation failed:', error)
      setError(error.toString())
    }
  }

  return (
    <div className="App Header d-flex justify-content-center align-items-center vh-100">
      <Container className="mt-5">
        <Row className="justify-content-md-center">
          <Col md="6">
            <h2>Create User</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formUsername">
                <Form.Label>Username:</Form.Label>
                <Form.Control
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
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
              <Button variant="primary" type="submit">
                Create User
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default CreateUserForm
