// @ts-ignore

import merge from 'deepmerge'

import { PropsWithChildren } from 'react'

import { ThemeProvider } from 'styled-components';

// @ts-ignore

import styles from './styles'



const highlight = {
    
    brand: {
        
        primary: {
            
            '0': '#4AED9E',
            
            '10': 'rgba(0,240,255,0.9)',
            
            '30': 'rgba(0,240,255,0.8)',
            
            '50': 'rgba(0,240,255,0.6)',
            
            '70': 'rgba(0,240,255,0.4)',
            
            '100': 'rgba(0,240,255,0.2)'
            
        },
        
        secondary: {
            
            '0': '#712FFF',
            
            '30': 'rgba(113,47,255,0.8)',
            
            '50': 'rgba(113,47,255,0.6)',
            
            '70': 'rgba(113,47,255,0.4)',
            
            '100': 'rgba(113,47,255,0.2)'
            
        },
        
        tertiary: {
            
            '0': '#B3B1B6',
            
            '30': '#83817c',
            
            '50': '#3A3A3A', // improvised
            
            '70': '#262626',
            
            '100': '#161617'
            
        }
        
    },
    
    button: {
        
        primary: {
            
            '0': '#00F0FF',
            
            '10': 'rgba(0,240,255,0.9)',
            
            '30': 'rgba(0,240,255,0.8)',
            
            '50': 'rgba(0,240,255,0.6)',
            
            '70': 'rgba(0,240,255,0.4)',
            
            '100': 'rgba(0,240,255,0.2)'
            
        },
        
        secondary: {
            
            '0': '#fff',
            
            '10': 'rgba(255,255,255,0.9)',
            
            '30': 'rgba(255,255,255,0.8)',
            
            '50': 'rgba(255,255,255,0.6)',
            
            '70': 'rgba(255,255,255,0.4)',
            
            '100': 'rgba(255,255,255,0.2)'
            
        },
        
        tertiary: {
            
            '0': '#B3B1B6',
            
            '30': '#83817c',
            
            '50': '#3A3A3A', // improvised
            
            '70': '#262626',
            
            '100': '#161617'
            
        }
        
    },
    
    border: {
        
        radius: {
            
            default: '8px',
            
            small: '6px',
            
            large: '24px'
            
        }
        
    },
    
    font: {
        
        family: `"Public Sans", sans-serif`,
        
        mono: 'Menlo, monospace',
        
        weights: {
            
            button: '500',
            
            contextMenu: '500',
            
            dropdown: {
                
                input: '500',
                
                item: 'normal'
                
            },
            
            input: '400',
            
            tooltip: '500',
            
            light: '100',
            
            title: '300'
            
        },
        
        sizes: {
            
            default: '16px',
            
            title: '42px',
            
            subtitle: '34px',
            
            small: '12px',
            
            medium: '20px',
            
            large: '24px'
            
        }
        
    },
    
    light: {
        
        '5': 'rgba(255, 255, 255, 0.05)',
        
        '10': 'rgba(255, 255, 255, 0.10)',
        
        '20': 'rgba(255, 255, 255, 0.20)',
        
        '40': 'rgba(255, 255, 255, 0.40)',
        
        '60': 'rgba(255, 255, 255, 0.60)',
        
        '80': 'rgba(255, 255, 255, 0.80)',
        
        '100': 'rgba(255, 255, 255, 1)'
        
    },
    
    dark: {
        
        '5': 'rgba(0, 0, 0, 0.05)',
        
        '10': 'rgba(0, 0, 0, 0.10)',
        
        '20': 'rgba(0, 0, 0, 0.20)',
        
        '40': 'rgba(0, 0, 0, 0.40)',
        
        '60': 'rgba(0, 0, 0, 0.60)',
        
        '80': 'rgba(0, 0, 0, 0.80)',
        
        '100': 'rgba(0, 0, 0, 1)'
    }
    
}



export const HighlightTheme = merge(styles.defaultTheme, highlight)

export const CustomThemeProvider = ({ children }: PropsWithChildren<{}>) => {
    return <ThemeProvider theme={HighlightTheme}>{children}</ThemeProvider>;
};