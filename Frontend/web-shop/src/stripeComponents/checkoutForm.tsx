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

    const element = elements._commonOptions.clientSecret

    console.log(elements._commonOptions.clientSecret)

    // @ts-ignore
    const { error } = await stripe.confirmCardPayment({
      element,
      confirmParams: {
        return_url: `${apiBaseUrl}/completion`,
      },
    })

    if (error?.type === 'card_error' || error?.type === 'validation_error') {
      // Check if error.message is defined before updating the state
      if (error.message !== undefined) {
        setMessage(error.message)
      } else {
        setMessage('An unexpected error occurred.')
      }
    } else {
      setMessage('An unexpected error occurred.')
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
