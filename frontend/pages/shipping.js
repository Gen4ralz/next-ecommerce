import React, { useContext, useEffect } from 'react'
import Layout from '../components/Layout'
import CheckoutWizard from '../components/CheckoutWizard'
import { useForm } from 'react-hook-form'
import { Store } from '../utils/Store'
import { useRouter } from 'next/router'

export default function ShippingScreen() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm()

  const router = useRouter()

  const { state, dispatch } = useContext(Store)
  const { cart, userInfo } = state

  const { shippingAddress } = cart

  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/shipping')
    }
    setValue('fullName', shippingAddress.fullName)
    setValue('address', shippingAddress.address)
    setValue('postalCode', shippingAddress.postalCode)
    setValue('phone', shippingAddress.phone)
  }, [router, setValue, shippingAddress, userInfo])

  const submitHandler = ({ fullName, address, postalCode, phone }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, postalCode, phone },
    })
    localStorage.setItem(
      'cart',
      JSON.stringify({
        ...cart,
        shippingAddress: { fullName, address, postalCode, phone },
      })
    )
    router.push('/payment')
  }

  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}>
        <h1 className="mb-4 text-xl">Shipping Address</h1>
        <div className="mb-4">
          <label htmlFor="fullName">Full Name</label>
          <input
            className="w-full"
            id="fullName"
            autoFocus
            {...register('fullName', { required: 'Please enter full name' })}
          />
          {errors.fullName && (
            <div className="text-red-500">{errors.fullName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="address">Address</label>
          <input
            className="w-full"
            id="address"
            autoFocus
            {...register('address', {
              required: 'Please enter address',
              minLength: { value: 3, message: 'Address is more than 2 chars' },
            })}
          />
          {errors.address && (
            <div className="text-red-500">{errors.address.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            className="w-full"
            id="postalCode"
            autoFocus
            {...register('postalCode', {
              required: 'Please enter postalCode',
              minLength: { value: 5, message: 'postalCode is 5 chars' },
            })}
          />
          {errors.postalCode && (
            <div className="text-red-500">{errors.postalCode.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="phone">Phone</label>
          <input
            className="w-full"
            id="phone"
            autoFocus
            {...register('phone', {
              required: 'Please enter postalCode',
              minLength: { value: 9, message: 'phone number must 10 chars' },
            })}
          />
          {errors.phone && (
            <div className="text-red-500">{errors.phone.message}</div>
          )}
        </div>
        <div className="mb-4">
          <button className="w-full flex items-center justify-center rounded-md border border-transparent bg-black px-6 py-3 text-base font-medium text-white shadow-sm">
            Next
          </button>
        </div>
      </form>
    </Layout>
  )
}
