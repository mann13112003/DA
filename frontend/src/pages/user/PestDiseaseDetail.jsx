import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserHeader from "../../components/user/userHeader";
import UserFooter from "../../components/user/userFooter";
import { getPestDiseaseById } from "../../services/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./PestDiseaseDetail.css";

const PestDiseaseDetail = () => {
    const { id } = useParams();
    const [pest, setPest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPestDetail = async () => {
            try {
                setLoading(true);
                const response = await getPestDiseaseById(id);
                if (response.data?.pestDisease.errCode === 0) {
                    setPest(response.data.pestDisease.data);
                } else {
                    console.error("Error fetching pest detail:", response.data.pestDisease.errMessage);
                }
            } catch (error) {
                console.error("Error fetching pest detail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPestDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Đang tải thông tin...</p>
            </div>
        );
    }
    
    if (!pest) {
        return <div className="error-message">Không tìm thấy thông tin sâu bệnh.</div>;
    }

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    return (
        <div>
            <UserHeader />
            <div className="pest-detail-container">
                <div className="pest-detail-header">
                    <h1>{pest.name}</h1>
                    <h2 className="scientific-name">{pest.scientific_name}</h2>
                    <div className="pest-info-tags">
                        <span className="category-tag">
                            {pest.category?.name}
                        </span>
                        <div className="growth-stages">
                            {pest.growthStages?.map(stage => (
                                <span key={stage.id} className="stage-tag">{stage.name}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {pest.images && pest.images.length > 0 && (
                    <div className="image-slider-container">
                        <Slider {...sliderSettings}>
                            {pest.images.map((img, index) => (
                                <div key={index} className="slider-item">
                                    <img 
                                        src={img.image_url} 
                                        alt={`${pest.name} ${index + 1}`} 
                                        className="slider-image"
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                )}
                
                <div className="main-image-container">
                    <img 
                        src={pest.image_url} 
                        alt={pest.name} 
                        className="main-image" 
                    />
                </div>

                {/* Description Section */}
                <div className="pest-info">
                    <h2>Thông tin chi tiết</h2>
                    <div 
                        className="content-html" 
                        dangerouslySetInnerHTML={{__html: pest.descriptionHTML || ''}}
                    />
                </div>
            </div>
            <UserFooter />
        </div>
    );
};

export default PestDiseaseDetail;