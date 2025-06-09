import React from "react";
import './userFooter.css';

const UserFooter = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Liên hệ</h3>
                    <ul>
                        <li>Email: contact@luaviet.com</li>
                        <li>Điện thoại: (84) 123-456-789</li>
                        <li>Địa chỉ: Thành phố Hà Nội</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 LuaViet. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default UserFooter;