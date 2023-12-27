import { Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate()

    const handleCreateUser = () => {
    navigate('/auth/register')
    console.log('Create user clicked');
  };

  const handleLogin = () => {
    navigate('/auth/login')
    console.log('Login clicked');
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md="auto">
          <h1>Welcome</h1>
          <Button variant="primary" onClick={handleCreateUser} className="mr-3">
            Create User
          </Button>
          <Button variant="success" onClick={handleLogin}>
            Login
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
