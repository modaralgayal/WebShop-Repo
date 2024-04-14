import React, { useState, useEffect, useContext } from 'react'
import productService from '../Services/products'
import Product from '../Components/product'
import './shop.css'
import { Text, Drawer, Button, Slider } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { AuthContext } from '../Services/authContext'

interface ProductInt {
  _id: string
  name: string
  price: number
  icon: string
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<ProductInt[]>([])
  // @ts-ignore
  const { isLoggedIn, logout } = useContext(AuthContext)
  const [opened, { open, close }] = useDisclosure(false)
  const [value, setValue] = useState(50)
  const [endValue, setEndValue] = useState(50)
  const [filteredProducts, setFilteredProducts] = useState<ProductInt[]>([])

  console.log('Checking in shop', isLoggedIn)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts: ProductInt[] = await productService.getAll()
        setProducts(fetchedProducts)
        setFilteredProducts(fetchedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    setFilteredProducts(products.filter(product => product.price <= endValue))
  }, [endValue, products])

  const handleFilter = () => {
    close()
    setFilteredProducts(products.filter(product => product.price <= endValue))
  }

  const handleCancel = () => {
    close()
    setEndValue(250)
    setFilteredProducts(products)
  }

  return (
    <div className="shop">
      <Drawer
        offset={8}
        radius="md"
        opened={opened}
        onClose={close}
        title="Filters"
      >
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
          style={{ top: '95px' }}
          size="lg"
          onClick={handleFilter}
        >
          {' '}
          Filter{' '}
        </Button>
        <Button
          variant="outline"
          radius="xs"
          style={{ top: '95px', left: '15px' }}
          size="lg"
          onClick={handleCancel}
        >
          {' '}
          Cancel{' '}
        </Button>
      </Drawer>

      <Button
        onClick={open}
        size="md"
        style={{ position: 'absolute', top: '25px', left: '50px' }}
      >
        {' '}
        Filter Selection{' '}
      </Button>

      <div className="products">
        {filteredProducts.map(product => (
          <Product
            key={product._id.toString()}
            name={product.name}
            price={product.price}
            imageFilename={product.icon}
            id={product._id.toString()}
          />
        ))}
      </div>
    </div>
  )
}

export default Shop