import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export function NavigateHomePage() {

    const navigate = useNavigate();
    const { userSession } = useAuth();

    if (userSession) {
        if (userSession.user.user_metadata.userType === "agent") {
            navigate("/agent");
        } else if (userSession.user.user_metadata.userType === "student") {
            navigate("/student");

        }

    }
}