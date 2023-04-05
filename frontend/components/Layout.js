/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import Footer from './Footer'
import Header from './Header'

export default function Layout({ title, children }) {
  return (
    <>
      <Head>
        <title>{title ? title + ' - Dosimple' : 'Dosimple'}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="container mx-auto px-2 pt-2">{children}</main>
      <Footer />
    </>
  )
}
