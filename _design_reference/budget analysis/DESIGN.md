---
name: Vibrant Travel System
colors:
  surface: '#fef7ff'
  surface-dim: '#ded8e2'
  surface-bright: '#fef7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f1fc'
  surface-container: '#f2ebf6'
  surface-container-high: '#ede6f1'
  surface-container-highest: '#e7e0eb'
  on-surface: '#1d1a22'
  on-surface-variant: '#584140'
  inverse-surface: '#322f37'
  inverse-on-surface: '#f5eef9'
  outline: '#8c706f'
  outline-variant: '#e0bfbd'
  surface-tint: '#ae2f34'
  primary: '#ae2f34'
  on-primary: '#ffffff'
  primary-container: '#ff6b6b'
  on-primary-container: '#6d0010'
  inverse-primary: '#ffb3b0'
  secondary: '#006a62'
  on-secondary: '#ffffff'
  secondary-container: '#70f8e8'
  on-secondary-container: '#007168'
  tertiary: '#705d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#caa800'
  on-tertiary-container: '#4c3e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad8'
  primary-fixed-dim: '#ffb3b0'
  on-primary-fixed: '#410006'
  on-primary-fixed-variant: '#8c1520'
  secondary-fixed: '#70f8e8'
  secondary-fixed-dim: '#4fdbcc'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#ffe173'
  tertiary-fixed-dim: '#e8c426'
  on-tertiary-fixed: '#221b00'
  on-tertiary-fixed-variant: '#554500'
  background: '#fef7ff'
  on-background: '#1d1a22'
  surface-variant: '#e7e0eb'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Nunito Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Nunito Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Nunito Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  caption:
    fontFamily: Nunito Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  container-max: 1280px
  gutter: 20px
---

## Brand & Style

This design system is built to evoke the excitement, warmth, and energy of global exploration. The brand personality is optimistic and adventurous, utilizing a "Vibrant Playful" aesthetic that balances high-energy colors with soft, approachable geometry. 

The style merges elements of **Modern Minimalism** with **Tactile Softness**. It relies on generous whitespace to allow vivid primary colors to pop, while using deep rounded corners and soft, colorful shadows to create a friendly, "bouncy" interface that feels responsive and welcoming. Every interaction should feel like a discovery, emphasizing motion and depth through subtle gradients and scaling effects.

## Colors

The palette is inspired by tropical landscapes and sun-drenched destinations. 

- **Primary (Sunset Coral):** Used for main actions, active navigation states, and key brand moments.
- **Secondary (Ocean Teal):** Used for supporting actions, filters, and travel categories.
- **Tertiary (Sunny Yellow):** Reserved for highlights, ratings, and "special discovery" UI elements.
- **Background (Warm Off-white):** Provides a soft, non-clinical canvas that reduces eye strain compared to pure white.
- **Gradients:** Use the "Sunset" gradient for hero banners and primary call-to-actions. Use the "Lagoon" gradient for progress trackers and success states.

## Typography

The typography strategy pairs the soft, modern geometry of **Plus Jakarta Sans** for headlines with the highly legible, rounded terminals of **Nunito Sans** for body copy.

- **Headlines:** Should be set with tight letter spacing to feel impactful and confident. Use Bold or ExtraBold weights for clear hierarchy.
- **Body:** Use Regular weight for general content. Ensure a generous line height (1.6) to maintain an airy, relaxed feel conducive to reading travel itineraries.
- **Labels:** Use uppercase with slight letter spacing for category tags and small UI labels to provide a distinct visual contrast from body text.

## Layout & Spacing

The layout follows a **Fluid Grid** philosophy with expanded margins to emphasize a sense of freedom.

- **Grid:** A 12-column system for desktop and a 4-column system for mobile.
- **Rhythm:** Use a 4px baseline grid. Components should primarily use `lg` (24px) padding to maintain the "airy" brand promise.
- **Margins:** Desktop views should utilize a 64px outer margin, while mobile views use 20px to maximize screen real estate for imagery.
- **Grouping:** Use `xl` (40px) spacing between major sections to prevent the vibrant colors from feeling cluttered.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layering** combined with **Ambient Colored Shadows**.

- **Shadows:** Avoid pure black or grey shadows. Use a low-opacity version of the Primary or Deep Accent color (e.g., `rgba(108, 92, 231, 0.15)`) for shadows to maintain the vibrant feel.
- **Levels:**
    - **Level 1 (Cards):** Soft, wide-spread shadow with 0px Y-offset.
    - **Level 2 (Dropdowns/Modals):** Deeper shadow with 8px Y-offset.
- **Interaction:** Floating Action Buttons (FABs) and active cards should "lift" on hover, increasing their shadow spread and scaling by 2% (1.02x) to provide tactile feedback.

## Shapes

The shape language is defined by extreme roundedness to convey friendliness and safety.

- **Cards & Containers:** Use a 24px (1.5rem) radius for all primary containers and image wrappers.
- **Buttons:** Use a 16px (1rem) radius for a "squircle" look, or a full pill shape for secondary utility buttons.
- **Inputs:** Match the button radius (16px) for consistency.
- **Icon Enclosures:** Small icons should be housed in circular or heavily rounded square containers with 12px radius.

## Components

### Buttons
- **Primary:** Sunset Gradient background, white text, 1.02x scale on hover.
- **Secondary:** Ocean Teal outline (2px) with a subtle off-white fill.
- **Tertiary:** Text-only with an underline that transforms into a Sunny Yellow highlight on hover.

### Cards
- **Travel Cards:** Must feature high-quality imagery with a 24px corner radius. Overlays should use a 20% dark gradient at the bottom for text legibility. 
- **Hover State:** Apply a "Lagoon" gradient border or soft purple glow.

### Badges & Chips
- **Status Badges:** High-saturation background (Palm Green for success, Mandarin for warning) with white, bold text.
- **Category Chips:** Light tinted backgrounds (10% opacity of secondary color) with 100px pill radius.

### Input Fields
- **Search Bars:** Large, centered, with a 24px radius and a Tropical Purple search icon. Background should be pure white to contrast against the Warm Off-white page background.

### Navigation
- **Bottom Bar (Mobile):** Use a blur effect (Glassmorphism) with 80% opacity and a Primary color indicator for the active state.