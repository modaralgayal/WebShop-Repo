import { PaymentElement } from '@stripe/react-stripe-js'
import { useState, FormEvent } from 'react'
import { useStripe, useElements } from '@stripe/react-stripe-js'
import './payments.css'
import { apiBaseUrl, confirmUrl } from '../constants'
import axios from 'axios'

export const CheckoutForm = ({ productIds }: { productIds: string[] }) => {
  const stripe = useStripe()
  const elements: any = useElements()
  const [message, setMessage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const userToken = localStorage.getItem('userToken')
    if (!userToken) {
      setMessage('User not logged in. Please log in to proceed.')
      return
    }

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: confirmUrl,
      },
      redirect: 'if_required',
    })

    if (error) {
      setMessage(error.message || 'Payment failed.')
      setIsProcessing(false)
      return
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        console.log('Adding to ordered')
        await axios.post(`${apiBaseUrl}/api/orders`, {
          productIds,
          userToken,
        })
        console.log('Successfully added to ordered')
      } catch (orderError) {
        console.error('Error adding products to ordered:', orderError)
        setMessage('Error adding products to ordered.')
      }
    } else {
      setMessage('Payment failed or canceled.')
    }

    setIsProcessing(false)
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
