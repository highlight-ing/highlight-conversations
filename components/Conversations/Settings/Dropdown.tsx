/**
 * 
 * import { useCallback, useEffect, useRef, useState } from 'react'
import { Portal } from 'react-portal'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'

export const Disabled = css`
  ${({ $disabled }) => {
    if ($disabled) {
      return 'opacity: 0.35; pointer-events: none;'
    }
  }}
`

const propTypes = {
  disabled: PropTypes.bool,
  onSelect: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  position: PropTypes.oneOf(['top', 'bottom']),
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large', 'xlarge']).isRequired,
  style: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}

const PIXEL_SPACING = 4

const Dropdown = ({ value, options, size, disabled, onSelect, style, position = 'bottom' }) => {
  const [isOpen, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const menuRef = useRef(null)
  const [menuStyles, setMenuStyles] = useState(null)

  const onClickOutsideListener = useCallback(
    (e) => {
      const el = dropdownRef.current
      if (isOpen && el && !el.contains(e.target)) {
        setOpen(false)
      }
    },
    [isOpen],
  )

  useEffect(() => {
    const getMenuStyles = () => {
      const targetRect = dropdownRef?.current?.getBoundingClientRect?.()
      const menuElement = menuRef.current

      const styles = { position: 'fixed' }

      if (position === 'top') {
        styles.bottom = window.innerHeight - targetRect.top + PIXEL_SPACING
        styles.left = targetRect.left + targetRect.width / 2 - menuElement.offsetWidth / 2
        styles.minWidth = targetRect.width
      } else {
        styles.top = targetRect.bottom + PIXEL_SPACING
        styles.left = targetRect.left
        styles.minWidth = targetRect.width
      }

      setMenuStyles(styles)
    }

    getMenuStyles()
  }, [position, isOpen])

  useEffect(() => {
    document.addEventListener('click', onClickOutsideListener)
    return () => {
      document.removeEventListener('click', onClickOutsideListener)
    }
  }, [onClickOutsideListener])

  useEffect(() => {
    if (isOpen && value) {
      const el = document.getElementById(`dropdown-item-${value?.value ?? value}`)
      if (el) {
        el.scrollIntoView({
          behavior: 'instant',
        })
      }
    }
  }, [isOpen, value])

  return (
    <DropdownInput
      ref={dropdownRef}
      onClick={() => setOpen(!isOpen)}
      style={style}
      $isOpen={isOpen}
      $disabled={disabled}
      $size={size}
    >
      {options.find((option) => option.value === value)?.label ?? value ?? 'Select'}
      <Arrow
        size={size === 'small' || size === 'xsmall' ? '14' : '17'}
        direction={isOpen ? 'up' : 'down'}
        dropdownSize={size}
      />
      <Portal>
        <Menu className="scrollable y" $position={position} style={menuStyles} ref={menuRef} $isOpen={isOpen}>
          {options.map((option, index) => {
            return (
              <MenuItem
                id={`dropdown-item-${option.value ?? option}`}
                key={`dropdown-item-${index}-${option.value ?? option}`}
                onClick={(e) => {
                  if (typeof onSelect === 'function') {
                    onSelect(option)
                  }
                  if (typeof option?.onClick === 'function') {
                    option.onClick(e)
                  }
                }}
                $selected={value === (option?.value ?? option)}
              >
                {option.label ?? option}
              </MenuItem>
            )
          })}
        </Menu>
      </Portal>
    </DropdownInput>
  )
}

Dropdown.propTypes = propTypes

export default Dropdown

const Arrow = ({ size = '17', color = 'white', direction, dropdownSize }) => {
  if (direction === 'down') {
    return (
      <DirectionalArrow
        $dropdownSize={dropdownSize}
        width={`${size}`}
        height={`${size}`}
        viewBox="0 0 17 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.1099 6.8396L9.49156 11.4579C8.94614 12.0034 8.05364 12.0034 7.50823 11.4579L2.88989 6.8396"
          stroke={color}
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </DirectionalArrow>
    )
  } else if (direction === 'up') {
    return (
      <DirectionalArrow
        $dropdownSize={dropdownSize}
        width={`${size}`}
        height={`${size}`}
        viewBox="0 0 17 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.1099 11.1604L9.49156 6.54207C8.94614 5.99665 8.05364 5.99665 7.50823 6.54207L2.88989 11.1604"
          stroke={color}
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </DirectionalArrow>
    )
  }
}

const DropdownInput = styled.div`
  display: flex;
  align-items: center;
  border-radius: ${({ theme }) => theme.border.radius.default};
  box-sizing: border-box;
  background-color: ${({ $isToggled, theme }) => ($isToggled ? theme.text['0'] : theme.neutral['0A4'])};
  border: 1px solid ${({ theme }) => theme.stroke['0A16']};
  color: ${({ theme }) => theme.text['0']};
  font-weight: ${({ theme }) => theme.font.weights.dropdown.input};
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  flex-shrink: 0;

  ${Disabled}

  &:hover {
    background-color: ${({ $isToggled, theme }) => ($isToggled ? 'rgba(255,255,255)' : theme.neutral['0A16'])};
    border-color: ${({ theme }) => theme.stroke['0A24']};
  }

  ${({ $size }) => {
    switch ($size) {
      case 'xsmall':
        return 'height: 24px; padding-inline-start: 8px; padding-inline-end: 30px; font-size: 12px;'
      case 'small':
        return 'height: 32px; padding-inline-start: 12px; padding-inline-end: 34px; font-size: 12px;'
      case 'medium':
        return 'height: 36px; padding-inline-start: 12px; padding-inline-end: 37px; font-size: 14px;'
      case 'large':
        return 'height: 42px; padding-inline-start: 14px; padding-inline-end: 39px; font-size: 14px;'
      case 'xlarge':
        return 'height: 72px; padding-inline-start: 14px; padding-inline-end: 39px; font-size: 14px;'
    }
  }}
`

const DirectionalArrow = styled.svg`
  position: absolute;
  cursor: pointer;
  ${({ $dropdownSize }) => {
    switch ($dropdownSize) {
      case 'xsmall':
        return 'top: 5px; right: 8px;'
      case 'small':
        return 'top: 7px; right: 12px;'
      case 'medium':
        return 'top: 7.5px; right: 12px;'
      case 'large':
        return 'top: 9.5px; right: 14px;'
      case 'xlarge':
        return 'top: 27px; right: 14px;'
    }
  }}
`

const Menu = styled.div`
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.stroke['0A16']};
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.neutral['95']};
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'all' : 'none')};
  flex-direction: column;
  min-width: max-content;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.32);
  z-index: 1;
  max-height: 30vh;
  overflow-y: auto;
`

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  color: ${({ theme }) => theme.text['0']};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.font.weights.dropdown.item};
  white-space: nowrap;
  ${({ $selected }) => ($selected ? `background-color: ${({ theme }) => theme.stroke['0A8']};` : '')}

  &:hover {
    background-color: ${({ theme }) => theme.stroke['0A16']};
  }
`

 * 
 * 
 */