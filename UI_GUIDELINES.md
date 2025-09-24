# Project O Zone - UI Style Guidelines

Based on UI Style Guide v1.1 (Last Updated: 01/23/2025)

## Core Visual Principles
- **CLEAN** - Minimalist and uncluttered interfaces
- **COLORFUL** - Rich, vibrant color palettes 
- **ENERGETIC / FUN** - Dynamic and engaging animations
- **GRAPHIC** - Bold visual elements and typography

## Color System

### Primary Colors (HSL Format)
```css
/* Common Tier */
--common-white: hsl(0, 0%, 100%);           /* #FFFFFF */
--common-light-gray: hsl(200, 17%, 82%);   /* #C8D6DD */
--common-dark-purple: hsl(258, 42%, 22%);   /* #2D1D51 */
--common-purple: hsl(258, 34%, 29%);        /* #453269 */
--common-dark-bg: hsl(270, 58%, 14%);       /* #250F39 */
--common-darker-bg: hsl(270, 55%, 12%);     /* #1E0B2E */
--common-teal: hsl(180, 84%, 21%);          /* #0B6262 */
--common-bright-teal: hsl(166, 83%, 56%);   /* #2BEDC8 */

/* Uncommon Tier */
--uncommon-purple: hsl(258, 42%, 22%);      /* #2D1D51 */
--uncommon-dark: hsl(258, 67%, 11%);        /* #150935 */
--uncommon-darker: hsl(270, 100%, 9%);      /* #17002D */
--uncommon-darkest: hsl(258, 67%, 9%);      /* #120926 */
--uncommon-magenta: hsl(283, 100%, 45%);    /* #A100E4 */
--uncommon-red: hsl(352, 100%, 46%);        /* #E80017 */
--uncommon-green: hsl(117, 100%, 66%);      /* #5EFF50 */

/* Rare Tier */
--rare-mint: hsl(160, 99%, 52%);            /* #10FE93 */
--rare-cyan: hsl(180, 100%, 50%);           /* #00FFFF */
--rare-blue: hsl(207, 100%, 70%);           /* #6BC1FF */

/* Epic Tier */
--epic-cyan: hsl(180, 100%, 50%);           /* #00FFFF */
--epic-pink: hsl(339, 86%, 44%);            /* #CE1151 */
--epic-magenta: hsl(313, 84%, 33%);         /* #960A6B */
--epic-orange: hsl(39, 100%, 57%);          /* #FFB225 */
--epic-hot-pink: hsl(320, 100%, 47%);       /* #FF0190 */
--epic-dark-pink: hsl(339, 94%, 40%);       /* #C9024F */
--epic-purple: hsl(258, 42%, 22%);          /* #2D1D51 */
--epic-dark-magenta: hsl(315, 84%, 23%);    /* #470D45 */
```

### Gradient Combinations
```css
/* Primary Gradients */
--gradient-purple-pink: linear-gradient(135deg, #2D1D51, #CE1151);
--gradient-cyan-teal: linear-gradient(135deg, #00FFFF, #0B6262);
--gradient-epic: linear-gradient(135deg, #FF0190, #FFB225);
--gradient-rare: linear-gradient(135deg, #10FE93, #6BC1FF);

/* Background Gradients */
--gradient-dark-bg: linear-gradient(135deg, #1E0B2E, #250F39);
--gradient-purple-bg: linear-gradient(135deg, #250F39, #2D1D51);
```

## Typography

### Primary Fonts
- **Display/Headers**: Impact (Regular)
- **UI Elements**: Montserrat (Regular, Black)

### Font Sizes
```css
/* Popup Headers */
--font-popup-header: 54pt; /* Impact */
--font-popup-subheader: 32pt; /* Montserrat Black */
--font-popup-text: 24pt; /* Montserrat Regular */

/* Buttons */
--font-button-large: 34pt; /* Montserrat Black */
--font-button-small: 24pt; /* Montserrat Black */

/* Interface */
--font-dropdown: 24pt; /* Montserrat Regular */
```

### Font Treatments
- **Chromatic Aberration** for stat icons
- **Offset Thick Stroke** for emphasis
- **Neon/Glow effects** for interactive elements

## Interactive Elements

### Button States
- **Default**: Base appearance with subtle background
- **Hover**: Enhanced glow/brightness
- **Press**: Slightly compressed/darkened
- **Selected**: Persistent highlight state
- **Disabled**: Reduced opacity/desaturated

### Design Patterns
- **Contrast is Key**: Mix irregular jagged shapes with clean sharp shapes
- **Irregular/Asymmetrical**: Eye-catching, attention-grabbing elements
- **Clean/Sharp**: Background elements that let content shine
- **Diagonal cuts** to match logo aesthetic

## Implementation Notes

### For Homepage
- Use gradient backgrounds with video overlay
- Apply neon glow effects to interactive elements  
- Maintain high contrast ratios
- Use floating animations for engagement

### For Components
- Prefer semantic color tokens over direct hex values
- Apply hover states with smooth transitions
- Use appropriate font weights for hierarchy
- Implement glitch/aberration effects sparingly for accent

### Accessibility
- Ensure sufficient color contrast ratios
- Provide focus indicators for keyboard navigation
- Use semantic HTML structure
- Test with reduced motion preferences