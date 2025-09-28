# Repository Guidelines

## Project Structure & Module Organization
Source lives in `src/app` using the Next.js App Router: `layout.tsx` defines global wrappers, `page.tsx` hosts the dashboard view, and `globals.css` carries Tailwind 4 utilities. Shared static assets (favicons, imagery) belong in `public/`. Build and tooling configs sit at the repo root (`next.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `biome.json`). Keep feature-specific components and hooks co-located under `src/app/(feature)` folders to sustain route-based modularity.

## Build, Test, and Development Commands
Install once with `npm install` (or `bun install`). Develop locally via `npm run dev`, which launches Next.js with Turbopack at `http://localhost:3000`. Ship-ready builds use `npm run build`; validate production output with `npm run start`. Quality gates rely on Biome: `npm run lint` runs the combined lint rules, while `npm run format` applies canonical formatting. Use `NODE_ENV=development` for diagnostic logging when needed.

## Coding Style & Naming Conventions
TypeScript 5, React 19, and Next.js 15 are the baseline. Biome enforces two-space indentation, trailing commas where valid, and import ordering—run it before committing. Prefer PascalCase for React components, camelCase for hooks and utilities, and kebab-case for route segment directories. Keep server actions in `src/app/api` segments, and colocate component-specific styles with the component or leverage Tailwind utilities inline.

## Testing Guidelines
A dedicated test runner is not yet configured; when adding one, favor Vitest + React Testing Library for component coverage and Playwright for end-to-end flows. Store unit specs alongside source files as `*.test.ts(x)` or under `src/__tests__`. Gate new functionality with meaningful assertions and document any required mocks. Until a test script is wired into `package.json`, call the runner directly (e.g., `npx vitest run`).

## Commit & Pull Request Guidelines
The existing history uses short, descriptive, capitalized messages—follow suit with imperative subject lines under 50 characters (e.g., `Add metrics widget`). Reference related issues in the body and outline key changes plus validation steps. For PRs, include: succinct summary, screenshots or recordings for UI work, testing notes (`npm run lint`, test command results), and any deployment considerations. Request review once checks pass and assign relevant owners.

## Security & Configuration Tips
Store secrets in `.env.local`; never commit them. Align local Node/Bun versions with the lockfiles (`bun.lock`, `package.json`). Review new dependencies for license compatibility and avoid enabling experimental Next.js flags without documenting the rationale in the PR.
