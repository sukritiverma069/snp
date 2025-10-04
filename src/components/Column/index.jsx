import React from "react";
import Widget from "../Widget";
import PersistentTimer from "../PersistentTimer";
import UserInfo from "../UserInfo";
import WeatherWidget from "../WeatherWidget";
import TodoWidget from "../TodoWidget";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import './Column.css';

const Column = ({ widgets }) => {
  const getWidgetContent = (name) => {
    switch (name) {
      case "timer":
        return <PersistentTimer />;
      case "userinfo":
        return <UserInfo />;
      case "weather":
        return <WeatherWidget />;
      case "todo":
        return <TodoWidget />;
      default:
        return <div>Unknown widget: {name}</div>;
    }
  };

  // Safety check for widgets
  if (!widgets || !Array.isArray(widgets) || widgets.length === 0) {
    return <div>No widgets to display</div>;
  }

  // Extract widget IDs for SortableContext
  const widgetIds = widgets.map(widget => widget.id);

  return (
    <SortableContext items={widgetIds} strategy={rectSortingStrategy}>
      <div className="dashboard-grid">
        {widgets.map((w) => (
          <Widget key={w.id} id={w.id}>
            {getWidgetContent(w.name)}
          </Widget>
        ))}
      </div>
    </SortableContext>
  );
};

export default Column;
