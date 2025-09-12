'use client';

import { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export default function Modal({ 
  isOpen, 
  message, 
  type, 
  onClose, 
  autoClose = true, 
  duration = 3000 
}: ModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      
      if (autoClose) {
        const timer = setTimeout(() => {
          setShow(false);
          setTimeout(onClose, 300); // Wait for animation to complete
        }, duration);
        
        return () => clearTimeout(timer);
      }
    } else {
      setShow(false);
    }
  }, [isOpen, autoClose, duration, onClose]);

  if (!isOpen) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? '✅' : '❌';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${show ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className={`relative ${bgColor} text-white p-6 rounded-2xl shadow-2xl transform ${show ? 'scale-100 translate-y-0' : 'scale-95 translate-y-2'} transition-all duration-300 max-w-md mx-4`}>
        <div className="flex items-center gap-4">
          <span className="text-2xl">{icon}</span>
          <div className="flex-1">
            <p className="font-medium text-lg">{message}</p>
            {autoClose && (
              <div className="mt-2 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-300 ease-linear"
                  style={{ 
                    width: show ? '0%' : '100%',
                    transitionDuration: `${duration}ms`
                  }}
                ></div>
              </div>
            )}
          </div>
          {!autoClose && (
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 text-xl font-bold ml-2"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
