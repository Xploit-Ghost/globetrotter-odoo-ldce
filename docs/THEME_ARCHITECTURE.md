# Globe Trotter Theme Architecture (V1)

## Global Tokens
### Colors
- **Primary:** \`#4F46E5\` (Indigo-600)
- **Primary Hover:** \`#4338CA\` (Indigo-700)
- **Secondary:** \`#0ea5e9\` (Sky-500)
- **Accent:** \`#F43F5E\` (Rose-500)
- **Background Gradient:** \`#0f172a\` to \`#1e1b4b\`
- **Surface:** \`rgba(255, 255, 255, 0.05)\`
- **Surface Hover:** \`rgba(255, 255, 255, 0.08)\`
- **Surface Border:** \`rgba(255, 255, 255, 0.1)\`
- **Surface Solid:** \`#1e293b\`
- **Text Primary:** \`#f8fafc\`
- **Text Secondary:** \`#94a3b8\`
- **Status Colors:**
  - Danger: \`#ef4444\`
  - Success: \`#10b981\`
  - Warning: \`#f59e0b\`

### Typography
- **Primary Font:** \`Outfit\`
- **Fallback Fonts:** \`-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif\`
- **Headings:** \`font-weight: 700\`, \`line-height: 1.2\`

### Layout & Spacing
- **Container Max Width:** \`1200px\`
- **Padding:** \`24px\` (Container), \`12px 24px\` (Buttons)
- **Border Radius:** \`12px\` (Buttons, Inputs), \`16px\` (Glass Cards), \`24px\` (Glass Panels)
- **Z-Index Layers:** Base rendering

### Visual Effects
- **Glassmorphism Base (\`.glass\`):** 
  - \`background: var(--surface)\`
  - \`backdrop-filter: blur(12px)\`
  - \`border: 1px solid var(--surface-border)\`
  - \`box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1)\`
- **Glassmorphism Panel (\`.glass-panel\`):**
  - \`background: rgba(15, 23, 42, 0.6)\`
  - \`backdrop-filter: blur(16px)\`
  - \`border: 1px solid rgba(255,255,255,0.05)\`
- **Ambient Background:** Radial gradients overlaid on Unsplash image, fixed attachment, heavy backdrop blur (\`40px\`).
- **Gradients:** Text gradients (\`.gradient-text\`) from \`#60a5fa\` to \`#c084fc\`.
- **Animations:** \`fadeIn\` (0.5s), \`pulse-slow\` (3s alternate)

### Components
- **Buttons:** \`.btn-primary\`, \`.btn-secondary\`, \`.btn-danger\`
- **Forms:** \`.form-group\`, \`.form-label\`, \`.form-input\`

*Documented prior to V2 Design Reference Overhaul.*
