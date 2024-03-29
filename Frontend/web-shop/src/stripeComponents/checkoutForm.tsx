import { PaymentElement } from '@stripe/react-stripe-js'
import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { useStripe, useElements } from '@stripe/react-stripe-js'
import './payments.css'

export const CheckoutForm = () => {
  const stripe = useStripe()
  const navigate = useNavigate()
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
    console.log("This is more testing")

    // @ts-ignore
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `/completion`, 
      },
    })
    

    console.log("This is the paymentIntent", error)

    if (error) {
      console.error('Stripe API error:', error);
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message || 'An unexpected error occurred.');
      } else {
        navigate("/completion")
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
      {message && <div id="payment-message">{message}</div>}
    </form>
  )
}

export default CheckoutForm
