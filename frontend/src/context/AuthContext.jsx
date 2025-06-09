import { createContext, useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import { login,getCurrentUser,logOut } from "../services/api";
import { toast } from "react-toastify";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Khi app load lại: kiểm tra xem cookie hợp lệ, nếu có thì lấy user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getCurrentUser();
                if (res.data && res.data.user) {
                    setUser(res.data.user);
                }
            } catch (err) {
                console.error("Không thể lấy thông tin user từ cookie:", err);
                setUser(null);
            }
            finally {
                setLoading(false);  // <== khi xong thì tắt loading
            }
        };
        fetchUser();
    }, []);

    const log_in = async (email, password) => {
        try {
            const response = await login({ email, password }); // backend set cookie HttpOnly tại đây
            if (response.data.errCode === 0) {
                toast.success("Đăng nhập thành công!");
                const userData = response.data.user;
                setUser(userData); // lưu user vào state, không lưu localStorage nữa

                if (userData.role === "admin") {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/");
                }
            } else {
                toast.error(response.data.errMessage);
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Lỗi đăng nhập, vui lòng thử lại.");
        }
    };

    const logout = async() => {
        setUser(null);
        await logOut()
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user,loading, log_in, logout }}>
            {children}
        </AuthContext.Provider>
    );
};