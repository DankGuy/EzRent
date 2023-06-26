import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_ANON_KEY;

export const useCheckLogin = () => {
  const [session, setSession] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      console.log(_event);
      if (_event != "SIGNED_IN") {
        window.location.href = "/";
      }
    });

    return () => subscription.unsubscribe();
  }, []);
};
export const supabase = createClient(supabaseUrl, supabaseKey);
