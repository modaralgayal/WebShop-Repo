import { useState } from 'react';
import userService from '../Services/users';
import { Form, Button } from 'react-bootstrap';


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
        <div>
            <h2>login</h2>
            <Form onSubmit={handleLogin}>
                <Form.Group>
                    <Form.Label>email:</Form.Label>
                    <Form.Control
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>password:</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    login
                </Button>
            </Form>
        </div>
    )
}

export default Login