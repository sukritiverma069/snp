import React from 'react';
import Dialog from '../Dialog';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import './InactivityDialog.css';

const InactivityDialog = ({ timeLeft, onExtendSession, onLogout, isVisible }) => {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Dialog
            open={isVisible}
            onOpenChange={() => {}} // Prevent closing by clicking overlay
            title={
                <div className="inactivity-distillalog-header">
                    <ExclamationTriangleIcon className="warning-icon" />
                    <span>Session Expiring Soon</span>
                </div>
            }
            showCloseButton={false}
            className="inactivity-dialog"
        >
            <div className="inactivity-content">
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
        </Dialog>
    );
};

export default InactivityDialog;