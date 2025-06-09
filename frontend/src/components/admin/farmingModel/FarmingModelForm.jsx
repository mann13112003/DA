import React, { useState, useEffect } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';
import { toast } from 'react-toastify';
import { createFarmingModel, updateFarmingModel } from '../../../services/api';

const mdParser = new MarkdownIt();

const FarmingModelForm = ({ initialData, onSuccess, onCancel }) => {
  const isEditing = Boolean(initialData);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    descriptionMarkdown: '',
    descriptionHTML: '',
    imageFile: null,
    previewUrl: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
      if (!initialData) {
        setFormData({
          name: '',
          region: '',
          descriptionMarkdown: '',
          descriptionHTML: '',
          imageFile: null,
          previewUrl: ''
        });
      }
    }, [initialData]);

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        name: initialData.name || '',
        region: initialData.region || '',
        descriptionMarkdown: initialData.descriptionMarkdown || '',
        descriptionHTML: initialData.descriptionHTML || '',
        imageFile: null,
        previewUrl: initialData.image || ''
      });
    }
  }, [isEditing, initialData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setFormData(prev => ({
      ...prev,
      imageFile: file,
      previewUrl: reader.result
    }));
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEditorChange = ({ text }) => {
    setFormData(prev => ({
      ...prev,
      descriptionMarkdown: text,
      descriptionHTML: mdParser.render(text)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return setError('Vui lòng nhập tên mô hình!');
    if (!formData.region.trim()) return setError('Vui lòng nhập vùng miền!');
    setError('');
    setLoading(true);

    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('region', formData.region);
    fd.append('descriptionMarkdown', formData.descriptionMarkdown);
    fd.append('descriptionHTML', formData.descriptionHTML);
    if (formData.imageFile) fd.append('image', formData.imageFile);

    try {
      const response = isEditing
        ? await updateFarmingModel(initialData.id, fd)
        : await createFarmingModel(fd);

      if (response.data.errCode === 0) {
        onSuccess && onSuccess(isEditing ? 'update' : 'create');
      } else {
        toast.error(response.data.errMessage || 'Có lỗi xảy ra!');
      }
      setFormData({
        name: '',
        region: '',
        descriptionMarkdown: '',
        descriptionHTML: '',
        imageFile: null,
        previewUrl: ''
      });
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Có lỗi xảy ra khi lưu dữ liệu!');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            {isEditing ? 'Đang cập nhật mô hình...' : 'Đang thêm mô hình mới...'}
          </div>
        </div>
      )}
      <div className="farming-model-form">
        <h3>{isEditing ? 'Chỉnh sửa mô hình' : 'Thêm mô hình mới'}</h3>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Tên mô hình</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Vùng miền</label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Ảnh mô hình</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {formData.previewUrl && (
              <div className="image-preview">
                <img src={formData.previewUrl} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Mô tả chi tiết</label>
            <MdEditor
              value={formData.descriptionMarkdown}
              style={{ height: 400 }}
              renderHTML={text => mdParser.render(text)}
              onChange={handleEditorChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}> 
              {isEditing ? 'Cập nhật' : 'Thêm mới'}
            </button>
            {isEditing && (
              <button type="button" onClick={onCancel} disabled={loading}>
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default FarmingModelForm;