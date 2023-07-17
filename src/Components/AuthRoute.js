import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const AuthRoute = () => {
    const location = useLocation();

    const {auth} = useAuth();

    console.log(auth);
    return auth ? (
        <Outlet />
    ) : (
        <Navigate to={"/login"} replace state={{ path: location.pathname }} />
    );
};

export default AuthRoute;