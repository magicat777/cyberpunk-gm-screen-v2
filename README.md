# Cyberpunk GM Screen

A modern, accessible, and interactive Game Master Screen for Cyberpunk Red tabletop RPG sessions. Built with React and deployed via GitHub Pages.

🔗 **Repository:** https://github.com/magicat777/cyberpunk-gm-screen-v2

## Features

### Core Tools
- 🎲 **Dice Roller**: Interactive rolling with Cyberpunk Red mechanics
- ⚔️ **Initiative Tracker**: Combat management with turn order and HP tracking
- 📚 **Rules Reference**: Searchable database of game rules
- 💾 **Save/Load System**: Multiple save slots with import/export

### Character Management
- 👤 **Character Sheets**: Full character display and editing
- 🤖 **NPC Generator**: 13 archetypes with appearance and motivations
- 📊 **Session Management**: Campaign tracking, loot, and reputation

### Game Resources
- 🗡️ **Equipment Database**: Complete catalog of weapons, armor, and cyberware
- 🏙️ **Night City Map**: Interactive map with districts, gangs, and landmarks
- 💻 **NetArchitecture Visualizer**: Create complex netrunning environments
- ⏱️ **Timer Manager**: Session timing with templates and alerts
- 🎯 **Encounter Builder**: Templates, environment, and threat calculation

### UI Features
- 🌗 **Themes**: Dark, Light, Cyberpunk, and High Contrast modes
- ♿ **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation
- 📱 **Mobile**: Responsive design for all screen sizes
- 🔍 **Search**: Fast searching across all content

## Quick Start

```bash
# Clone the repository
git clone https://github.com/magicat777/cyberpunk-gm-screen-v2.git

# Install dependencies
cd cyberpunk-gm-screen-v2
yarn install

# Start development server
yarn dev

# Run tests
yarn test

# Build for production
yarn build
```

## Development

This project uses:
- React 18 with TypeScript
- Vite for blazing fast development
- Zustand for state management
- CSS Modules for styling
- Docker for containerized development
- GitHub Actions for CI/CD
- GitHub Pages for hosting

### Docker Development

```bash
# Build and run the Docker container
cd scripts/docker
docker-compose up -d

# Access the application at http://localhost:5173
```

## Project Structure

```
src/
├── components/          # React components
│   ├── core/           # Layout components
│   ├── gm-tools/       # Game master tools
│   ├── interactive/    # Interactive features
│   ├── reference/      # Reference materials
│   └── utility/        # Utility components
├── data/               # Game data and content
├── hooks/              # Custom React hooks
├── pages/              # Route pages
├── store/              # State management
├── styles/             # Global styles and themes
├── types/              # TypeScript definitions
└── utils/              # Utility functions
```

## Features Documentation

### Dice Roller
- Supports all Cyberpunk Red dice types (d6, d10)
- Critical success/failure detection
- Roll history tracking
- Custom modifiers

### Initiative Tracker
- Turn order management
- HP tracking
- Quick add participants
- Combat flow control

### Character System
- Complete character sheets
- Edit mode for all stats
- Skills, cyberware, equipment tracking
- Lifepath information

### NPC Generator
- 13 different archetypes
- Customizable threat levels
- Random appearance generation
- Motivation and personality traits

### Equipment Database
- Weapons, armor, cyberware catalog
- Advanced filtering
- Grid and list views
- Detailed item specifications

### Night City Map
- Interactive district navigation
- Gang territory visualization
- Landmark system
- Wiki-style notes per region

### NetArchitecture Visualizer
- Floor-based architecture design
- Challenge and loot generation
- Visual representation
- 2077/Edgerunners compatible

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS/Android)

## Contributing

Please read our [Contributing Guide](docs/02-development/contributing.md) before submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Cyberpunk Red is © R. Talsorian Games
- This is an unofficial fan project
- Built with ❤️ by the community

## Status

✅ **Project Complete**: All features implemented and ready for use!