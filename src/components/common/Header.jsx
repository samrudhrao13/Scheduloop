import React, { useState } from 'react';
import ChangePasswordModal from './ChangePasswordModal';

const Header = ({ title, user, onLogout }) => {
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    return (
        <>
            <div className="header">
                <div className="app-brand">
                    <img src="/logo.svg" alt="App Logo" className="app-logo" />
                    <h1 className="app-title">{title}</h1>
                </div>
                <div className="user-info">
                    <span className="user-badge">
                        {user.name || user.role.toUpperCase()}
                        {user.usn && ` - ${user.usn}`}
                    </span>
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="btn btn-warning"
                        style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                        🔒 Change Password
                    </button>
                    <button onClick={onLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </div>

            <ChangePasswordModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                user={user}
            />
        </>
    );
};

export default Header;