import { useCallback, useEffect, useState } from 'react'
import GenericOmittedFields from '@/models/utils/GenericOmittedFields'
import Todo from '@/models/Todo'
import { createClient } from '@/supabase/client'
import { notification } from 'antd'

export type TodoSubmission = Omit<Todo, GenericOmittedFields>

export default function useTodo() {
  const supabase = createClient()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(false)
  const [mutate, setMutate] = useState(true)

  useEffect(() => {
    const getTodos = async () => {
      setLoading(true)

      const response = await supabase
        .from(tableName)
        .select()
        .order('created_at', { ascending: true })
        .returns<Todo[]>()

      if (response.error) {
        notification.error({
          message: response.error.message,
          description: response.error.details,
        })
        setLoading(false)
        return
      }

      setTodos(response.data || [])
      setLoading(false)
      setMutate(false)
    }

    if (mutate) getTodos()
  }, [supabase, mutate])

  const refresh = () => setMutate(true)

  const add = useCallback(
    async (submission: TodoSubmission) => {
      setLoading(true)
      const { error } = await supabase.from(tableName).insert(submission)
      if (error) {
        notification.error({
          message: error.message,
          description: error.details,
        })
        setLoading(false)
        return
      }
      setMutate(true)
      notification.success({
        message: `${entityName} added!`,
      })
    },
    [supabase],
  )

  const edit = useCallback(
    async ({ id, submission }: { id: number; submission: TodoSubmission }) => {
      setLoading(true)
      const { error } = await supabase
        .from(tableName)
        .update(submission)
        .eq('id', id)
      if (error) {
        notification.error({
          message: error.message,
          description: error.details,
        })
        setLoading(false)
        return
      }
      setMutate(true)
      notification.success({
        message: `${entityName} edited!`,
      })
    },
    [supabase],
  )

  const remove = useCallback(
    async (id: number) => {
      setLoading(true)
      const { error } = await supabase.from(tableName).delete().eq('id', id)
      if (error) {
        notification.error({
          message: error.message,
          description: error.details,
        })
        setLoading(false)
        return
      }
      setMutate(true)
      notification.success({
        message: `${entityName} removed!`,
      })
    },
    [supabase],
  )

  return { todos, loading, refresh, add, edit, remove }
}

const tableName = 'todos'
const entityName = 'Todo'
