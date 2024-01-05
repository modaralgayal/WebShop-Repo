import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51OUoM6IbmxL4mLPQolZE4noaxGmlaTBgZ7FD0p6WCbOWJV639gloJhwjlS5oRp91VFjwAC8qOdG2oHdEutzwtcO600STeBcDuu', {
  apiVersion: "2023-10-16" // Set your desired API version
});

stripe.products.create({
  name: 'Starter Subscription',
  description: '$12/Month subscription',
}).then(product => {
  stripe.prices.create({
    unit_amount: 1200,
    currency: 'usd',
    recurring: {
      interval: 'month',
    },
    product: product.id,
  }).then(price => {
    console.log('Success! Here is your starter subscription product id: ' + product.id);
    console.log('Success! Here is your starter subscription price id: ' + price.id);
  });
});