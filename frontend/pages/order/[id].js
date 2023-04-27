import React, { useContext, useEffect, useReducer } from 'react'
import Layout from '../../components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { Store } from '../../utils/Store'
import { getError } from '../../utils/error'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { toast } from 'react-toastify'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true }
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true }
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload }
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' }
    default:
      state
  }
}

function OrderScreen({ params }) {
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()
  const orderId = params.id
  const { state } = useContext(Store)
  const { userInfo } = state
  const router = useRouter()

  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
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
      router.push('/login')
      return
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
          `${process.env.NEXT_PUBLIC_BACKEND}/api/orders/${orderId}`,
          requestOptions
        )
        const data = await response.json()
        dispatch({ type: 'FETCH_SUCCESS', payload: data.data })
        console.log(data.data)
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
        console.log(err)
      }
    }
    if (!order.id || successPay || (order.id && order.id !== orderId)) {
      fetchOrder()
      if (successPay) {
        dispatch({ type: 'PAY_RESET' })
      }
      //   if (successDeliver) {
      //     dispatch({ type: 'DELIVER_RESET' })
      //   }
    } else {
      const loadPaypalScript = async () => {
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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND}/api/keys/paypal`,
          requestOptions
        )
        const data = await response.json()
        paypalDispatch({
          type: 'resetOptions',
          value: { 'client-id': data.data, currency: 'THB' },
        })
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' })
      }
      loadPaypalScript()
    }
  }, [order, orderId, paypalDispatch, router, successPay, userInfo])

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID
      })
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' })
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append(
          'Authorization',
          'Bearer ' + `${userInfo.tokens.access_token}`
        )

        console.log(details)

        const payload = {
          id: details.id,
          status: details.status,
          email_address: details.payer.email_address,
          intent: details.intent,
        }

        const requestOptions = {
          method: 'PUT',
          headers: headers,
          credentials: 'include',
          body: JSON.stringify(payload),
        }
        console.log(requestOptions.body)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND}/api/orders/${orderId}/pay`,
          requestOptions
        )
        const data = await response.json()
        console.log(data.data)
        dispatch({ type: 'PAY_SUCCESS', payload: data.data })
        toast.success('Order is paid successfully')
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) })
        toast.error(getError(err))
      }
    })
  }

  function onError(err) {
    toast.error(getError(err))
  }

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
                  {!isPaid && (
                    <li>
                      {isPending ? (
                        <div>Loading...</div>
                      ) : (
                        <div className="w-full">
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}></PayPalButtons>
                        </div>
                      )}
                      {loadingPay && <div>Loading...</div>}
                    </li>
                  )}
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
