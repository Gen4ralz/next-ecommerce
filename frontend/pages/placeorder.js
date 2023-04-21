import React, { useContext, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import CheckoutWizard from '../components/CheckoutWizard'
import { Store } from '../utils/Store'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { getError } from '../utils/error'

export default function PlaceOrderScreen() {
  const { state, dispatch } = useContext(Store)
  const { cart } = state
  const { cartItems, shippingAddress, paymentMethod } = cart
  const router = useRouter()

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100

  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.product.price, 0)
  )

  const shipping = 0

  const totalPrice = itemsPrice + shipping

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment')
    }
  }, [paymentMethod, router])

  const [loading, setLoading] = useState(false)

  const placeOrderHandler = async () => {
    try {
      setLoading(true)
      let payload = {
        orderItems: cartItems,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        itemsPrice: itemsPrice,
        shipping: shipping,
        totalPrice: totalPrice,
      }

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      }

      await fetch(`http://localhost:8080/orders`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setLoading(false)
          dispatch({ type: 'CART_CLEAR_ITEMS' })
          localStorage.setItem(
            'cart',
            JSON.stringify({ ...cart, cartItems: [] })
          )
          router.push(`/order/${data._id}`)
        })
    } catch (err) {
      setLoading(false)
      toast.error(getError(err))
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
                      <Link href={`/product/${item.product.slug}`}>
                        <Image
                          src={item.color.image}
                          alt={item.color.name}
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
                          <p>{item.product.name}</p>
                          <p>{item.product.price} ฿</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.color.name} &nbsp;|&nbsp; {item.size.name}
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
                      <div>${itemsPrice}</div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Shipping</div>
                      <p className="text-red-700">
                        {shipping === 0 ? 'Free' : 30}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Total</div>
                      <div>${totalPrice}</div>
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
