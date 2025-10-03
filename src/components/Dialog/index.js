import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './Dialog.css';

const DialogComponent = ({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  children, 
  showCloseButton = true,
  className = ''
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className={`dialog-content ${className}`}>
          {title && (
            <Dialog.Title className="dialog-title">
              {title}
            </Dialog.Title>
          )}
          
          {description && (
            <Dialog.Description className="dialog-description">
              {description}
            </Dialog.Description>
          )}
          
          <div className="dialog-body">
            {children}
          </div>
          
          {showCloseButton && (
            <Dialog.Close asChild>
              <button className="dialog-close-button" aria-label="Close">
                <Cross2Icon />
              </button>
            </Dialog.Close>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DialogComponent;