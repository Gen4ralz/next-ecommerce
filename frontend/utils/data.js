const data = {
  products: [
    {
      name: 'Nina Sets',
      slug: 'nina-sets',
      category: 'Sets',
      image: '/images/nina-bn.jpg',
      images: [
        { src: '/images/nina-bn.jpg', alt: 'nina-bn' },
        { src: '/images/nina-cm.jpg', alt: 'nina-cm' },
        { src: '/images/nina-gn.jpg', alt: 'nina-gn' },
        { src: '/images/nina-pk.jpg', alt: 'nina-pk' },
      ],
      colors: [
        {
          name: 'Brick',
          class: '#A0522D',
          sizes: [{ name: 'Freesize', stock: 5 }],
          sku: 'nina-bn',
          image: '/images/nina-bn.jpg',
        },
        {
          name: 'Cream',
          class: '#FFF5EE',
          sizes: [{ name: 'Freesize', stock: 2 }],
          sku: 'nina-cm',
          image: '/images/nina-cm.jpg',
        },
        {
          name: 'Olive',
          class: '#556B2F',
          sizes: [{ name: 'Freesize', stock: 0 }],
          sku: 'nina-gn',
          image: '/images/nina-gn.jpg',
        },
        {
          name: 'Pink',
          class: '#DDA0DD',
          sizes: [{ name: 'Freesize', stock: 5 }],
          sku: 'nina-pk',
          image: '/images/nina-pk.jpg',
        },
      ],
      price: 590,
      brand: 'Glamclothes',
      rating: 4.6,
      numReviews: 8,
      description:
        'ชุดเซทสายไขว้ เนื้อผ้าลื่นนิ่ม ใส่สบาย ลุคชิลๆ กางเกงเอวยางยืดรอบตัว  แนะนำเลยค่า งานแกรมเหมือนเดิมค่า',
      details: [
        { bust: 36, length: 22 },
        { waise: '24 - 38', hip: 38, length: 39 },
      ],
      models: [
        { height: '160 ซม.' },
        { size: '32 / 25 / 34' },
        { wear: 'นางแบบสวมใส่ไซส์ S หรือ Freesize' },
      ],
    },
    {
      name: 'Sundae Sets',
      slug: 'sundae-sets',
      category: 'Sets',
      image: '/images/sundae-cf.jpg',
      sizes: ['S', 'M', 'L'],
      price: 590,
      brand: 'Glamclothes',
      rating: 4.6,
      numReviews: 5,
      countInStock: 0,
      description: 'A popular sets',
    },
    {
      name: 'Tweed Look Sets',
      slug: 'tweed-look-sets',
      category: 'Sets',
      image: '/images/tweed-wh.jpg',
      sizes: ['Freesize'],
      price: 590,
      brand: 'Glamclothes',
      rating: 4.4,
      numReviews: 8,
      countInStock: 20,
      description: 'A popular sets',
    },
  ],
}

export default data
