
import React from 'react';

interface SpinnerProps {
    message: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-sky-500"></div>
      <p className="text-white text-lg mt-4">{message}</p>
    </div>
  );
};

export default Spinner;
