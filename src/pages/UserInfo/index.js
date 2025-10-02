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
            <div className="user-header">
                <div className="user-avatar">
                    {user.image ? (
                        <img src={user.image} alt={`${user.firstName} ${user.lastName}`} />
                    ) : (
                        <div className="avatar-placeholder">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                    )}
                </div>
                <div className="user-details">
                    <h2>{user.firstName} {user.lastName}</h2>
                    <p className="username">@{user.username}</p>
                    <p className="email">{user.email}</p>
                </div>
            </div>
            
            <div className="user-stats">
                <div className="stat">
                    <span className="label">Age:</span>
                    <span className="value">{user.age || 'N/A'}</span>
                </div>
                <div className="stat">
                    <span className="label">Gender:</span>
                    <span className="value">{user.gender || 'N/A'}</span>
                </div>
                <div className="stat">
                    <span className="label">Phone:</span>
                    <span className="value">{user.phone || 'N/A'}</span>
                </div>
            </div>

            <button onClick={refreshUserData} className="refresh-button">
                Refresh Data
            </button>
        </div>
    );
};

export default UserInfo