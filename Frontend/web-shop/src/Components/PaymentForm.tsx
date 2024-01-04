import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { PaymentMethod, StripeCardElementOptions } from '@stripe/stripe-js'
import axios from 'axios'
import { useState, FormEvent } from 'react'
import { apiBaseUrl } from '../constants'
import './components.css'

type PaymentFormProps = {
  totalAmount: number
}

const CARD_OPTIONS: StripeCardElementOptions = {
  iconStyle: 'solid',
  style: {
    base: {
      iconColor: '#c4f0ff',
      color: '#fff',
      fontWeight: 500,
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': { color: '#fce883' },
      '::placeholder': { color: '#87bbfd' },
    },
    invalid: {
      iconColor: '#ffc7ee',
      color: '#ffc7ee',
    },
  },
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ totalAmount }) => {
  const [success, setSuccess] = useState<boolean>(false)
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!stripe || !elements) {
      return
    }

    try {
      const {
        error,
        paymentMethod,
      }: { error?: any; paymentMethod?: PaymentMethod } =
        await stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardElement)!,
        })

      if (error) {
        console.error('Error creating payment method:', error)
        return
      }

      // Perform null/undefined check before accessing id property
      if (paymentMethod && paymentMethod.id) {
        const { id } = paymentMethod
        const response = await axios.post(`${apiBaseUrl}/payment`, {
          amount: totalAmount,
          id,
        })

        console.log('Successful payment')
        setSuccess(true)
      } else {
        console.error('Payment method id not available')
      }
    } catch (error) {
      console.error('Error creating payment method:', error)
    }
  }

  return (
    <>
      {!success ? (
        <form onSubmit={handleSubmit}>
          <fieldset className="FormGroup">
            <div className="FormRow">
              <CardElement options={CARD_OPTIONS} />
            </div>
          </fieldset>
          <button className="paymentButton" type="submit">
            Pay
          </button>
        </form>
      ) : (
        <div>
          <h2>Payment Successful!</h2>
        </div>
      )}
    </>
  )
}
