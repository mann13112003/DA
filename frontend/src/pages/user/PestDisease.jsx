import React, { Fragment, useState, useEffect } from "react";
import UserHeader from "../../components/user/userHeader";
import UserFooter from "../../components/user/userFooter";
import PestCard from "../../components/user/pestCard";
import { getAllPestDisease, pestCategoryList, growthStageList } from "../../services/api";
import './PestDisease.css';
import Pagination from '../../components/common/Pagination';

const PestDisease = () => {
    const [pestList, setPestList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [growthStages, setGrowthStages] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchCategory, setSearchCategory] = useState("");
    const [searchStage, setSearchStage] = useState("");
    const [filteredPests, setFilteredPests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pestRes, categoryRes, stageRes] = await Promise.all([
                    getAllPestDisease(),
                    pestCategoryList(),
                    growthStageList()
                ]);

                if (pestRes.data.pestDiseaseList.errCode === 0) {
                    setPestList(pestRes.data.pestDiseaseList.data);
                    setFilteredPests(pestRes.data.pestDiseaseList.data);
                }

                if (categoryRes.data.pestDiseaseCategoryList.errCode === 0) {
                    setCategories(categoryRes.data.pestDiseaseCategoryList.data);
                }
                if (stageRes.data.pestDiseaseStagesList.errCode === 0) {
                    setGrowthStages(stageRes.data.pestDiseaseStagesList.data);
                }
            } catch (e) {
                console.error('Lỗi tải danh sách sâu bệnh', e);
            }
        };
        fetchData();
    }, []);

    const handleSearch = () => {
        const filtered = pestList.filter(pest => {
            const nameMatch = searchName.trim() === '' || 
                pest.name.toLowerCase().includes(searchName.toLowerCase());
            const categoryMatch = searchCategory === '' || 
                pest.category_id === +searchCategory;
            const stageMatch = searchStage === '' ||
                pest.growthStages?.some(stage => stage.id === +searchStage);
            return nameMatch && categoryMatch && stageMatch;
        });
        setFilteredPests(filtered);
    };
    useEffect(() => {
            setCurrentPage(1);
    }, [searchName, searchCategory, searchStage]);

    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentPests = filteredPests.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <Fragment>
            <UserHeader />
            <div className="pest-disease-container">
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm sâu bệnh" 
                        value={searchName} 
                        onChange={(e) => setSearchName(e.target.value)} 
                    />
                    <select 
                        value={searchCategory} 
                        onChange={(e) => setSearchCategory(e.target.value)}
                    >
                        <option value="">Tất cả loại</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={searchStage}
                        onChange={(e) => setSearchStage(e.target.value)}
                    >
                        <option value="">Tất cả giai đoạn</option>
                        {growthStages.map(stage => (
                            <option key={stage.id} value={stage.id}>
                                {stage.name}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleSearch}>🔍 Tìm kiếm</button>
                </div>
                <div className="pest-disease-list">
                    {currentPests.map(pest => (
                        <PestCard key={pest.id} pest={pest} />
                    ))}
                </div>
                <Pagination
                      currentPage={currentPage}
                      pageSize={pageSize}
                      totalItems={filteredPests.length}
                      onPageChange={handlePageChange}
                />
            </div>
            <UserFooter />
        </Fragment>
    );
};

export default PestDisease;