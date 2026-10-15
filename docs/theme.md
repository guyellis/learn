# Theme System

Learn features a user-selectable theme system inspired by LinkSilk, supporting light and dark modes with four curated color palettes.

## Palettes

| Palette | Primary Color | Secondary Color |
| :--- | :--- | :--- |
| **Ocean** (Default) | Blue (`#2196f3`) | Teal (`#1de9b6`) |
| **Default** | Cyan (`#00bcd4`) | Deep Orange (`#ff3d00`) |
| **Sunset** | Deep Orange (`#ff5722`) | Amber (`#ffc400`) |
| **Forest** | Green (`#4caf50`) | Lime (`#c6ff00`) |

The legacy static indigo/amber pairing is retired.

## Features

- **Instant Re-theming:** Choosing a palette or toggling light/dark mode re-themes the application immediately without requiring a page reload.
- **Persistent Storage:** Selections are validated and saved in `localStorage` under the key `learn.theme` (`{"themeMode": "light" | "dark", "themePalette": "ocean" | ...}`). Missing, corrupt, or invalid values fall back to defaults (Ocean, light mode).
- **Home Page Picker:** The Home page includes a dedicated **Theme** section with accessible buttons (each at least 48px tall) displaying primary and secondary color swatches, active state indication (`aria-pressed`), and a Light/Dark toggle.
- **Readable Unselected Buttons:** By construction in theme style overrides, unselected outlined toggle buttons (e.g. Level and Operation buttons on the drill setup page) use the theme's primary text color and a clearly visible border. All button text and fills meet or exceed WCAG AA contrast ratio (3:1) across all palettes in both light and dark modes.
- **Current Route Indicator:** Navigation buttons on the AppBar visually indicate the active page with an inverted treatment (light background with bold dark text) and carry `aria-current="page"`. Unknown routes (404) highlight none.
