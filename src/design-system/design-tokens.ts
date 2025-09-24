/**
 * COMPREHENSIVE DESIGN SYSTEM TOKENS
 * ===================================
 * This file contains all design tokens, rules, and constants extracted from the project.
 * These values should be used consistently across all components and pages.
 */

// LIGHT MODE COLOR TOKENS (HSL)
export const LIGHT_MODE_COLORS = {
  // Backgrounds
  backgroundStart: '240 10% 85%',
  backgroundEnd: '260 15% 80%',
  background: '0 0% 92%',
  foreground: '240 10% 3.9%',
  
  // Homepage specific
  homepageBackgroundStart: '240 10% 85%',
  homepageBackgroundEnd: '260 15% 80%',
  homepageText: '240 10% 3.9%',
  
  // Draft page specific
  draftBackgroundStart: '240 10% 85%',
  draftBackgroundEnd: '260 15% 80%',
  
  // Homepage button colors
  homepageButtonCards: '120 100% 35%', // Green
  homepageButtonDecks: '200 100% 60%', // Sky Blue
  homepageButtonDraft: '320 100% 60%', // Pink
  homepageButtonRandom: '25 95% 55%', // Orange
  homepageButtonText: '0 0% 98%',
  
  // Primary colors
  primary: '320 100% 50%',
  primaryForeground: '0 0% 98%',
  
  // Accent colors
  accent: '180 100% 40%',
  accentForeground: '0 0% 98%',
  
  // Secondary colors
  secondary: '120 100% 35%',
  secondaryForeground: '0 0% 98%',
  
  // Supporting colors
  muted: '210 40% 95%',
  mutedForeground: '215.4 16.3% 46.9%',
  card: '0 0% 100%',
  cardForeground: '240 10% 3.9%',
  popover: '0 0% 100%',
  popoverForeground: '240 10% 3.9%',
  destructive: '0 84.2% 60.2%',
  destructiveForeground: '0 0% 98%',
  border: '214.3 31.8% 91.4%',
  input: '214.3 31.8% 91.4%',
  ring: '320 100% 50%',
  
  // Wave colors (should match dark mode background)
  waveLight: '260 90% 10%',
  waveDark: '290 95% 5%',
  
  // Chart colors
  chart1: '320 100% 50%',
  chart2: '180 100% 40%',
  chart3: '120 100% 35%',
  chart4: '290 90% 45%',
  chart5: '240 100% 55%',
  
  // Status indicators
  success: '120 100% 35%',
  warning: '60 100% 45%',
  orange: '20 95% 55%',
  orangeForeground: '0 0% 98%',
  
  // Gaming aesthetic
  boxText: '240 10% 3.9%',
  neonGlow: '320 100% 50%',
  
  // Sidebar
  sidebarBackground: '0 0% 98%',
  sidebarForeground: '240 5% 26%',
  sidebarPrimary: '320 100% 50%',
  sidebarPrimaryForeground: '0 0% 98%',
  sidebarAccent: '240 5% 96%',
  sidebarAccentForeground: '320 100% 50%',
  sidebarBorder: '240 6% 90%',
  sidebarRing: '320 100% 50%',
} as const;

