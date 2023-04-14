import { createContext, useReducer } from 'react'
import Cookies from 'js-cookie'

export const Store = createContext()

const ls = typeof window !== 'undefined' ? window.localStorage : null

const cart = ls?.getItem('cart')
  ? JSON.parse(ls.getItem('cart'))
  : {
      cartItems: [],
      shippingAddress: { location: {} },
      paymentMethod: '',
    }

const initialState = {
  cart,
  userInfo: Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload
      const { sku } = newItem
      const existItem = state.cart.cartItems.find(
        (item) =>
          // item.slug === name &&
          // item.color === color &&
          // item.size === size &&
          item.sku === sku
      )
      if (existItem) {
        const cartItems = state.cart.cartItems.map((item) =>
          // item.name === name &&
          // item.color === color &&
          // item.size === size &&
          item.sku === sku ? newItem : item
        )
        ls?.setItem('cart', JSON.stringify({ ...state.cart, cartItems }))
        return { ...state, cart: { ...state.cart, cartItems } }
      } else {
        const cartItems = [...state.cart.cartItems, newItem]
        ls?.setItem('cart', JSON.stringify({ ...state.cart, cartItems }))
        return { ...state, cart: { ...state.cart, cartItems } }
      }
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.sku !== action.payload.sku
      )
      ls?.setItem('cart', JSON.stringify({ ...state.cart, cartItems }))
      return { ...state, cart: { ...state.cart, cartItems } }
    }
    case 'USER_LOGIN':
      return { ...state, userInfo: action.payload }
    case 'USER_LOGOUT':
      return { ...state, userInfo: null, cart: { cartItems: [] } }
    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = { state, dispatch }
  return <Store.Provider value={value}>{children}</Store.Provider>
}
