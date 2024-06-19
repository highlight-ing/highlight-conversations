// Figma: https://www.figma.com/file/YEUIt7OxtgJFybAOfjadMu/Asset-Library---Desktop?type=design&node-id=11690-99271&mode=design&t=VmkleMvWzQtrHfhY-4

  

/**

* An object representing the brand's color scheme.

*

* The color scheme is divided into two main categories: primary and secondary. Each category

* contains a palette of colors represented in different shades, indicated by numeric keys.

*

* The numeric keys range from '10' to '100', where lower numbers represent lighter shades and

* higher numbers represent darker shades. The colors are provided in HEX and RGBA formats.

*

* Example usage:

* const primaryColor = brand.primary['50']; // #FFB84B

* const secondaryColor = brand.secondary['70']; // #6440CE

*

* @property {Object} primary - The primary color palette of the brand.

* @property {string} primary.10 - Lightest shade of the primary color (#FFE2B6).

* @property {string} primary.30 - Light shade of the primary color (#FFC366).

* @property {string} primary.50 - Medium shade of the primary color (#FFB84B).

* @property {string} primary.70 - Dark shade of the primary color (#CC933C).

* @property {string} primary.80 - Darker shade of the primary color in RGBA format (rgba(117, 95, 62)).

* @property {string} primary.90 - Darker shade of the primary color in RGBA format (rgba(97, 75, 42)).

* @property {string} primary.100 - Darkest shade of the primary color (#291C08).

*

* @property {Object} secondary - The secondary color palette of the brand.

* @property {string} secondary.10 - Lightest shade of the secondary color (#C6B2FF).

* @property {string} secondary.30 - Light shade of the secondary color (#8E67FF).

* @property {string} secondary.50 - Medium shade of the secondary color (#794EF4).

* @property {string} secondary.70 - Dark shade of the secondary color (#6440CE).

* @property {string} secondary.100 - Darkest shade of the secondary color (#100826).

*/

