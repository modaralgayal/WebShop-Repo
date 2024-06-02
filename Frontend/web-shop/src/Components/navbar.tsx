import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './navbar.css'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../Services/authContext'
import { Group, Button, Slider, Text, Drawer } from '@mantine/core'
import userService from '../Services/users'
import { useToken } from '../Services/currentUser'
import { useState } from 'react'
import { useDisclosure } from '@mantine/hooks'

interface ProductInt {
  _id: string
  name: string
  price: number
  icon: string
}

export const Navbar = () => {
  const { isLoggedIn, logout, setFilteredAmount } = useContext(AuthContext) // Add setFilteredAmount from context
  const [opened, { open, close }] = useDisclosure(false)
  const navigate = useNavigate()
  const { clearToken } = useToken()
  const [value, setValue] = useState(50)
  const [endValue, setEndValue] = useState(50)

  const handleLogOut = async () => {
    userService.logOut()
    logout()
    clearToken()
    navigate('/')
  }

  const handleFilter = () => {
    close()
    setFilteredAmount(endValue) // Set the filtered amount in context
  }

  const handleCancel = () => {
    close()
    setFilteredAmount(250)
  }

  return (
    <div className="navbar">
      <div className="shop-name"> Modar's Webshop </div>
      {isLoggedIn && (
        <>
          <Drawer offset={8} radius="md" opened={opened} onClose={close}>
            <Text ta="center"> Select Price Range </Text>
            <Slider
              value={value}
              onChange={setValue}
              onChangeEnd={setEndValue}
              style={{ top: '75px' }}
              size="lg"
              color="red"
              min={0}
              max={250}
              labelAlwaysOn
            />
            <Button
              variant="filled"
              color="rgba(0, 0, 0, 1)"
              radius="xs"
              size="lg"
              onClick={handleFilter}
            >
              Filter
            </Button>
            <Button
              variant="outline"
              radius="xs"
              size="lg"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Drawer>

          <Button onClick={open} size="xl" className="filter-selection-button">
            Filter Selection
          </Button>

          <div className="buttonGroup">
            <Button
              className="shopping-cart-button"
              size="xl"
              onClick={() => navigate('/checkout')}
            >
              <FontAwesomeIcon
                icon={faCartShopping}
                className="icon"
                style={{ width: '50px' }}
                id="shopping cart"
              />
            </Button>


            <Button
              onClick={handleLogOut}
              variant="filled"
              color="rgba(214, 21, 21, 1)"
              size="xl"
              className="logout-button"
            >
              Logout
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
