//@ts-ignore
import paypal from '@paypal/checkout-server-sdk'
//@ts-ignore
import checkoutNodeJssdk from '@paypal/checkout-server-sdk'

const configureEnvironment = function () {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  return process.env.NODE_ENV === 'production'
    ? new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret)
    : new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret)
}

const client = function () {
  return new checkoutNodeJssdk.core.PayPalHttpClient(configureEnvironment())
}


export const createOrder = async ( price: string  ) => {
  const PaypalClient = client()
      //This code is lifted from https://github.com/paypal/Checkout-NodeJS-SDK
      const request = new paypal.orders.OrdersCreateRequest()
      request.headers['prefer'] = 'return=representation'
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: price+"",
            },
          },
        ],
      })
      const response = await PaypalClient.execute(request)
      if (response.statusCode !== 201) {
        console.log("RES: ", response)
        throw new Error("Some Error Occured at backend")
      }
      
      return response;
}

export const captureOrder = async (orderID: string) => {
   //Capture order to complete payment
   console.log('order id', orderID)
 
   const PaypalClient = client()
   const request = new paypal.orders.OrdersCaptureRequest(orderID)
   request.requestBody({})
   const response = await PaypalClient.execute(request)
   if (!response) {
    throw new Error("Some Error Occured at backend")
  }

  return response;
}

export default client
