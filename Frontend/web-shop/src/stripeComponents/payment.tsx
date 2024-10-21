import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Elements } from '@stripe/react-stripe-js';
import { CheckoutForm } from './checkoutForm';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { apiBaseUrl } from '../constants';
import axios from 'axios';

export const Payment = () => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null>>(
    () => Promise.resolve(null),
  );
  const [clientSecret, setClientSecret] = useState<string>('');
  const location = useLocation();
  
  const totalPrice = location.state ? Number(location.state.totalPrice) : null;
  const productIdsWithCount = location.state ? location.state.productIds : [];

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/config`);
        const { publishableKey } = await response.json();
        const stripe = await loadStripe(publishableKey);
        setStripePromise(Promise.resolve(stripe));
      } catch (error) {
        console.error('Error fetching Stripe config:', error);
        setStripePromise(Promise.resolve(null));
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const response = await axios.post(`${apiBaseUrl}/create-payment-intent`, {
          totalPrice,
          productIds: productIdsWithCount,
        });

        if (!response) {
          throw new Error('Failed to fetch payment intent');
        }

        const { clientSecret } = response.data;
        setClientSecret(clientSecret);
      } catch (error: any) {
        console.error('Error fetching payment intent:', error.message);
        setClientSecret('');
      }
    };

    if (totalPrice) {
      fetchPaymentIntent();
    }
  }, [totalPrice, productIdsWithCount]); 

  return (
    <div className="payment-form">
      <h1>React Stripe and the Payment Element</h1>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm productIds={productIdsWithCount} /> 
        </Elements>
      )}
    </div>
  );
};
