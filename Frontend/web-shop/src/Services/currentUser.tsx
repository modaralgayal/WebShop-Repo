import React, { createContext, useState, useContext, ReactNode } from 'react'

// Define the token context type
type TokenContextType = {
  token: string
  setAuthToken: (newToken: string) => void
  clearToken: () => void
}

// Create the context
const TokenContext = createContext<TokenContextType | undefined>(undefined)

// Custom hook to use the token context
export const useToken = () => {
  const context = useContext(TokenContext)
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider')
  }
  return context
}

// Token provider component
type TokenProviderProps = {
  children: ReactNode // Use ReactNode for children
}

export const TokenProvider: React.FC<TokenProviderProps> = ({
  children,
}: TokenProviderProps) => {
  // State to hold the token
  const [token, setToken] = useState<string>('')

  // Function to set the token
  const setAuthToken = (newToken: string) => {
    setToken(newToken)
  }

  // Function to clear or empty the token
  const clearToken = () => {
    setToken('')
  }

  const contextValue: TokenContextType = {
    token,
    setAuthToken,
    clearToken,
  }

  return (
    <TokenContext.Provider value={contextValue}>
      {children}
    </TokenContext.Provider>
  )
}
