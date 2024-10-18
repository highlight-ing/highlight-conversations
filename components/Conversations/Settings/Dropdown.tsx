import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

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
  position?: 'top' | 'bottom';
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
}

const Dropdown: React.FC<DropdownProps> = ({
  value,
  options,
  onSelect,
  disabled = false,
  style,
  position = 'bottom',
  size = 'medium',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [menuStyles, setMenuStyles] = useState<React.CSSProperties>({});

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      calculateMenuPosition();
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);
  
  const calculateMenuPosition = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();

      const styles: React.CSSProperties = {
        position: 'absolute',
        minWidth: rect.width,
        zIndex: 1000,
      };

      if (position === 'bottom') {
        styles.top = rect.bottom + window.scrollY;
        styles.left = rect.left + window.scrollX;
      } else if (position === 'top') {
        styles.top = rect.top + window.scrollY - rect.height;
        styles.left = rect.left + window.scrollX;
      }

      setMenuStyles(styles);
    }
  };

  const selectedOption = options.find((option) => option.value === value);

  // Styles for the dropdown input
  const getDropdownInputStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      borderRadius: 8,
      boxSizing: 'border-box',
      backgroundColor: isOpen ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
      border: isOpen ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)',
      color: '#eeeeee',
      fontWeight: 500,
      cursor: disabled ? 'default' : 'pointer',
      position: 'relative',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      opacity: disabled ? 0.35 : 1,
      pointerEvents: disabled ? 'none' : 'auto',
    };

    const sizeStyles: React.CSSProperties = {};
    switch (size) {
      case 'xsmall':
        sizeStyles.height = 24;
        sizeStyles.paddingLeft = 8;
        sizeStyles.paddingRight = 30;
        sizeStyles.fontSize = 12;
        break;
      case 'small':
        sizeStyles.height = 32;
        sizeStyles.paddingLeft = 12;
        sizeStyles.paddingRight = 34;
        sizeStyles.fontSize = 12;
        break;
      case 'medium':
        sizeStyles.height = 36;
        sizeStyles.paddingLeft = 12;
        sizeStyles.paddingRight = 37;
        sizeStyles.fontSize = 14;
        break;
      case 'large':
        sizeStyles.height = 42;
        sizeStyles.paddingLeft = 14;
        sizeStyles.paddingRight = 39;
        sizeStyles.fontSize = 14;
        break;
      case 'xlarge':
        sizeStyles.height = 72;
        sizeStyles.paddingLeft = 14;
        sizeStyles.paddingRight = 39;
        sizeStyles.fontSize = 14;
        break;
      default:
        sizeStyles.height = 36;
        sizeStyles.paddingLeft = 12;
        sizeStyles.paddingRight = 37;
        sizeStyles.fontSize = 14;
        break;
    }

    return { ...baseStyle, ...sizeStyles };
  };

  // Styles for the arrow icon
  const getArrowStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {
      position: 'absolute',
      cursor: 'pointer',
    };
    switch (size) {
      case 'xsmall':
        style.top = 5;
        style.right = 8;
        break;
      case 'small':
        style.top = 7;
        style.right = 12;
        break;
      case 'medium':
        style.top = 7.5;
        style.right = 12;
        break;
      case 'large':
        style.top = 9.5;
        style.right = 14;
        break;
      case 'xlarge':
        style.top = 27;
        style.right = 14;
        break;
      default:
        style.top = 7.5;
        style.right = 12;
        break;
    }
    return style;
  };

  // Styles for the dropdown menu
  const menuStyle: React.CSSProperties = {
    position: 'absolute',
    borderRadius: 8,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxSizing: 'border-box',
    backgroundColor: '#1A1A1A',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 0 12px 0 rgba(0, 0, 0, 0.32)',
    zIndex: 1000,
    maxHeight: '30vh',
    overflowY: 'auto',
  };

  // Styles for each menu item
  const getMenuItemStyle = (isSelected: boolean): React.CSSProperties => {
    return {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      cursor: 'pointer',
      color: '#eeeeee',
      fontSize: 14,
      fontWeight: 400,
      whiteSpace: 'nowrap',
      backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
    };
  };

  // Handle hover effects for the dropdown input
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!disabled) setIsHovered(false);
  };

  // Update background and border colors on hover
  const dropdownInputStyle = {
    ...getDropdownInputStyle(),
    backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.08)' : getDropdownInputStyle().backgroundColor,
    border: isHovered
      ? '1px solid rgba(255, 255, 255, 0.2)'
      : getDropdownInputStyle().border,
  };

  return (
    <>
      <div
        ref={dropdownRef}
        style={{ ...dropdownInputStyle, ...style }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {selectedOption ? selectedOption.label : 'Select'}
        <svg
          style={getArrowStyle()}
          width={size === 'small' || size === 'xsmall' ? '14' : '17'}
          height={size === 'small' || size === 'xsmall' ? '14' : '17'}
          viewBox="0 0 17 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={
              isOpen
                ? 'M14.1099 11.1604L9.49156 6.54207C8.94614 5.99665 8.05364 5.99665 7.50823 6.54207L2.88989 11.1604'
                : 'M14.1099 6.8396L9.49156 11.4579C8.94614 12.0034 8.05364 12.0034 7.50823 11.4579L2.88989 6.8396'
            }
            stroke="white"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {isOpen &&
        ReactDOM.createPortal(
          <div style={{ ...menuStyle, ...menuStyles }}>
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <div
                  key={option.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(option);
                    setIsOpen(false);
                  }}
                  style={getMenuItemStyle(isSelected)}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      'rgba(255, 255, 255, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = isSelected
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'transparent';
                  }}
                >
                  {option.label}
                </div>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
};

export default Dropdown;
