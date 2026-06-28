import React, { useState, useEffect } from 'react';
import { ref, set, get } from 'firebase/database';
import { database } from './config/firebase';

const InitPage = () => {
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [hasSuperAdmin, setHasSuperAdmin] = useState(false);
    const [credentials, setCredentials] = useState(null);

    useEffect(() => {
        checkSuperAdmin();
    }, []);

    const checkSuperAdmin = async () => {
        try {
            const usersSnapshot = await get(ref(database, 'users'));
            if (usersSnapshot.exists()) {
                const users = usersSnapshot.val();
                const superAdmin = Object.entries(users).find(([id, u]) => u.role === 'superadmin');

                if (superAdmin) {
                    setHasSuperAdmin(true);
                    setCredentials({
                        email: superAdmin[1].email,
                        password: '***hidden***'
                    });
                }
            }
        } catch (error) {
            console.error('Error checking:', error);
        }
        setChecking(false);
    };

    const createSuperAdmin = async () => {
        if (hasSuperAdmin) {
            alert('Super Admin already exists!');
            return;
        }

        setLoading(true);
        try {
            const superAdminId = 'superadmin_' + Date.now();
            const newCredentials = {
                email: 'superadmin@erp.com',
                password: 'Super@123',
                role: 'superadmin',
                name: 'System Super Admin',
                createdAt: Date.now()
            };

            await set(ref(database, `users/${superAdminId}`), newCredentials);

            setCredentials(newCredentials);
            setHasSuperAdmin(true);

            alert(
                'Super Admin Created Successfully!\n\n' +
                'Email: superadmin@erp.com\n' +
                'Password: Super@123\n\n' +
                'Go back to login page and:\n' +
                '1. Check "Login as Super Admin"\n' +
                '2. Enter these credentials\n' +
                '3. Click Login'
            );
        } catch (error) {
            alert('Error creating Super Admin: ' + error.message);
        }
        setLoading(false);
    };

    if (checking) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <div className="spinner"></div>
                    <p style={{ textAlign: 'center', marginTop: '20px' }}>Checking system...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>System Initialization</h1>

                {hasSuperAdmin ? (
                    <>
                        <div style={styles.successBox}>
                            <h2 style={{ color: '#28a745', marginBottom: '15px', fontSize: '20px' }}>
                                Super Admin Already Exists
                            </h2>
                            <p style={{ marginBottom: '10px' }}>Email: {credentials.email}</p>
                            <p style={{ fontSize: '12px', color: '#666' }}>
                                Password is hidden for security. If you forgot it, you'll need database access to view or reset it.
                            </p>
                        </div>

                        <button onClick={() => window.location.href = '/'} style={styles.button}>
                            Go to Login Page
                        </button>
                    </>
                ) : (
                    <>
                        <div style={styles.infoBox}>
                            <strong>Safe Operation</strong>
                            <p style={{ marginTop: '10px', fontSize: '14px' }}>
                                This will only create a Super Admin account. Your existing data will NOT be touched.
                            </p>
                        </div>

                        <button
                            onClick={createSuperAdmin}
                            disabled={loading}
                            style={{ ...styles.button, background: '#28a745' }}
                        >
                            {loading ? 'Creating...' : 'Create Super Admin Account'}
                        </button>

                        <button
                            onClick={() => window.location.href = '/'}
                            style={{ ...styles.button, background: '#6c757d', marginTop: '10px' }}
                        >
                            Cancel and Go Back
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    },
    card: {
        background: 'white',
        padding: '40px',
        borderRadius: '15px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
    },
    title: {
        color: '#667eea',
        marginBottom: '20px',
        textAlign: 'center',
        fontSize: '24px'
    },
    infoBox: {
        background: '#d1ecf1',
        border: '1px solid #17a2b8',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px'
    },
    successBox: {
        background: '#d4edda',
        border: '1px solid #28a745',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
    },
    button: {
        width: '100%',
        padding: '15px',
        background: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer'
    }
};

export default InitPage;
