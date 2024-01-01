import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../navbar.css';
import { faCartShopping, faCog, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Services/authContext';
import { Button } from 'react-bootstrap';
import userService from '../Services/users'

export const Navbar = () => {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate()
    

    const handleLogOut = async () => {
        userService.logOut()
        logout()
        navigate('/')
    };
  
  return (
    <div className="navbar">
      <div className="link">
        {isLoggedIn && (
        <>
        <Link to="/checkout">
            <FontAwesomeIcon icon={faCartShopping} className="icon" />
        </Link>
        
        <Link to={''}>
            <FontAwesomeIcon icon={faUser} className="icon" />
        </Link>
        
        <Link to={''}>
            <FontAwesomeIcon icon={faCog} className="icon" />
        </Link>
        
        <Button variant="primary" onClick={handleLogOut}>
            Log Out
        </Button>
        </>

        )}
      </div>
    </div>
  );
};