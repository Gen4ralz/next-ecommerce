/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import React from 'react'

export default function ProductItem({ product }) {
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <img
          src={product.image}
          alt={product.name}
          className="rounded shadow-md"
        />
      </Link>
      <div className="flex flex-col items-left justify-center pl-2">
        <h2 className="text-lg">{product.name}</h2>
        <p>{product.brand}</p>
        <p>฿{product.price}</p>
      </div>
    </div>
  )
}
