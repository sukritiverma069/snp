import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { useAuth } from "../../stores";
import UserInfo from "../UserInfo";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PersistentTimer from "../../components/PersistenTimer";
import DropZone from "../../components/DropZone";
import Widget from "../../components/Widget";
import WeatherWidget from "../../components/WeatherWidget";
import TodoWidget from "../../components/TodoWidget";

const defaultWidgets = [
  { id: "timer" },
  { id: "userinfo" },
  { id: "weather" },
  { id: "todo" },
];

const getWidgetContent = (id) => {
  switch (id) {
    case "timer":
      return <PersistentTimer />;
    case "userinfo":
      return <UserInfo />;
    case "weather":
      return <WeatherWidget />;
    case "todo":
      return <TodoWidget />;
    default:
      return <div>Unknown widget</div>;
  }
};

const Dashboard = () => {
  const { user, logout, userActions, isUserLoading } = useAuth();
  const navigate = useNavigate();

  const [widgets, setWidgets] = useState(defaultWidgets);

  useEffect(()=> {
    // Don't run if user data is still loading or not available
    if (isUserLoading || !user?.id) {
      return;
    }

    const savedData = localStorage.getItem('savedWidgets');
    
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      
      if(user.id === parsedData?.userId && parsedData?.widgets){
        setWidgets(parsedData.widgets);
      } else {
        localStorage.setItem('savedWidgets', JSON.stringify({userId: user.id, widgets: defaultWidgets}));
        setWidgets(defaultWidgets);
      }
    } else {
      localStorage.setItem('savedWidgets', JSON.stringify({userId: user.id, widgets: defaultWidgets}));
      setWidgets(defaultWidgets);
    }
  }, [user?.id, isUserLoading]);


  const moveWidget = (item) => {
    
    setWidgets((prev) => {
      const existing = prev.find((w) => w.id === item.id);
      const filtered = prev.filter((w) => w.id !== item.id);
      const newWidgets = [...filtered, existing];

      const localStorageUserId = JSON.parse(localStorage.getItem('savedWidgets'))?.userId;
      const widgetData = {
        userId: localStorageUserId, 
        widgets: newWidgets
      };
      localStorage.setItem('savedWidgets', JSON.stringify(widgetData));
      
      return newWidgets;
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const resetWidgetOrder = () => {
    if (user?.id) {
      setWidgets(defaultWidgets);
      localStorage.setItem('savedWidgets', JSON.stringify({
        userId: user.id, 
        widgets: defaultWidgets
      }));
      
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Welcome!</h1>
          <div className="header-right">
            <div className="user-greeting">
              Hello, {user?.firstName} {user?.lastName}!
            </div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </header>
        <main className="dashboard-main">
          <div className="dashboard-content">
            <div className="widgets-header">
              <h2>Customizable Dashboard</h2>
              <button 
                onClick={resetWidgetOrder}
                className="reset-layout-btn"
                title="Reset widget order to default"
              >
                Reset Layout
              </button>
            </div>
            <div className="widgets-grid">
              {widgets.map((w) => (
                <DropZone key={w.id} onDrop={moveWidget}>
                  <Widget id={w.id}>{getWidgetContent(w.id)}</Widget>
                </DropZone>
              ))}
            </div>
          </div>
        </main>
      </div>
    </DndProvider>
  );
};

export default Dashboard;
