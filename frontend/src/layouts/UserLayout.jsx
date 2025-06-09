// layouts/UserLayout.js
import { Outlet } from "react-router-dom";
import UserHeader from "../components/user/userHeader";
import UserFooter from "../components/user/userFooter";
const UserLayout = () => {
  return (
    <div>
      <UserHeader />
      <div className="container">
        <Outlet /> {/* Nơi hiển thị các trang con */}
      </div>
      <UserFooter/>
    </div>
  );
};

export default UserLayout;
