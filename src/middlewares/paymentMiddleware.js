import Model from "../models";
import axios from "axios";

import {
  update
} from "../services"

import {
  getToken
} from '../services/paymentService'

const baseAPIUrl = "https://api.sandbox.paypal.com/v1"
const {
  User
} = Model;

export const checkSubscription = async (req, res, next) => {
  const token = await getToken()
  if (req.user.profileId) {
    axios.get(`${baseAPIUrl}/billing/subscriptions/${req.user.profileId}`)
      .then(async (subscription) => {
        if (subscription.data.status === 'APPROVAL' && !req.user.isSubscribed) {
          await update(User, req.user.id, {
            isSubscribed: true
          })
          fs.readFile('subscription_info.json', (error, data) => {
            if (error) {
              res.status(400).json({
                status: 'error',
                message: error
              })
            }

            const plans = JSON.parse(data)

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
}