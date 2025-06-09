import React, { useState } from 'react';
import RiceForm from '../../components/admin/rice/RiceForm';
import RiceList from '../../components/admin/rice/RiceList';
import { toast } from 'react-toastify';
import SidebarAdmin from "../../components/admin/adminSidebar";
import './RiceManagement.css';
import 'react-markdown-editor-lite/lib/index.css';

const RiceManagement = () => {
  const [editingRice, setEditingRice] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);  
  const handleFormSuccess = (action) => {
    setEditingRice(null);
    setRefreshTrigger(prev => prev + 1);
    if (action === 'update') {
      toast.success("Cập nhật giống lúa thành công!");
    } else {
      toast.success("Tạo giống lúa thành công!");
    }
  };

  const handleCancelEdit = () => {
    setEditingRice(null);
  };

  const scrollToForm = () => {
    const formElement = document.querySelector('.rice-form-container');
    const contentElement = document.querySelector('.rice-content');
    if (formElement && contentElement) {
      contentElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  return (
    <div className="rice-management-container">
      <SidebarAdmin />
      <div className="rice-content">
        <h2>Quản lý giống lúa</h2>
        <RiceForm 
          initialData={editingRice}
          onSuccess={handleFormSuccess}
          onCancel={handleCancelEdit}
        />
        <RiceList 
          onEdit={(rice) => {
            setEditingRice(rice);
            scrollToForm();
          }}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </div>
  );
};

export default RiceManagement;
