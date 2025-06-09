import React,{useState,useEffect} from 'react';
import { getAllRice,deleteRice } from '../../../services/api';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from "react-toastify";
import Pagination from '../../common/Pagination';
const RiceList = ( { onEdit, refreshTrigger} ) => {
  const [riceList,setRiceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const fetchRice = async() => {
    setLoading(true);
    try{
      const res = await getAllRice();
      if(res.data.riceList.errCode === 0){
        setRiceList(res.data.riceList.data);
      }
    }catch(e){
      console.error('Error loading rice list', e)
    }
    setLoading(false);
  }
  useEffect(() => {
    fetchRice();
    },[refreshTrigger]); 

  const handleDeleteRice = async(id) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa giống lúa này không?');
    if(!confirmDelete) return;
    try{
      await deleteRice(id);
      await fetchRice();
    }catch(e){
      console.error('Error deleting rice',e);
      toast.error('Xóa thất bại!')
    }
  } 

  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentRice = riceList.slice(indexOfFirstItem, indexOfLastItem);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className='rice-list'>
      <h4>Danh sách giống lúa</h4>
      {
        loading ? (<p>Đang tải dữ liệu...</p>) : (
          <>
            <table id='list-rice'>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên giống lúa</th>
                  <th>Loại giống</th>
                  <th>Giới thiệu</th>
                  <th>Ảnh</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentRice.map((rice,index) => (
                  <tr key = {rice.id}>
                    <td>{indexOfFirstItem+index+1}</td>
                    <td>{rice.name}</td>
                    <td>{rice.RiceTypes.map(t => t.name).join(', ')}</td>
                    <td>{rice.description}</td>
                    <td>
                      {rice.image_url && <img src={rice.image_url} alt={rice.name} style={{ width: 60 }} />}
                    </td>
                    <td>
                      <button onClick={() => onEdit(rice)} className="edit-btn"><FaEdit /></button>
                      <button onClick={() => handleDeleteRice(rice.id)} className="delete-btn"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={riceList.length}
                onPageChange={handlePageChange}
            />
          </>
        )
      }
    </div>
  );
};
export default RiceList;
