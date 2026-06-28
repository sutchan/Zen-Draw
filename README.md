# ZenDraw | 禅抽 v3.3

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

## Code Quality

This project follows strict code quality standards:

- **TypeScript Strict Mode**: Enhanced type safety with `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`.
- **ESLint Enhanced Rules**: Security, accessibility (jsx-a11y), and React best practices enforcement.
- **Code Review Standard**: Defined review checklist with priority levels (🔴 Blockers, 🟡 Suggestions, 💭 Nits).
- **CI/CD Pipeline**: Automated type checking, linting, build verification, and security audits on every PR.
- **Security First**: `crypto.getRandomValues()` for cryptographic-quality randomness, input validation, XSS protection.

See [Code Review Standard](./.github/CODE_REVIEW_STANDARD.md) for details.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion (motion/react)
- **Icons**: Lucide React
- **Theming**: next-themes
- **UI Components**: shadcn/ui
- **Language**: TypeScript (strict mode)

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

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint check |
| `npm run lint:fix` | Auto-fix ESLint errors |
| `npm run type-check` | TypeScript type checking |

## Project Structure

```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Main page
├── style.css               # Global styles
├── components/
│   ├── draw/               # Draw feature components
│   ├── number-roller.tsx   # Number rolling animation
│   ├── theme-provider.tsx  # Theme provider
│   └── ui/                 # shadcn/ui components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
└── locales/                # i18n translations
```

## Contributing

Please read our [Code Review Standard](./.github/CODE_REVIEW_STANDARD.md) and [PR Template](./.github/PULL_REQUEST_TEMPLATE.md) before submitting a pull request.

### Pull Request Process

1. Create a feature branch from `main`
2. Complete the self-checklist in the PR template
3. Ensure all CI checks pass
4. Request review from code owners
5. Address review feedback

## Security

- Random number generation uses `crypto.getRandomValues()` for cryptographic quality
- All user inputs are validated and sanitized
- No sensitive information is stored in client-side code
- Regular dependency audits with `npm audit`

## License

MIT License
