import { createContext, useState, ReactNode } from 'react'

type AuthContextType = {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
  filteredAmount: number
  setFilteredAmount: (amount: number) => void
}

const initialAuthState: AuthContextType = {
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  filteredAmount: 50,
  setFilteredAmount: () => {},
}

export const AuthContext = createContext<AuthContextType>(initialAuthState)

type Props = {
  children: ReactNode
}

export const AuthProvider = ({ children }: Props) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [filteredAmount, setFilteredAmount] = useState<number>(50)

  const login = () => {
    setIsLoggedIn(true)
  }

  const logout = () => {
    setIsLoggedIn(false)
  }

  const authContextValue: AuthContextType = {
    isLoggedIn,
    login,
    logout,
    filteredAmount,
    setFilteredAmount,
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  )
}
