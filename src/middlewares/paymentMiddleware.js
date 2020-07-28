import Model from "../models";
import axios from "axios";

import {
  update
} from "../services"
import catchAsync from "../lib/catchAsync"

import {
  getPaypalToken
} from '../services/paymentService'

const baseAPIUrl = "https://api.sandbox.paypal.com/v1"
const {
  User
} = Model;

/*
  middleware to check if user have a valide subscri
*/
export const checkSubscription = catchAsync(async (req, res, next) => {
  const token = await getPaypalToken()
  if (req.user.profileId) {
    axios.get(`${baseAPIUrl}/billing/subscriptions/${req.user.profileId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(async (subscription) => {
        console.log(subscription)
        if ((subscription.data.status === 'APPROVAL' || subscription.data.status === 'ACTIVE') && !req.user.isSubscribed) {
          await update(User, req.user.id, {
            isSubscribed: true
          })
        } else {
          await update(User, req.user.id, {
            isSubscribed: false
          })
        }
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .catch(err => console.log(err))
  }

  next()
})