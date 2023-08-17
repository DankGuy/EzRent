import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

// const login = (email, password) =>
//   supabase.auth.signInWithPassword({ email, password });

// const signOut = () => supabase.auth.signOut();

// const passwordReset = (email) =>
//   supabase.auth.resetPasswordForEmail(email, {
//     redirectTo: "http://localhost:5173/update-password"
//   });

// const updatePassword = (updatedPassword) =>
//   supabase.auth.updateUser({ password: updatedPassword });

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [userSession, setUserSession] = useState(null); // new
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    //get user session
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();

      // console.log(data);
      // console.log(data.session) 
      if (data.session) {
        setUserSession(data.session);
        setAuth(true);
      }
      setLoading(false);
    };

    getSession();


    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      // console.log(event)
      if (event == "PASSWORD_RECOVERY") {
        setAuth(false);
        setUserSession(session);
        setLoading(false);
      } else if (event === "SIGNED_IN") {
        // setUser(session.user);
        setAuth(true);
        setUserSession(session);
        setLoading(false);
      } else if (event === "SIGNED_OUT") {
        console.log("signed out");
        setAuth(false);
        setUserSession(null);
        setLoading(false);
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);



  return (
    <AuthContext.Provider
      value={{
        auth,
        // user,
        userSession,
        // login,
        // signOut,
        // passwordReset,
        // updatePassword
      }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;