export const brand = {

    primary: {
    
    '10': '#FFE2B6',
    
    '30': '#FFC366',
    
    '50': '#FFB84B',
    
    '70': '#CC933C',
    
    '80': 'rgba(117, 95, 62)', // improvised
    
    '90': 'rgba(97, 75, 42)', // improvised
    
    '100': '#291C08'
    
    },
    
    secondary: {
    
    '10': '#C6B2FF',
    
    '30': '#8E67FF',
    
    '50': '#794EF4',
    
    '70': '#6440CE',
    
    '100': '#100826'
    
    }
    
    }
    
      
    
    /**
    
    * An object representing the color scheme for text.
    
    *
    
    * This scheme includes different shades of colors used for textual elements. The shades are
    
    * represented by numeric keys, where lower numbers indicate lighter shades and higher numbers
    
    * indicate darker shades. The colors are provided in HEX format.
    
    *
    
    * Example usage:
    
    * const lightText = text['30']; // #B3B1B6
    
    * const darkText = text['100']; // #161617
    
    *
    
    * @property {string} 0 - Lightest share of text color (white).
    
    * @property {string} 30 - Light shade of text color (#B3B1B6).
    
    * @property {string} 50 - Medium light shade of text color (#83817c).
    
    * @property {string} 70 - Medium dark shade of text color (#5E5C61).
    
    * @property {string} 100 - Darkest shade of text color (#161617).
    
    */
    
    export const text = {
    
    '0': '#FFF',
    
    '30': '#B3B1B6',
    
    '50': '#83817c', // improvised
    
    '70': '#5E5C61',
    
    '100': '#161617'
    
    }
    
      
    
    /**
    
    * An object representing the color scheme for background layers.
    
    *
    
    * This scheme is designed for use in various background layers in a UI. The keys represent
    
    * different layers ('first-layer', 'second-layer', 'third-layer'), each with a specific HEX color value.
    
    *
    
    * Example usage:
    
    * const primaryBackground = background['first-layer']; // #000
    
    * const secondaryBackground = background['second-layer']; // #161617
    
    *
    
    * @property {string} first-layer - Color for the first background layer (#000).
    
    * @property {string} second-layer - Color for the second background layer (#161617).
    
    * @property {string} third-layer - Color for the third background layer (#1F1F20).
    
    */
    
    export const background = {
    
    'first-layer': '#000',
    
    'second-layer': '#161617',
    
    'third-layer': '#1F1F20'
    
    }
    
      
    
    /**
    
    * Object representing the color scheme for buttons.
    
    *
    
    * This includes colors for primary buttons, with shades representing different states or variants.
    
    * The shades are represented by numeric keys ('70', '90', '100'), where lower numbers are lighter and higher numbers are darker.
    
    *
    
    * Example usage:
    
    * const activeButtonColor = button.primary['70']; // #706453
    
    * const disabledButtonColor = button.primary['100']; // #1F1F20
    
    *
    
    * @property {Object} primary - Color palette for primary buttons.
    
    * @property {string} primary.70 - Medium shade of primary button color (#706453).
    
    * @property {string} primary.90 - Dark shade of primary button color (#37322B).
    
    * @property {string} primary.100 - Darkest shade of primary button color (#1F1F20).
    
    */
    
    export const button = {
    
    primary: {
    
    '10': '#FFE2B6',
    
    '30': '#FFC366',
    
    '50': '#FFB84B',
    
    '70': '#706453',
    
    '90': '#37322B',
    
    '100': '#1F1F20'
    
    }
    
    }
    
      
    
    /**
    
    * Object representing the neutral color palette.
    
    *
    
    * This palette is used for various neutral elements in UI design. It includes both HEX and RGBA color formats,
    
    * with numeric keys indicating shade ('30', '100') or opacity levels of white ('0A4', '0A16', '0A24') and black ('100A40', '100A80').
    
    *
    
    * Example usage:
    
    * const lightNeutral = neutral['30']; // #B3B3B3
    
    * const deepNeutral = neutral['100']; // #0D0D0E - Also known as neutral-100 in Figma
    
    * const translucentWhite = neutral['0A16']; // rgba(255, 255, 255, 0.16)
    
    *
    
    * @property {string} 30 - Light neutral color in HEX format (#B3B3B3).
    
    * @property {string} 95 - (Legacy) Very dark neutral color in HEX format (#0D0D0E). This may be deprecated if '100' is the new key used in Figma.
    
    * @property {string} 0A4 - Very translucent white color (rgba(255, 255, 255, 0.04)).
    
    * @property {string} 0A16 - Translucent white color with more opacity (rgba(255, 255, 255, 0.16)).
    
    * @property {string} 0A24 - Translucent white color with even more opacity (rgba(255, 255, 255, 0.24)).
    
    * @property {string} 100A40 - Translucent black color (rgba(0, 0, 0, 0.4)).
    
    * @property {string} 100A80 - More opaque translucent black color (rgba(0, 0, 0, 0.8)).
    
    * @property {string} 100 - Deep neutral color, reflecting the updated neutral-100 color in Figma (#0D0D0E).
    
    */
    
    export const neutral = {
    
    '30': '#B3B3B3',
    
    '95': '#0D0D0E', // legacy? in figma this exists, but its neutral-100
    
    '0A4': 'rgba(255, 255, 255, 0.04)',
    
    '0A8': 'rgba(255, 255, 255, 0.08)',
    
    '0A16': 'rgba(255, 255, 255, 0.16)',
    
    '0A24': 'rgba(255, 255, 255, 0.24)',
    
    '100A40': 'rgba(0, 0, 0, 0.4)',
    
    '100A80': 'rgba(0, 0, 0, 0.8)',
    
    '100': '#0D0D0E'
    
    }
    
      
    
    /**
    
    * An object representing the color scheme for strokes.
    
    *
    
    * This scheme includes various shades and opacities for use in UI strokes or borders. The keys
    
    * represent either the shade ('50') or the opacity level of white color ('0A8', '0A16', '0A24').
    
    * The colors are provided in HEX for shades and RGBA for opacities.
    
    *
    
    * Example usage:
    
    * const regularStroke = stroke['50']; // #5E5C61
    
    * const translucentStroke = stroke['0A16']; // rgba(255, 255, 255, 0.16)
    
    *
    
    * @property {string} 50 - Standard stroke color in HEX format (#5E5C61).
    
    * @property {string} 0A8 - Stroke color with 8% opacity of white (rgba(255, 255, 255, 0.08)).
    
    * @property {string} 0A16 - Stroke color with 16% opacity of white (rgba(255, 255, 255, 0.16)).
    
    * @property {string} 0A24 - Stroke color with 24% opacity of white (rgba(255, 255, 255, 0.24)).
    
    */
    
    export const stroke = {
    
    '50': '#5E5C61',
    
    '0A8': 'rgba(255, 255, 255, 0.08)',
    
    '0A16': 'rgba(255, 255, 255, 0.16)'
    
    }
    
      
    
    /**
    
    * Object representing the color scheme for indicating success.
    
    *
    
    * This scheme includes various shades of green, each representing a level of success or positive indication in a UI.
    
    * The shades are indicated by numeric keys ('10', '30', '50', '60', '70', '100'), with lower numbers being lighter.
    
    *
    
    * Example usage:
    
    * const lightSuccess = success['10']; // #67E4BB
    
    * const darkSuccess = success['100']; // #0E3025
    
    *
    
    * @property {string} 10 - Lightest shade of success color (#67E4BB).
    
    * @property {string} 30 - Light shade of success color (#4DDFB0).
    
    * @property {string} 50 - Medium shade of success color (#01D28E).
    
    * @property {string} 60 - Darker medium shade of success color (#1f7257).
    
    * @property {string} 70 - Dark shade of success color (#0B5E43).
    
    * @property {string} 100 - Darkest shade of success color (#0E3025).
    
    */
    
    export const success = {
    
    '10': '#67E4BB',
    
    '30': '#4DDFB0',
    
    '50': '#01D28E',
    
    '60': '#1f7257',
    
    '70': '#0B5E43',
    
    '100': '#0E3025'
    
    }
    
      
    
    /**
    
    * Object representing the color scheme for indicating errors.
    
    *
    
    * This scheme includes various shades of red, each representing a level of error or warning in a UI.
    
    * The shades are indicated by numeric keys ('10', '30', '50', '70', '100'), with lower numbers being lighter
    
    * and higher numbers being darker. These colors are typically used to draw attention to errors or critical issues.
    
    *
    
    * Example usage:
    
    * const lightError = error['10']; // #EF7177
    
    * const severeError = error['100']; // #341A1C
    
    *
    
    * @property {string} 10 - Lightest shade of error color (#EF7177).
    
    * @property {string} 30 - Light shade of error color (#ED5F66).
    
    * @property {string} 50 - Medium shade of error color (#EB4D55).
    
    * @property {string} 70 - Dark shade of error color (#68292C).
    
    * @property {string} 100 - Darkest shade of error color (#341A1C).
    
    */
    
    export const error = {
    
    '10': '#EF7177',
    
    '30': '#ED5F66',
    
    '50': '#EB4D55',
    
    '70': '#68292C',
    
    '100': '#341A1C'
    
    }
    
      
    
    export default {
    
    brand,
    
    text,
    
    stroke,
    
    background,
    
    button,
    
    neutral,
    
    success,
    
    error
    
    }