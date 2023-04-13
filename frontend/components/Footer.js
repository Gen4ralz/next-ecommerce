import {
  HomeIcon,
  ShoppingBagIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { Store } from '../utils/Store'
import dynamic from 'next/dynamic'

function Footer() {
  const router = useRouter()
  const path = router.pathname
  const { state } = useContext(Store)
  const { cart } = state
  return (
    <footer className="sticky bottom-0 bg-white p-5 w-full flex border-t border-gray-200 shadow-inner justify-center items-center space-x-12 text-gray-600">
      <Link
        href="/"
        className={
          (path === '/'
            ? 'text-sky-700 border-sky-500 bg-sky-50'
            : 'border-gray-200') +
          ' w-16 h-16 rounded-lg bg-white border flex flex-col justify-center items-center'
        }>
        <HomeIcon className="w-6 h-6" />
        <span className="text-xs mt-2">Home</span>
      </Link>
      <Link
        href="/cart"
        className={
          (path === '/cart'
            ? 'text-sky-700 border-sky-500 bg-sky-50'
            : 'border-gray-200') +
          ' w-16 h-16 rounded-lg bg-white border border-gray-200 flex flex-col justify-center items-center'
        }>
        <ShoppingBagIcon className="w-6 h-6 text-center"></ShoppingBagIcon>
        <span className="mt-2 text-xs">
          Cart{' '}
          {cart.cartItems.length > 0 && (
            <span className="ml-1 rounded-full bg-rose-500 text-xs font-bold text-white px-1">
              {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
            </span>
          )}
        </span>
      </Link>

      <Link
        href="/login"
        className={
          (path === '/login'
            ? 'text-sky-700 border-sky-500 bg-sky-50'
            : 'border-gray-200') +
          ' w-16 h-16 rounded-lg bg-white border border-gray-200 flex flex-col justify-center items-center'
        }>
        <UserIcon className="w-6 h-6" />
        <span className="mt-2 text-xs">User</span>
      </Link>
    </footer>
  )
}

export default dynamic(() => Promise.resolve(Footer), { ssr: false })
