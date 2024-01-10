import { PaymentElement } from '@stripe/react-stripe-js'
import { useState, FormEvent } from 'react'
import { useStripe, useElements } from '@stripe/react-stripe-js'
import './payments.css'
import { apiBaseUrl } from '../constants'

export const CheckoutForm = () => {
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

    console.log("This is the clientSecret",elements._commonOptions.clientSecret.clientSecret)

    // @ts-ignore
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${apiBaseUrl}/completion`, 
      },
    })

    console.log("This is the paymentIntent", error)

    if (error) {
      console.error('Stripe API error:', error);
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message || 'An unexpected error occurred.');
      } 
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
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  )
}

export default CheckoutForm
