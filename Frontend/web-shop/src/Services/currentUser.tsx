import React, { createContext, useState, useContext, ReactNode } from 'react'

type TokenContextType = {
  token: string
  setAuthToken: (newToken: string) => void
  clearToken: () => void
}

const TokenContext = createContext<TokenContextType | undefined>(undefined)

export const useToken = () => {
  const context = useContext(TokenContext)
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider')
  }
  return context
}

type TokenProviderProps = {
  children: ReactNode
}

export const TokenProvider: React.FC<TokenProviderProps> = ({
  children,
}: TokenProviderProps) => {
  const [token, setToken] = useState<string>('')

  const setAuthToken = (newToken: string) => {
    setToken(newToken)
  }

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
