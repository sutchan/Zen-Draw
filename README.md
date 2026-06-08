# ZenDraw | 禅抽 v3.0

[中文版本](./README_CN.md)

ZenDraw is a professional, full-screen random draw application with Apple-inspired design. Built with Next.js, Tailwind CSS, and Framer Motion. Designed for high-impact visual presentations during lucky draws, classroom activities, or any event requiring a random selection.

## Design Philosophy

This version embraces Apple Design principles:

- **Minimal Layout**: Clean interface with only essential elements
- **Large Display**: Prominent result presentation for visual impact
- **Generous Whitespace**: Comfortable reading with breathing room
- **Clear Hierarchy**: Intuitive content structure

## Features

- **Slot-Machine Roller**: Dynamic rolling animation for draw results.
- **Full-Screen Display**: Immersive visual experience with large, animated numbers.
- **Customizable Rules**:
  - Define range (Min/Max).
  - Set draw count and toggle duplicates.
  - Custom padding (digits), prefixes, and suffixes.
- **Custom List Import**: Import a custom list of items (names, prizes, etc.) to draw from instead of numbers.
- **Multi-language Support**: Seamlessly switch between English and Simplified Chinese.
- **Responsive Design**: Optimized for Desktop, Tablet, and Mobile devices.
- **Theming & Fonts**: Choose from multiple color presets (Default, Ocean, Forest, Sunset, Purple, Neon) and font families (Sans, Mono, Serif).
- **Dark/Light Mode**: Full support for system themes and manual toggling.
- **History Tracking & Export**: Keep track of all previous draws and export them to a text file.
- **Settings Persistence**: All user settings are automatically saved to localStorage.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion (motion/react)
- **Icons**: Lucide React
- **Theming**: next-themes
- **UI Components**: shadcn/ui

## Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## License

MIT License
