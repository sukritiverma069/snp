import React, { useState, useEffect } from 'react'

const PersistentTimer = () => {
    const [timeOnMount, setTimeOnMount] = useState(new Date().toLocaleTimeString());
    const [displayStartTime, setDisplayStartTime] = useState(new Date().toLocaleTimeString());
    const [timeElapsed, setTimeElapsed] = useState('00:00:00');

    const calculateElapsedTime = () => {
        const startTime = localStorage.getItem('timeOnMount');
        const now = new Date();
        const startDate = new Date(startTime);
        const diff = now - startDate;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeElapsed(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }

    const resetTime = () => {
        const currentTime = new Date();
        setTimeOnMount(currentTime.toLocaleTimeString());
        localStorage.setItem('timeOnMount', currentTime.toISOString());
        setTimeElapsed('00:00:00');
    };

    useEffect(()=> {
        const currentTime = localStorage.getItem('timeOnMount') || new Date();
        setTimeOnMount(currentTime);
        if(!localStorage.getItem('timeOnMount')){
            localStorage.setItem('timeOnMount', currentTime.toISOString());
        }
        setInterval(()=> {
            setDisplayStartTime(new Date().toLocaleTimeString());
            calculateElapsedTime()
        }, 1000)
    }, []);


    return (
        <>
            <div style={{fontSize: '24px', fontWeight: 'bold'}}>{displayStartTime}</div>
            <div style={{fontSize: '24px', fontWeight: 'bold'}}>{timeElapsed}</div>
            <button onClick={() => resetTime()}>Reset Timer</button>
        </>

    )
}

export default PersistentTimer