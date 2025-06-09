import React, { useState } from 'react';
import FarmingModelForm from '../../components/admin/farmingModel/FarmingModelForm';
import FarmingModelList from '../../components/admin/farmingModel/FarmingModelList';
import SidebarAdmin from '../../components/admin/adminSidebar';
import { toast } from 'react-toastify';
import './FarmingModelManagement.css';

const FarmingModelManagement = () => {
  const [editingModel, setEditingModel] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFormSuccess = (action) => {
    setEditingModel(null);
    setRefreshTrigger(prev => prev + 1);
    toast.success(action === 'update' 
      ? 'Cập nhật mô hình thành công!'
      : 'Thêm mô hình mới thành công!'
    );
  };

  const scrollToForm = () => {
    const formElement = document.querySelector('.farming-model-management');
    const contentElement = document.querySelector('.content');
    if (formElement && contentElement) {
      contentElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="farming-model-management">
      <SidebarAdmin />
      <div className="content">
        <h2>Quản lý mô hình canh tác</h2>
        <FarmingModelForm
          initialData={editingModel}
          onSuccess={handleFormSuccess}
          onCancel={() => setEditingModel(null)}
        />
        <FarmingModelList
          onEdit={(model) => {
            setEditingModel(model);
            scrollToForm();
          }}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </div>
  );
};

export default FarmingModelManagement;