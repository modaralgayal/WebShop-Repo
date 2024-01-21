import { Button, Container, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

const HomePage = () => {
  const navigate = useNavigate()

  const handleCreateUser = () => {
    navigate('/auth/register')
    console.log('Create user clicked')
  }

  const handleLogin = () => {
    navigate('/auth/login')
    console.log('Login clicked')
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
        <Card
          className="p-5 border-5"
          style={{ backgroundColor: 'darkslategray', border: '2px solid' }}
        >
          <Card.Body className="text-center">
            <h1 style={{ color: 'white' }}>Welcome To My Webshop</h1>
            <div className="d-flex justify-content-center">
              <Button
                variant="primary"
                onClick={handleCreateUser}
                className="mb-3 mx-2"
                style={{ minWidth: '120px' }}
              >
                Create User
              </Button>
              <Button
                variant="success"
                onClick={handleLogin}
                className="mb-3 mx-2"
                style={{ minWidth: '120px' }}
              >
                Login
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
      <div
        style={{
          width: '100%',
          borderTop: '1px solid #ccc',
          textAlign: 'center',
          position: 'absolute',
          bottom: '0',
          padding: '20px',
        }}
      >
      </div>
    </div>
  )
}

export default HomePage
