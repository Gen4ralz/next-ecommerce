/* eslint-disable @next/next/no-img-element */
import { XMarkIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import React, { useContext } from 'react'
import Layout from '../components/Layout'
import { Store } from '../utils/Store'

export default function CartScreen() {
  const { state, dispatch } = useContext(Store)
  const {
    cart: { cartItems },
  } = state
  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
  }
  return (
    <Layout title="Cart">
      <h1 className="text-2xl font-bold px-2 py-4">CART</h1>

      <div className="mt-2 mx-2">
        <div className="flow-root">
          <ul role="list" className="-my-6 divide-y divide-gray-200 mb-2">
            {cartItems.map((item) => (
              <li key={item.sku} className="flex py-6">
                <div className="w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <Link href={`/product/${item.product.slug}`}>
                    <img
                      src={item.color.image}
                      alt={item.color.name}
                      className="h-full w-full object-cover object-center"
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
            {cartItems.reduce((a, c) => a + c.quantity * c.product.price, 0)} ฿
          </p>
        </div>
        <div className="mt-6">
          <Link
            href="#"
            className="flex items-center justify-center rounded-md border border-transparent bg-black px-6 py-3 text-base font-medium text-white shadow-sm">
            Checkout
          </Link>
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
    </Layout>
  )
}
