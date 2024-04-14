import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './navbar.css'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../Services/authContext'
import { Button } from '@mantine/core'
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
        <div className="shop-name"> Modar's Webshop </div>
        {isLoggedIn && (
          <>
            <div className="other-links">
              <Link to="/checkout">
                <FontAwesomeIcon
                  icon={faCartShopping}
                  className="icon"
                  id="shopping cart"
                />
              </Link>

              <Button
                onClick={handleLogOut}
                variant="filled"
                color="rgba(214, 21, 21, 1)"
                size="md"
              >
                {' '}
                Logout{' '}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
