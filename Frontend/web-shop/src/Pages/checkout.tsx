import { useState, useEffect } from 'react'
import { useToken } from '../Services/currentUser'
import userService from '../Services/users'
import productService from '../Services/products'
import { CartItem } from './cartItem'

export const CheckOut = () => {
  const [productData, setProductData] = useState<{ [key: string]: any }>({})
  const [cartItemChanged, setCartItemChanged] = useState(false) // New state to track changes

  const { token } = useToken()

  const handleCartItemChanged = () => {
    setCartItemChanged(prevState => !prevState) // Trigger a change in CheckOut component
  }

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        console.log('Running')
        const response = await userService.currentUserInfo(token)
        const basket = response.basket || []

        const allProducts = await productService.getAll()

        const productsById = allProducts.reduce(
          (acc: { [key: string]: any }, product: any) => {
            acc[product._id] = product
            return acc
          },
          {},
        )

        const count = basket.reduce(
          (acc: { [key: string]: any }, productId: string | number) => {
            acc[productId] = (acc[productId] || 0) + 1
            return acc
          },
          {},
        )

        const basketWithData = Object.keys(count).reduce(
          (acc: { [key: string]: any }, productId: string | number) => {
            acc[productId] = {
              ...productsById[productId],
              count: count[productId],
            }
            return acc
          },
          {},
        )

        setProductData(basketWithData)
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }

    fetchCurrentUser()
  }, [cartItemChanged]) // Include cartItemChanged in the dependency array

  return (
    <div className="cart">
      <h2>Your Items</h2>
      <ul>
        {Object.entries(productData).map(([productId, productDetails]: any) => (
          <CartItem
            key={productId}
            data={productDetails}
            onCartItemChanged={handleCartItemChanged}
          />
        ))}
      </ul>
    </div>
  )
}
