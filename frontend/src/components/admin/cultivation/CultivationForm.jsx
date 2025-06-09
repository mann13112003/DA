import React, { useState, useEffect } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';
import { toast } from 'react-toastify';
import { createCultivation, updateCultivation } from '../../../services/api';

const mdParser = new MarkdownIt();

const CultivationForm = ({ initialData, onSuccess, onCancel }) => {
  const isEditing = Boolean(initialData);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    region: '',
    descriptionMarkdown: '',
    descriptionHTML: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
      if (!initialData) {
        setFormData({
          region: '',
          descriptionMarkdown: '',
          descriptionHTML: ''
        });
      }
    }, [initialData]);

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        region: initialData.region || '',
        descriptionMarkdown: initialData.descriptionMarkdown || '',
        descriptionHTML: initialData.descriptionHTML || ''
      });
    }
  }, [isEditing, initialData]);

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
    if (!formData.region.trim()) {
      return setError('Vui lòng nhập vùng miền!');
    }
    setError('');
    setLoading(true);

    try {
      const response = isEditing
        ? await updateCultivation(initialData.id, formData)
        : await createCultivation(formData);

      if (response.data.errCode === 0) {
        // toast.success(isEditing ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
        onSuccess && onSuccess(isEditing ? 'update' : 'create');
      } else {
        toast.error(response.data.errMessage || 'Có lỗi xảy ra!');
      }
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Có lỗi xảy ra khi lưu dữ liệu!');
    } finally {
      setLoading(false);
      // Reset form data after submission
      setFormData({
        region: '',
        descriptionMarkdown: '',
        descriptionHTML: ''
      });
    }
  };

  return (
    <>
      {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <div className="loading-text">
              {isEditing ? 'Đang cập nhật kỹ thuật...' : 'Đang thêm kỹ thuật mới...'}
            </div>
          </div>
        )}
      <div className="cultivation-form">
        <h3>{isEditing ? 'Chỉnh sửa kỹ thuật canh tác' : 'Thêm kỹ thuật canh tác mới'}</h3>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Vùng miền</label>
            <input
              type="text"
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              placeholder="Nhập vùng miền áp dụng"
            />
          </div>

          <div className="form-group">
            <label>Kỹ thuật canh tác chi tiết</label>
            <MdEditor
              value={formData.descriptionMarkdown}
              style={{ height: 400 }}
              renderHTML={text => mdParser.render(text)}
              onChange={handleEditorChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {isEditing ? 'Cập nhật' : 'Thêm mới'}
            </button>
            {isEditing && (
              <button type="button" onClick={onCancel} className="cancel-btn" disabled={loading}>
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default CultivationForm;