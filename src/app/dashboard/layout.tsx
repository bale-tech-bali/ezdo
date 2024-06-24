'use client'

import { Button, Result, Spin, notification } from 'antd'
import { useEffect, useState } from 'react'
import { LoginOutlined } from '@ant-design/icons'
import { Session } from '@supabase/auth-js'
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

  return <>{children}</>
}
