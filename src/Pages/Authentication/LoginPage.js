import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { Button } from 'antd'

console.log(process.env.SUPABASE_KEY);

const supabaseUrl = 'https://exsvuquqspmbrtyjdpyc.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4c3Z1cXVxc3BtYnJ0eWpkcHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYyNzMxNDgsImV4cCI6MjAwMTg0OTE0OH0.vtMaXrTWDAluG_A-68pvQlSQ6GAskzADYfOonmCXPoo"
const supabase = createClient(supabaseUrl, supabaseKey)

export default function LoginPage() {
  const [session, setSession] = useState(null)

  const logout = () => {
    supabase.auth.signOut()
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log(session)
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log(_event)
      if(_event === 'PASSWORD_RECOVERY'){  
        window.location.href = '/reset-password'
      }
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />)
  }
  else {
    return (
      <div>
        <Button danger type='primary' onClick={logout}>logout</Button>
        Logged in!</div>
    )
  }
}