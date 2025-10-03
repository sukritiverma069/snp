import React from "react";
import { useDrag } from "react-dnd";

const Widget = ({ id, children }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "WIDGET",
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
        border: "1px solid #e0e0e0",
        padding: "0",
        backgroundColor: "white",
        cursor: "move",
        borderRadius: "12px",
        boxShadow: isDragging 
          ? "0 8px 25px rgba(0, 0, 0, 0.2)" 
          : "0 4px 15px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        overflow: "hidden",
        height: "fit-content",
      }}
    >
      {children}
    </div>
  );
};

export default Widget;
