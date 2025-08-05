# AI Screensaver - React Native App 🕐🌤️

A beautiful fullscreen screensaver application built with React Native and Expo, featuring digital clock, weather widget, and rotating background images with smooth transition effects.

## 📦 Ready-to-Use Builds

### ✅ Web Version (Ready)
**Location**: `dist/` folder  
**Size**: ~3.8 MB  
**Files**: 31 files including HTML, CSS, JS, and assets  
**Deploy**: Upload contents of `dist/` folder to any web server  

### 📱 Android Version (Export Ready)
**Location**: `dist/` folder  
**Bundle**: Android Hermes Bytecode (3.46 MB)  
**Status**: Ready for APK creation with Android SDK  

### 🚀 Quick Build Commands
```bash
# Build both platforms
npm run build:all

# Build web only
npm run build:web

# Build Android export only
npm run build:android

# Create Android APK (requires Java & Android SDK)
npm run build:android:apk

# Automated build (Windows)
build.bat

# Automated build (Linux/macOS)
./build.sh
```

## Features ✨

### � Digital Clock
- Large, customizable time display
- 12h/24h format options
- Show/hide seconds
- Date display with multiple formats
- Elegant typography with text shadows

### 🌤️ Weather Widget
- Current weather conditions
- Temperature display
- Location-based weather (auto-detect or manual)
- 3-5 day weather forecast
- Weather icons and descriptions

### 🖼️ Dynamic Backgrounds
- Rotating background images from remote repositories
- Multiple transition effects (fade, slide, zoom, flip)
- Customizable change intervals
- Smooth animations

### ⚙️ Comprehensive Settings
- Time and date customization
- Weather preferences
- Background image configuration
- Transition effects selection
- Keep screen awake option

## Installation 🚀

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aiscreensaver
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Weather API (Optional)**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env and add your OpenWeatherMap API key
   # See WEATHER_API_SETUP.md for detailed instructions
   ```

4. **Setup Image Repositories (Optional)**
   Configure background image sources:
   - See `IMAGE_REPOSITORIES_SETUP.md` for detailed instructions
   - Supports Picsum, Unsplash, GitHub repos, local images, and custom APIs
   - Default: Picsum Photos (no setup required)

5. **Start the development server**
   ```bash
   npx expo start
   ```

## Usage 📱

### Running the App
- Use Expo Go app on your mobile device, or
- Run in iOS Simulator / Android Emulator
- Use `npm start` task in VS Code

### Navigation
- **Tap anywhere** on the screensaver to access settings
- **Back button** in settings to return to screensaver
- **Reset button** to restore default settings

## Project Structure 📁

```
aiscreensaver/
├── app/                          # Expo Router pages
├── components/
│   ├── screensaver/             # Main screensaver components
│   │   ├── ScreensaverScreen.tsx
│   │   ├── DigitalClock.tsx
│   │   ├── WeatherWidget.tsx
│   │   └── BackgroundSlider.tsx
│   └── settings/                # Settings screen
│       └── SettingsScreen.tsx
├── services/                    # Business logic
│   ├── settingsService.ts       # Settings persistence
│   ├── weatherService.ts        # Weather API integration
│   └── imageService.ts          # Image loading
├── types/                       # TypeScript definitions
│   └── index.ts
└── .github/
    └── copilot-instructions.md  # Development guidelines
```

## Configuration ⚙️

### Weather API
Currently uses mock data for demonstration. To integrate with a real weather API:

1. Get an API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Update `weatherService.ts` with your API key
3. Uncomment real API calls

### Image Sources
Default uses [Picsum Photos](https://picsum.photos/) for random images. You can configure:
- Custom image repository URLs
- Local image folders
- CDN endpoints

## Development 🛠️

### Tech Stack
- **React Native** (Latest)
- **Expo** (Managed workflow)
- **TypeScript** (Type safety)
- **Expo Router** (File-based routing)
- **AsyncStorage** (Settings persistence)

### Dependencies
- `@react-native-async-storage/async-storage` - Settings storage
- `expo-location` - GPS location services
- `expo-linear-gradient` - Gradient backgrounds
- `expo-keep-awake` - Prevent screen sleep
- `expo-font` - Custom fonts
- `@expo/vector-icons` - Icon library

### Key Components

#### ScreensaverScreen
Main fullscreen component orchestrating clock, weather, and background

#### DigitalClock
Large time display with customizable formats and styling

#### WeatherWidget
Current conditions and forecast with location detection

#### BackgroundSlider
Image rotation with smooth transition animations

#### SettingsScreen
Comprehensive configuration interface

## Customization 🎨

### Adding New Transition Effects
1. Add effect type to `TransitionEffect` type
2. Implement animation in `BackgroundSlider.tsx`
3. Add option to settings UI

### Custom Fonts
1. Add font files to `assets/fonts/`
2. Load in `_layout.tsx`
3. Apply in component styles

### Weather Providers
1. Create new service in `services/`
2. Implement `WeatherData` interface
3. Update `WeatherWidget` to use new service

## Contributing 🤝

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Support 💬

For questions and support:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

---

Built with ❤️ using React Native and Expo

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
