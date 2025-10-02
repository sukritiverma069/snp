import React from "react";
import { useDrop } from "react-dnd";

const DropZone = ({ onDrop, children }) => {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "WIDGET",
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={dropRef}
      style={{
        minHeight: "100px",
        border: "2px dashed gray",
        margin: "8px 0",
        backgroundColor: isOver ? "#e0f7fa" : "transparent",
        transition: "0.3s",
      }}
    >
      {children}
    </div>
  );
};

export default DropZone;
