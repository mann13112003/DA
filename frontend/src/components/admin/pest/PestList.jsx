import React, { useState, useEffect } from 'react';
import { getAllPestDisease, deletePestDisease, pestCategoryList, growthStageList } from '../../../services/api';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from "react-toastify";
import Select from 'react-select';
import Pagination from '../../common/Pagination';
const PestList = ({ onEdit, refreshTrigger }) => {
  const [pestList, setPestList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [growthStages, setGrowthStages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);  
  // Thêm state cho bộ lọc
  const [filters, setFilters] = useState({
    name: '',
    categoryId: '',
    growthStageId: ''
  });

  const fetchInitialData = async () => {
    try {
      const [catRes, stagesRes] = await Promise.all([
        pestCategoryList(),
        growthStageList()
      ]);
      if (catRes.data.pestDiseaseCategoryList.errCode === 0) {
        setCategories(catRes.data.pestDiseaseCategoryList.data);
      }
      if (stagesRes.data.pestDiseaseStagesList.errCode === 0) {
        setGrowthStages(stagesRes.data.pestDiseaseStagesList.data);
      }
    } catch (err) {
      console.error('Failed to load filter data', err);
    }
  };

  const fetchPests = async () => {
    setLoading(true);
    try {
      const res = await getAllPestDisease();
      if (res.data.pestDiseaseList.errCode === 0) {
        setPestList(res.data.pestDiseaseList.data);
        setFilteredList(res.data.pestDiseaseList.data);
      }
    } catch (e) {
      console.error('Error loading pest list', e);
      toast.error('Lỗi khi tải danh sách sâu bệnh');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInitialData();
    fetchPests();
  }, [refreshTrigger]);

  // Thêm useEffect để xử lý lọc
  useEffect(() => {
    let result = [...pestList];
    
    if (filters.name) {
      result = result.filter(pest => 
        pest.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    
    if (filters.categoryId) {
      result = result.filter(pest => 
        pest.category_id === parseInt(filters.categoryId)
      );
    }
    
    if (filters.growthStageId) {
      result = result.filter(pest => 
        pest.growthStages?.some(stage => 
          stage.id === parseInt(filters.growthStageId)
        )
      );
    }
    
    setFilteredList(result);
  }, [filters, pestList]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeletePest = async (id) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa sâu bệnh này không?');
    if (!confirmDelete) return;

    try {
      const res = await deletePestDisease(id);
      if (res.data.errCode === 0) {
        toast.success('Xóa sâu bệnh thành công!');
        await fetchPests();
      } else {
        toast.error(res.data.errMessage || 'Xóa thất bại!');
      }
    } catch (e) {
      console.error('Error deleting pest', e);
      toast.error('Xóa thất bại!');
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentPest = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className='pest-list'>
      <h4>Danh sách sâu bệnh</h4>
      
      {/* Thêm phần bộ lọc */}
      <div className="filters-container">
        <div className="filter-group">
          <input
            type="text"
            name="name"
            placeholder="Tìm theo tên..."
            value={filters.name}
            onChange={handleFilterChange}
          />
        </div>
        
        <div className="filter-group">
          <select
            name="categoryId"
            value={filters.categoryId}
            onChange={handleFilterChange}
          >
            <option value="">Tất cả loại</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <select
            name="growthStageId"
            value={filters.growthStageId}
            onChange={handleFilterChange}
          >
            <option value="">Tất cả giai đoạn</option>
            {growthStages.map(stage => (
              <option key={stage.id} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên sâu bệnh</th>
                <th>Loại</th>
                <th>Giai đoạn</th>
                <th>Ảnh</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentPest.map((pest, index) => (
                <tr key={pest.id}>
                  <td>{indexOfFirstItem+index + 1}</td>
                  <td>{pest.name}</td>
                  {/* <td>{pest.scientific_name}</td> */}
                  <td>{pest.category?.name}</td>
                  <td>{pest.growthStages?.map(stage => stage.name).join(', ')}</td>
                  <td>
                    {pest.image_url && (
                      <img src={pest.image_url} alt={pest.name} style={{ width: 60 }} />
                    )}
                  </td>
                  <td>
                    <button onClick={() => onEdit(pest)} className="edit-btn"><FaEdit /></button>
                    <button onClick={() => handleDeletePest(pest.id)} className="delete-btn"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalItems={filteredList.length}
                  onPageChange={handlePageChange}
            />
        </>
      )}
    </div>
  );
};

export default PestList;