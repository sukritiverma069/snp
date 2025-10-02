import React from "react";
import { useDrag } from "react-dnd";

const Widget = ({ id, children }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "WIDGET",   // Must match droppable type
    item: { id },     // Info about the dragged item
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
        border: "1px solid gray",
        padding: "16px",
        marginBottom: "8px",
        backgroundColor: "white",
        cursor: "move",
      }}
    >
      {children}
    </div>
  );
};

export default Widget;
