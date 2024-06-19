import styled, { css, keyframes } from 'styled-components'

import colors, { error, neutral, stroke, success, text } from './color'

  

export const defaultTheme = {

...colors,

border: {

radius: {

default: '8px',

small: '6px'

}

},

font: {

family: `"DM Sans", sans-serif`,

weights: {

button: '500',

contextMenu: '500',

dropdown: {

input: '500',

item: 'normal'

},

input: '400',

tooltip: '500'

}

}

}

  

export const Disabled = css`

${({ $disabled }) => {

if ($disabled) {

return 'opacity: 0.35; pointer-events: none;'

}

}}

`

  

const loadingPlaceholderAnimation = keyframes`

0% { background-position: -650px 0; }

100% { background-position: 650px 0; }

`

  

export const LoadingPlaceholder = css`

animation-duration: 1.7s;

animation-fill-mode: forwards;

animation-iteration-count: infinite;

animation-timing-function: linear;

animation-name: ${loadingPlaceholderAnimation};

background: linear-gradient(

to right,

${({ $backgroundColor }) => $backgroundColor || neutral['0A4']} 2%,

${({ $loadingOverlayColor }) => $loadingOverlayColor || stroke['0A8']} 18%,

${({ $backgroundColor }) => $backgroundColor || neutral['0A4']} 33%

);

background-size: ${({ $loadingSpace }) => $loadingSpace ?? '1300px'}; // Animation Area

`

  

export default {

defaultTheme,

Disabled,

LoadingPlaceholder

}