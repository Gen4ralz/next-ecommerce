/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import React from 'react'

export default function ProductItem({ product }) {
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <img src={product.image} alt={product.name} />
      </Link>
      <div className="flex flex-col items-left justify-center pl-2">
        <h2 className="font-bold mt-1">{product.name}</h2>
        <p className="text-sm text-gray-400">{product.brand}</p>
        <p className="font-bold">{product.price} ฿</p>
      </div>
    </div>
  )
}
