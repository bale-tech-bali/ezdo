'use client'

import { Button, Card, Form, Input, Row, Typography } from 'antd'
import Image from 'next/image'
import { LoginOutlined } from '@ant-design/icons'
import styles from './page.module.scss'

interface Credentials {
  email: string
  password: string
}

export default function Page() {
  return (
    <div className={styles.loginCardContainer}>
      <Card
        title={
          <Row align="middle" justify="center" className={styles.loginCardHead}>
            <Image
              src="/logo.svg"
              alt="Ezdo | Simple Todo"
              height={50}
              width={50}
            />
            <Typography.Title level={4} className={styles.loginCardTitle}>
              Ezdo | Simple Todo
            </Typography.Title>
          </Row>
        }
        className={styles.loginCard}
      >
        <Form name="login" layout="vertical">
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
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              icon={<LoginOutlined />}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