// DARK MODE COLOR TOKENS (HSL)
export const DARK_MODE_COLORS = {
  // Dark Fantasy Enhanced backgrounds
  backgroundStart: '260 90% 10%',
  backgroundEnd: '290 95% 5%',
  background: '260 25% 8%',
  foreground: '180 100% 95%',
  
  // Homepage specific (should be dark in dark mode)
  homepageBackgroundStart: '260 90% 10%',
  homepageBackgroundEnd: '290 95% 5%',
  homepageText: '180 100% 95%',
  
  // Draft page specific
  draftBackgroundStart: '260 90% 10%',
  draftBackgroundEnd: '290 95% 5%',
  
  // Homepage button colors (same across modes)
  homepageButtonCards: '120 100% 35%', // Green
  homepageButtonDecks: '200 100% 60%', // Sky Blue
  homepageButtonDraft: '320 100% 60%', // Pink
  homepageButtonRandom: '25 95% 55%', // Orange
  homepageButtonText: '0 0% 98%',
  
  // Enhanced Neon Colors for Dark Mode
  primary: '320 100% 75%',
  primaryForeground: '260 25% 5%',
  
  accent: '180 100% 75%',
  accentForeground: '260 25% 5%',
  
  secondary: '120 100% 70%',
  secondaryForeground: '260 25% 5%',
  
  // Dark Fantasy Supporting Colors
  muted: '260 20% 15%',
  mutedForeground: '260 10% 70%',
  card: '260 30% 12%',
  cardForeground: '180 100% 95%',
  popover: '260 30% 12%',
  popoverForeground: '180 100% 95%',
  destructive: '0 100% 70%',
  destructiveForeground: '260 25% 5%',
  border: '260 35% 20%',
  input: '260 30% 18%',
  ring: '320 100% 75%',
  
  waveLight: '240 10% 85%',
  waveDark: '260 15% 80%',
  
  // Dark Mode Gaming Chart colors
  chart1: '320 100% 75%',
  chart2: '180 100% 75%',
  chart3: '120 100% 70%',
  chart4: '290 90% 65%',
  chart5: '240 100% 80%',
  
  // Dark Mode Status indicators
  success: '120 100% 70%',
  warning: '60 100% 70%',
  orange: '20 95% 65%',
  orangeForeground: '260 25% 5%',
  
  // Dark Mode text for gaming aesthetic
  boxText: '180 100% 95%',
  neonGlow: '320 100% 75%',
  
  // Dark Mode Gaming Sidebar
  sidebarBackground: '260 30% 12%',
  sidebarForeground: '180 100% 95%',
  sidebarPrimary: '320 100% 75%',
  sidebarPrimaryForeground: '260 25% 5%',
  sidebarAccent: '260 25% 18%',
  sidebarAccentForeground: '180 100% 95%',
  sidebarBorder: '260 35% 20%',
  sidebarRing: '320 100% 75%',
} as const;

// GRADIENT DEFINITIONS
export const GRADIENTS = {
  light: {
    primary: 'linear-gradient(135deg, hsl(320 100% 50%), hsl(290 90% 45%))',
    secondary: 'linear-gradient(135deg, hsl(180 100% 40%), hsl(120 100% 35%))',
    fantasy: 'linear-gradient(135deg, hsl(240 10% 85%), hsl(260 15% 80%))',
    card: 'linear-gradient(135deg, hsl(0 0% 92%), hsl(210 40% 88%))',
  },
  dark: {
    primary: 'linear-gradient(135deg, hsl(320 100% 75%), hsl(290 90% 65%))',
    secondary: 'linear-gradient(135deg, hsl(180 100% 75%), hsl(120 100% 70%))',
    fantasy: 'linear-gradient(135deg, hsl(260 90% 10%), hsl(290 95% 5%))',
    card: 'linear-gradient(135deg, hsl(260 30% 12%), hsl(280 35% 15%))',
  }
} as const;

// SHADOW AND GLOW EFFECTS
export const SHADOWS = {
  light: {
    neonPink: '0 0 20px hsl(320 100% 50% / 0.3)',
    neonCyan: '0 0 20px hsl(180 100% 40% / 0.3)',
    neonGreen: '0 0 20px hsl(120 100% 35% / 0.3)',
    gaming: '0 10px 30px hsl(240 20% 95% / 0.8)',
  },
  dark: {
    neonPink: '0 0 20px hsl(320 100% 75% / 0.5)',
    neonCyan: '0 0 20px hsl(180 100% 75% / 0.5)',
    neonGreen: '0 0 20px hsl(120 100% 70% / 0.5)',
    gaming: '0 10px 30px hsl(260 90% 10% / 0.8)',
  }
} as const;

// TYPOGRAPHY
export const FONTS = {
  gaming: ['Orbitron', 'Rajdhani', 'system-ui', 'sans-serif'],
  monoGaming: ['Fira Code', 'Courier New', 'monospace'],
} as const;

