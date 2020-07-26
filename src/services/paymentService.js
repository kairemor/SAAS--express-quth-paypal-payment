import axios from 'axios';
import qs from 'querystring';
import fs from 'fs';
import {
  update
} from '../services';
import Models from '../models';
import catchAsync from '../lib/catchAsync';

const {
  User
} = Models

axios.defaults.headers.common["Content-Type"] = "application/json"
axios.defaults.headers.common["Accept-Language"] = "en_US"

const baseAPIUrl = "https://api.sandbox.paypal.com/v1"
// get token from client and secret id
export const getToken = async () => {
  try {
    const result = await axios.post(`${baseAPIUrl}/oauth2/token`, qs.stringify({
      grant_type: 'client_credentials'
    }), {
      headers: {
        "Accept": "application/json",
        "Accept-Language": "en_US",
      },
      auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_CLIENT_SECRET
      }
    })
    return result.data.access_token.toString()
  } catch (error) {
    return error
  }
}


// get product that tale plan 
const createProduct = catchAsync(async () => {
  const token = await getToken();
  const product = {
    "name": "Node api software",
    "description": "Node api software",
    "type": "SERVICE",
    "category": "SOFTWARE"
  }
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  try {
    const result = await axios.post(`${baseAPIUrl}/catalogs/products`, product)
    return result.data.id
  } catch (err) {

  }
})

// create all proposed plan for subscription 
const createPlans = catchAsync(async () => {
  const token = await getToken();
  const product_id = await createProduct()
  const plans = [
    // this is one plan
    {
      "product_id": product_id,
      "name": "Basic Plan",
      "description": "Basic plan",
      "billing_cycles": [{
          "frequency": {
            "interval_unit": "MONTH",
            "interval_count": 1
          },
          "tenure_type": "TRIAL",
          "sequence": 1,
          "total_cycles": 1
        },
        {
          "frequency": {
            "interval_unit": "MONTH",
            "interval_count": 1
          },
          "tenure_type": "REGULAR",
          "sequence": 2,
          "total_cycles": 12,
          "pricing_scheme": {
            "fixed_price": {
              "value": "10",
              "currency_code": "USD"
            }
          }
        }
      ],
      "payment_preferences": {
        "auto_bill_outstanding": true,
        "setup_fee": {
          "value": "10",
          "currency_code": "USD"
        },
        "setup_fee_failure_action": "CONTINUE",
        "payment_failure_threshold": 3
      },
      "taxes": {
        "percentage": "10",
        "inclusive": false
      }
    },
    // this is an other plan
    {
      "product_id": product_id,
      "name": "Standard Plan",
      "description": "Standard plan",
      "billing_cycles": [{
          "frequency": {
            "interval_unit": "MONTH",
            "interval_count": 3
          },
          "tenure_type": "TRIAL",
          "sequence": 1,
          "total_cycles": 1
        },
        {
          "frequency": {
            "interval_unit": "MONTH",
            "interval_count": 3
          },
          "tenure_type": "REGULAR",
          "sequence": 2,
          "total_cycles": 12,
          "pricing_scheme": {
            "fixed_price": {
              "value": "30",
              "currency_code": "USD"
            }
          }
        }
      ],
      "payment_preferences": {
        "auto_bill_outstanding": true,
        "setup_fee": {
          "value": "30",
          "currency_code": "USD"
        },
        "setup_fee_failure_action": "CONTINUE",
        "payment_failure_threshold": 3
      },
      "taxes": {
        "percentage": "10",
        "inclusive": false
      }
    },
  ]

  const data = {}
  data['product_id'] = product_id
  try {
    plans.forEach((plan, index) => {
      axios.post(`${baseAPIUrl}/billing/plans`, plan, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "PayPal-Request-Id": `PLAN-18062020-00${index+1}`,
            "Prefer": "return=representation",
            "Accept": "application/json"
          }
        })
        .then(result => {
          data[`plan_${index}`] = {
            id: result.data.id,
            name: plan.name,
            price: plan.payment_preferences.setup_fee.value,
            interval_count: plan.billing_cycles[0].frequency.interval_count
          }
          fs.writeFile('subscription_info.json', JSON.stringify(data), (err) => {
            if (err) console.error(err);
          });
        })
    });
  } catch (error) {

  }

})
/*
  create my product and include plan in the payment business environment
*/
createPlans()

