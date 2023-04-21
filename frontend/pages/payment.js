import React, { useContext, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import CheckoutWizard from '../components/CheckoutWizard'
import { useRouter } from 'next/router'
import { Store } from '../utils/Store'
import { toast } from 'react-toastify'

export default function PaymentScreen() {
  const router = useRouter()
  const [selectedPayment, setSelectedPayment] = useState('')
  const { state, dispatch } = useContext(Store)
  const { cart } = state
  const { shippingAddress, paymentMethod } = cart

  const submitHandler = (e) => {
    e.preventDefault()
    if (!selectedPayment) {
      return toast.error('Payment method is required')
    }
    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPayment })
    localStorage.setItem(
      'cart',
      JSON.stringify({ ...cart, paymentMethod: selectedPayment })
    )
    router.push('/placeorder')
  }

  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push('/shipping')
    }
    setSelectedPayment(paymentMethod || '')
  }, [paymentMethod, router, shippingAddress.address])

  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />
      <form
        className="mx-4 md:mx-auto max-w-screen-md"
        onSubmit={submitHandler}>
        {/* <h1 className="font-bold mb-4">Payment Method</h1> */}
        {['PayPal', 'Stripe', 'Cash On Delivery', 'Bank Transfer'].map(
          (payment) => (
            <div key={payment} className="mb-4">
              <input
                name="paymentMethod"
                className="p-2 outline-none focus:ring-0"
                id={payment}
                type="radio"
                checked={selectedPayment === payment}
                onChange={() => setSelectedPayment(payment)}
              />
              <label className="p-2" htmlFor={payment}>
                {payment}
              </label>
            </div>
          )
        )}
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => router.push('/shipping')}
            type="button"
            className="rounded-md border border-transparent bg-gray-100 px-6 py-3 text-base font-medium text-black shadow-sm">
            Back
          </button>
          <button className="rounded-md border border-transparent bg-black px-6 py-3 text-base font-medium text-white shadow-sm">
            Next
          </button>
        </div>
      </form>
    </Layout>
  )
}
