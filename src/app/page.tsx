'use client'

import { Button, Card, Form, Input, Row, Typography, notification } from 'antd'
import Image from 'next/image'
import { LoginOutlined } from '@ant-design/icons'
import { createClient } from '@/supabase/client'
import styles from './page.module.scss'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const login = async (credentials: Credentials) => {
    setLoading(true)
    const response = await supabase.auth.signInWithPassword(credentials)
    if (response.error) {
      notification.error({
        message: 'Login Failed!',
        description: response.error.message,
      })
      setLoading(false)
      return
    }
    notification.success({
      message: 'Login Successful',
      description: `Hi, ${response.data.user.email}!`,
    })
    router.push('/todos')
  }

  return (
    <div className={styles.loginCardContainer}>
      <Card
        title={
          <Row align="middle" justify="center" className={styles.loginCardHead}>
            <Image
              src="/logo.svg"
              alt="ezdo | Simple Todo"
              height={50}
              width={50}
            />
            <Typography.Title level={4} className={styles.loginCardTitle}>
              ezdo | Simple Todo
            </Typography.Title>
          </Row>
        }
        className={styles.loginCard}
      >
        <Form
          name="login"
          layout="vertical"
          disabled={loading}
          onFinish={login}
        >
          <Form.Item<Credentials>
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input a valid email!',
                type: 'email',
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item<Credentials>
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              icon={<LoginOutlined />}
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

interface Credentials {
  email: string
  password: string
}
