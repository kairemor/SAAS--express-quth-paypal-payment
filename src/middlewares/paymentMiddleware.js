import Model from "../models";
import axios from "axios";

import {
  update
} from "../services"
import catchAsync from "../lib/catchAsync"

import {
  getToken
} from '../services/paymentService'

const baseAPIUrl = "https://api.sandbox.paypal.com/v1"
const {
  User
} = Model;

export const checkSubscription = catchAsync(async (req, res, next) => {
  const token = await getToken()
  console.log(token);
  if (req.user.profileId) {
    axios.get(`${baseAPIUrl}/billing/subscriptions/${req.user.profileId}`)
      .then(async (subscription) => {
        if (subscription.data.status === 'APPROVAL' && !req.user.isSubscribed) {
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