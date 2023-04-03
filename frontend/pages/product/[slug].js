/* eslint-disable @next/next/no-img-element */
import { useContext, useState } from 'react'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
import data from '../../utils/data'
import Link from 'next/link'
import { Store } from '../../utils/Store'
import { ChevronLeftIcon, StarIcon } from '@heroicons/react/24/solid'
import { RadioGroup } from '@headlessui/react'

export default function ProductScreen() {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const { query } = useRouter()
  const { slug } = query
  const product = data.products.find((x) => x.slug === slug)

  const [selectedColor, setSelectedColor] = useState(product?.colors[0])
  const [selectedSize, setSelectedSize] = useState(null)

  const handleColorSelect = (color) => {
    setSelectedColor(color)
    setSelectedSize(null)
  }

  const handleSizeSelect = (size) => {
    if (size.stock > 0) {
      setSelectedSize(size)
    }
  }

  if (!product) {
    return <div>Product Not Found</div>
  }

  const addToCartHandler = () => {
    if (selectedColor && selectedSize) {
      const cartItem = {
        product: product,
        color: selectedColor,
        size: selectedSize,
        sku: selectedColor.sku,
        quantity: 1,
      }

      // Check if the item already exists in the cart
      const existingCartItem = state.cart.cartItems.find(
        (item) =>
          item.product.slug === product.slug &&
          item.color.name === selectedColor.name &&
          item.size.name === selectedSize.name &&
          item.color.sku === selectedColor.sku
      )

      if (existingCartItem) {
        // If the item already exists, update the quantity
        const updatedCartItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        }

        dispatch({ type: 'CART_ADD_ITEM', payload: updatedCartItem })
      } else {
        // If the item does not exist, add it to the cart
        dispatch({ type: 'CART_ADD_ITEM', payload: cartItem })
      }
      router.push('/cart')
    }
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  return (
    <Layout title={product.name}>
      {/* Image gallery */}
      <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-2">
        <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
          <img
            src={product.images[0]}
            alt="cover"
            className="w-full h-full object-cover object-center"
          />
          <Link
            href="/"
            className="text-white rounded-full left-[5%] text-2xl absolute top-[15%] p-4 bg-black/20 md:hidden">
            <ChevronLeftIcon className="w-8 h-8" />
          </Link>
        </div>
      </div>

      {/* Product info */}
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg: pr-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {product.name}
          </h1>
        </div>

        {/* Option */}
        <div className="mt-4 lg:row-span-3 lg:mt-0">
          <h2 className="sr-only">Product Information</h2>
          <p className="text-3xl tracking-tight text-gray-900">
            {product.price}
          </p>
          <div className="mt-6">
            <h3 className="sr-only">Reviews</h3>
            <div className="flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    className={classNames(
                      product.rating > rating
                        ? 'text-yellow-500'
                        : 'text-gray-200',
                      'h-5 w-5 flex-shrink-0'
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="sr-only">{product.rating} out of 5 stars</p>
              <Link
                href="#"
                className="ml-3 text-sm font-medium text-indigo-600">
                {product.numReviews} reviews
              </Link>
            </div>
          </div>
          <div className="mt-10">
            <h3 className="text-sm font-medium text-gray-900">สี - Color</h3>
            <RadioGroup
              value={selectedColor}
              onChange={handleColorSelect}
              className="mt-4">
              <RadioGroup.Label className="sr-only">
                Select a color
              </RadioGroup.Label>
              <div className="flex items-center space-x-2">
                {product.colors.map((color) => (
                  <RadioGroup.Option
                    key={color.name}
                    value={color}
                    className={({ active, checked }) =>
                      classNames(
                        active && checked ? 'ring ring-offset-1' : '',
                        !active && checked ? 'ring-2' : '',
                        'relative -m-0.5 flex cursor-pointer items-center jusitfy-center rounded-full p-0.5 focus:outline-none ring-gray-400'
                      )
                    }>
                    <RadioGroup.Label as="span" className="sr-only">
                      {' '}
                      {color.name}{' '}
                    </RadioGroup.Label>
                    <span
                      aria-hidden="true"
                      className="w-8 h-8 border rounded-full"
                      style={{ backgroundColor: color.class }}
                    />
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </div>
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">ขนาด - Size</h3>
            </div>
            {selectedColor && (
              <RadioGroup
                value={selectedSize}
                onChange={handleSizeSelect}
                className="mt-4">
                <RadioGroup.Label className="sr-only">
                  Select a size
                </RadioGroup.Label>
                <div className="flex items-center space-x-2">
                  {selectedColor.sizes.map((size) => (
                    <RadioGroup.Option
                      key={size.name}
                      value={size}
                      className={({ active }) =>
                        classNames(
                          size.stock > 0
                            ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
                            : 'cursor-not-allowed bg-gray-50 text-gray-200',
                          active ? 'ring-2 ring-indigo-500' : '',
                          'group relative flex items-center jusitfy-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover: bg-gray-50 focus:outline-none sm:flex-1 sm:py-6'
                        )
                      }
                      disabled={size.stock === 0}>
                      {({ active, checked }) => (
                        <>
                          <RadioGroup.Label as="span">
                            {size.name}
                          </RadioGroup.Label>
                          {size.stock > 0 ? (
                            <span
                              className={classNames(
                                active ? 'boder' : 'border-2',
                                checked
                                  ? 'border-indigo-500'
                                  : 'border-transparent',
                                'pointer-events-none absolute -inset-px rounded-md'
                              )}
                              aria-hidden="true"
                            />
                          ) : (
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200">
                              <svg
                                className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                stroke="currentColor">
                                <line
                                  x1={0}
                                  y1={100}
                                  x2={100}
                                  y2={0}
                                  vectorEffect="non-scaling-stroke"
                                />
                              </svg>
                            </span>
                          )}
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            )}
          </div>
          <button
            onClick={addToCartHandler}
            disabled={
              !selectedColor || !selectedSize || selectedSize.stock === 0
            }
            className={
              selectedSize
                ? 'mt-10 flex w-full items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 bg-indigo-500'
                : 'mt-10 flex w-full items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white bg-gray-400 cursor-not-allowed'
            }>
            Add to cart
          </button>
        </div>
        <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
          <div>
            <h3 className="sr-only">Description</h3>
            <div className="space-y-6">
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
