import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
    return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '20px', color: '#666' }}>{message}</p>
        </div>
    );
};

export default LoadingSpinner;