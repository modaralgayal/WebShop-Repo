import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useContext } from 'react'
import Login from './Pages/loginPage'
import HomePage from './Pages/home'
import Shop from './Pages/shop'
import { AuthContext } from './Services/authContext'
import CreateUserForm from './Pages/register'
import { Navbar } from './Components/navbar'
import { AuthProvider } from './Services/authContext'
import { TokenProvider } from './Services/currentUser'
import { CheckOut } from './Pages/checkout'
import { Payment } from './stripeComponents/payment'
import AuthenticationWrapper from './Components/authenticationwrapper'
import { Completion } from './stripeComponents/completion'
import { MantineProvider } from '@mantine/core'

const App = () => {
  const { isLoggedIn } = useContext(AuthContext)
  console.log('Checking from app: ', isLoggedIn)

  return (
    <MantineProvider>
      <TokenProvider>
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
                <Link to="/payment"></Link>
                <Link to="/completion"></Link>
              </div>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<CreateUserForm />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/checkout" element={<CheckOut />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/completion" element={<Completion />} />
              </Routes>
            </AuthenticationWrapper>
          </Router>
        </AuthProvider>
      </TokenProvider>
    </MantineProvider>
  )
}

export default App
