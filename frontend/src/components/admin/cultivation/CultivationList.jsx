import React, { useState, useEffect } from 'react';
import { getAllCultivation, deleteCultivation } from '../../../services/api';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Pagination from '../../common/Pagination';

const CultivationList = ({ onEdit, refreshTrigger }) => {
  const [cultivations, setCultivations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const fetchCultivations = async () => {
    setLoading(true);
    try {
      const response = await getAllCultivation();
      if (response.data.errCode === 0) {
        setCultivations(response.data.data);
      }
    } catch (error) {
      console.error('Error loading cultivations:', error);
      toast.error('Không thể tải danh sách kỹ thuật canh tác!');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCultivations();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa kỹ thuật canh tác này?')) return;

    try {
      const response = await deleteCultivation(id);
      if (response.data.errCode === 0) {
        toast.success('Xóa kỹ thuật canh tác thành công!');
        fetchCultivations();
      } else {
        toast.error(response.data.errMessage || 'Có lỗi xảy ra!');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Không thể xóa kỹ thuật canh tác!');
    }
  };

  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentCul = cultivations.slice(indexOfFirstItem, indexOfLastItem);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="cultivation-list">
      <h3>Danh sách kỹ thuật canh tác</h3>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Vùng miền</th>
                <th>Mô tả ngắn</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentCul.map((cultivation, index) => (
                <tr key={cultivation.id}>
                  <td>{indexOfFirstItem+index + 1}</td>
                  <td>{cultivation.region}</td>
                  <td>
                    {cultivation.descriptionHTML && 
                      <div dangerouslySetInnerHTML={{ 
                        __html: cultivation.descriptionHTML.substring(0, 100) + '...' 
                      }} />
                    }
                  </td>
                  <td>
                    <button onClick={() => onEdit(cultivation)} className="edit-btn">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(cultivation.id)} className="delete-btn">
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
                      totalItems={cultivations.length}
                      onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default CultivationList;