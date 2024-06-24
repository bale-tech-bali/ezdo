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

      const { data, error } = await supabase
        .from('todos')
        .select()
        .order('created_at', { ascending: true })
        .returns<Todo[]>()

      if (error) {
        notification.error({
          message: error.message,
          description: error.details,
        })
        setLoading(false)
        return
      }

      setTodos(data)
      setLoading(false)
      setMutate(false)
    }

    if (mutate) getTodos()
  }, [supabase, mutate])

  const refresh = () => setMutate(true)

  const add = useCallback(
    async (submission: TodoSubmission) => {
      setLoading(true)
      const { error } = await supabase.from('todos').insert(submission)
      if (error) {
        notification.error({
          message: error.message,
          description: error.details,
        })
        setLoading(false)
        return
      }
      setMutate(true)
      notification.success({ message: 'Todo added!' })
    },
    [supabase],
  )

  const edit = useCallback(
    async ({ id, submission }: { id: number; submission: TodoSubmission }) => {
      setLoading(true)
      const { error } = await supabase
        .from('todos')
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
      notification.success({ message: 'Todo edited!' })
    },
    [supabase],
  )

  const remove = useCallback(
    async (id: number) => {
      setLoading(true)
      const { error } = await supabase.from('todos').delete().eq('id', id)
      if (error) {
        notification.error({
          message: error.message,
          description: error.details,
        })
        setLoading(false)
        return
      }
      setMutate(true)
      notification.success({ message: 'Todo removed!' })
    },
    [supabase],
  )

  return { todos, loading, refresh, add, edit, remove }
}
