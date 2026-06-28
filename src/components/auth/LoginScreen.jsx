import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../../config/firebase';
import '../../styles/auth.css';

const LoginScreen = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [institutionId, setInstitutionId] = useState('');
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    useEffect(() => {
        loadInstitutions();
    }, []);

    const loadInstitutions = async () => {
        try {
            const snapshot = await get(ref(database, 'institutions'));
            if (snapshot.exists()) {
                const data = snapshot.val();
                const instList = Object.entries(data).map(([id, inst]) => ({
                    id,
                    name: inst.name
                }));
                setInstitutions(instList);
            }
        } catch (error) {
            console.error('Error loading institutions:', error);
        }
    };

    const handleSubmit = async () => {
        if (!email || !password) {
            alert('Please enter email and password');
            return;
        }

        if (!isSuperAdmin && !institutionId) {
            alert('Please select your institution');
            return;
        }

        setLoading(true);
        await onLogin(email, password, isSuperAdmin ? null : institutionId);
        setLoading(false);
    };

    return (
        <div className="app-container">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-logo">
                        <img src="/logo.svg" alt="App Logo" style={{ height: '48px' }} />
                    </div>
                    <h2>Institution ERP System</h2>
                </div>

                <div className="form-check" style={{ marginBottom: '20px' }}>
                    <input
                        type="checkbox"
                        id="superAdminCheck"
                        checked={isSuperAdmin}
                        onChange={(e) => setIsSuperAdmin(e.target.checked)}
                    />
                    <label htmlFor="superAdminCheck">Login as Super Admin</label>
                </div>

                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    />
                </div>

                {!isSuperAdmin && (
                    <div className="form-group">
                        <label>Institution / College</label>
                        <select
                            value={institutionId}
                            onChange={(e) => setInstitutionId(e.target.value)}
                        >
                            <option value="">Select your institution</option>
                            {institutions.map(inst => (
                                <option key={inst.id} value={inst.id}>
                                    {inst.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <button onClick={handleSubmit} className="btn btn-primary" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </div>
        </div>
    );
};

export default LoginScreen;