import React, { useContext, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import CheckoutWizard from '../components/CheckoutWizard'
import { Store } from '../utils/Store'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { getError } from '../utils/error'
import dynamic from 'next/dynamic'

function PlaceOrderScreen() {
  const { state, dispatch } = useContext(Store)
  const { userInfo, cart } = state
  const { cartItems, shippingAddress, paymentMethod } = cart
  const router = useRouter()

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100

  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  )

  const shippingFee = 0

  const totalPrice = itemsPrice + shippingFee

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment')
    }
    if (cartItems.length === 0) {
      router.push('/cart')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [loading, setLoading] = useState(false)

  const placeOrderHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    let payload = {
      order_items: cartItems,
      shipping_address: shippingAddress,
      paymentMethod: paymentMethod,
      itemsPrice: itemsPrice,
      shippingFee: shippingFee,
      totalPrice: totalPrice,
    }

    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append(
      'Authorization',
      'Bearer ' + `${userInfo.tokens.access_token}`
    )

    const requestOptions = {
      method: 'POST',
      headers: headers,
      credentials: 'include',
      body: JSON.stringify(payload),
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/orders`,
        requestOptions
      )
      const data = await response.json()
      console.log(data)
      if (data.error) {
        toast.error(data.message)
      } else {
        dispatch({ type: 'CART_CLEAR_ITEMS' })
        localStorage.setItem('cart', JSON.stringify({ ...cart, cartItems: [] }))
        router.push(`/order/${data.data.order_id}`)
      }
    } catch (error) {
      toast.error(getError(error))
    }
  }

  return (
    <Layout title="Place Order">
      <CheckoutWizard activeStep={3} />
      {cartItems.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go shopping</Link>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
              <div className="card border border-gray-200 p-5 shadow-md">
                <p className="mb-2 font-bold text-gray-700">Shipping Address</p>
                <div className="ml-4 font-sm text-gray-500">
                  <div>{shippingAddress.fullName}</div>
                  <div>{shippingAddress.address}</div>
                  <div>{shippingAddress.postalCode}</div>
                  <div className="flex justify-between">
                    {shippingAddress.phone}{' '}
                    <span>
                      <Link
                        href="/shipping"
                        className="text-indigo-700 font-bold">
                        Edit
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
              <div className="card border border-gray-200 p-5 shadow-md">
                <h2 className="mb-2 font-bold text-gray-700">Payment Method</h2>
                <div className="flex justify-between ml-4 font-sm text-gray-500">
                  {paymentMethod}
                  <span>
                    <Link href="/payment" className="text-indigo-700 font-bold">
                      Edit
                    </Link>
                  </span>
                </div>
              </div>
              <div className="card overflow-x-auto p-5">
                <h2 className="mb-2 font-bold text-gray-700">Order Items</h2>
                {cartItems.map((item) => (
                  <li key={item.sku} className="flex py-3">
                    <div className="w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <Link href={`/product/${item.slug}`}>
                        <Image
                          src={item.image}
                          alt={item.color}
                          className="h-full w-full object-cover object-center"
                          width={50}
                          height={50}
                          priority
                        />
                      </Link>
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>{item.name}</p>
                          <p>{item.price * item.quantity} ฿</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.color} &nbsp;|&nbsp; {item.size}
                        </p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="text-gray-500">Qty {item.quantity}</p>
                      </div>
                    </div>
                  </li>
                ))}
                <div className="flex justify-between">
                  <div></div>
                  <Link href="/cart" className="text-indigo-700 font-bold">
                    Edit
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <div className="card border border-gray-200 p-5 shadow-md">
                <h2 className="mb-2 font-bold text-gray-700">Order Summary</h2>
                <ul>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Items</div>
                      <div>{itemsPrice} ฿</div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Shipping</div>
                      <p className="text-green-500">
                        {shippingFee === 0 ? 'Free' : 30}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Total</div>
                      <div>{totalPrice} ฿</div>
                    </div>
                  </li>
                  <li>
                    <button
                      disabled={loading}
                      onClick={placeOrderHandler}
                      className="primary-button w-full">
                      {loading ? 'Loading...' : 'Place Order'}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(PlaceOrderScreen), { ssr: false })
