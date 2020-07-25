import fs from 'fs';
import {
  createSubscriptionPayPal,
  createSubscriptionCard
} from '../services/paymentService';
import catchAsync from "../lib/catchAsync"

/*
  get the id of your payment plans 
*/
export const getPlansId = async (req, res, next) => {

  fs.readFile('subscription_info.json', (error, data) => {
    if (error) {
      res.status(400).json({
        status: 'error',
        message: error
      })
    }
    res.status(200).json({
      status: 'success',
      payload: JSON.parse(data)
    })
  })

}

/*
  paypal Subscription to handle the subscription in a plan using paypal
*/
export const paypalSubscription = catchAsync(async (req, res, next) => {
  await createSubscriptionPayPal(req, res, next)
})

/*
  credit card Subscription to handle the subscription in a plan using credit card
*/
export const creditCardSubscription = catchAsync(async (req, res, next) => {
  await createSubscriptionCard(req, res, next)
})

/*
  if payment success 
*/
// export const paymentSuccess = catchAsync(async (req, res, next) => {
//   await paymentSuccessService(req, res, next)
// })

/*
  if payment error 
*/
// export const paymentError = catchAsync(async (req, res, next) => {
//   await paymentErrorService(req, res, next)
// })