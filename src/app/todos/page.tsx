'use client'

import { Button, Card, Form, Input, Modal, Table } from 'antd'
import useTodo, { TodoSubmission } from '@/hooks/todo'
import { PlusOutlined } from '@ant-design/icons'
import getTodoColumns from './columns'
import { useState } from 'react'

export default function Page() {
  const { todos, loading, add, edit, remove } = useTodo()
  const [todoForm] = Form.useForm<TodoSubmission>()

  const [openedFormModalType, setOpenedFormModalType] = useState<
    'Add' | 'Edit' | null
  >(null)

  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null)

  const columns = getTodoColumns({
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
    if (selectedTodoId === null) {
      return
    }
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

  return (
    <>
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
