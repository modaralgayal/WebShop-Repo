import React, { useState, useEffect, useContext } from 'react'
import productService from '../Services/products'
import Product from '../Components/product'
import './shop.css'
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

  console.log('Checking in shop', isLoggedIn)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts: ProductInt[] = await productService.getAll()
        setProducts(fetchedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="shop">
      <div className="shopTitle">
        <h1> Modar's Shop </h1>
      </div>

      <div className="products">
        {products.map(product => (
          <Product
            id={product._id.toString()}
            name={product.name}
            price={product.price}
            imageFilename={product.icon}
          />
        ))}
      
      </div>
    </div>
  )
}

export default Shop
