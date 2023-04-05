import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'

export default function Carousel({
  children: images,
  autoSlide = false,
  autoSlideInterval = 3000,
}) {
  const [curr, setCurr] = useState(0)

  const prev = () =>
    setCurr((curr) => (curr === 0 ? images.length - 1 : curr - 1))
  const next = () =>
    setCurr((curr) => (curr === images.length - 1 ? 0 : curr + 1))

  useEffect(() => {
    if (!autoSlide) return
    const slideInterval = setInterval(next, autoSlideInterval)
    return () => clearInterval(slideInterval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSlide, autoSlideInterval])

  return (
    <div className="overflow-hidden relative">
      <div
        className="flex transition-transform ease-out duration-500"
        style={{ transform: `translateX(-${curr * 100}%)` }}>
        {images}
      </div>
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button
          onClick={prev}
          className="p-1 rounded-full shadow bg-white/50 text-gray-800">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button
          onClick={next}
          className="p-1 rounded-full shadow bg-white/50 text-gray-800">
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`transition-all w-3 h-3 bg-white rounded-full ${
                curr === i ? 'p-2' : 'bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
