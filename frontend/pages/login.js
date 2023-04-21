import Link from 'next/link'
import React, { useContext, useEffect } from 'react'
import Layout from '../components/Layout'
import { useForm } from 'react-hook-form'
import { getError } from '../utils/error'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { Store } from '../utils/Store'
import Cookies from 'js-cookie'

export default function LoginScreen() {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const { userInfo } = state
  const { redirect } = router.query

  useEffect(() => {
    if (userInfo?.name) {
      router.push(redirect || '/')
    }
  }, [redirect, router, userInfo?.name])

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm()

  const submitHandler = ({ email, password }) => {
    // build the request payload
    let payload = {
      email: email,
      password: password,
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    }

    fetch(`http://localhost:8080/authenticate`, requestOptions)
      .then((response) => response.json())

      .then((data) => {
        console.log(data)
        if (data.error) {
          // handle error
          toast.error(data.message)
        } else {
          // handle success
          dispatch({ type: 'USER_LOGIN', payload: data })
          Cookies.set('userInfo', JSON.stringify(data))
          router.push(redirect || '/')
        }
      })
      .catch((error) => {
        // handle network error
        toast.error(getError(error))
      })
  }

  return (
    <Layout title="Login">
      <form
        className="mx-auto max-w-screen-md px-6"
        onSubmit={handleSubmit(submitHandler)}>
        <h1 className="py-4 text-xl font-bold text-center">Login</h1>
        <div className="mb-4">
          <label htmlFor="email" className="font-bold">
            Email
          </label>
          <input
            type="email"
            {...register('email', {
              required: 'Please enter email',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Please enter valid email',
              },
            })}
            className="w-full mt-2"
            id="email"
            autoFocus
          />
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="font-bold">
            Password
          </label>
          <input
            type="password"
            {...register('password', {
              required: 'Please enter password',
              minLength: { value: 6, message: 'Password is more than 5' },
            })}
            className="w-full mt-2"
            id="password"
            autoFocus
          />
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <button className="primary-button w-full" type="submit">
            Login
          </button>
        </div>
        <div className="mb-4">
          Don&apos;t have an account? &nbsp;
          <Link href="register" className="text-rose-500 font-bold">
            Register
          </Link>
        </div>
      </form>
    </Layout>
  )
}
