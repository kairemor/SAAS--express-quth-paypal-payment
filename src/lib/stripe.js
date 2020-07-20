import stripe from 'stripe'; 

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
export const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

const stripeClient = stripe(stripeSecretKey)

/*
  My stripe handler to validate user checkout when 
  the user token and the token are provided 
*/
export const stripeHandler = (source, amount, currency) => stripeClient.charges.create({
  amount,
  source,
  currency
})