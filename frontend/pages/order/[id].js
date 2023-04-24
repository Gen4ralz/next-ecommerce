import React, { useContext, useEffect, useReducer } from 'react'
import Layout from '../../components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { Store } from '../../utils/Store'
import { getError } from '../../utils/error'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      state
  }
}

function OrderScreen({ params }) {
  const orderId = params.id
  const { state } = useContext(Store)
  const { userInfo } = state
  const router = useRouter()

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  })

  const {
    shipping_address,
    paymentMethod,
    order_items,
    itemsPrice,
    shippingFee,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login')
    }
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append(
      'Authorization',
      'Bearer ' + `${userInfo.tokens.access_token}`
    )

    const requestOptions = {
      method: 'GET',
      headers: headers,
      credentials: 'include',
    }

    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const response = await fetch(
          `http://localhost:8080/api/orders/${orderId}`,
          requestOptions
        )
        const data = await response.json()
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
        console.log(data)
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
        console.log(err)
      }
    }
    if (!order.id || (order.id && order.id !== orderId)) {
      fetchOrder()
      //   if (successPay) {
      //     dispatch({ type: 'PAY_RESET' })
      //   }
      //   if (successDeliver) {
      //     dispatch({ type: 'DELIVER_RESET' })
      //   }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order])

  return (
    <Layout title={`Order ${orderId}`}>
      <div className="flex justify-between mx-2 py-4">
        <h1 className="font-bold text-gray-700">Order:</h1>
        <span className="font-bold text-gray-700">{orderId}</span>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <>
          <div className="grid md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
              <div className="card border border-gray-200 p-5 shadow-md">
                <p className="mb-2 font-bold text-gray-700">Shipping Address</p>
                <div className="ml-4 font-sm text-gray-500">
                  <div>{shipping_address.fullName}</div>
                  <div>{shipping_address.address}</div>
                  <div>{shipping_address.postalCode}</div>
                  <div className="flex justify-between">
                    {shipping_address.phone}{' '}
                    <span>
                      {isDelivered ? (
                        <div className="text-green-600">
                          Delivered at {deliveredAt}
                        </div>
                      ) : (
                        <div className="text-red-600">Not delivered</div>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="card border border-gray-200 p-5 shadow-md">
                <h2 className="mb-2 font-bold text-gray-700">Payment Method</h2>
                <div className="flex justify-between ml-4 font-sm text-gray-500">
                  {paymentMethod}
                  <span>
                    {isPaid ? (
                      <div className="text-green-600">Paid at {paidAt}</div>
                    ) : (
                      <div className="text-red-600">Not paid</div>
                    )}
                  </span>
                </div>
              </div>
              <div className="card border border-gray-200 p-5 shadow-md">
                <h2 className="mb-2 font-bold text-gray-700">Order Items</h2>
                {order_items.map((item) => (
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
                {/* <div className="flex justify-between">
                  <div></div>
                  <Link href="/cart" className="text-indigo-700 font-bold">
                    Edit
                  </Link>
                </div> */}
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
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  return { props: { params } }
}

export default dynamic(() => Promise.resolve(OrderScreen), { ssr: false })
