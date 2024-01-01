import { useState, useEffect, useContext } from 'react';
import userService from '../Services/users';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../Services/authContext';
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [caughtError, setError] = useState('');
    // @ts-ignore
    const { isLoggedIn, login, logout } = useContext(AuthContext);
    const navigate = useNavigate()

    useEffect(() => {
        // Check if the user is logged in when the Login component mounts
        if (isLoggedIn) {
            console.log('check inside it if its going at the wrong time, true expected:',isLoggedIn)
          // Log out the user when they navigate to the login page while logged in
          userService.logOut();
          logout();
          console.log('User logged out');
        }
      }, []);

    useEffect(() => {
        let timer: any;
        if (caughtError) {
            timer = setTimeout(() => {
                setError('');
            }, 7500); // 7.5 seconds
        }

        return () => {
            clearTimeout(timer);
        };
    }, [caughtError]);

    const handleLogin = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
          const user = await userService.login({ email, password });
          login()
          console.log('Logged in:', user);
          return navigate("/shop")
        } catch (error: any) {
            console.log('Login Failed: ', error)
            return setError(error.toString());
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
                            {caughtError && (
                                <Row className="mb-3">
                                    <Col>
                                        <Alert variant="danger">{caughtError}</Alert>
                                    </Col>
                                </Row>
                            )}
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