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

const defaultWidgets = [
  { id: "timer", content: <PersistentTimer /> },
  { id: "userinfo", content: <UserInfo /> },
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [widgets, setWidgets] = useState(defaultWidgets);

  useEffect(()=> {
    const savedWidgets = localStorage.getItem("widgets");
    if(savedWidgets){
      setWidgets(JSON.parse(savedWidgets));
    }else {
      setWidgets(defaultWidgets);
    }

  }, []);


  const moveWidget = (item) => {

    setWidgets((prev) => {
      const existing = prev.find((w) => w.id === item.id);
      const filtered = prev.filter((w) => w.id !== item.id);
      return [...filtered, existing];
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Welcome to SNP Assignment</h1>
          <div className="header-right">
            <div className="user-greeting">
              Hello, {user?.firstName} {user?.lastName}!
            </div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </header>
        <main>
          <div style={{ width: "400px", margin: "20px auto" }}>
            <h2>Customizable Dashboard</h2>
            {widgets.map((w) => (
              <DropZone key={w.id} onDrop={moveWidget}>
                <Widget id={w.id}>{w.content}</Widget>
              </DropZone>
            ))}
          </div>
        </main>

        {/* <main className="dashboard-main">
          <div className="dashboard-content">
            <div className="welcome-section">
              <h2>Dashboard</h2>
              <p>
                Welcome to your personal dashboard. Here you can manage your
                profile and view your information.
              </p>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-cards">
                <div className="action-card" onClick={goToProfile}>
                  <div className="card-icon">👤</div>
                  <h4>View Profile</h4>
                  <p>See and manage your profile information</p>
                </div>

                <div className="action-card">
                  <div className="card-icon">⚙️</div>
                  <h4>Settings</h4>
                  <p>Manage your account settings</p>
                </div>

                <div className="action-card">
                  <div className="card-icon">📊</div>
                  <h4>Analytics</h4>
                  <p>View your activity analytics</p>
                </div>
              </div>
            </div>

            <UserInfo />
          </div>
        </main> */}
      </div>
    </DndProvider>
  );
};

export default Dashboard;
