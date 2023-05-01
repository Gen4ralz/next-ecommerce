import { ToastContainer } from 'react-toastify'
import '../styles/globals.css'
import { StoreProvider } from '../utils/Store'
import 'react-toastify/dist/ReactToastify.css'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const fetchLineId = async () => {
      const liff = (await import('@line/liff')).default
      const headers = new Headers()
      headers.append('Content-Type', 'application/json')
      const requestOptions = {
        method: 'GET',
        headers: headers,
        credentials: 'include',
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND}/keys/lineliff`,
          requestOptions
        )
        const data = await response.json()
        const liffId = data.data
        if (liffId) {
          await liff.init({ liffId })
          // use the lineId and other data as necessary
        } else {
          console.error('LIFF ID not found')
        }
      } catch (err) {
        console.log(err)
      }
      // if (!liff.isLoggedIn()) {
      //   liff.login()
      // }
    }
    fetchLineId()
  }, [])

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
