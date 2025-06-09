import React, { useState } from 'react';
import UserForm from '../../components/admin/user/UserForm';
import UserList from '../../components/admin/user/UserList';
import SidebarAdmin from '../../components/admin/adminSidebar';
import { toast } from 'react-toastify';
import './UserManagement.css';

const UserManagement = () => {
  const [editingUser, setEditingUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFormSuccess = (action) => {
    setEditingUser(null);
    setRefreshTrigger(prev => prev + 1);
    toast.success(action === 'update' 
      ? 'Cập nhật người dùng thành công!'
      : 'Thêm người dùng mới thành công!'
    );
  };
  const scrollToForm = () => {
    const formElement = document.querySelector('.user-management');
    const contentElement = document.querySelector('.content');
    if (formElement && contentElement) {
      contentElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="user-management">
      <SidebarAdmin />
      <div className="content">
        <h2>Quản lý người dùng</h2>
        <UserForm
          initialData={editingUser}
          onSuccess={handleFormSuccess}
          onCancel={() => setEditingUser(null)}
        />
        <UserList
          onEdit={(user) => {
            setEditingUser(user);
            scrollToForm();
          }}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </div>
  );
};

export default UserManagement;