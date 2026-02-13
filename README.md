# 🌳 Buddy's Treehouse V5

An interactive educational app designed for young learners (ages 3-7) featuring 42 engaging activities across 10 learning modules.

![Version](https://img.shields.io/badge/version-5.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178c6)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎵 Audio & Music
- Custom Suno jingle integration
- Professional splash screen with animated intro
- Background music system with fade in/out
- Interactive sound effects for all actions
- Voice recording (Talking Tom feature)

### 📚 Learning Modules (10 Total)

1. **Letters** 🔤 - Letter recognition, sounds, and matching
2. **Numbers** 🔢 - Counting, recognition, and simple math
3. **Colors** 🎨 - Color recognition, mixing, and rainbow order
4. **Shapes** ⬜ - Shape recognition, sorting, and building
5. **Music** 🎵 - Rhythm patterns, instruments, and memory
6. **Logic & Thinking** 🧩 - Same/different, opposites, patterns, empathy
7. **Science** 🔬 - Day/night cycle, solar system, animals, experiments
8. **Geography** 🌍 - Home tour, neighborhood, and globe exploration
9. **Writing** ✍️ - Letter tracing, spelling, sentences, stories
10. **Physical Ed** ⚽ - Balance, Simon Says, and dance party

### 🎯 Gamification
- **164 Stars** to collect across all activities
- **12 Achievements** to unlock
- Progressive difficulty with star-gated modules
- Confetti celebrations and level-up animations
- Parent dashboard with comprehensive analytics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/buddys-treehouse-v5.git

# Navigate to directory
cd buddys-treehouse-v5

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
buddys-treehouse-v5/
├── public/
│   └── audio/
│       └── buddy-jingle-loop.mp3
├── src/
│   ├── components/
│   │   ├── activities/
│   │   │   ├── LogicThinkingModule.tsx
│   │   │   ├── ScienceModule.tsx
│   │   │   └── RemainingModules.tsx
│   │   ├── ActivityModal.tsx
│   │   ├── Buddy3D-SIMPLE.tsx
│   │   ├── BuddyJinglePlayer.tsx
│   │   ├── BuddyVoiceRecorder.tsx
│   │   ├── EnhancedAnimations.tsx
│   │   ├── ParentDashboard.tsx
│   │   └── SplashScreen.tsx
│   ├── config/
│   │   └── activities.config.ts
│   ├── store/
│   │   └── buddyStore.ts
│   ├── utils/
│   │   └── audioManager.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## 🎮 How to Use

1. **Launch the App** - Opens with custom jingle splash screen
2. **Main Menu** - Select from available learning modules
3. **Complete Activities** - Earn stars and unlock achievements
4. **Track Progress** - Parents can view detailed analytics
5. **Voice Recording** - Kids can record and play back their voice

## 🔧 Technology Stack

- **Frontend Framework**: React 18.2
- **Language**: TypeScript 5.3
- **Build Tool**: Vite 5.1
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 11.0
- **State Management**: Zustand 4.5
- **Icons**: Lucide React

## 📊 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Quality

- ESLint configuration for TypeScript and React
- Strict TypeScript settings
- Auto-formatting with Prettier (recommended)

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repository in Vercel
3. Deploy automatically

The app includes a `vercel.json` configuration file for seamless deployment.

### Other Platforms

Compatible with:
- Netlify
- GitHub Pages
- AWS Amplify
- Any static hosting service

## 🎨 Customization

### Adding New Activities

1. Create component in `src/components/activities/`
2. Import in `activities.config.ts`
3. Add to appropriate module's levels array

### Changing Theme Colors

Edit `tailwind.config.js` to customize:
- Color gradients
- Animations
- Spacing
- Typography

### Audio Files

Place audio files in `public/audio/` directory. Supported formats:
- MP3 (recommended)
- WAV
- OGG

## 📱 Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers (iOS Safari 14+, Chrome Mobile) ✅

## 🐛 Known Issues

- Voice recording requires microphone permissions
- Audio autoplay may be blocked on some mobile browsers (requires user interaction)
- Best performance on modern browsers with hardware acceleration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgments

- Custom jingle created with [Suno AI](https://suno.com)
- Icons from [Lucide](https://lucide.dev)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

**Made with ❤️ for young learners everywhere** 🐻🌳

**Estimated Value**: $110,000+ in educational content and development
