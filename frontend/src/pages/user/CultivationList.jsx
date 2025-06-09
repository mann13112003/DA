import React, { useState, useEffect } from 'react';
import { getAllCultivation } from '../../services/api';
import CultivationCard from '../../components/user/CultivationCard';
import Header from '../../components/user/userHeader';
import Footer from '../../components/user/userFooter';
import './CultivationList.css';

const CultivationList = () => {
  const [cultivations, setCultivations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCultivations = async () => {
      try {
        const response = await getAllCultivation();
        if (response.data.errCode === 0) {
          setCultivations(response.data.data);
        } else {
          setError('Không thể tải dữ liệu');
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải dữ liệu:',err);
      } finally {
        setLoading(false);
      }
    };

    fetchCultivations();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  const scrollToRegion = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="cultivation-page">
      <Header />
      <div className="cultivation-container">
        <h1 className="page-title">Quy trình canh tác theo vùng miền</h1>

        <div className="table-of-contents">
          <h2>Mục lục</h2>
          <ul>
            {cultivations.map((cultivation, index) => (
              <li key={`toc-${cultivation.id}`}>
                <button 
                  onClick={() => scrollToRegion(`region-${cultivation.id}`)}
                  className="toc-link"
                >
                  <span className="toc-number">{index + 1}.</span>
                  <span className="toc-text">Vùng {cultivation.region}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="cultivation-list">
          {cultivations.map((cultivation) => (
            <div 
              key={cultivation.id}
              id={`region-${cultivation.id}`}
            >
              <CultivationCard cultivation={cultivation} />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CultivationList;