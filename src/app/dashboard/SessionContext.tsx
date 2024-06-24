import { Session } from '@supabase/auth-js'
import { createContext } from 'react'

const SessionContext = createContext<{ session: Session | null | undefined }>({
  session: undefined,
})

export default SessionContext
