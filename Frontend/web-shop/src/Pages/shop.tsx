import React, { useState, useEffect, useContext } from 'react'
import productService from '../Services/products'
import Product from '../Components/product'
import './shop.css'
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
  const [opened, { open, close }] = useDisclosure(false)
  const { isLoggedIn, filteredAmount } = useContext(AuthContext)
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
    setFilteredProducts(
      products.filter(product => product.price <= filteredAmount),
    )
  }, [filteredAmount, products])

  return (
    <div className="shop">
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