// SPACING AND LAYOUT
export const LAYOUT = {
  borderRadius: {
    base: '0.75rem',
    lg: 'var(--radius)',
    md: 'calc(var(--radius) - 2px)',
    sm: 'calc(var(--radius) - 4px)',
  },
  container: {
    center: true,
    padding: '2rem',
    screens: {
      '2xl': '1400px'
    }
  },
  gridTemplateColumns: {
    '13': 'repeat(13, minmax(0, 1fr))',
  }
} as const;

// ANIMATIONS AND KEYFRAMES
export const ANIMATIONS = {
  keyframes: {
    accordionDown: {
      from: { height: '0' },
      to: { height: 'var(--radix-accordion-content-height)' }
    },
    accordionUp: {
      from: { height: 'var(--radix-accordion-content-height)' },
      to: { height: '0' }
    },
    glowPulse: {
      '0%': { boxShadow: '0 0 20px hsl(var(--primary) / 0.5)' },
      '100%': { boxShadow: '0 0 30px hsl(var(--primary) / 0.8), 0 0 40px hsl(var(--accent) / 0.3)' }
    },
    neonFlicker: {
      '0%, 100%': { textShadow: '0 0 5px hsl(var(--primary)), 0 0 10px hsl(var(--primary)), 0 0 15px hsl(var(--primary))' },
      '50%': { textShadow: '0 0 2px hsl(var(--primary)), 0 0 5px hsl(var(--primary)), 0 0 8px hsl(var(--primary))' }
    },
    float: {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-10px)' }
    },
    fadeIn: {
      '0%': { opacity: '0', transform: 'translateY(20px)' },
      '100%': { opacity: '1', transform: 'translateY(0)' }
    }
  },
  durations: {
    accordionDown: '0.2s ease-out',
    accordionUp: '0.2s ease-out',
    glowPulse: '2s ease-in-out infinite alternate',
    neonFlicker: '3s ease-in-out infinite',
    float: '3s ease-in-out infinite',
    fadeIn: '0.6s ease-out forwards'
  }
} as const;

// BUTTON VARIANTS AND SIZES
export const BUTTON_VARIANTS = {
  variants: {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
    orange: 'bg-orange text-orange-foreground hover:bg-orange/90',
  },
  sizes: {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  }
} as const;

// COMPONENT CLASSES
export const COMPONENT_CLASSES = {
  neonText: {
    base: 'text-primary',
    shadow: '0 0 5px hsl(var(--primary)), 0 0 10px hsl(var(--primary)), 0 0 15px hsl(var(--primary))'
  },
  neonCyanText: {
    base: 'text-accent',
    shadow: '0 0 5px hsl(var(--accent)), 0 0 10px hsl(var(--accent)), 0 0 15px hsl(var(--accent))'
  },
  neonGreenText: {
    base: 'text-secondary',
    shadow: '0 0 5px hsl(var(--secondary)), 0 0 10px hsl(var(--secondary)), 0 0 15px hsl(var(--secondary))'
  },
  cardGaming: {
    background: 'var(--gradient-card)',
    border: '1px solid hsl(var(--primary) / 0.3)',
    boxShadow: '0 0 20px hsl(var(--primary) / 0.2), inset 0 1px 0 hsl(var(--accent) / 0.1)'
  },
  btnGaming: {
    background: 'var(--gradient-primary)',
    border: '1px solid hsl(var(--primary))',
    boxShadow: 'var(--shadow-neon-pink)',
    transition: 'all 0.3s ease',
    hover: {
      boxShadow: 'var(--shadow-neon-pink), 0 0 30px hsl(var(--primary) / 0.7)',
      transform: 'translateY(-2px)'
    }
  },
  headingGaming: {
    base: 'font-bold text-transparent bg-clip-text',
    backgroundImage: 'var(--gradient-primary)',
    textShadow: '0 0 30px hsl(var(--primary) / 0.5)'
  },
  roomBackground: {
    position: 'relative',
    background: 'var(--gradient-fantasy)',
    backgroundAttachment: 'fixed'
  }
} as const;

