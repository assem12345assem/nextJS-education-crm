import { baseUrl } from '@/app/config/baseUrl';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import axios from 'axios';

// @ts-ignore
const SampleMainPage = () => {
  return (
    <PayPalScriptProvider
      //@ts-ignore
      options={{
        'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        currency: 'USD',
        intent: 'capture'
      }}
    >
      <PayPalButtons
        style={{
          color: 'gold',
          shape: 'rect',
          label: 'pay',
          height: 50
        }}
        createOrder={async (data, actions) => {
          const order_id = await paypalCreateOrder()
          console.log("gokeogke")
          return order_id + ''
        }}
        //@ts-ignore
        onApprove={async (data, actions) => {
          let response = await paypalCaptureOrder(data.orderID)
          if (response) return true
        }}
      />
    </PayPalScriptProvider>

  )
};

const paypalCreateOrder = async () => {

  try {
    let response = await axios.post(`${baseUrl}paypal/createOrder`, {
      order_price: 70 //bucks
    })
    const order_id = response.data.order.id;

    console.log('resps ', response)

    console.log("id : " ,order_id)
    return order_id
  } catch (err) {
    // Your custom code to show an error like showing a toast:
    // toast.error('Some Error Occured')
    console.log('error', err)
    return null
  }
  console.log("here efple")
}

const paypalCaptureOrder = async (orderID: any) => {
  console.log("here")
  try {
    let response = await axios.post(`${baseUrl}/paypal/captureOrder`, {
      orderID
    })
    if (response.data.success) {
      // Order is successful
      // Your custom code

      // Like showing a success toast:
      // toast.success('Amount Added to Wallet')

      // And/Or Adding Balance to Redux Wallet
      // dispatch(setWalletBalance({ balance: response.data.data.wallet.balance }))
      return response
    }
  } catch (err) {
    // Order is not successful
    // Your custom code

    // Like showing an error toast
    // toast.error('Some Error Occured')
    return null
  }
}
export default SampleMainPage;