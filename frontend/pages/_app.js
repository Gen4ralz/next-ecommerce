import { ToastContainer } from 'react-toastify'
import '../styles/globals.css'
import { StoreProvider } from '../utils/Store'
import 'react-toastify/dist/ReactToastify.css'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <PayPalScriptProvider deferLoading={true}>
        <Component {...pageProps} />
        <ToastContainer />
      </PayPalScriptProvider>
    </StoreProvider>
  )
}

export default MyApp
