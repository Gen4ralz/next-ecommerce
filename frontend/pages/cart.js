/* eslint-disable @next/next/no-img-element */
import { XMarkIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import React, { useContext } from 'react'
import Layout from '../components/Layout'
import { Store } from '../utils/Store'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

function CartScreen() {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const {
    cart: { cartItems },
  } = state
  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
  }
  const checkoutHandler = () => {
    router.push('/shipping')
  }

  const updateCartHandler = (item, qty) => {
    const quantity = Number(qty)
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
  }
  return (
    <Layout title="Cart">
      <h1 className="text-2xl font-bold px-2 py-4">CART</h1>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty.{' '}
          <Link href="/" className="text-green-700">
            Go shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-2 mx-2">
            <div className="flow-root">
              <ul role="list" className="-my-6 divide-y divide-gray-200 mb-2">
                {cartItems.map((item) => (
                  <li key={item.sku} className="flex py-6">
                    <div className="w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <Link href={`/product/${item.slug}`}>
                        <img
                          src={item.image}
                          alt={item.color}
                          className="h-full w-full object-cover object-center"
                        />
                      </Link>
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>{item.color}</p>
                          <p>{item.price * item.quantity} ฿</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.color} &nbsp;|&nbsp; {item.size}
                        </p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="text-gray-500">
                          Qty{' '}
                          <select
                            value={item.quantity}
                            onChange={(e) =>
                              updateCartHandler(item, e.target.value)
                            }>
                            {[...Array(item.stock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </select>
                        </p>
                        <div className="flex">
                          <button
                            type="button"
                            className="font-medium text-rose-500"
                            onClick={() => removeItemHandler(item)}>
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>
                Subtotal: ({cartItems.reduce((a, c) => a + c.quantity, 0)} pcs.)
              </p>
              <p className="font-bold text-xl text-emerald-500">
                {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)} ฿
              </p>
            </div>
            <div className="mt-6">
              <button
                onClick={checkoutHandler}
                className="w-full flex items-center justify-center rounded-md border border-transparent bg-black px-6 py-3 text-base font-medium text-white shadow-sm">
                Checkout
              </button>
            </div>
            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
              <p>
                or{' '}
                <Link href="/" className="font-medium text-indigo-600">
                  Continue Shopping<span aria-hidden="true"> &rarr;</span>
                </Link>
              </p>
            </div>
          </div>
        </>
      )}
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false })
