import { useState, useEffect } from "react";
import LoginCard from "../../Components/LoginCard";
import { supabase } from "../../supabase-client";
import { Button } from "antd";
import AgentLayout from "../agent/AgentLayout";
import StudentLayout from "../student/StudentLayout";

export default function AuthPage({}) {
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
      else {
        console.log("not signed in");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <LoginCard supabase={supabase} session={session} logout={logout} />;
  } else {
    if (metadata.userType === "agent") {
      localStorage.setItem("selectedKey", "/agent");
      // setUserType("agent");
      window.location.href = "/agent";

    } else if (metadata.userType === "student") {
      localStorage.setItem("selectedKey", "/student/profile/profileInformation");
      // setUserType("student");
      window.location.href = "/student";
    }
  }
}
