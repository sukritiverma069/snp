import React from "react";
import { useDrop } from "react-dnd";

const DropZone = ({ onDrop, children, index }) => {
  const [{ isOver, canDrop }, dropRef] = useDrop(() => ({
    accept: "WIDGET",
    drop: (item, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      onDrop(item, index);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = isOver && canDrop;

  return (
    <div
      ref={dropRef}
      style={{
        minHeight: "fit-content",
        border: isActive ? "2px dashed #4a90e2" : "2px dashed transparent",
        borderRadius: "12px",
        padding: "4px",
        backgroundColor: isActive ? "rgba(74, 144, 226, 0.1)" : "transparent",
        transition: "all 0.3s ease",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
};

export default DropZone;
