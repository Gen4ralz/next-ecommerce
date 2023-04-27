import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { Store } from '../utils/Store'
import Cookies from 'js-cookie'
import { Menu } from '@headlessui/react'
import dynamic from 'next/dynamic'

function Header() {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const { cart, userInfo } = state
  const path = router.pathname
  const [name, setName] = useState('')
  const [cartItemsCount, setCartItemsCount] = useState(0)

  useEffect(() => {
    setName(userInfo ? userInfo.name : '')
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0))
  }, [cart.cartItems, userInfo])

  const logoutHandler = () => {
    dispatch({ type: 'USER_LOGOUT' })
    Cookies.remove('userInfo')
    localStorage.removeItem('cartItems')
    router.push('/login')
  }
  return (
    <div
      className={
        (path.match(/^\/product\/.*/) ? 'hidden' : '') ||
        (path === '/login' ? 'hidden' : '') ||
        (path === '/cart' ? 'hidden' : '') +
          ' bg-white shadow-sm sticky top-0 z-50'
      }>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-4">
        <div className="flex items-center justify-between sm:mx-2">
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

          <div className="flex items-center space-x-2">
            <Link
              href="/cart"
              className="w-14 h-12 rounded-lg bg-gray-100 border border-gray-200 flex justify-center items-center">
              <ShoppingBagIcon className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="ml-1 rounded-full bg-rose-500 text-xs font-bold text-white px-1">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            {userInfo ? (
              <Menu as="div" className="relative">
                <div>
                  <Menu.Button className="items-center space-x-2 w-14 h-12 rounded-lg bg-gray-100 border border-gray-200">
                    <span className="text-blue-600">
                      {userInfo ? name : ''}
                    </span>
                  </Menu.Button>
                </div>
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/profile"
                          className={`${
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700'
                          } block px-4 py-2 text-sm`}>
                          Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/order-history"
                          className={`${
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700'
                          } block px-4 py-2 text-sm`}>
                          Order History
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logoutHandler}
                          className={`${
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700'
                          } block w-full text-left px-4 py-2 text-sm`}>
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            ) : (
              <Link
                href="/login"
                className="w-14 h-12 rounded-lg bg-gray-100 border border-gray-200 flex justify-center items-center">
                <Image
                  src="https://avatars.dicebear.com/api/bottts/2.svg"
                  alt="bottts"
                  width="28"
                  height="28"
                  className="rounded-lg mx-auto"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(Header), { ssr: false })
