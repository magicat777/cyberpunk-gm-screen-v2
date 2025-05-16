# Cyberpunk GM Screen Directory Structure

## Directory Organization

```
/app/data/projects/cyberpunk-gm-screen-v2/
│
├── .github/                        # GitHub specific configuration
│   ├── workflows/                  # GitHub Actions workflows
│   │   ├── ci.yml                  # Continuous Integration
│   │   ├── cd.yml                  # Continuous Deployment to GitHub Pages
│   │   └── pr-checks.yml           # Pull request validation
│   ├── ISSUE_TEMPLATE/             # Issue templates
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── user_story.md
│   └── pull_request_template.md    # PR template
│
├── docs/                           # Project documentation (not deployed)
│   ├── 01-documentation/           # Planning and requirements
│   │   ├── requirements.md
│   │   ├── architecture.md
│   │   ├── accessibility.md
│   │   ├── style-guide.md
│   │   └── wireframes/
│   ├── 02-development/             # Development guides
│   │   ├── setup.md
│   │   ├── docker-guide.md
│   │   ├── component-guide.md
│   │   ├── testing-strategy.md
│   │   └── ci-cd-guide.md
│   └── 03-deployment/              # Production deployment docs
│       ├── deployment-guide.md
│       ├── monitoring.md
│       └── maintenance.md
│
├── project-management/             # Project management (not in repo)
│   ├── issues/                     # Issue tracking
│   │   ├── backlog.md
│   │   ├── workarounds.md
│   │   └── resolved.md
│   ├── agile/                      # Agile process docs
│   │   ├── sprints/
│   │   ├── retrospectives/
│   │   └── standup-notes/
│   └── user-stories/               # User story definitions
│
├── src/                            # Source code (in GitHub repo)
│   ├── components/                 # React components
│   │   ├── core/                   # Core layout components
│   │   │   ├── AppShell/
│   │   │   ├── Header/
│   │   │   ├── Navigation/
│   │   │   └── Footer/
│   │   ├── gm-tools/              # Game master tools
│   │   │   ├── DiceRoller/
│   │   │   ├── InitiativeTracker/
│   │   │   ├── EncounterBuilder/
│   │   │   └── TimerManager/
│   │   ├── reference/             # Reference panels
│   │   │   ├── RulesReference/
│   │   │   ├── SkillsPanel/
│   │   │   ├── CombatPanel/
│   │   │   ├── EquipmentPanel/
│   │   │   └── CyberwarePanel/
│   │   ├── interactive/           # Interactive elements
│   │   │   ├── CharacterSheet/
│   │   │   ├── NPCGenerator/
│   │   │   ├── NightCityMap/
│   │   │   └── EncounterGenerator/
│   │   ├── utility/               # Utility components
│   │   │   ├── SearchBar/
│   │   │   ├── FilterSystem/
│   │   │   ├── SaveManager/
│   │   │   ├── PrintView/
│   │   │   └── NotesManager/
│   │   └── accessibility/         # Accessibility components
│   │       ├── ThemeProvider/
│   │       ├── FontSizeControls/
│   │       ├── KeyboardNavigationHelper/
│   │       └── ScreenReaderAnnouncements/
│   ├── data/                      # Game data and constants
│   │   ├── skills.json
│   │   ├── equipment.json
│   │   ├── cyberware.json
│   │   └── rules.json
│   ├── hooks/                     # Custom React hooks
│   ├── contexts/                  # React contexts
│   ├── types/                     # TypeScript type definitions
│   ├── styles/                    # Global styles and themes
│   │   ├── themes/
│   │   └── globals.css
│   ├── utils/                     # Utility functions
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Entry point
│   └── vite-env.d.ts             # Vite env types
│
├── public/                        # Static assets (in GitHub repo)
│   ├── images/
│   ├── fonts/
│   └── index.html
│
├── tests/                         # Test files (in GitHub repo)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── scripts/                       # Build and utility scripts (not in repo)
│   ├── build.sh
│   ├── deploy.sh
│   ├── test.sh
│   └── docker/
│       ├── Dockerfile
│       └── docker-compose.yml
│
├── .dockerignore                  # Docker ignore file
├── .gitignore                     # Git ignore file
├── .eslintrc.json                 # ESLint configuration
├── .prettierrc                    # Prettier configuration
├── CLAUDE.md                      # Claude AI instructions
├── LICENSE                        # Project license
├── README.md                      # Project README
├── package.json                   # NPM dependencies
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite configuration
└── yarn.lock                      # Yarn lock file
```

## GitHub Repository Contents

The following directories/files will be committed to GitHub:
- `.github/`
- `src/`
- `public/`
- `tests/`
- Configuration files (`.gitignore`, `.eslintrc.json`, etc.)
- `LICENSE`
- `README.md`
- `package.json`
- `yarn.lock`
- `tsconfig.json`
- `vite.config.ts`

## Local Development Only

The following directories will NOT be in the GitHub repository:
- `docs/` (comprehensive documentation)
- `project-management/` (agile artifacts, issue tracking)
- `scripts/` (deployment scripts, Docker configs)
- `node_modules/` (dependencies)
- `dist/` (build output)
- `.env` files (environment variables)

## Docker Container Structure

The Docker container will mount the local directory and include:
- All source code
- Development dependencies
- Build tools
- Testing frameworks
- Local development server

## GitHub Pages Deployment

The production build will be deployed to GitHub Pages and include:
- Compiled React application
- Static assets
- Service worker for offline functionality
- Optimized bundle

## Component Folder Structure

Each component folder follows this pattern:
```
ComponentName/
├── ComponentName.tsx      # Main component
├── ComponentName.test.tsx # Component tests
├── ComponentName.module.css # Component styles
├── index.ts              # Export file
└── README.md             # Component documentation
```

This structure ensures:
- Clean separation of concerns
- GitHub repository remains deployment-ready
- Documentation and project management artifacts are maintained separately
- Docker development environment is fully configured
- CI/CD pipeline can deploy directly from main branch