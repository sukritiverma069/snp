import React from 'react';
import './InactivityDialog.css';

const InactivityDialog = ({ timeLeft, onExtendSession, onLogout, isVisible }) => {
    if (!isVisible) return null;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="inactivity-overlay">
            <div className="inactivity-dialog">
                <div className="dialog-header">
                    <div className="warning-icon">⚠️</div>
                    <h2>Session Expiring Soon</h2>
                </div>
                
                <div className="dialog-content">
                    <p>Your session will expire in:</p>
                    <div className="countdown-timer">
                        {formatTime(timeLeft)}
                    </div>
                    <p className="warning-text">
                        You will be automatically logged out when the timer reaches zero.
                    </p>
                </div>
                
                <div className="dialog-actions">
                    <button 
                        onClick={onExtendSession}
                        className="extend-button"
                    >
                        Extend Session
                    </button>
                    <button 
                        onClick={onLogout}
                        className="logout-button"
                    >
                        Logout Now
                    </button>
                </div>
                
                <div className="dialog-footer">
                    <small>Click "Extend Session" to continue working</small>
                </div>
            </div>
        </div>
    );
};

export default InactivityDialog;