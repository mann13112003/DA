import React from "react";
import { Link } from "react-router-dom";
const RiceCard = ({ rice }) => {
    return (
        <div className="card-rice">
            <img src={rice.image_url} alt={rice.name} className="card-image" />
            <div className="card-content">
                <h3 className="card-title">{rice.name}</h3>
                <p className="tags">
                    {rice.RiceTypes?.map(type => type.name).join(", ")}
                </p>
                <p className="card-description">
                    {rice.description && rice.description > 10 ? rice.description.slice(0, 10) + "..." : rice.description}
                </p>
                <Link to={`/rice/${rice.id}`} className="card-button">Xem thêm</Link>
            </div>
        </div>
    )
}
export default RiceCard