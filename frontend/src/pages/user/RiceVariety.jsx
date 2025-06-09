import React, { Fragment } from "react"
import UserHeader from "../../components/user/userHeader";
import UserFooter from "../../components/user/userFooter";
import RiceCard from "../../components/user/riceCard";
import {getAllRice, riceTypeList} from "../../services/api";
import './RiceVariety.css'
import { useState, useEffect } from "react";
import Pagination from '../../components/common/Pagination';

const RiceVariety = () => {
    const [riceList, setRiceList] = useState([]);
    const [riceType, setRiceType] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchType, setSearchType] = useState("");
    const [filteredRice, setFilteredRice] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const resRice = await getAllRice();
                const resRiceTypes = await riceTypeList();
                if(resRice.data.riceList.errCode === 0){
                    setRiceList(resRice.data.riceList.data);
                    setFilteredRice(resRice.data.riceList.data);    
                }
                if(resRiceTypes.data.riceTypeList.errCode === 0){
                    setRiceType(resRiceTypes.data.riceTypeList.data);

                }

            }catch(e){
                console.error('Lỗi tải danh sách giống lúa', e);
            }
           
        };
        fetchData();
    }, []);

    const handleSearch = () => {
        const filtered = riceList.filter(rice => {
            const nameMatch = searchName.trim() === '' || rice.name.toLowerCase().includes(searchName.toLowerCase());
            const typeMatch = searchType === '' || rice.RiceTypes.some(type => type.id === +searchType);
            return nameMatch && typeMatch;
        });
        setFilteredRice(filtered);
    }

    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchName, searchType]);

    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentRices = filteredRice.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    
    return (
        <div className="rice-variety-page">
            <UserHeader></UserHeader>
            <div className="main-content">
                <div className="rice-variety-container">
                    <div className="search-bar">
                        <input type="text" placeholder="Tìm kiếm giống lúa" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                            <option value="">Tất cả loại giống</option>
                            {riceType.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                        <button onClick={handleSearch}>🔍 Tìm kiếm</button>
                    </div>
                    <div className="rice-variety-list">
                        {currentRices.map(rice => (
                            <RiceCard key={rice.id} rice={rice} />
                        ))}
                    </div>
                    <Pagination
                      currentPage={currentPage}
                      pageSize={pageSize}
                      totalItems={filteredRice.length}
                      onPageChange={handlePageChange}
                    />
                </div>
            </div>
            <UserFooter></UserFooter>
        </div>
    )
}
export default RiceVariety