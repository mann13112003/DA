import React from "react";
const FeatureCard = ({icon,title,description,buttonText,onClick}) => {
    return (
        <div className="feature-card">
            <div className="feature-icon">{icon}</div>
            <div>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-description">{description}</p>
                <button className="feature-button" onClick={onClick}>{buttonText} →</button>
            </div>
        </div>
    );
};
export default FeatureCard;