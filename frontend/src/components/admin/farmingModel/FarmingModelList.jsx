import React, { useState, useEffect } from 'react';
import { getAllFarmingModel, deleteFarmingModel } from '../../../services/api';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Pagination from '../../common/Pagination';

const FarmingModelList = ({ onEdit, refreshTrigger }) => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const response = await getAllFarmingModel();
      if (response.data.errCode === 0) {
        setModels(response.data.data);
      }
    } catch (error) {
      console.error('Error loading farming models:', error);
      toast.error('Không thể tải danh sách mô hình!');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchModels();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa mô hình này?')) return;

    try {
      const response = await deleteFarmingModel(id);
      if (response.data.errCode === 0) {
        toast.success('Xóa mô hình thành công!');
        fetchModels();
      } else {
        toast.error(response.data.errMessage || 'Có lỗi xảy ra!');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Không thể xóa mô hình!');
    }
  };

  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentModel = models.slice(indexOfFirstItem, indexOfLastItem);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="farming-model-list">
      <h3>Danh sách mô hình canh tác</h3>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên mô hình</th>
                <th>Vùng miền</th>
                <th>Ảnh</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentModel.map((model, index) => (
                <tr key={model.id}>
                  <td>{indexOfFirstItem+index + 1}</td>
                  <td>{model.name}</td>
                  <td>{model.region}</td>
                  <td>
                    {model.image && (
                      <img
                        src={model.image}
                        alt={model.name}
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                    )}
                  </td>
                  <td>
                    <button onClick={() => onEdit(model)} className="edit-btn">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(model.id)} className="delete-btn">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalItems={models.length}
                    onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default FarmingModelList;