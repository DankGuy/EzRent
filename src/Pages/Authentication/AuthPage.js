import { useState, useEffect } from "react";
import LoginCard from "../../Components/LoginCard";
import { supabase } from "../../supabase-client";

export default function LoginPage() {
  const [session, setSession] = useState(null);

  const logout = () => {
    supabase.auth.signOut();
  };


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      console.log(_event)
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <LoginCard supabase={supabase} session={session} logout={logout} />
  )
}