import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../Services/authContext'
import { useNavigate, useLocation } from 'react-router-dom'
import userService from '../Services/users'

const AuthenticationWrapper = ({ children }: any) => {
  const { isLoggedIn, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isLoggedIn) {
      // If the user is logged in and tries to access these routes, redirect to login
      if (
        location.pathname !== '/auth/login' &&
        location.pathname !== '/auth/register' &&
        location.pathname !== '/'
      ) {
        userService.logOut()
        logout()
        navigate('/auth/login')
      }
    } else if (isLoggedIn) {
      if (location.pathname === '/auth/register' || location.pathname === '/') {
        userService.logOut()
        logout()
        navigate('/auth/login')
      }
    }
  }, [isLoggedIn, navigate, location.pathname])

  return <React.Fragment>{children}</React.Fragment>
}

export default AuthenticationWrapper