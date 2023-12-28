import { useState } from 'react';
import userService from '../Services/users';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleLogin = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
          const user = await userService.login({ email, password });
          console.log('Logged in:', user);
        } catch (error) {
          console.error('Login failed:', error);
        }
    };
    
    return (
        <div className="App Header d-flex justify-content-center align-items-center vh-100">
            <Container>
                <Row className="justify-content-center">
                    <Col md={6}>
                        <h2>Login</h2>
                        <Form onSubmit={handleLogin}>
                            <Form.Group>
                                <Form.Label>Email:</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    placeholder="example@email.com"
                                    size='lg'
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Password:</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    placeholder="password"
                                    size='lg'
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Login
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Login