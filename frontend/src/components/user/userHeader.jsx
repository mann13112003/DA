import React, { Fragment, useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaSignOutAlt,FaBars,FaTimes } from "react-icons/fa"; 
import './userHeader.css';
import logo from "../../assets/logo.png";
const UserHeader = () => {
    const { user, logout } = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    const closeSidebar = () => {
        setSidebarOpen(false);
    };
    return (
        <Fragment>
            <nav className="navbar">
                <div className="logo">
                    <NavLink to="/">
                        <img src={logo} alt="Logo" />
                        <p>LuasViet</p>
                    </NavLink>
                </div>
                <ul className="nav-links">
                    <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Giới Thiệu</NavLink></li>
                    <li><NavLink to="/rice-variety" className={({ isActive }) => isActive ? "active" : ""}>Giống Lúa</NavLink></li>
                    <li><NavLink to="/pest-disease" className={({ isActive }) => isActive ? "active" : ""}>Sâu bệnh</NavLink></li>
                    <li><NavLink to="/cultivation" className={({ isActive }) => isActive ? "active" : ""}>Kỹ thuật canh tác</NavLink></li>
                    <li><NavLink to="/model-farm" className={({ isActive }) => isActive ? "active" : ""}>Mô hình canh tác</NavLink></li>
                </ul>
                <div className="user-section">
                    {user ? (
                        <div className="profile-user">
                            <img src="https://haycafe.vn/wp-content/uploads/2022/02/Avatar-trang-den.png" alt="profile" />
                            <span>{user.username}</span>
                            <FaSignOutAlt className="logout-icon" onClick={logout} title="Logout" />
                        </div>
                    ) : (
                        <NavLink to="/login" className="log_in">Login</NavLink>
                    )}
                </div>
                <div className="fabar" onClick={toggleSidebar}>
                    <FaBars />
                </div>
            </nav>
            
            {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
            <div className={`sidebar-toggle ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <p>Menu</p>
                    <FaTimes className="close-btn" onClick={closeSidebar} />
                </div>
                <ul>
                    <li><NavLink to="/" onClick={closeSidebar}>Giới Thiệu</NavLink></li>
                    <li><NavLink to="/rice-variety" onClick={closeSidebar}>Giống Lúa</NavLink></li>
                    <li><NavLink to="/cultivation" onClick={closeSidebar}>Kỹ Thuật Canh Tác</NavLink></li>
                    <li><NavLink to="/pest-disease" onClick={closeSidebar}>Sâu bệnh</NavLink></li>
                    <li><NavLink to="/model-farm" onClick={closeSidebar}>Mô hình canh tác</NavLink></li>
                </ul>
                <div className="sidebar-user">
                    {user ? (
                        <div>
                            <p>Welcome, {user.username}</p>
                            <FaSignOutAlt className="logout-icon" onClick={() => { logout(); closeSidebar(); }} />
                        </div>
                    ) : (
                        <NavLink to="/login" onClick={closeSidebar}>Login</NavLink>
                    )}
                </div>
            </div>
        </Fragment>
    );
};

export default UserHeader;
