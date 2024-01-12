import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useToken } from '../Services/currentUser'
import userService from '../Services/users'
import productService from '../Services/products'
import { CartItem } from '../Components/cartItem'
import '../Components/cart.css'

export const CheckOut = () => {
  const [productData, setProductData] = useState<{ [key: string]: any }>({})
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [cartItemChanged, setCartItemChanged] = useState<boolean>(false)
  const navigate = useNavigate()
  const { token } = useToken()

  const handleCartItemChanged = () => {
    setCartItemChanged(prevState => !prevState)
  }

  const handleGoToCheckout = () => {
    navigate('/payment', { state: { totalPrice } })
  }

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
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

        const total = Object.values(basketWithData).reduce(
          (acc: number, product: any) => {
            const price = product.price || 0
            const quantity = product.count || 0
            return acc + price * quantity
          },
          0,
        )

        setTotalPrice(total)

        setProductData(basketWithData)
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }

    fetchCurrentUser()
  }, [cartItemChanged])

  return (
    <div className="cart">
      <h2>Your Items</h2>
      <ul>
        {Object.entries(productData).map(
          ([productId, productDetails]: [string, any]) => (
            <CartItem
              key={productId}
              data={productDetails}
              onCartItemChanged={handleCartItemChanged}
            />
          ),
        )}
      </ul>
      <p>Total Price: €{totalPrice.toFixed(2)}</p>
      <button className="CheckoutButton" onClick={handleGoToCheckout}>
        Go to Checkout
      </button>
    </div>
  )
}
