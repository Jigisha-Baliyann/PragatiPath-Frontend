import React, { ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-gray-800 text-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ children }: { children: ReactNode }) => <>{children}</>;
export const DialogHeader = ({ children }: { children: ReactNode }) => <div className="mb-4">{children}</div>;
export const DialogTitle = ({ children }: { children: ReactNode }) => <h2 className="text-xl font-bold">{children}</h2>;
export const DialogDescription = ({ children }: { children: ReactNode }) => <p className="text-gray-400">{children}</p>;
export const DialogFooter = ({ children }: { children: ReactNode }) => <div className="mt-4">{children}</div>;
