import { createContext, useReducer } from 'react'
import Cookies from 'js-cookie'

export const Store = createContext()

const initialState = {
  cart: {
    cartItems: Cookies.get('cartItems')
      ? JSON.parse(Cookies.get('cartItems'))
      : [],
  },
  userInfo: Cookies.get('user-Info') ? JSON.parse(Cookies.get('userInfo')) : [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload
      const { name, color, size, sku } = newItem
      const existItem = state.cart.cartItems.find(
        (item) =>
          item.slug === name &&
          item.color === color &&
          item.size === size &&
          item.sku === sku
      )
      if (existItem) {
        const cartItems = state.cart.cartItems.map((item) =>
          item.name === name &&
          item.color === color &&
          item.size === size &&
          item.sku === sku
            ? newItem
            : item
        )
        return { ...state, cart: { ...state.cart, cartItems } }
      } else {
        const cartItems = [...state.cart.cartItems, newItem]
        return { ...state, cart: { ...state.cart, cartItems } }
      }
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.sku !== action.payload.sku
      )
      return { ...state, cart: { ...state.cart, cartItems } }
    }
    case 'USER_LOGIN':
      return { ...state, userInfo: action.payload }
    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = { state, dispatch }
  return <Store.Provider value={value}>{children}</Store.Provider>
}
