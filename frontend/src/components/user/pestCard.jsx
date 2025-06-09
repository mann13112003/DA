import React from "react";
import { Link } from "react-router-dom";

const PestCard = ({ pest }) => {
    return (
        <div className="card-pest">
            <img src={pest.image_url} alt={pest.name} className="card-image" />
            <div className="card-content">
                <h3 className="card-title">{pest.name}</h3>
                <p className="tags">
                    <span className="category">Loại: {pest.category?.name}</span>
                </p>
                {/* <p className="scientific-name">
                    {pest.scientific_name}
                </p> */}
                <p className="growth-stages">
                    <span className="stages-label">Giai đoạn bị bệnh: </span>
                    {pest.growthStages?.map(stage => stage.name).join(', ')}
                </p>
                <Link to={`/pest-disease/${pest.id}`} className="card-button">Xem thêm</Link>
            </div>
        </div>
    )
}

export default PestCard;