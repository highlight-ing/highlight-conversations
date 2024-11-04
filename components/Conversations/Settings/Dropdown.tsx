import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Portal } from 'react-portal'
import styled from 'styled-components'

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

const PIXEL_SPACING = 4;

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
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuStyles, setMenuStyles] = useState<React.CSSProperties>({});
  const [isHovered, setIsHovered] = useState(false);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    },
    [dropdownRef, menuRef],
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      calculateMenuPosition();
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, handleClickOutside])

  const calculateMenuPosition = () => {
    if (dropdownRef.current && menuRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();

      const styles: React.CSSProperties = {
        position: 'fixed',
        minWidth: rect.width,
        zIndex: 1000,
      }

      if (position === 'bottom') {
        styles.top = rect.bottom + PIXEL_SPACING;
        styles.left = rect.left;
      } else if (position === 'top') {
        styles.bottom = window.innerHeight - rect.top + PIXEL_SPACING;
        styles.left = rect.left;
      }

      setMenuStyles(styles);
    }
  }

  const selectedOption = options.find((option) => option.value === value);

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true);
  }

  const handleMouseLeave = () => {
    if (!disabled) setIsHovered(false);
  }

  return (
    <>
      <DropdownInput
        ref={dropdownRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        $isOpen={isOpen}
        $isHovered={isHovered}
        $disabled={disabled}
        $size={size}
        style={style}
      >
        {selectedOption ? selectedOption.label : 'Select'}
        <Arrow
          size={size === 'small' || size === 'xsmall' ? '14' : '17'}
          direction={isOpen ? 'up' : 'down'}
          dropdownSize={size}
        />
      </DropdownInput>
      {isOpen && (
        <Portal>
          <Menu ref={menuRef} style={menuStyles}>
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <MenuItem
                  key={option.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(option);
                    setIsOpen(false);
                  }}
                  selected={isSelected}
                >
                  {option.label}
                </MenuItem>
              );
            })}
          </Menu>
        </Portal>
      )}
    </>
  )
}

export default Dropdown

// Styled-components for Dropdown

interface DropdownInputProps {
  $isOpen: boolean;
  $isHovered: boolean;
  $disabled: boolean;
  $size: string;
}

const DropdownInput = styled.div<DropdownInputProps>`
  display: flex;
  align-items: center;
  border-radius: 8px;
  box-sizing: border-box;
  background-color: ${(props) =>
    props.$isOpen || props.$isHovered ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)'};
  border: ${(props) =>
    props.$isOpen || props.$isHovered
      ? '1px solid rgba(255, 255, 255, 0.2)'
      : '1px solid rgba(255, 255, 255, 0.1)'};
  color: #eeeeee;
  font-weight: 500;
  cursor: ${(props) => (props.$disabled ? 'default' : 'pointer')};
  position: relative;
  white-space: nowrap;
  flex-shrink: 0;
  opacity: ${(props) => (props.$disabled ? 0.35 : 1)};
  pointer-events: ${(props) => (props.$disabled ? 'none' : 'auto')};

  ${(props) => {
    switch (props.$size) {
      case 'xsmall':
        return `
          height: 24px;
          padding-left: 8px;
          padding-right: 30px;
          font-size: 12px;
        `;
      case 'small':
        return `
          height: 32px;
          padding-left: 12px;
          padding-right: 34px;
          font-size: 12px;
        `;
      case 'medium':
        return `
          height: 36px;
          padding-left: 12px;
          padding-right: 37px;
          font-size: 14px;
        `;
      case 'large':
        return `
          height: 42px;
          padding-left: 14px;
          padding-right: 39px;
          font-size: 14px;
        `;
      case 'xlarge':
        return `
          height: 72px;
          padding-left: 14px;
          padding-right: 39px;
          font-size: 14px;
        `;
      default:
        return `
          height: 36px;
          padding-left: 12px;
          padding-right: 37px;
          font-size: 14px;
        `;
    }
  }}
`;

interface ArrowProps {
  size: string;
  color?: string;
  direction: 'up' | 'down';
  dropdownSize: string;
}

const Arrow: React.FC<ArrowProps> = ({
  size = '17',
  color = 'white',
  direction,
  dropdownSize,
}) => {
  return (
    <DirectionalArrow
      $dropdownSize={dropdownSize}
      width={size}
      height={size}
      viewBox="0 0 17 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={
          direction === 'up'
            ? 'M14.1099 11.1604L9.49156 6.54207C8.94614 5.99665 8.05364 5.99665 7.50823 6.54207L2.88989 11.1604'
            : 'M14.1099 6.8396L9.49156 11.4579C8.94614 12.0034 8.05364 12.0034 7.50823 11.4579L2.88989 6.8396'
        }
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </DirectionalArrow>
  );
};

const DirectionalArrow = styled.svg<{ $dropdownSize: string }>`
  position: absolute;
  cursor: pointer;

  ${(props) => {
    switch (props.$dropdownSize) {
      case 'xsmall':
        return `
          top: 5px;
          right: 8px;
        `;
      case 'small':
        return `
          top: 7px;
          right: 12px;
        `;
      case 'medium':
        return `
          top: 7.5px;
          right: 12px;
        `;
      case 'large':
        return `
          top: 9.5px;
          right: 14px;
        `;
      case 'xlarge':
        return `
          top: 27px;
          right: 14px;
        `;
      default:
        return `
          top: 7.5px;
          right: 12px;
        `;
    }
  }}
`;

const Menu = styled.div`
  position: fixed;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  background-color: #1A1A1A;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.32);
  z-index: 1000;
  max-height: 30vh;
  overflow-y: auto;
`;

const MenuItem = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  color: #eeeeee;
  font-size: 14px;
  font-weight: 400;
  white-space: nowrap;
  background-color: ${(props) =>
    props.selected ? 'rgba(255, 255, 255, 0.08)' : 'transparent'};

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }
`
