# Open Dashboard Next

A modern, production-ready dashboard starter template built with Next.js 15, designed to help you ship your SaaS or application backend faster.

[中文文档](./README.zh-CN.md)

## Features

- **Modern Stack**: Built on Next.js 15 with App Router, React 19, and Turbopack for blazing-fast development
- **Beautiful UI**: Pre-configured with Tailwind CSS v4, Hero UI components, and Phosphor Icons
- **Type-Safe**: Full TypeScript support with strict mode enabled
- **State Management**: Zustand for efficient client-side state management
- **Data Visualization**: Recharts integration for charts and graphs
- **Database Ready**: TypeORM configured for database operations
- **Code Quality**: Biome for linting and formatting
- **Developer Experience**: Bun runtime for faster package management and execution

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/open-dashboard-next.git
cd open-dashboard-next

# Install dependencies
bun install

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard.

## Available Scripts

- `bun run dev` - Start development server with Turbopack
- `bun run build` - Build for production with Turbopack
- `bun run start` - Start production server
- `bun run lint` - Run Biome linter
- `bun run format` - Format code with Biome
- `bun run create-page` - Scaffold a new page (custom script)

## Project Structure

```
open-dashboard-next/
├── src/
│   ├── app/              # Next.js App Router pages and layouts
│   │   ├── (auth)/       # Authentication pages (login, register)
│   │   ├── (dashboard)/  # Dashboard pages with shared layout
│   │   └── api/          # API routes
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utility functions and helpers
│   └── stores/           # Zustand state management stores
├── public/               # Static assets
├── scripts/              # Build and utility scripts
└── config files          # Configuration files (Next.js, Tailwind, TypeScript, etc.)
```

## Tech Stack

### Core Framework
- **Next.js 15.5.4** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety

### Styling & UI
- **Tailwind CSS v4** - Utility-first CSS framework
- **Hero UI** - Component library
- **Phosphor Icons** - Icon system
- **Framer Motion** - Animation library

### Data & State
- **Zustand** - State management
- **TanStack Table** - Powerful table component
- **Recharts** - Chart library
- **Zod** - Schema validation
- **TypeORM** - Database ORM

### Developer Tools
- **Bun** - Fast runtime and package manager
- **Turbopack** - Next-generation bundler
- **Biome** - Fast linter and formatter

## Configuration

### Path Mapping

TypeScript is configured with path mapping for cleaner imports:

```typescript
import { Component } from '@/components/Component'
import { util } from '@/lib/util'
```

### Styling

Tailwind CSS v4 is configured with Hero UI integration. Global styles are in `src/app/globals.css`.

### Linting

Biome is configured for Next.js and React best practices. Configuration is in `biome.json`.

## Development Guidelines

- Use the App Router pattern for all new pages
- Place shared components in `src/components/`
- Use Zustand stores for global state management
- Follow the existing code structure and naming conventions
- Run `bun run lint` before committing code

## Authentication Routes

The template includes pre-built authentication pages:

- `/login` - User login page
- `/register` - User registration page

## Dashboard Features

The dashboard includes several example pages demonstrating common patterns:

- **Main Dashboard** - Overview with charts and metrics
- **Simple Table** - Basic data table implementation
- **Pagination** - Table with server-side pagination
- **Actions** - Table with row actions
- **Compound** - Complex table with multiple features
- **Selectables** - Table with row selection
- **Rich Cell** - Table with custom cell rendering
- **Settings** - User settings page

## Customization

### Adding New Pages

Use the custom page scaffolding script:

```bash
bun run create-page
```

### Modifying the Sidebar

Edit `src/lib/sidebar-items.ts` to add or remove sidebar navigation items.

### Customizing Theme

Modify `tailwind.config.ts` and `src/lib/color-theme.ts` for theme customization.

## Deployment

### Build for Production

```bash
bun run build
bun run start
```

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/open-dashboard-next)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

If you have any questions or run into issues, please open an issue on GitHub.
