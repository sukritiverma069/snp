import { useState, useEffect } from "react";
import { useAuth } from "../stores";
import { refreshAccessToken } from "../services/authService";

const useInactivityHook = (sessionDuration = 2 * 1000) => {
  const { isAuthenticated, logout, authActions, refreshToken } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const extendSession = async () => {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      authActions.setLoading(true);
      const tokenData = await refreshAccessToken(refreshToken);
      authActions.updateAccessToken(tokenData.accessToken, tokenData.expiresIn);
      
      if (tokenData.refreshToken && tokenData.refreshToken !== refreshToken) {
        authActions.setAuth({
          accessToken: tokenData.accessToken,
          refreshToken: tokenData.refreshToken,
          expiresIn: tokenData.expiresIn
        });
      }
      
      setShowDialog(false);
      setTimeLeft(60);
      authActions.setLoading(false);
    } catch (error) {
      authActions.setLoading(false);
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
        if (showDialog) return;
        
        clearTimeout(timer);

         timer = setTimeout(() => {
           setShowDialog(true);
           setTimeLeft(60);
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
