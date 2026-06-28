import React from 'react';

const StatCard = ({ title, value, label, icon, color = 'primary' }) => {
    const gradients = {
        primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        success: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
        danger: 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)',
        warning: 'linear-gradient(135deg, #ffc107 0%, #ff8b3d 100%)',
        info: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)'
    };

    return (
        <div className="card stat-card" style={{ background: gradients[color] }}>
            {icon && <div className="stat-icon">{icon}</div>}
            <h3>{title}</h3>
            <div className="stat-number">{value}</div>
            {label && <div className="stat-label">{label}</div>}
        </div>
    );
};

export default StatCard;