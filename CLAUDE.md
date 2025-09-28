# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `bun dev` (preferred) or `npm run dev` - Uses Turbopack for faster builds
- **Production build**: `bun run build` - Also uses Turbopack for optimized builds
- **Start production**: `bun start`
- **Linting**: `bun run lint` - Uses Biome for linting and code quality checks
- **Formatting**: `bun run format` - Uses Biome to format code with 2-space indentation

## Tech Stack & Architecture

This is a Next.js 15 application using the App Router pattern with the following key technologies:

- **Framework**: Next.js 15.5.4 with App Router architecture
- **React**: Version 19.1.0 (latest)
- **Runtime**: Bun (preferred package manager and runtime)
- **Build Tool**: Turbopack (Next.js's Rust-based bundler)
- **Styling**: Tailwind CSS v4
- **Linting/Formatting**: Biome (configured for Next.js and React)
- **TypeScript**: Strict mode enabled with path mapping (`@/*` -> `./src/*`)

## Project Structure

- `src/app/` - App Router pages and layouts (Next.js 13+ pattern)
  - `layout.tsx` - Root layout with Geist font configuration
  - `page.tsx` - Home page component
  - `globals.css` - Global Tailwind styles
- `public/` - Static assets served at root
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration with path mapping
- `biome.json` - Biome linter/formatter configuration

## Code Standards

- **TypeScript**: Strict mode enabled, use proper typing
- **Fonts**: Geist Sans and Geist Mono are pre-configured via next/font/google
- **Styling**: Use Tailwind CSS classes, follows utility-first approach
- **File Organization**: Follow App Router conventions in `src/app/`
- **Import Paths**: Use `@/` alias for imports from `src/` directory

## Biome Configuration

The project uses Biome instead of ESLint/Prettier with:
- 2-space indentation
- Recommended rules for Next.js and React
- Auto-organize imports enabled
- Unknown CSS at-rules disabled (for Tailwind compatibility)

## Development Notes

- Turbopack is enabled for both dev and build commands for faster compilation
- Hot reloading is configured for instant feedback during development
- The project follows Next.js 15 App Router patterns - avoid Pages Router conventions
- Images should use the `next/image` component for optimization