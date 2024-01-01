import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../Services/authContext';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthenticationWrapper = ({ children }: any) => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect logic based on isLoggedIn status
    if (!isLoggedIn && location.pathname !== '/auth/login' && location.pathname !== '/' && location.pathname !== '/auth/register') {
      navigate('/auth/login');
    }
  }, [isLoggedIn, navigate, location.pathname]);

  return <React.Fragment>{children}</React.Fragment>;
};

export default AuthenticationWrapper;
