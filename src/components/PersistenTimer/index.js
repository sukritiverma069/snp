import React, { useState, useEffect } from 'react';
import './PersistentTimer.css';

const PersistentTimer = () => {
    const [displayStartTime, setDisplayStartTime] = useState(new Date().toLocaleTimeString());
    const [timeElapsed, setTimeElapsed] = useState('00:00:00');

    const calculateElapsedTime = () => {
        const startTime = localStorage.getItem('pageOpenTime');
        if (startTime) {
            const now = new Date();
            const startDate = new Date(startTime);
            const diff = now - startDate;
            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setTimeElapsed(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
    };

    const resetTimer = () => {
        const currentTime = new Date();
        localStorage.setItem('pageOpenTime', currentTime.toISOString());
        setTimeElapsed('00:00:00');
    };

    useEffect(() => {
        // Initialize or get existing start time
        let startTime = localStorage.getItem('pageOpenTime');
        if (!startTime) {
            const currentTime = new Date();
            startTime = currentTime.toISOString();
            localStorage.setItem('pageOpenTime', startTime);
        }

        // Update display every second
        const interval = setInterval(() => {
            setDisplayStartTime(new Date().toLocaleTimeString());
            calculateElapsedTime();
        }, 1000);

        // Calculate initial elapsed time
        calculateElapsedTime();

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="persistent-timer">
            <div className="timer-header">
                <h3>⏱️ Page Timer</h3>
                <div className="current-time">
                    {displayStartTime}
                </div>
            </div>
            
            <div className="timer-content">
                <div className="timer-section">
                    <div className="timer-label">Total time spent on this page</div>
                    <div className="timer-display">
                        {timeElapsed}
                    </div>
                </div>
                
                <div className="timer-info">
                    <p>This timer shows how long you've had this page open, even across browser sessions.</p>
                </div>
                
                <button onClick={resetTimer} className="reset-button">
                    🔄 Reset Timer
                </button>
            </div>
        </div>
    );
};

export default PersistentTimer;