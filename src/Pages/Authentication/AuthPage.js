import { useState, useEffect } from "react";
import LoginCard from "../../Components/LoginCard";
import { supabase } from "../../supabase-client";
import { Button } from "antd";

export default function LoginPage() {
  const [session, setSession] = useState(null);
  const [metadata, setMetadata] = useState({
    userType: "",
  });

  async function getUserMetadata() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user.user_metadata;
  }

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
      console.log(_event);
      if (_event === "SIGNED_IN") {
        setMetadata(getUserMetadata().then((res) => setMetadata(res)));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <LoginCard supabase={supabase} session={session} logout={logout} />;
  } else {
    if (metadata.userType === "agent") {
      window.location.href = "/agent/";
    } else if (metadata.userType === "student") {
      window.location.href = "/student";
    }
    return (
      <>
        <Button primary danger onClick={logout}>
          Logout
        </Button>
        <h1>Hi</h1>
      </>
    );
  }
}
