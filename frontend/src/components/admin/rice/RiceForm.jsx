import React, { useState, useEffect } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { createRice, updateRice, riceTypeList } from '../../../services/api';

const mdParser = new MarkdownIt();

const RiceForm = ({ initialData, onSuccess, onCancel }) => {
  const isEditing = Boolean(initialData);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    riceTypes: [],
    description: '',
    descriptionMarkdown: '',
    descriptionHTML: '',
    imageFile: null,
    previewUrl: ''
  });

  const [allRiceTypes, setAllRiceTypes] = useState([]);   // [{id,name}]
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await riceTypeList();
        if (res.data.riceTypeList.errCode === 0) {
          setAllRiceTypes(res.data.riceTypeList.data);
        }
      } catch (err) {
        console.error('Failed to load rice types', err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!initialData) {
      setFormData({
        name: '',
        riceTypes: [],
        description: '',
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
        riceTypes: initialData.RiceTypes?.map(t => t.id) || [],
        description: initialData.description || '',
        descriptionMarkdown: initialData.descriptionMarkdown || '',
        descriptionHTML: initialData.descriptionHTML || '',
        imageFile: null,
        previewUrl: initialData.image_url || ''
      });
    }
  }, [isEditing, initialData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected image file:", file);
    if (!file) return setFormData(p => ({ ...p, imageFile: null, previewUrl: '' }));

    const reader = new FileReader();
    reader.onloadend = () =>
      setFormData(p => ({ ...p, imageFile: file, previewUrl: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) =>
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleEditorChange = ({ text }) =>
    setFormData(p => ({
      ...p,
      descriptionMarkdown: text,
      descriptionHTML    : mdParser.render(text)
    }));

  const handleRiceTypeSelect = (selectedOptions) =>
    setFormData(p => ({
      ...p,
      riceTypes: selectedOptions.map(opt => opt.value)    
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim())        return setError('Vui lòng nhập Tên giống lúa!');
    if (!formData.riceTypes.length)   return setError('Vui lòng chọn ít nhất 1 loại lúa!');
    setError('');
    setLoading(true);
    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('riceTypes', JSON.stringify(formData.riceTypes));
    fd.append('description', formData.description);
    fd.append('descriptionMarkdown', formData.descriptionMarkdown);
    fd.append('descriptionHTML', formData.descriptionHTML);
    if (formData.imageFile) fd.append('image', formData.imageFile);

    try {
      for (let [key, value] of fd.entries()) {
        console.log(`${key}:`, value);
      }
      const response = isEditing
        ? await updateRice(initialData.id, fd)
        : await createRice(fd);
      console.log("API response:", response.data);
      const result = isEditing ? response.data.updatedRice : response.data.data || response.data;
      if (result && result.errCode === 0) {
        onSuccess && onSuccess(isEditing ? 'update' : 'create');
      } else {
        toast.error(result.errMessage || 'Lỗi khi lưu giống lúa');
      }
      /* reset */
      setFormData({
        name: '',
        riceTypes: [],
        description: '',
        descriptionMarkdown: '',
        descriptionHTML: '',
        imageFile: null,
        previewUrl: ''
      });
    } catch (err) {
      console.error('Save error:', err);
      alert('Có lỗi xảy ra khi lưu dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  const selectOptions = allRiceTypes.map(t => ({ value: t.id, label: t.name }));
  const selectValue   = selectOptions.filter(opt => formData.riceTypes.includes(opt.value));

  return (
    <>
      {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <div className="loading-text">
              {isEditing ? 'Đang cập nhật giống lúa...' : 'Đang thêm giống lúa mới...'}
            </div>
          </div>
        )}
      <div className="rice-form-container">
        <h3 className="form-title">{isEditing ? 'Chỉnh sửa giống lúa' : 'Thêm mới giống lúa'}</h3>
        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="rice-form">

          <div className="form-grid">
            <div className="form-group">
              <label>Tên giống lúa</label>
              <input  
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Loại lúa</label>
              <Select
                options={selectOptions}
                value={selectValue}
                onChange={handleRiceTypeSelect}
                isMulti
                placeholder="Chọn loại lúa…"
                closeMenuOnSelect={false}
                styles={{ control: base => ({ ...base, minHeight: 42 }) }}
              />
            </div>
          </div>

          <div className="des-image">
            <div className="form-group description">
              <label>Giới thiệu</label>
              <textarea
                className='description'
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            <div className="form-group image-group">
              <label>Ảnh giống lúa</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {formData.previewUrl && (
                <div className="image-preview">
                  <img src={formData.previewUrl} alt="preview" />
                </div>
              )}
            </div>
          </div>
    
          <div className="form-group">
            <label>Mô tả chi tiết (Markdown)</label>
            <MdEditor
              value={formData.descriptionMarkdown}
              style={{ height: 500 }}
              renderHTML={text => mdParser.render(text)}
              onChange={handleEditorChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={loading}>
              {isEditing ? 'Chỉnh sửa' : 'Thêm mới'}
            </button>
            {isEditing && (
              <button type="button" onClick={onCancel} className="btn-cancel" disabled={loading}>
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default RiceForm;
