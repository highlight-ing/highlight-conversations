import React, { useState, useRef, useEffect } from 'react';

interface Option {
  label: string;
  value: any;
}

interface DropdownProps {
  value: any;
  options: Option[];
  onSelect: (option: Option) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const Dropdown: React.FC<DropdownProps> = ({ value, options, onSelect, disabled, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div
      ref={dropdownRef}
      style={{ position: 'relative', display: 'inline-block', ...style }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          padding: '8px 12px',
          cursor: 'pointer',
          backgroundColor: '#222',
          color: '#fff',
          border: '1px solid #444',
          borderRadius: '4px',
          minWidth: '150px',
          textAlign: 'left',
        }}
      >
        {selectedOption ? selectedOption.label : 'Select'}
        <span style={{ float: 'right' }}>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            marginTop: '4px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            zIndex: 1000,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                backgroundColor: value === option.value ? '#eee' : '#fff',
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