/*
  Paypal subscription creation service 
*/
export const createSubscriptionPayPal = async (req, res, next) => {
  const isoDate = new Date();
  const token = await getToken();
  isoDate.setSeconds(isoDate.getSeconds() + 10);
  const subscription = {
    "plan_id": req.body.planId,
    "start_time": "" + isoDate.toISOString().slice(0, 19) + 'Z',
    "subscriber": {
      "name": {
        "given_name": req.user.firstName,
        "surname": req.user.firstName
      },
      "email_address": req.user.email
    },
    "application_context": {
      "brand_name": "subscription software",
      "locale": "en-US",
      "shipping_preference": "SET_PROVIDED_ADDRESS",
      "user_action": "SUBSCRIBE_NOW",
      "payment_method": {
        "payer_selected": "PAYPAL",
        "payee_preferred": "IMMEDIATE_PAYMENT_REQUIRED"
      }
    },
    "return_url": `${req.protocol}://${req.get('host')}/api/v1/payment/success`,
    "cancel_url": `${req.protocol}://${req.get('host')}/api/v1/payment/payment-success`,
  }

  const links = {};
  try {
    const result = await axios.post(`${baseAPIUrl}/billing/subscriptions`, subscription, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "PayPal-Request-Id": "SUBSCRIPTION-21092020-001",
        "Prefer": "return=representation",
        "Accept": "application/json"
      }
    })

    result.data.links.forEach((linkObj) => {
      links[linkObj.rel] = {
        'href': linkObj.href,
        'method': linkObj.method
      };
    })
    const profileId = links['self'].href.split('/').pop()
    await update(User, req.user.id, {
      profileId: profileId
    })
  } catch (error) {
    //capture HATEOAS links
    return res.status(400).json({
      status: "error",
      message: error
    })
  }

  // axios.get(links['self'].href)
  //   .then(sub => {
  //     console.log(sub);
  //   })

  //if redirect url present, redirect user
  if (links.hasOwnProperty('approve')) {
    return res.redirect(links['approve'].href);
  } else {
    console.error('no redirect URI present');
  }
}

/*
  credit card subscription creation service 
*/
export const createSubscriptionCard = async (req, res, next) => {
  const isoDate = new Date();
  const token = await getToken();
  isoDate.setSeconds(isoDate.getSeconds() + 10);
  const subscription = {
    "plan_id": req.body.planId,
    "start_time": "" + isoDate.toISOString().slice(0, 19) + 'Z',
    "shipping_amount": {
      "currency_code": "USD",
      "value": "10.00"
    },
    "subscriber": {
      "name": {
        "given_name": req.user.firstName,
        "surname": req.user.lastName
      },
      "email_address": "customer@example.com",
      "shipping_address": {
        "name": {
          "full_name": `${req.user.firstName} + ${req.user.lastName}`
        }
      },
      "payment_source": {
        "card": {
          "number": req.body.number,
          "expiry": req.body.expiry,
          "security_code": req.body.security_code,
          "name": req.user.firstName
        }
      }
    }
  }

  const result = await axios(`${baseAPIUrl}/billing/subscriptions`, subscription, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  result.data.links.forEach((linkObj) => {
    links[linkObj.rel] = {
      'href': linkObj.href,
      'method': linkObj.method
    };
  })
  try {
    const profileId = links['self'].href.split('/').pop()
    await update(User, req.user.id, {
      profileId: profileId
    })
  } catch (error) {

  }
  return res.status(200).json({
    status: 'success',
    payload: result.data
  })
}


// export const paymentSuccessService = async (req, res, next) => {
//   console.log(req.query.token)
// }

// export const paymentErrorService = async (req, res, next) => {

// }