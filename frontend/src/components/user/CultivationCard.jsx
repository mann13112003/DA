import React from 'react';

const CultivationCard = ({ cultivation }) => {
  return (
    <div className="cultivation-card">
      <div className="cultivation-header">
        <h3>{cultivation.region}</h3>
      </div>
      <div className="cultivation-content">
        <div 
          className="cultivation-description"
          dangerouslySetInnerHTML={{ __html: cultivation.descriptionHTML }}
        />
      </div>
    </div>
  );
};

export default CultivationCard;