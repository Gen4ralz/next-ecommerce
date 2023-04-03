import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import { Store } from '../utils/Store'

export default function Header() {
  const { state } = useContext(Store)
  const { cart } = state
  const router = useRouter()
  const path = router.pathname
  // const [phrase, setPhrase] = useState(initialState:'')
  return (
    <div className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-4">
        <div className="flex items-center justify-between mx-2">
          <Link
            href="/"
            className="sm:block sm:font-bold sm:text-gray-700 sm:text-2xl hidden">
            Shop.
          </Link>
          <div className="items-center">
            <input
              type="text"
              placeholder="Search for products..."
              className={
                (path === '/cart' ? 'hidden' : '') +
                ' bg-gray-100 w-full py-2 px-4 rounded-xl mt-4'
              }
            />
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="sm:block w-16 h-12 rounded-lg bg-gray-100 border border-gray-200 flex justify-center items-center px-2">
              <ShoppingBagIcon className="w-6 h-6" />
              {cart.cartItems.length > 0 && (
                <span className="ml-1 rounded-full bg-rose-500 text-xs font-bold text-white px-1">
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                </span>
              )}
            </Link>
            <Link
              href="/login"
              className="sm:block w-16 h-12 rounded-lg bg-gray-100 border border-gray-200 flex justify-center items-center">
              <Image
                src="https://avatars.dicebear.com/api/bottts/2.svg"
                alt="bottts"
                width="28"
                height="28"
                className="rounded-lg mx-auto"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
