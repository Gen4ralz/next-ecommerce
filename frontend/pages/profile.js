import React, { useContext } from 'react'
import { Store } from '../utils/Store'

export default function Profile() {
  const { state } = useContext(Store)
  const { userInfo } = state
  return (
    <div>
      <h1>{userInfo.name}</h1>
    </div>
  )
}
