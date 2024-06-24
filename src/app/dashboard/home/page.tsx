'use client'

import { Button, Card, Form, Input, Modal, Table, notification } from 'antd'
import { LogoutOutlined, PlusOutlined } from '@ant-design/icons'
import useTodo, { TodoSubmission } from '@/hooks/todo'
import { createClient } from '@/supabase/client'
import getTodoColumns from './columns'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const supabase = createClient()
  const router = useRouter()
  const { todos, loading, refresh, add, edit, remove } = useTodo()
  const [todoForm] = Form.useForm<TodoSubmission>()

  const [openedFormModalType, setOpenedFormModalType] = useState<
    'Add' | 'Edit' | null
  >(null)

  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null)

  const columns = getTodoColumns({
    refreshCallback: refresh,
    editCallback: (todo) => {
      todoForm.setFieldsValue(todo)
      setSelectedTodoId(todo.id)
      setOpenedFormModalType('Edit')
    },
    removeCallback: (id) => remove(id),
  })

  const submitForm = () => {
    switch (openedFormModalType) {
      case 'Add':
        addTodo()
        break
      case 'Edit':
        editTodo()
        break
    }
  }

  const addTodo = () => {
    todoForm
      .validateFields()
      .then(async (value) => {
        await add(value)
        submitSuccessCallback()
      })
      .catch(() => {})
  }

  const editTodo = async () => {
    if (selectedTodoId === null) return
    todoForm
      .validateFields()
      .then(async (value) => {
        await edit({
          id: selectedTodoId,
          submission: value,
        })
        submitSuccessCallback()
      })
      .catch(() => {})
  }

  const submitSuccessCallback = () => {
    setOpenedFormModalType(null)
    todoForm.resetFields()
  }

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
      <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 12 }}>
        <Button danger icon={<LogoutOutlined />} onClick={logout}>
          Logout
        </Button>
      </div>

      <Card
        title="Todos"
        extra={
          <Button
            icon={<PlusOutlined />}
            onClick={() => setOpenedFormModalType('Add')}
          />
        }
      >
        <Table
          loading={loading}
          columns={columns}
          dataSource={todos.map((todo) => ({ ...todo, key: todo.id }))}
          pagination={false}
        />
      </Card>

      <Modal
        open={!!openedFormModalType}
        title={openedFormModalType + ' Todo'}
        onCancel={() => {
          setOpenedFormModalType(null)
          todoForm.resetFields()
        }}
        onOk={submitForm}
        okText={openedFormModalType}
      >
        <Form layout="vertical" form={todoForm} onFinish={submitForm}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'This field cannot be empty!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
