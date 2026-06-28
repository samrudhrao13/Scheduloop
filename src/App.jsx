import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from './config/firebase';

import './styles/global.css';
import './styles/auth.css';
import './styles/dashboard.css';
import './styles/components.css';
import './styles/modal.css';

import LoginScreen from './components/auth/LoginScreen';
import SuperAdminDashboard from './components/dashboards/SuperAdminDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import PrincipalDashboard from './components/dashboards/PrincipalDashboard';
import HODDashboard from './components/dashboards/HODDashboard';
import FacultyDashboard from './components/dashboards/FacultyDashboard';
import StudentDashboard from './components/dashboards/StudentDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('erp_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (err) {
        localStorage.removeItem('erp_user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = async (email, password, institutionId) => {
    try {
      setLoading(true);

      // Get all users
      const usersSnapshot = await get(ref(database, 'users'));
      const users = usersSnapshot.val();

      if (!users) {
        alert('No users found in system. Please initialize the system first.');
        setLoading(false);
        return { success: false };
      }

      // Find matching user
      let userEntry = null;

      // Check if logging in as super admin (institutionId will be null)
      if (institutionId === null) {
        console.log('Checking for Super Admin login...');
        userEntry = Object.entries(users).find(([id, userData]) => {
          return userData.role === 'superadmin' &&
            userData.email === email &&
            userData.password === password;
        });

        if (!userEntry) {
          alert('Invalid Super Admin credentials.\n\nDefault credentials:\nEmail: superadmin@erp.com\nPassword: Super@123');
          setLoading(false);
          return { success: false };
        }
      } else {
        // Regular user login with institution
        console.log('Checking for regular user login...');
        userEntry = Object.entries(users).find(([id, userData]) => {
          return userData.email === email &&
            userData.password === password &&
            userData.institutionId === institutionId;
        });

        if (!userEntry) {
          alert('Invalid credentials or wrong institution selected.\n\nPlease check:\n- Email is correct\n- Password is correct\n- Institution is correct');
          setLoading(false);
          return { success: false };
        }
      }

      const [userId, userData] = userEntry;

      // Check if first login (must change password)
      if (userData.mustChangePassword) {
        const newPassword = prompt('This is your first login.\n\nPlease enter a new password (minimum 6 characters):');

        if (!newPassword) {
          alert('Password change cancelled. Cannot proceed.');
          setLoading(false);
          return { success: false };
        }

        if (newPassword.length < 6) {
          alert('Password must be at least 6 characters long.');
          setLoading(false);
          return { success: false };
        }

        // Update password in Firebase
        const { update, ref: dbRef } = await import('firebase/database');
        await update(dbRef(database, `users/${userId}`), {
          password: newPassword,
          mustChangePassword: false
        });

        alert('Password changed successfully! Logging you in...');
        userData.password = newPassword;
        userData.mustChangePassword = false;
      }

      const userWithId = { id: userId, ...userData };
      setUser(userWithId);
      localStorage.setItem('erp_user', JSON.stringify(userWithId));
      setLoading(false);
      return { success: true };

    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + error.message);
      setLoading(false);
      return { success: false };
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('erp_user');
  };

  if (loading && !user) {
    return (
      <div className="app-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '20px', color: 'white' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const dashboardProps = { user, onLogout: handleLogout };

  switch (user.role) {
    case 'superadmin':
      return <SuperAdminDashboard {...dashboardProps} />;
    case 'admin':
      return <AdminDashboard {...dashboardProps} />;
    case 'principal':
      return <PrincipalDashboard {...dashboardProps} />;
    case 'hod':
      return <HODDashboard {...dashboardProps} />;
    case 'faculty':
      return <FacultyDashboard {...dashboardProps} />;
    case 'student':
      return <StudentDashboard {...dashboardProps} />;
    default:
      return (
        <div className="app-container">
          <div className="card" style={{ maxWidth: '500px', margin: '100px auto' }}>
            <div className="message message-error">Invalid user role</div>
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
          </div>
        </div>
      );
  }
}

export default App;