import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { useAuth } from "../../stores";
import { DndContext, closestCorners } from "@dnd-kit/core";
import Column from "../../components/Column";

const defaultWidgets = [
  { id: 1, name: "timer" },
  { id: 2, name: "userinfo" },
  { id: 3, name: "weather" },
  { id: 4, name: "todo" },
];


const Dashboard = () => {
  const { user, logout, userActions, isUserLoading } = useAuth();
  const navigate = useNavigate();

  const [widgets, setWidgets] = useState(() => {
    console.log("checking if this is recalled");
    const savedData = localStorage.getItem("savedWidgets");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData?.widgets) {
          return parsedData.widgets;
        }
      } catch (error) {
        console.error("Error parsing saved widgets:", error);
      }
    }
    return defaultWidgets;
  });

  useEffect(() => {
    console.log("inside useEffect");
    // Don't run if user data is still loading or not available
    if (isUserLoading || !user?.id) {
      return;
    }

    const savedWidgetsJson = localStorage.getItem("savedWidgets");

    if (savedWidgetsJson) {
      try {
        const savedWidgetsData = JSON.parse(savedWidgetsJson);
        const isCurrentUserData = user.id === savedWidgetsData?.userId;
        const hasValidWidgets = savedWidgetsData?.widgets;

        if (isCurrentUserData && hasValidWidgets) {
          setWidgets((currentWidgets) => {
            const userSavedWidgets = savedWidgetsData.widgets;
            const haveWidgetsChanged =
              JSON.stringify(currentWidgets) !==
              JSON.stringify(userSavedWidgets);

            if (haveWidgetsChanged) {
              return userSavedWidgets;
            }
            return currentWidgets;
          });
        } else {
          // Different user or invalid data - initialize with defaults
          const defaultWidgetsData = {
            userId: user.id,
            widgets: defaultWidgets,
          };
          localStorage.setItem(
            "savedWidgets",
            JSON.stringify(defaultWidgetsData)
          );
          setWidgets(defaultWidgets);
        }
      } catch (parseError) {
        console.error("Error parsing saved widgets:", parseError);
        // Reset to defaults on parse error
        const defaultWidgetsData = { userId: user.id, widgets: defaultWidgets };
        localStorage.setItem(
          "savedWidgets",
          JSON.stringify(defaultWidgetsData)
        );
        setWidgets(defaultWidgets);
      }
    } else {
      // No saved data - initialize with defaults
      const defaultWidgetsData = { userId: user.id, widgets: defaultWidgets };
      localStorage.setItem("savedWidgets", JSON.stringify(defaultWidgetsData));
      setWidgets(defaultWidgets);
    }
  }, [user?.id, isUserLoading]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }

    setWidgets((currentWidgets) => {
      const activeIndex = currentWidgets.findIndex((widget) => widget.id === active.id);
      const overIndex = currentWidgets.findIndex((widget) => widget.id === over.id);
      
      if (activeIndex === -1 || overIndex === -1) {
        return currentWidgets;
      }

      // Create new array with reordered widgets
      const newWidgets = [...currentWidgets];
      const [movedWidget] = newWidgets.splice(activeIndex, 1);
      newWidgets.splice(overIndex, 0, movedWidget);
      
      // Save to localStorage
      if (user?.id) {
        const widgetData = {
          userId: user.id,
          widgets: newWidgets,
        };
        localStorage.setItem("savedWidgets", JSON.stringify(widgetData));
      }

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
      localStorage.setItem(
        "savedWidgets",
        JSON.stringify({
          userId: user.id,
          widgets: defaultWidgets,
        })
      );
    }
  };


  return (
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
        <div className="dashboard-main">
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
          </div>
        </div>
        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
           <Column widgets={widgets}></Column>
        </DndContext>
      </div>
  );
};

export default Dashboard;
