import { useContext } from "react";
import {Navigate, Outlet} from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({allowedRoles}) => {
    const {user,loading} = useContext(AuthContext);
    if (loading) {
        return <p>Đang kiểm tra phiên đăng nhập...</p>;
    }
    if(!user){
        return <Navigate to = "/login" replace />;
    }
    if(!allowedRoles.includes(user.role)){
        return <Navigate to = "/" replace />;
    }
    return <Outlet></Outlet>
}
export default ProtectedRoute;