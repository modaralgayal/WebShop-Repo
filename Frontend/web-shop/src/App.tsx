import {
  BrowserRouter as Router,
  Routes, Route, Link, Navigate
} from 'react-router-dom'
import { useContext } from 'react';
import Login from './Pages/loginPage';
import HomePage from './Pages/home';
import Shop from './Pages/shop';
import { AuthContext } from './Services/authContext';
import CreateUserForm from './Pages/register'
import { Navbar } from './Components/navbar';
import { AuthProvider } from './Services/authContext';
import { CheckOut } from './Pages/checkout';
import AuthenticationWrapper from './Components/authenticationwrapper';


const App = () => {
  const { isLoggedIn } = useContext(AuthContext);
  console.log('Checking from app: ',isLoggedIn)

  return (
    <AuthProvider>
      <Router>
        <AuthenticationWrapper>
        <Navbar />
      <div> 
        <Link to="/"></Link>
        <Link to="/auth/login"></Link>
        <Link to="/auth/register"></Link>
        <Link to="/auth/logout"></Link>
        <Link to="/shop"></Link>
        <Link to="/checkout"></Link>
      </div>
       <Routes>
        {/* Redirect to different routes based on the isLoggedIn status */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<CreateUserForm />} />
        <Route path="/shop" element={isLoggedIn ? <Navigate to="/shop" /> : <Shop />}/>
        <Route path="/checkout" element={isLoggedIn ? <Navigate to="/checkout" /> : <CheckOut />} />
      </Routes>
      </AuthenticationWrapper>
    </Router>
    </AuthProvider>
  );
};

export default App;
