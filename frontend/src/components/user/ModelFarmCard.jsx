const ModelFarmCard = ({ model }) => {
  return (
    <div className="model-card">
      <div className="model-header">
        <h3>{model.name}</h3>
        <span className="model-region">Vùng: {model.region}</span>
      </div>
      
      {model.image && (
        <div className="model-image">
          <img src={model.image} alt={model.name} />
        </div>
      )}
      
      <div className="model-content">
        <div 
          className="model-description"
          dangerouslySetInnerHTML={{ __html: model.descriptionHTML }}
        />
      </div>
    </div>
  );
};

export default ModelFarmCard;