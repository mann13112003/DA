import React, { useState } from 'react';
import CultivationForm from '../../components/admin/cultivation/CultivationForm';
import CultivationList from '../../components/admin/cultivation/CultivationList';
import SidebarAdmin from '../../components/admin/adminSidebar';
import { toast } from 'react-toastify';
import './CultivationManagement.css';

const CultivationManagement = () => {
  const [editingCultivation, setEditingCultivation] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFormSuccess = (action) => {
    setEditingCultivation(null);
    setRefreshTrigger(prev => prev + 1);
    toast.success(action === 'update' 
      ? 'Cập nhật kỹ thuật canh tác thành công!'
      : 'Thêm kỹ thuật canh tác mới thành công!'
    );
  };

  const scrollToForm = () => {
    const formElement = document.querySelector('.cultivation-management');
    const contentElement = document.querySelector('.content');
    if (formElement && contentElement) {
      contentElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="cultivation-management">
      <SidebarAdmin />
      <div className="content">
        <h2>Quản lý kỹ thuật canh tác</h2>
        <CultivationForm
          initialData={editingCultivation}
          onSuccess={handleFormSuccess}
          onCancel={() => setEditingCultivation(null)}
        />
        <CultivationList
          onEdit={(cultivation) => {
            setEditingCultivation(cultivation);
            scrollToForm();
          }}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </div>
  );
};

export default CultivationManagement;