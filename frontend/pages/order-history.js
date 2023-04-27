import React, { useContext, useEffect, useReducer } from 'react'
import { getError } from '../utils/error'
import { Store } from '../utils/Store'
import Layout from '../components/Layout'
import Link from 'next/link'
import { useRouter } from 'next/router'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '', orders: action.payload }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export default function OrderHistoryScreen() {
  const router = useRouter()
  const { state } = useContext(Store)
  const { userInfo } = state
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  })
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
          `http://localhost:8080/api/orders/history`,
          requestOptions
        )
        const data = await response.json()
        console.log(data.data)
        dispatch({ type: 'FETCH_SUCCESS', payload: data.data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }
    fetchOrder()
  }, [router, userInfo])
  return (
    <Layout title="Order History">
      <h1 className="py-4 text-xl font-bold text-center">Order History</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b">
              <tr>
                <th className="px-5 text-center">ORDER</th>
                <th className="px-12 text-center">DATE</th>
                <th className="px-5 text-center">TOTAL</th>
                <th className="px-12 text-center">PAID</th>
                <th className="px-5 text-center">DELIVERED</th>
                <th className="px-5 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="text-sm text-center py-4">
                    {order.id.substring(20, 24)}
                  </td>
                  <td className="text-sm text-center">
                    {order.created_at.substring(0, 10)}
                  </td>
                  <td className="text-sm text-center">{order.totalPrice}</td>
                  <td className="text-sm text-center">
                    {order.isPaid ? (
                      <p className="text-green-500">
                        {order.paidAt.substring(0, 10)}
                      </p>
                    ) : (
                      <p className="text-red-500">not paid</p>
                    )}
                  </td>
                  <td className="text-center text-sm">
                    {order.isDelivered ? (
                      `${order.deliveredAt.substring(0, 10)}`
                    ) : (
                      <p className="text-red-500">not delivered</p>
                    )}
                  </td>
                  <td className="text-sm text-center">
                    <Link
                      href={`/order/${order.id}`}
                      className="p-2 bg-black text-white rounded-md">
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
