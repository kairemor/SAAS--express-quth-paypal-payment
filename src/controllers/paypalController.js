import paypal from 'paypal-rest-sdk';

var clientId = process.env.PAYPAL_CLIENT_ID || 'AWSRx72-_TMexvb3du3r9CnwO71FtMN_SatQcTbvsyOTj13gAnvuAoPpRbx3g6h4EyUdbrLfxo1gJJaH';
var secret = process.env.PAYPAL_CLIENT_SECRET || 'EMeqpL8hX0lFom4o7lKyhAgq2pblt-J0Wx4KnvzniFzF4heyFufCG7TmdK3Pm-ekjB_S9flkIOqqGZPR';

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': clientId,
  'client_secret': secret
});

export const createAgreementController = (req, res) => {
  const billingPlan = req.query.plan;

  const isoDate = new Date();
  isoDate.setSeconds(isoDate.getSeconds() + 4);
  isoDate.toISOString().slice(0, 19) + 'Z';

  const billingAgreementAttributes = {
    "name": "Standard Membership",
    "description": "Food of the World Club Standard Membership",
    "start_date": isoDate,
    "plan": {
      "id": billingPlan
    },
    "payer": {
      "payment_method": "paypal"
    },
    "shipping_address": {
      "line1": "W 34th St",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country_code": "US"
    }
  };

  // Use activated billing plan to create agreement
  paypal.billingAgreement.create(billingAgreementAttributes, (error, billingAgreement) => {
    if (error) {
      console.error(error);
      throw error;
    } else {
      console.log(billingAgreement)
      //capture HATEOAS links
      const links = {};
      billingAgreement.links.forEach(function (linkObj) {
        links[linkObj.rel] = {
          'href': linkObj.href,
          'method': linkObj.method
        };
      })

      //if redirect url present, redirect user
      if (links.hasOwnProperty('approval_url')) {
        res.redirect(links['approval_url'].href);
      } else {
        console.error('no redirect URI present');
      }
    }
  })
}

export const processAgreement = (req, res) => {
  const token = req.query.token;
  console.log(token);
  paypal.billingAgreement.execute(token, {}, function (error, billingAgreement) {
    if (error) {
      console.error(error);
      throw error;
    } else {
      console.log(billingAgreement);
      res.send('Billing Agreement Created Successfully');
    }
  });
}