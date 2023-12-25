import React, { useState } from 'react';
import userService from './Services/users';

const App = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const user = await userService.login({ email, password });
      console.log('Logged in:', user);
      // Here, you might want to set authentication state or redirect to another page upon successful login
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login failure, display error messages, etc.
    }
  };

  const handleGetUsers = async () => {
    try {
      const fetchedUsers = await userService.getAll();
      setUsers(fetchedUsers);
      console.log('Fetched users:', fetchedUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // Handle error while fetching users
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>

      <button onClick={handleGetUsers}>Get Users</button>

      <div>
        {users.map((user, index) => (
          <pre key={index}>{JSON.stringify(user, null, 2)}</pre>
        ))}
      </div>
    </div>
  );
};

export default App;
