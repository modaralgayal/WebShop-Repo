import { createContext, useState, ReactNode } from 'react'

type AuthContextType = {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

const initialAuthState: AuthContextType = {
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
}

export const AuthContext = createContext<AuthContextType>(initialAuthState)

type Props = {
  children: ReactNode
}

export const AuthProvider = ({ children }: Props) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  const login = () => {
    // Implement your login logic
    setIsLoggedIn(true)
  }

  const logout = () => {
    // Implement your logout logic
    setIsLoggedIn(false)
  }

  const authContextValue: AuthContextType = {
    isLoggedIn,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  )
}
