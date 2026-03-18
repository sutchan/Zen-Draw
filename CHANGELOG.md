# Changelog

## [2.4.0]
- feat: Add adjustable draw duration (1-30s, default 5s)

## [2.3.0]
- feat: Set default number display to 3 digits (padding with zeros)

## [2.2.0]
- feat: Add visual expand hint for new users
- feat: Pulse animation on menu button when sidebar is hidden for the first time
- feat: Side-edge "Chevron" hint for quick sidebar expansion on Desktop
- feat: Force hide sidebar immediately when "Start Draw" is clicked
- ux: "New" badge in sidebar header for first-time discovery

## [2.1.0]
- feat: Advanced sidebar auto-hide logic
- feat: Add idle timer (8s) to automatically hide sidebar when inactive
- feat: Add click-outside/backdrop to close sidebar
- feat: Add mobile backdrop for better focus when settings are open
- ux: Improve sidebar interaction and focus

## [2.0.0]
- feat: Implement sidebar auto-hide feature (automatically hides when drawing starts)
- feat: Add "Auto-hide Sidebar" toggle in settings panel
- i18n: Add translations for auto-hide feature in English and Chinese
- refactor: Major version bump for core UX improvement

## [1.7.0]
- fix: Enforce strictly fixed width for individual digit slots in NumberRoller to prevent layout jitter
- style: Further optimize rolling speed for a more intense "slot machine" feel
- refactor: Standardize character slot sizing across responsive breakpoints

## [1.6.0]
- fix: Fix "Random Roller" animation visibility by moving gradient styling to internal elements
- style: Improve rolling animation smoothness and speed
- refactor: Clean up redundant styling in main page

## [1.5.0]
- fix: Remove geolocation permission request and location display
- security: Enhanced privacy by removing unnecessary tracking

## [1.4.0]
- feat: Implement slot-machine style "Random Roller" animation for draw results
- feat: Individual digit animation for a more dynamic visual experience
- style: Update UI to support rolling state

## [1.3.0]
- feat: Rename project to ZenDraw | 禅抽
- style: Update bilingual branding across UI and documentation

## [1.2.0]
- feat: Add SEO metadata and GEO location tracking
- feat: Optimize responsive layout for Desktop/Tablet/Mobile
- feat: Add semantic IDs to all major containers for debugging
- docs: Add GitHub compliant README.md and README_CN.md
- style: Standardize all file header comments to single-line format

## [1.1.0]
- feat: Support i18n (English and Simplified Chinese)
- feat: Refactor layout to full-screen display area
- feat: Add collapsible settings sidebar
- style: Enhance typography and animation for random numbers

## [1.0.0]
- feat: Initial release of Random Draw App
- feat: Add customizable number range (min, max)
- feat: Add customizable display rules (digits padding, prefix, suffix)
- feat: Add draw count and allow duplicates toggle
- feat: Add history panel
- feat: Support dark/light mode toggle
