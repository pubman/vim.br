# VimMotion Trainer

> Master Vim motions through interactive practice problems in real code contexts

![Status](https://img.shields.io/badge/status-in_development-orange)
![React](https://img.shields.io/badge/React-19.1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF)

VimMotion Trainer is a web application designed to help developers master Vim motions through interactive practice problems. The app provides code transformation challenges where users navigate from current state to target state using optimal Vim commands.

## ✨ Features

### Current Implementation
- 🎯 **Interactive Code Editor** - Real vim motions with CodeMirror 6
- 📊 **Progress Tracking** - Motion-specific learning analytics
- 🎨 **Dark Theme UI** - Professional vim-inspired interface
- 📈 **Performance Metrics** - Speed, efficiency, and score tracking
- 🎮 **Multiple Difficulty Levels** - Progressive skill development
- 📱 **Responsive Design** - Works across all devices

### Planned Features (See [PRD](./vim_trainer_prd.md))
- 🔄 **Dynamic Problem Generation** - Infinite practice scenarios
- 🏆 **Achievement System** - Badges and progress milestones
- 👥 **Multiplayer Mode** - Compete with other developers
- 📚 **Multi-language Support** - JavaScript, Python, Go, Rust
- 🤖 **AI-powered Adaptation** - Personalized learning paths

## 🚀 Quick Start

### Prerequisites
- Node.js 20.19.0+ or 22.12.0+
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/vimbr.git
cd vimbr

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands

```bash
npm run dev      # Start development server with HMR
npm run build    # Build for production
npm run lint     # Run ESLint code quality checks
npm run preview  # Preview production build locally
```

## 🎯 Core Value Proposition

- **Infinite Practice** - Dynamically generated problems ensure endless content
- **Progressive Learning** - Difficulty scaling from basic motions to complex combinations
- **Real Code Context** - Practice with actual code patterns, not abstract text
- **Performance Tracking** - Detailed analytics on motion efficiency and progress

## 🏗️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7 with SWC for fast compilation
- **Styling**: Tailwind CSS 4 (latest version)
- **Code Editor**: CodeMirror 6 with vim extension
- **Motion Engine**: @replit/codemirror-vim
- **State Management**: React hooks (Zustand planned)

## 📁 Project Structure

```
src/
├── components/
│   ├── Stats.tsx           # Performance metrics display
│   ├── CodeWindow.tsx      # Interactive vim editor
│   ├── ProfileSidebar.tsx  # User progress and navigation
│   └── MotionHelper.tsx    # Vim motion reference
├── config.ts               # Application configuration
├── App.tsx                 # Main application component
└── main.tsx               # Application entry point
```

## 🎮 How It Works

1. **Select Difficulty** - Choose from 5 progressive difficulty levels
2. **Practice Motions** - Use vim commands to transform code from current to target state
3. **Track Progress** - Monitor your efficiency and speed improvements
4. **Level Up** - Unlock advanced motions and complex scenarios

### Difficulty Progression

| Level | Focus | Motions |
|-------|-------|---------|
| **Beginner** | Basic navigation | `hjkl`, `w`, `b`, `e` |
| **Intermediate** | Line operations | `$`, `0`, `^`, `f`, `F`, `t`, `T` |
| **Advanced** | Text objects | `ci"`, `da(`, `yi{`, `gg`, `G` |
| **Expert** | Complex combinations | Search patterns, macros |
| **Master** | Optimization challenges | Speed tests, competitions |

## 🔧 Configuration

The application uses modern tooling with sensible defaults:

- **TypeScript**: Strict mode enabled for better code quality
- **ESLint**: React and TypeScript rules with modern flat config
- **Tailwind**: Dark theme with vim-inspired color palette
- **Vim Mode**: Full vim keybinding support with status indicators

## 📋 Development Roadmap

### Phase 1 (Current) - MVP
- [x] Interactive vim editor with motion tracking
- [x] Basic UI with progress indicators
- [x] Dark theme and responsive design
- [ ] Problem generation engine
- [ ] User authentication

### Phase 2 - Enhanced Features
- [ ] Multiple programming languages
- [ ] Advanced analytics dashboard
- [ ] Social features and leaderboards
- [ ] Mobile application

### Phase 3 - Platform
- [ ] AI-powered personalized learning
- [ ] IDE integrations
- [ ] Enterprise/team features
- [ ] Community-generated content

## 🎯 Target Users

- **Primary**: Developers learning Vim/NeoVim who want structured practice
- **Secondary**: Experienced Vim users optimizing motion efficiency
- **Tertiary**: Coding bootcamps and educational platforms

## 📚 Documentation

- [Product Requirements Document](./vim_trainer_prd.md) - Complete feature specifications
- [CLAUDE.md](./CLAUDE.md) - Development guidance for Claude Code

## 🤝 Contributing

Contributions are welcome! Please see the [PRD](./vim_trainer_prd.md) for the complete vision and planned features.

## 📄 License

MIT License - see LICENSE file for details

---

**VimMotion Trainer** - Helping developers master the art of efficient code navigation ⚡
