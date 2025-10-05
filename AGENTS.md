# AGENT.md

This file provides guidance to Codex when working with code in this repository.

## Rules you must follow:

- Commit current changes when the user requests are finished, following this format: `feat/ui/fix/chore/doc: a brief summary about changes.`

## Tech Stack & Architecture

This is a Next.js 15 application using the App Router pattern with the following key technologies:

- **Framework**: Next.js 15.5.4 with App Router architecture
- **React**: Version 19.1.0 (latest)
- **Runtime**: Bun (preferred package manager and runtime)
- **Build Tool**: Turbopack (Next.js's Rust-based bundler)
- **Styling**: Tailwind CSS v4 + Hero UI
- **State Management**: Zustand
- **Linting/Formatting**: Biome (configured for Next.js and React)
- **TypeScript**: Strict mode enabled with path mapping (`@/*` -> `./src/*`)
