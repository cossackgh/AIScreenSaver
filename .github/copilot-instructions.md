<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# AI Screensaver App - Development Guidelines

This is a React Native (Expo) application for a fullscreen screensaver with digital clock and weather widget.

## Project Structure

- `/components/screensaver/` - Main screensaver components (clock, weather, background)
- `/components/settings/` - Settings screen components
- `/services/` - Business logic and API services
- `/types/` - TypeScript type definitions

## Key Features

1. **Digital Clock** - Large, customizable time display with date options
2. **Weather Widget** - Current weather and forecast display
3. **Background Images** - Rotating background images with transition effects
4. **Settings** - Comprehensive configuration options

## Development Guidelines

- Use TypeScript for all new files
- Follow React Native best practices
- Use Expo managed workflow
- Implement proper error handling
- Use AsyncStorage for persistent settings
- Support both iOS and Android platforms

## API Integration

- Weather data uses mock data (replace with real API in production)
- Background images use Picsum Photos API for demonstration
- Location services use Expo Location API

## Styling

- Use StyleSheet for component styling
- Support both light and dark themes
- Ensure proper text shadows for readability over images
- Use responsive design principles
