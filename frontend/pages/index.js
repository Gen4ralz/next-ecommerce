// import { useContext, useEffect } from 'react'
import Layout from '../components/Layout'
import ProductItem from '../components/ProductItem'
// import { Store } from '../utils/Store'
// import Cookies from 'js-cookie'

export default function Home({ products }) {
  // const { state, dispatch } = useContext(Store)
  // const { userInfo } = state
  // useEffect(() => {
  //   if (userInfo === null) {
  //     const requestOptions = {
  //       method: 'GET',
  //       credentials: 'include',
  //     }

  //     fetch(`http://localhost:8080/refresh`, requestOptions)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         if (data.access_token) {
  //           dispatch({ type: 'USER_LOGIN', payload: data.access_token })
  //           Cookies.set('userInfo', data.access_token)
  //         }
  //       })
  //       .catch((error) => {
  //         console.log('user is not logged in', error)
  //       })
  //   }
  // }, [dispatch, userInfo])
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

  const response = await fetch(`http://localhost:8080/products`, requestOptions)
  const data = await response.json().catch((err) => {
    console.log(err)
  })

  return {
    props: {
      products: data,
    },
  }
}
