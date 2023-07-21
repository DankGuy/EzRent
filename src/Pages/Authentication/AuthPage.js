import { useState, useEffect, useNavigate } from "react";
import LoginCard from "../../Components/LoginCard";
import { supabase } from "../../supabase-client";

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

  const navigate = useNavigate();

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
    return <LoginCard />;
  } else {
    if (metadata.userType === "agent") {
      localStorage.setItem("selectedKey", "/agent");
      navigate("/agent");

      // TODO: Check whether the student is admin or not (get userID, query from student table, check if admin or not)
    } else if (metadata.userType === "student") {
      localStorage.setItem("selectedKey", "/student/profile/profileInformation");
      navigate("/agent");
    }
  }
}
