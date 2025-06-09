import "./adminSidebar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaUser, FaSeedling, FaBug, FaBook, FaSignOutAlt,FaLayerGroup } from "react-icons/fa";
import {AuthContext} from "../../context/AuthContext"
import { useContext } from "react";
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {user,logout} = useContext(AuthContext);
  return (
    <div className="sidebar">
      <div className="profile">
          <img src="https://haycafe.vn/wp-content/uploads/2022/02/Avatar-trang-den.png" alt="profile" />
          <span>{user.username}</span>
      </div>
      <ul className="menu">
          <li className={location.pathname === "/admin/dashboard" ? "active" : ""} onClick={() => navigate("/admin/dashboard")}> 
            <FaHome className="icon" /> Bảng điều khiển
          </li>
          <li className={location.pathname === "/admin/user-management" ? "active" : ""} onClick={() => navigate("/admin/user-management")}> 
            <FaUser className="icon" /> Quản lý người dùng
          </li>
          <li className={location.pathname === "/admin/rice-management" ? "active" : ""} onClick={() => navigate("/admin/rice-management")}> 
            <FaSeedling className="icon" /> Quản lý giống lúa
          </li>
          <li className={location.pathname === "/admin/pest-diseases-management" ? "active" : ""} onClick={() => navigate("/admin/pest-diseases-management")}> 
            <FaBug className="icon" /> Quản lý sâu bệnh
          </li>
          <li className={location.pathname === "/admin/cultivation-management" ? "active" : ""} onClick={() => navigate("/admin/cultivation-management")}> 
            <FaBook className="icon" /> Quản lý quy trình canh tác
          </li>
          <li className={location.pathname === "/admin/farming-model-management" ? "active" : ""} onClick={() => navigate("/admin/farming-model-management")}> 
            <FaLayerGroup className="icon" /> Mô hình canh tác
          </li>
      </ul>
      <div className="logout" onClick={logout}> 
        <FaSignOutAlt className="icon" /> Đăng xuất
      </div>
    </div>
  );
};

export default Sidebar;