// DESIGN RULES AND GUIDELINES
export const DESIGN_RULES = {
  // Color usage rules
  colors: {
    // NEVER use direct colors like text-white, text-black, bg-white, bg-black
    // ALWAYS use semantic tokens from the design system
    forbidden: ['text-white', 'text-black', 'bg-white', 'bg-black'],
    required: 'USE SEMANTIC TOKENS ONLY: text-foreground, bg-background, etc.',
    format: 'ALL COLORS MUST BE HSL FORMAT'
  },
  
  // Component design rules
  components: {
    buttons: 'Use button variants from BUTTON_VARIANTS, customize through design system',
    cards: 'Use card-gaming class for gaming aesthetic',
    text: 'Use neon-text, neon-cyan-text, neon-green-text for special effects',
    backgrounds: 'Use gradient classes from design system'
  },
  
  // Responsive design
  responsive: {
    mobile: 'Always ensure responsive design',
    breakpoints: 'Follow Tailwind breakpoint system',
    container: 'Use container classes for proper spacing'
  },
  
  // Gaming aesthetic rules
  gaming: {
    fonts: 'Use font-gaming for headings, font-mono-gaming for code',
    effects: 'Apply glow-pulse, neon-flicker animations sparingly',
    shadows: 'Use neon shadow variants for gaming elements',
    contrast: 'Ensure proper contrast in both light and dark modes'
  },
  
  // Dark/Light mode compatibility
  theming: {
    rule: 'ALL components must work in both light and dark modes',
    testing: 'Test every component in both themes',
    tokens: 'Use CSS custom properties for theme-aware styling'
  }
} as const;

// SEMANTIC TOKEN MAPPING
export const SEMANTIC_TOKENS = {
  text: {
    primary: 'text-foreground',
    secondary: 'text-muted-foreground',
    accent: 'text-accent-foreground',
    destructive: 'text-destructive-foreground',
    success: 'text-secondary-foreground' // Using secondary as success color
  },
  background: {
    primary: 'bg-background',
    card: 'bg-card',
    muted: 'bg-muted',
    accent: 'bg-accent',
    destructive: 'bg-destructive'
  },
  border: {
    default: 'border-border',
    input: 'border-input',
    accent: 'border-accent'
  }
} as const;

// USAGE EXAMPLES FOR DEVELOPERS
export const USAGE_EXAMPLES = {
  correctButton: `
    // ✅ CORRECT - Using semantic variant
    <Button variant="secondary">Success Action</Button>
    <Button variant="orange">Warning Action</Button>
  `,
  
  incorrectButton: `
    // ❌ WRONG - Direct color override
    <Button className="bg-green-500 text-white">Success Action</Button>
  `,
  
  correctText: `
    // ✅ CORRECT - Using semantic tokens
    <h1 className="text-foreground font-gaming">Gaming Title</h1>
    <p className="text-muted-foreground">Description text</p>
  `,
  
  incorrectText: `
    // ❌ WRONG - Direct colors
    <h1 className="text-white font-gaming">Gaming Title</h1>
    <p className="text-gray-400">Description text</p>
  `,
  
  correctCard: `
    // ✅ CORRECT - Using design system classes
    <div className="card-gaming">
      <h2 className="heading-gaming">Card Title</h2>
    </div>
  `,
  
  correctNeonEffect: `
    // ✅ CORRECT - Using predefined neon classes
    <span className="neon-text">Glowing Text</span>
    <span className="neon-cyan-text">Cyan Glow</span>
  `
} as const;

export default {
  LIGHT_MODE_COLORS,
  DARK_MODE_COLORS,
  GRADIENTS,
  SHADOWS,
  FONTS,
  LAYOUT,
  ANIMATIONS,
  BUTTON_VARIANTS,
  COMPONENT_CLASSES,
  DESIGN_RULES,
  SEMANTIC_TOKENS,
  USAGE_EXAMPLES
};