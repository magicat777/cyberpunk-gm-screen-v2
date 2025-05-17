# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: Cyberpunk GM Screen v2

A modern, accessible, and interactive Cyberpunk Red Game Master Screen built with React, deployed via GitHub Pages.

**Status**: ✅ ALL FEATURES COMPLETE - BUILD SUCCESSFUL

This project has been fully implemented with all planned features. The production build has been completed successfully and is ready for deployment.

## Project Structure

```
cyberpunk-gm-screen-v2/
├── .github/                # GitHub Actions workflows and templates
├── src/                    # React source code
├── public/                 # Static assets
├── tests/                  # Test files
├── scripts/docker/         # Docker configuration
├── docs/                   # Project documentation (not in repo)
├── project-management/     # Agile artifacts (not in repo)
└── Configuration files
```

## Development Environment

- Windows 11 host system
- Docker Desktop for containerization
- Local directory: `C:\claude-ubuntu-dckr4\instance4\projects\cyberpunk-gm-screen-v2`
- Container directory: `/app/data/projects/cyberpunk-gm-screen-v2`

## Commands

### Development
```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn test         # Run tests
yarn lint         # Run linter
yarn format       # Format code
yarn type-check   # Check TypeScript types
```

### Docker
```bash
# From the project root
cd scripts/docker
docker-compose up -d   # Start container
docker-compose down    # Stop container
docker-compose logs    # View logs
```

## Architecture

- **React 18** with TypeScript
- **Vite** for build tooling
- **Zustand** for state management
- **Vitest** for testing
- **Storybook** for component development
- **GitHub Actions** for CI/CD
- **GitHub Pages** for hosting

## Component Structure
Each component follows this pattern:
```
ComponentName/
├── ComponentName.tsx       # Main component
├── ComponentName.test.tsx  # Tests
├── ComponentName.module.css # Styles
├── index.ts               # Export
└── README.md              # Documentation
```

## Development Guidelines

1. **Accessibility First**: All components must be WCAG 2.1 AA compliant
2. **Mobile Responsive**: Design for mobile-first
3. **TypeScript Strict**: Use strict type checking
4. **Test Coverage**: Aim for 80%+ coverage
5. **Clean Commits**: Use conventional commit messages
6. **PR Reviews**: All PRs require review before merge

## Git Workflow

1. Create feature branch from `main`
2. Make changes with meaningful commits
3. Push branch and create PR
4. Wait for CI checks to pass
5. Get PR reviewed and approved
6. Merge to main (squash and merge)
7. Delete feature branch

## Key Features (All Implemented)

✅ **Core Layout** - AppShell, Header, Navigation, Footer
✅ **GM Tools** - DiceRoller, InitiativeTracker, EncounterBuilder, TimerManager
✅ **Reference Panels** - Rules, Skills, Combat, Equipment, Cyberware
✅ **Interactive Elements** - CharacterSheet, NPCGenerator, NightCityMap, NetArchitectureVisualizer, EncounterGenerator
✅ **Utility Components** - Search, Filter, Save/Load, Notes, Session Manager
✅ **Accessibility** - Theme switching, Font controls, Keyboard navigation, Screen reader support

## Completed Features Summary

All planned features have been successfully implemented across all phases:

### Phase 1 - Project Setup & Core Infrastructure ✅
- Vite + React 18 + TypeScript project initialization
- Component architecture with proper folder structure
- Basic routing and state management
- Theme system implementation

### Phase 2 - Design System & Accessibility ✅
- Style foundation (colors, spacing, typography)
- Responsive grid system
- Theme switching (dark/light/high contrast)
- Component library setup

### Phase 3 - Core UI Framework ✅
- App shell with header, footer, navigation
- Typography and icon systems
- Form component library
- Reference panel framework

### Phase 4 - Interactive GM Tools & Features ✅
- Initiative Tracker with combat management
- Character Sheet System with full editing
- NPC Generator with 13 archetypes
- Night City Interactive Map
- NetArchitecture Visualizer
- Equipment Database with filtering
- Session Management System
- Save/Load functionality
- Timer Manager for game sessions

## Deployment

Automatic deployment to GitHub Pages on push to `main` branch via GitHub Actions.

### Production Build
- Build command: `yarn build` or `npm run build`
- Build output: `dist/` directory
- Build status: ✅ Successful (all TypeScript and linting issues resolved)
- Build tool: Vite 7.0.6 with production optimizations
- Assets: Minified and optimized with code splitting

## Important Notes

- Keep the GitHub repository clean (use .gitignore properly)
- Separate development docs from production code
- Test on multiple devices and browsers
- Prioritize accessibility in all features