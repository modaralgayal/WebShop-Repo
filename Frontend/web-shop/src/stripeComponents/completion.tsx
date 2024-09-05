import axios from 'axios'
import { useEffect } from 'react'
import { useLocation } from 'react-router'

export const Completion = () => {
  const location = useLocation()

  useEffect(() => {
    console.log('Location state: ', location) // Log location state to debug

    if (location) {
      handleSuccessfulOrder(location)
    } else {
      console.warn('No state passed to Completion page.')
    }
  }, [location.state]) // Add location.state as a dependency

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
      <h1 className="text-4xl md:text-6xl font-bold text-center">
        Thank you for shopping with us 🎉
      </h1>
    </main>
  )
}

const handleSuccessfulOrder = async (state: any) => {
  console.log('ORDERED SUCCESSFULLY PROCESSED')
  try {
    const { basket } = state
    if (!basket || basket.length === 0) {
      console.warn('No basket found in the state.')
      return
    }

    console.log('Adding products to ordered Section')
    console.log('ORDERED SUCCESSFULLY PROCESSED')

    const response = await axios.post('/api/orders', {
      productIds: basket.map((item: { productId: any }) => item.productId),
    })

    console.log('Order successfully processed:', response.data)
  } catch (error) {
    console.error('Error processing order:', error)
  }
}
