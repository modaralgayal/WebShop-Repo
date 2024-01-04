import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { PaymentForm } from './PaymentForm'
import { useParams } from 'react-router-dom'

const PUBLIC_KEY =
  'pk_live_51OUoM6IbmxL4mLPQ2NOEUm2J49yurhhGCEd6Hiqqq3Q70jYWyUbMdb0YqWdmiTJJxd2HerucgqSXeBcjFTwv0pRM00RDKGi16y'

const stripeTestPromise = loadStripe(PUBLIC_KEY)

export const StripeContainer = () => {
  const { totalAmount }: number | any = useParams()

  const parsedTotalAmount = parseFloat(totalAmount)

  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentForm totalAmount={parsedTotalAmount} />
    </Elements>
  )
}
