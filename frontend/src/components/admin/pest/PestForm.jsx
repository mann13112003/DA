import React, { useState, useEffect } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { FaTimes } from 'react-icons/fa';
import { createPestDisease, updatePestDisease, pestCategoryList, growthStageList } from '../../../services/api';

const mdParser = new MarkdownIt();

const PestForm = ({ initialData, onSuccess, onCancel }) => {
  const isEditing = Boolean(initialData);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    scientific_name: '',
    category_id: '',
    growthStageIds: [],
    descriptionMarkdown: '',
    descriptionHTML: '',
    imageFile: null,
    otherImages: [],
    previewUrl: '',
    previewOtherUrls: []
  });

  const [categories, setCategories] = useState([]);
  const [growthStages, setGrowthStages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, stagesRes] = await Promise.all([
          pestCategoryList(),
          growthStageList()
        ]);
        // console.log('catRes:', catRes);
        // console.log('stagesRes:', stagesRes);
        if (catRes.data.pestDiseaseCategoryList.errCode === 0) {
          setCategories(catRes.data.pestDiseaseCategoryList.data);
        }
        if (stagesRes.data.pestDiseaseStagesList.errCode === 0) {
          setGrowthStages(stagesRes.data.pestDiseaseStagesList.data);
        }
      } catch (err) {
        console.error('Failed to load initial data', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
      if (!initialData) {
        setFormData({
          name: '',
          scientific_name: '',
          category_id: '',
          growthStageIds: [],
          descriptionMarkdown: '',
          descriptionHTML: '',
          imageFile: null,
          otherImages: [],
          previewUrl: '',
          previewOtherUrls: []
        });
      }
    }, [initialData]);

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        name: initialData.name || '',
        scientific_name: initialData.scientific_name || '',
        category_id: initialData.category_id || '',
        growthStageIds: initialData.growthStages?.map(s => s.id) || [],
        descriptionMarkdown: initialData.descriptionMarkdown || '',
        descriptionHTML: initialData.descriptionHTML || '',
        imageFile: null,
        otherImages: [],
        previewUrl: initialData.image_url || '',
        previewOtherUrls: initialData.images?.map(img => img.image_url) || []
      });
    }
  }, [isEditing, initialData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setFormData(p => ({ ...p, imageFile: file, previewUrl: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleOtherImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(urls => {
      setFormData(p => ({
        ...p,
        otherImages: [...p.otherImages, ...files],
        previewOtherUrls: [...p.previewOtherUrls, ...urls]
      }));
    });
  };

  const handleInputChange = (e) =>
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleEditorChange = ({ text }) =>
    setFormData(p => ({
      ...p,
      descriptionMarkdown: text,
      descriptionHTML: mdParser.render(text)
    }));

  const handleSubmit = async (e) => {
    console.log('formData:', formData);
    e.preventDefault();
    if (!formData.name.trim()) return setError('Vui lòng nhập tên sâu bệnh!');
    if (!formData.category_id) return setError('Vui lòng chọn loại sâu bệnh!');
    setError('');
    setLoading(true);
    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('scientific_name', formData.scientific_name);
    fd.append('category_id', formData.category_id);
    fd.append('descriptionMarkdown', formData.descriptionMarkdown);
    fd.append('descriptionHTML', formData.descriptionHTML);
    fd.append('growthStageIds', JSON.stringify(formData.growthStageIds));
    
    if (formData.imageFile) {
      fd.append('image', formData.imageFile);
    }
    
    formData.otherImages.forEach(file => {
      fd.append('image-other', file);
    });

    try {
      const response = isEditing
        ? await updatePestDisease(initialData.id, fd)
        : await createPestDisease(fd);
      console.log("API response:", response.data);
      const result = isEditing ? response.data.updatedPestDisease : response.data.data || response.data;
      if (result && result.errCode === 0) {
        onSuccess && onSuccess(isEditing ? 'update' : 'create');
        setFormData({
          name: '',
          scientific_name: '',
          category_id: '',
          growthStageIds: [],
          descriptionMarkdown: '',
          descriptionHTML: '',
          imageFile: null,
          otherImages: [],
          previewUrl: '',
          previewOtherUrls: []
        });
      } else {
        toast.error(result.errMessage || 'Lỗi khi lưu sâu bệnh');
      }
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Có lỗi xảy ra khi lưu dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMainImage = () => {
    setFormData(prev => ({
      ...prev,
      imageFile: null,
      previewUrl: ''
    }));
  };
  
  const handleRemoveOtherImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      otherImages: prev.otherImages.filter((_, index) => index !== indexToRemove),
      previewOtherUrls: prev.previewOtherUrls.filter((_, index) => index !== indexToRemove)
    }));
  };

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            {isEditing ? 'Đang cập nhật sâu bệnh...' : 'Đang thêm sâu bệnh mới...'}
          </div>
        </div>
      )}
      <div className="pest-form-container">
        <h3>{isEditing ? 'Chỉnh sửa sâu bệnh' : 'Thêm mới sâu bệnh'}</h3>
        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="pest-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Tên sâu bệnh</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Tên khoa học</label>
              <input
                type="text"
                name="scientific_name"
                value={formData.scientific_name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Loại sâu bệnh</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
              >
                <option value="">Chọn loại...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Giai đoạn sinh trưởng</label>
              <Select
                isMulti
                options={growthStages.map(stage => ({
                  value: stage.id,
                  label: stage.name
                }))}
                value={formData.growthStageIds.map(id => ({
                  value: id,
                  label: growthStages.find(s => s.id === id)?.name
                }))}
                onChange={(selected) => {
                  setFormData(p => ({
                    ...p,
                    growthStageIds: selected.map(option => option.value)
                  }));
                }}
              />
            </div>
          </div>

          <div className="image-section">
            <div className="form-group">
              <label>Ảnh chính</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {formData.previewUrl && (
                <div className="image-preview">
                  <div className="image-wrapper">
                      <img src={formData.previewUrl} alt="preview" />
                      <button 
                          type="button" 
                          className="remove-image" 
                          onClick={handleRemoveMainImage}
                      >
                          <FaTimes />
                      </button>
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Ảnh khác</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleOtherImagesChange}
              />
              <div className="other-images-preview">
                  {formData.previewOtherUrls.map((url, idx) => (
                      <div key={idx} className="image-wrapper">
                      <img src={url} alt={`other ${idx + 1}`} />
                      <button 
                          type="button"
                          className="remove-image"
                          onClick={() => handleRemoveOtherImage(idx)}
                      >
                          <FaTimes />
                      </button>
                      </div>
                  ))}
              </div>
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

export default PestForm;