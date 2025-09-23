# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VimMotion Trainer (vimbr) is a React web application designed to help developers master Vim motions through interactive practice problems. The app dynamically generates code transformation challenges where users must navigate from a current state to a target state using optimal Vim commands.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7 with SWC plugin for fast compilation
- **Styling**: Tailwind CSS 4 (using the new Vite plugin)
- **Linting**: ESLint with TypeScript and React hooks plugins

## Development Commands

```bash
# Start development server with hot module replacement
npm run dev

# Build for production (TypeScript compilation + Vite build)
npm run build

# Run ESLint to check code quality
npm run lint

# Preview production build locally
npm run preview
```

## Project Architecture

### Current State
The project is currently in early development with a standard Vite + React template. The actual VimMotion Trainer features described in `vim_trainer_prd.md` are not yet implemented.

### Key Components Structure
- `src/main.tsx` - Application entry point with React 19 StrictMode
- `src/App.tsx` - Main application component (currently default Vite template)
- `src/index.css` - Global styles with Tailwind directives
- `src/App.css` - Component-specific styles

### Configuration Files
- `vite.config.ts` - Vite configuration with React SWC and Tailwind plugins
- `eslint.config.js` - ESLint configuration using the new flat config format
- `tsconfig.json` - Base TypeScript configuration
- `tsconfig.app.json` - Application-specific TypeScript settings
- `tsconfig.node.json` - Node.js environment TypeScript settings

## Development Notes

- The project uses React 19 with the new `createRoot` API
- Tailwind CSS 4 is configured via the new Vite plugin (not PostCSS)
- ESLint uses the modern flat configuration format
- TypeScript is configured with strict mode and modern ES2020 features
- No test framework is currently configured

## Future Implementation

The product requirements document (`vim_trainer_prd.md`) outlines plans for:
- Vim motion practice interface with before/after code states
- Dynamic problem generation system
- User progress tracking and analytics
- Difficulty scaling from basic to expert level motions
- Backend API for problem generation and user management

When implementing these features, consider the architecture described in the PRD which suggests:
- State management via React Query + Zustand
- Vim motion parser and validator
- Code highlighting with Prism.js or Monaco Editor