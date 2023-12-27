import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import Login from './Pages/loginPage';
import HomePage from './Pages/home';
import CreateUserForm from './Pages/register';


const App = () => {

  return (
    <Router>
      <div>
        <Link to="/"></Link>
        <Link to="/auth/login"></Link>
        <Link to="/auth/register"></Link>
      </div>
      <Routes>
      <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<CreateUserForm />} />
      </Routes>
    </Router>
  );
};

export default App;
