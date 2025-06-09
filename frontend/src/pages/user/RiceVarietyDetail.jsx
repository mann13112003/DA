import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserHeader from "../../components/user/userHeader";
import UserFooter from "../../components/user/userFooter";
import { getRiceById } from "../../services/api";
import "./RiceVarietyDetail.css";

const RiceVarietyDetail = () => {
    const { id } = useParams();
    const [rice, setRice] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchRiceDetail = async () => {
            try {
                setLoading(true);
                const response = await getRiceById(id);
                if (response.data?.rice.errCode === 0) {
                    setRice(response.data.rice.data);
                }else{
                    console.error("Error fetching rice detail:", response.data.rice.errMessage);
                }
            } catch (error) {
                console.error("Error fetching rice detail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRiceDetail();
    }, [id]);
    if (loading) {
        return (
            <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Đang tải thông tin...</p>
            </div>
        );
    }
    
    if (!rice) {
        return <div className="error-message">Không tìm thấy thông tin giống lúa.</div>;
    }

    return (
        <div>
            <UserHeader />
            <div className="rice-detail-container">
                <div className="rice-detail-header">
                    <h1>{rice.name}</h1>
                    <div className="rice-types">
                        {rice.RiceTypes?.map(type => (
                            <span key={type.id} className="type-tag">{type.name}</span>
                        ))}
                    </div>
                </div>
                
                <div className="rice-detail-content">
                    <div className="rice-image-container">
                        <img src={rice.image_url} alt={rice.name} />
                    </div>
                    
                    <div className="rice-info">
                        <h2>Thông tin chi tiết</h2>
                        <div className="rice-description">
                            {rice.description}
                        </div>
                    </div>
                </div>
                <div className="rice-detail-description">
                    <div className="content-html" dangerouslySetInnerHTML={{__html: rice.descriptionHTML || ''}}></div>
                </div>
            </div>
            <UserFooter />
        </div>
    );
};

export default RiceVarietyDetail;