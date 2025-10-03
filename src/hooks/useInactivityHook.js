import { useState, useEffect } from "react";
import { useAuth } from "../stores";

const useInactivityHook = (sessionDuration = 2 * 1000) => {
  const { isAuthenticated, logout, authActions } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);

  const extendSession = async () => {
    try {
    await authActions.extendSession();
    setShowDialog(false);
    setTimeLeft(5);
    } catch (error) {
      forceLogout();
    }
  }

  const forceLogout = () => {
    setShowDialog(false);
    logout()
  }

  useEffect(() => {
    if (isAuthenticated === true) {
      let timer;

      const resetTimer = () => {
        // Don't reset if dialog is already showing and countdown is active
        if (showDialog) return;
        
        clearTimeout(timer);

         timer = setTimeout(() => {
           setShowDialog(true);
           setTimeLeft(5);
         }, sessionDuration);
      };

      const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

      events.forEach((e) => {
        window.addEventListener(e, resetTimer);
      });

      resetTimer();

      return () => {
        clearTimeout(timer);
        events.forEach((e) => window.removeEventListener(e, resetTimer));
      };
    }
   }, [isAuthenticated, sessionDuration, showDialog]);

   useEffect(() => {
     let countdownTimer;
     
     if (showDialog && timeLeft > 0) {
       countdownTimer = setInterval(() => {
         setTimeLeft((prevTime) => {
           if (prevTime <= 1) {
             setShowDialog(false);
             logout();
             return 0;
           }
           return prevTime - 1;
         });
       }, 1000);
     }

     return () => {
       if (countdownTimer) {
         clearInterval(countdownTimer);
       }
     };
   }, [showDialog, logout]);

   return {
     showDialog,
     timeLeft,
     extendSession,
     forceLogout
   };
};

export default useInactivityHook;
