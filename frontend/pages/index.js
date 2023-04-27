import Layout from '../components/Layout'
import ProductItem from '../components/ProductItem'

export default function Home({ products }) {
  return (
    <Layout title="Home Page">
      <div className="grid grid-cols-2 gap-x-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem product={product} key={product.slug}></ProductItem>
        ))}
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  const requestOptions = {
    method: 'GET',
    headers: headers,
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND}/products`,
    requestOptions
  )
  const data = await response.json().catch((err) => {
    console.log(err)
  })

  return {
    props: {
      products: data,
    },
  }
}
