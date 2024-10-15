import { useCallback, useEffect, useRef, useState } from 'react'
import { Portal } from 'react-portal'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Disabled } from '../styles'


// Define PIXEL_SPACING or import it if it's defined elsewhere
const PIXEL_SPACING = 8; // Example value, adjust as needed

// Define or import DropdownInput, Arrow, Menu, and MenuItem
const DropdownInput = styled.div``; // Example styled component
const Arrow = ({ size, direction, dropdownSize }) => <div />; // Example component
const Menu = styled.div``; // Example styled component
const MenuItem = styled.div``; // Example styled component

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
  
  Dropdown.propTypes = {
    value: PropTypes.any,
    options: PropTypes.array.isRequired,
    size: PropTypes.string,
    disabled: PropTypes.bool,
    onSelect: PropTypes.func,
    style: PropTypes.object,
    position: PropTypes.string,
  }
  
  export default Dropdown
