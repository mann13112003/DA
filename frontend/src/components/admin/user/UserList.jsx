import React, { useState, useEffect } from 'react';
import { listUsers, deleteUser } from '../../../services/api';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Pagination from '../../common/Pagination';

const UserList = ({ onEdit, refreshTrigger }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await listUsers();
      if (response.data.errCode === 0) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Không thể tải danh sách người dùng!');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;

    try {
      const response = await deleteUser(id);
      if (response.data.errCode === 0) {
        toast.success('Xóa người dùng thành công!');
        fetchUsers();
      } else {
        toast.error(response.data.errMessage || 'Có lỗi xảy ra!');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Không thể xóa người dùng!');
    }
  };


  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="user-list">
      <h3>Danh sách người dùng</h3>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Email</th>
                <th>Tên người dùng</th>
                <th>Vai trò</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="5">Không có người dùng nào</td>
                </tr>
              ) : (
                currentUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{user.email}</td>
                  <td>{user.userName}</td>
                  <td>{user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</td>
                  <td>
                    <button onClick={() => onEdit(user)} className="edit-btn">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)} className="delete-btn">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
          <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={users.length}
              onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default UserList;