import paypal from 'paypal-rest-sdk';

var clientId = process.env.PAYPAL_CLIENT_ID || 'AWSRx72-_TMexvb3du3r9CnwO71FtMN_SatQcTbvsyOTj13gAnvuAoPpRbx3g6h4EyUdbrLfxo1gJJaH';
var secret = process.env.PAYPAL_CLIENT_SECRET || 'EMeqpL8hX0lFom4o7lKyhAgq2pblt-J0Wx4KnvzniFzF4heyFufCG7TmdK3Pm-ekjB_S9flkIOqqGZPR';

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': clientId,
  'client_secret': secret
});

const billingPlanAttribs = {
  "name": "Food of the World Club Membership: Standard",
  "description": "Monthly plan for getting the t-shirt of the month.",
  "type": "fixed",
  "payment_definitions": [{
    "name": "Standard Plan",
    "type": "REGULAR",
    "frequency_interval": "1",
    "frequency": "MONTH",
    "cycles": "11",
    "amount": {
      "currency": "USD",
      "value": "19.99"
    }
  }],
  "merchant_preferences": {
    "setup_fee": {
      "currency": "USD",
      "value": "1"
    },
    "cancel_url": "http://localhost:3000/cancel",
    "return_url": "http://localhost:3000/processagreement",
    "max_fail_attempts": "0",
    "auto_bill_amount": "YES",
    "initial_fail_amount_action": "CONTINUE"
  }
};

const billingPlanUpdateAttributes = [{
  "op": "replace",
  "path": "/",
  "value": {
    "state": "ACTIVE"
  }
}];

paypal.billingPlan.create(billingPlanAttribs, (error, billingPlan) => {
  if (error) {
    console.log(error);
    throw error;
  } else {
    console.log(billingPlan)
    // Activate the plan by changing status to Active
    paypal.billingPlan.update(billingPlan.id, billingPlanUpdateAttributes, (error, response) => {
      if (error) {
        console.log(error);
        throw error;
      } else {
        console.log(billingPlan.id);
      }
    });
  }
});