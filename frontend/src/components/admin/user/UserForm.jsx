import React, { useState, useEffect } from 'react';
import { createUser, updateUser } from '../../../services/api';

const UserForm = ({ initialData, onSuccess, onCancel }) => {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    role: 'user',
    image: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
        if (!initialData) {
          setFormData({
            email: '',
            password: '',
            username: '',
            role: 'user',
            image: ''
          });
        }
      }, [initialData]);

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        email: initialData.email || '',
        username: initialData.userName || '',
        role: initialData.role || 'user',
        image: initialData.image || ''
      });
    }
  }, [isEditing, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email?.trim()) return setError('Email không được để trống');
    if (!isEditing && !formData.password?.trim()) return setError('Mật khẩu không được để trống');
    if (!formData.username?.trim()) return setError('Tên người dùng không được để trống');

    try {
      const response = isEditing
        ? await updateUser(initialData.id, formData)
        : await createUser(formData);

      if (response.data.errCode === 0) {
        // toast.success(isEditing ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
        onSuccess(isEditing ? 'update' : 'create');
      } else {
        setError(response.data.errMessage || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className="user-form">
      <h3>{isEditing ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h3>
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isEditing}
            />
          </div>

          {!isEditing && (
            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div className="form-group">
            <label>Tên người dùng</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Vai trò</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="user">Người dùng</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {isEditing ? 'Cập nhật' : 'Thêm mới'}
          </button>
          {isEditing && (
            <button type="button" onClick={onCancel} className="cancel-btn">
              Hủy
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserForm;