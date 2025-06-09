import React, { useState } from 'react';
import PestForm from '../../components/admin/pest/PestForm';
import PestList from '../../components/admin/pest/PestList';
import { toast } from 'react-toastify';
import SidebarAdmin from "../../components/admin/adminSidebar";
import './PestDiseaseManagement.css';
import 'react-markdown-editor-lite/lib/index.css';

const PestDiseaseManagement = () => {
  const [editingPest, setEditingPest] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);  

  const handleFormSuccess = (action) => {
    setEditingPest(null);
    setRefreshTrigger(prev => prev + 1);
    if (action === 'update') {
      toast.success("Cập nhật sâu bệnh thành công!");
    } else {
      toast.success("Thêm sâu bệnh thành công!");
    }
  };

  const handleCancelEdit = () => {
    setEditingPest(null);
  };
  const scrollToForm = () => {
    const formElement = document.querySelector('.pest-form-container');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="pest-management-container">
      <SidebarAdmin />
      <div className="pest-content">
        <h2>Quản lý sâu bệnh</h2>
        <PestForm 
          initialData={editingPest}
          onSuccess={handleFormSuccess}
          onCancel={handleCancelEdit}
        />
        <PestList 
          onEdit={(pest) => {
            setEditingPest(pest);
            scrollToForm();
          }}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </div>
  );
};

export default PestDiseaseManagement;