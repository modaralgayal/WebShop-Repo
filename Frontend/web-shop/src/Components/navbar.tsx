import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../navbar.css'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../Services/authContext'
import { Button } from 'react-bootstrap'
import userService from '../Services/users'
import { useToken } from '../Services/currentUser'

export const Navbar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const { clearToken } = useToken()

  const handleLogOut = async () => {
    userService.logOut()
    logout()
    clearToken()
    navigate('/')
  }

  return (
    <div className="navbar">
      <div className="link">
        {isLoggedIn && (
          <>
            <Link to="/checkout">
              <FontAwesomeIcon icon={faCartShopping} className="icon" id="shopping cart" />
            </Link>

            <Button variant="primary" onClick={handleLogOut}>
              Log Out
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
