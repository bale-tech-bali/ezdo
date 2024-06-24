'use client'

import { Button, Result, Spin, notification } from 'antd'
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { Session } from '@supabase/auth-js'
import SessionContext from './SessionContext'
import { createClient } from '@/supabase/client'
import { useRouter } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const router = useRouter()
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error)
        return notification.error({
          message: error.name,
          description: error.message,
        })

      setSession(data.session)
    }

    if (session === undefined) getSession()
  }, [supabase, session])

  if (session === undefined)
    return (
      <div style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
        <Spin size="large" />
      </div>
    )

  if (session === null)
    return (
      <div style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <Button
              type="primary"
              icon={<LoginOutlined />}
              onClick={() => {
                router.push('/')
              }}
            >
              Login
            </Button>
          }
        />
      </div>
    )

  const { user } = session
  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error)
      return notification.error({
        message: 'Logout Failed!',
        description: error.message,
      })

    router.push('/')
    notification.success({
      message: 'Logout Successful',
      description: 'Sad to see you go!',
    })
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h1>Hi, {user.email}!</h1>
        </div>
        <div>
          <Button danger icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      <SessionContext.Provider value={{ session }}>
        {children}
      </SessionContext.Provider>
    </>
  )
}
