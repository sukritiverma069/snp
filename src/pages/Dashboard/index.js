import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { useAuth } from "../../stores";
import UserInfo from "../UserInfo";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PersistentTimer from "../../components/PersistentTimer";
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

  const [widgets, setWidgets] = useState(() => {
    const savedData = localStorage.getItem('savedWidgets');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData?.widgets) {
          return parsedData.widgets;
        }
      } catch (error) {
        console.error('Error parsing saved widgets:', error);
      }
    }
    return defaultWidgets;
  });

  useEffect(() => {
    // Don't run if user data is still loading or not available
    if (isUserLoading || !user?.id) {
      return;
    }

    const savedWidgetsJson = localStorage.getItem('savedWidgets');
    
    if (savedWidgetsJson) {
      try {
        const savedWidgetsData = JSON.parse(savedWidgetsJson);
        const isCurrentUserData = user.id === savedWidgetsData?.userId;
        const hasValidWidgets = savedWidgetsData?.widgets;
        
        if (isCurrentUserData && hasValidWidgets) {
          setWidgets(currentWidgets => {
            const userSavedWidgets = savedWidgetsData.widgets;
            const haveWidgetsChanged = JSON.stringify(currentWidgets) !== JSON.stringify(userSavedWidgets);
            
            if (haveWidgetsChanged) {
              return userSavedWidgets;
            }
            return currentWidgets;
          });
        } else {
          // Different user or invalid data - initialize with defaults
          const defaultWidgetsData = { userId: user.id, widgets: defaultWidgets };
          localStorage.setItem('savedWidgets', JSON.stringify(defaultWidgetsData));
          setWidgets(defaultWidgets);
        }
      } catch (parseError) {
        console.error('Error parsing saved widgets:', parseError);
        // Reset to defaults on parse error
        const defaultWidgetsData = { userId: user.id, widgets: defaultWidgets };
        localStorage.setItem('savedWidgets', JSON.stringify(defaultWidgetsData));
        setWidgets(defaultWidgets);
      }
    } else {
      // No saved data - initialize with defaults
      const defaultWidgetsData = { userId: user.id, widgets: defaultWidgets };
      localStorage.setItem('savedWidgets', JSON.stringify(defaultWidgetsData));
      setWidgets(defaultWidgets);
    }
  }, [user?.id, isUserLoading]);


  const moveWidget = (draggedItem, targetIndex) => {
    setWidgets((prev) => {
      const draggedIndex = prev.findIndex((w) => w.id === draggedItem.id);

      // If dragging to the same position, do nothing
      if (draggedIndex === targetIndex) {
        return prev;
      }

      // Create a copy of the array
      const newWidgets = [...prev];

      // Remove the dragged widget from its current position
      const draggedWidget = newWidgets[draggedIndex];
      newWidgets.splice(draggedIndex, 1);

      // Calculate the correct insertion index
      // If we're moving forward (to a higher index), we need to account for the removal
      const insertIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;

      // Insert the widget at the new position
      newWidgets.splice(insertIndex, 0, draggedWidget);

      // Save to localStorage
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
              {widgets && widgets.length > 0 ? (
                widgets.map((w, index) => (
                  <DropZone key={w.id} onDrop={moveWidget} index={index}>
                    <Widget id={w.id}>{getWidgetContent(w.id)}</Widget>
                  </DropZone>
                ))
              ) : (
                <div style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#666',
                  fontStyle: 'italic'
                }}>
                  Loading widgets...
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </DndProvider>
  );
};

export default Dashboard;
