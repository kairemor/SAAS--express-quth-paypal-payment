import { stripeHandler, stripePublicKey } from '../lib/stripe';

/*
  get My Stripe public key to checkout user payment in my account 
*/
export const getPublicKey = (req, res, next) => {
  return res.status(200).json({
    status: "success",
    payload: {
      publicKey: stripePublicKey
    }
  })
}


export const stripeCheckout = async (req, res, next) => {
  switch (req.body.price) {
    case 30:
      
      break;
  
    default:
      break;
  }

  stripeHandler(req.body.source, req.body.amount, req.body.currency)
    .then(() => {
      return res.status(200).send({ 
        status : "success",
        message : "The payment is checkout with success" 
      })
    })
    .catch((err) => {
      return  res.status(400).send({
        status: "error",
        message: `The checkout error message : ${err}`
      })
    })
}