import { PaymentElement } from '@stripe/react-stripe-js'
import { useState, FormEvent } from 'react'
import { useStripe, useElements } from '@stripe/react-stripe-js'
import './payments.css'
import { apiBaseUrl } from '../constants'
import axios from 'axios'

export const CheckoutForm = ({ productIds }: { productIds: string[] }) => {
  const stripe = useStripe()
  const elements: any = useElements()
  const [message, setMessage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `http://localhost:5173/completion`, // Assuming you have a return URL after payment completion
      },
      redirect: "if_required",
    })

    // Payment handling
    if (error) {
      setMessage(error.message || "Payment failed.")
      setIsProcessing(false)
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment was successful, now add the products to the user's ordered list
      try {
        const userToken = localStorage.getItem('userToken') // Fetch user token

        const response = await axios.post(`${apiBaseUrl}/api/orders`, {
          productIds,
          userToken, // Assuming userToken is stored in localStorage or passed somehow
        })

        if (response.status === 200) {
          console.log('Products added to ordered successfully')
          // Redirect to the completion page after successful payment and order processing
          window.location.href = `http://localhost:5173/completion`
        } else {
          setMessage('Failed to add products to ordered.')
        }
      } catch (orderError) {
        console.error('Error adding products to ordered:', orderError)
        setMessage('Error adding products to ordered.')
      }

      setMessage('Payment successful!')
      setIsProcessing(false)
    } else {
      setMessage('Payment failed or canceled.')
      setIsProcessing(false)
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
