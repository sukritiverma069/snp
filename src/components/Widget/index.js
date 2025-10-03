import React from "react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import './Widget.css';

const Widget = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.8 : 1,
    padding: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: isDragging 
      ? '0 20px 40px rgba(0, 0, 0, 0.15)' 
      : '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f0f0f0',
    width: '100%',
    minHeight: '400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      {...attributes}
      {...listeners}
    >
      {/* Drag Handle - Visual Indicator Only */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          color: '#4a5568',
          zIndex: 10,
          padding: '8px',
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          opacity: isDragging ? 1 : 0.8,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          pointerEvents: 'none', // Don't interfere with drag events
        }}
        title="Drag to reorder"
      >
        <DragHandleDots2Icon width={16} height={16} />
      </div>
      
      <div className="widget-container" style={{ position: 'relative', height: '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default Widget;
