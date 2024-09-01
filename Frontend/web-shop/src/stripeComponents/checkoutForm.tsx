import { PaymentElement } from '@stripe/react-stripe-js'
import { useState, FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useStripe, useElements } from '@stripe/react-stripe-js'
import './payments.css'
import axios from 'axios'

export const CheckoutForm = () => {
  const stripe = useStripe()
  const navigate = useNavigate()
  const elements: any = useElements()
  const location = useLocation()

  const [message, setMessage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `http://localhost:5173/completion`,
      },
    })

    if (error) {
      console.error('Stripe API error:', error)
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message || 'An unexpected error occurred.')
      } else {
        await handleSuccessfulOrder()
        navigate('/completion')
      }
    }
    setIsProcessing(false)
  }

  const handleSuccessfulOrder = async () => {
    try {
      const { state } = location
      const { basket } = state // assuming basket data (productIds and quantities) is passed via navigate
      console.log('Adding products to ordered Section')

      const response = await axios.post('/api/orders', {
        productIds: basket.map((item: { productId: any }) => item.productId),
      })

      console.log('Order successfully processed:', response.data)
    } catch (error) {
      console.error('Error processing order:', error)
    }
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button
        className="paymentButton"
        disabled={isProcessing || !stripe || !elements}
        id="submit"
      >
        <span id="button-text">
          {isProcessing ? 'Processing ... ' : 'Pay now'}
        </span>
      </button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  )
}

export default CheckoutForm
