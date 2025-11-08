
import React from 'react';
import type { Option } from '../types';

interface OptionSelectorProps {
  title: string;
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({ title, options, selectedValue, onSelect }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-sky-500 ${
              selectedValue === option.id
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OptionSelector;
