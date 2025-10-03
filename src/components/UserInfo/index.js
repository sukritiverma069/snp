import React, { useEffect, useState } from 'react'
import './UserInfo.css'
import { getCurrentUserData } from '../../services/userService'
import { useAuth } from '../../stores'

const UserInfo = () => {
    const { user, accessToken, userActions } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (accessToken && !user) {
            fetchUserData();
        }
    }, [accessToken, user]);

    const fetchUserData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const userData = await getCurrentUserData(accessToken);
            userActions.setUser(userData);
            
        } catch (err) {
            console.error('Failed to fetch user data:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshUserData = () => {
        fetchUserData();
    };

    if (isLoading) {
        return (
            <div className="user-info loading">
                <p>Loading user information...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="user-info error">
                <p>Error loading user data: {error}</p>
                <button onClick={refreshUserData} className="retry-button">
                    Retry
                </button>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="user-info no-data">
                <p>No user data available</p>
                <button onClick={refreshUserData} className="retry-button">
                    Load User Data
                </button>
            </div>
        );
    }

    return (
        <div className="user-info">
            <div className="widget-header">
                <div>
                    <h3 className="widget-title">👤 User Profile</h3>
                    <div className="widget-subtitle">@{user.username}</div>
                </div>
            </div>
            
            <div className="widget-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: '600'
                    }}>
                        {user.image ? (
                            <img src={user.image} alt={`${user.firstName} ${user.lastName}`} style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }} />
                        ) : (
                            <span>{user.firstName?.[0]}{user.lastName?.[0]}</span>
                        )}
                    </div>
                    <div>
                        <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#2d3748' }}>
                            {user.firstName} {user.lastName}
                        </h2>
                        <p style={{ margin: '0', fontSize: '14px', color: '#718096' }}>
                            {user.email}
                        </p>
                    </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="widget-info-card">
                        <div className="widget-info-label">Age</div>
                        <div className="widget-info-value">{user.age || 'N/A'}</div>
                    </div>
                    <div className="widget-info-card">
                        <div className="widget-info-label">Gender</div>
                        <div className="widget-info-value">{user.gender || 'N/A'}</div>
                    </div>
                    <div className="widget-info-card">
                        <div className="widget-info-label">Phone</div>
                        <div className="widget-info-value">{user.phone || 'N/A'}</div>
                    </div>
                </div>

                <button onClick={refreshUserData} className="widget-button" style={{ marginTop: '16px' }}>
                    Refresh Data
                </button>
            </div>
        </div>
    );
};

export default UserInfo