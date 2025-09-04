# HRM Training Visualization

An interactive educational tool for understanding how Hierarchical Reasoning Models (HRM) learn to solve tasks through hierarchical decomposition.

![Version](https://img.shields.io/badge/version-1.0.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

## 🎯 Overview

This visualization demonstrates how an AI agent learns to solve a simple key-door puzzle by breaking it down into hierarchical sub-goals. Watch as the model transforms from random wandering (30-40 steps) to efficient problem-solving (8-10 steps) through training.

### Key Features

- **🎓 Interactive Tutorial**: 7-step guided journey through AI training
- **🧠 Live Thought Visualization**: See the AI's decision-making in real-time
- **📊 Animated Training Process**: Watch examples being processed with progressive speed
- **🎮 Free Exploration Mode**: Experiment with training parameters
- **📈 Performance Metrics**: Track improvement from untrained to trained model

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/wrightmikea/viz-hrm-ft.git
cd viz-hrm-ft

# Run setup script (installs dependencies)
./scripts/setup.sh

# Start development server
./scripts/dev.sh
```

The app will open at `http://localhost:3000` (or `3001` if port is busy).

## 🛠️ Development Workflow

### Available Scripts

| Script | Description |
|--------|-------------|
| `./scripts/setup.sh` | Initial setup - installs dependencies |
| `./scripts/dev.sh` | Start development server with hot reload |
| `./scripts/build.sh` | Build optimized production version |
| `./scripts/serve.sh [port]` | Serve production build (default port: 8080) |
| `./scripts/clean.sh` | Remove build artifacts and dependencies |

### NPM Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 📁 Project Structure

```
viz-hrm-ft/
├── src/
│   ├── components/        # React components
│   │   ├── Dialogs/       # Modal dialogs (About, References, etc.)
│   │   ├── Hierarchy/     # AI thought visualization
│   │   ├── Training/      # Training animation components
│   │   ├── Tutorial/      # Tutorial wizard components
│   │   └── World/         # Game world visualization
│   ├── core/
│   │   ├── game/          # Game engine logic
│   │   └── model/         # HRM model implementation
│   ├── store/             # Zustand state management
│   └── styles/            # Global CSS styles
├── static/                # Production build output
├── scripts/               # Bash utility scripts
├── docs/                  # Documentation and planning
└── LICENSE               # MIT License
```

## 🎮 How to Use

### Tutorial Mode (Default)

1. **Introduction** - Learn about the challenge
2. **See Untrained AI** - Watch random behavior
3. **Generate Training Data** - Create optimal examples
4. **Train the Model** - Watch the learning process
5. **Test Trained AI** - See improved performance
6. **Free Exploration** - Experiment freely

### Free Exploration Mode

After completing the tutorial, use the numbered control buttons:

1. **Reset** - Clear everything
2. **Test** - Run the AI (before/after training)
3. **Data** - Generate training examples
4. **Train** - Start training animation
5. **Test** - Compare performance

### UI Features

- **Mode Indicators**: Always know where you are (Introduction, Tutorial Step N of M, Free Exploration)
- **Help Button**: Shows suggested workflow
- **References Dialog**: Links to research papers and videos
- **About Dialog**: Version info and project details
- **Change History**: Track updates and improvements

## 🧠 Technical Details

### Architecture

- **Frontend**: React 18 with TypeScript
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Build Tool**: Vite
- **Styling**: Tailwind CSS

### HRM Model Components

1. **Planner (High-Level)**: Decides what to do (get key → open door)
2. **Doer (Low-Level)**: Executes actions (move left/right, pick, open)

### Training Process

- **Untrained**: ~30% accuracy, 30-40 steps, often fails
- **Training**: 10 optimal examples, progressive learning visualization
- **Trained**: ~95% accuracy, 8-10 steps, reliable success

## 📚 References

- [HRM GitHub Repository](https://github.com/sapientinc/HRM) - Original implementation
- [Understanding Hierarchical Reasoning](https://www.youtube.com/watch?v=mhft9WBK4uE) - Video explanation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Credits

- **Author**: Mike Wright
- **Year**: 2025
- **Inspired by**: Hierarchical Reasoning Model research

## 📊 Version History

### v1.0.1 (2025-01-04)
- Fixed training data display persistence
- Added help button with workflow instructions
- Reorganized control buttons in logical order
- Added References, About, and Change History dialogs
- Added mode indicators for better UX
- Added footer with copyright and license info

### v1.0.0 (2025-01-04)
- Initial release
- Interactive 7-step tutorial
- Animated training visualization
- Live AI thought bubbles
- Free exploration mode

## 🚢 Deployment

The production build creates static files that can be deployed to any static hosting service:

```bash
# Build for production
./scripts/build.sh

# Files are in ./static directory
# Deploy this directory to your hosting service
```

### Deployment Options

- **GitHub Pages**: Push `static/` directory to `gh-pages` branch
- **Netlify**: Drag and drop `static/` folder
- **Vercel**: Deploy with `vercel --prod static`
- **AWS S3**: Upload `static/` contents to S3 bucket
- **Any static host**: Upload `static/` directory contents

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 is busy | Dev server will automatically use port 3001 |
| Build fails | Run `./scripts/clean.sh` then `./scripts/setup.sh` |
| Dialogs not opening | Check browser console for errors |
| Animation stuttering | Close other browser tabs to free resources |

## 📮 Contact & Support

- **Repository**: [github.com/wrightmikea/viz-hrm-ft](https://github.com/wrightmikea/viz-hrm-ft)
- **Issues**: [GitHub Issues](https://github.com/wrightmikea/viz-hrm-ft/issues)

---

Made with ❤️ for AI education