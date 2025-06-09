import { useState, useEffect } from 'react';
import { getAllFarmingModel } from '../../services/api';
import Header from '../../components/user/userHeader';
import Footer from '../../components/user/userFooter';
import ModelFarmCard from '../../components/user/ModelFarmCard';
import './ModelFarmList.css';

const ModelFarmList = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await getAllFarmingModel();
        if (response.data.errCode === 0) {
          setModels(response.data.data);
        }
      } catch (err) {
        setError('Không thể tải dữ liệu mô hình canh tác');
        console.error('Error fetching models:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, []);

  const scrollToModel = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Đang tải dữ liệu...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <p>{error}</p>
    </div>
  );

  return (
    <div className="model-farm-page">
      <Header />
      <div className="model-farm-container">
        <h1 className="page-title">Các mô hình canh tác tiên tiến</h1>

        <div className="table-of-contents">
          <h2>Mục lục</h2>
          <ul>
            {models.map((model, index) => (
              <li key={`toc-${model.id}`}>
                <button 
                  onClick={() => scrollToModel(`model-${model.id}`)}
                  className="toc-link"
                >
                  <span className="toc-number">{index + 1}.</span>
                  <span className="toc-text">{model.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="model-farm-list">
          {models.map((model, index) => (
            <div 
              key={model.id}
              id={`model-${model.id}`}
              className="model-section"
            >
              <div className="section-number">{index + 1}</div>
              <ModelFarmCard model={model} />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ModelFarmList;