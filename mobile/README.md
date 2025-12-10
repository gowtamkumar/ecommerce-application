# Mobile App

This is the React Native mobile application for the E-commerce project.

## Prerequisites

- Node.js
- npm or yarn
- Expo Go app on your mobile device OR Android Studio / Xcode for emulators.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Scan the QR code with Expo Go (Android) or Camera (iOS), or press `a` for Android Emulator / `i` for iOS Simulator.

## Configuration

The API URL is configured in `src/api/client.js`.
- Android Emulator: `http://10.0.2.2:3900/api/v1`
- iOS Simulator: `http://localhost:3900/api/v1`
- Physical Device: Replace with your computer's LAN IP (e.g., `http://192.168.1.x:3900/api/v1`).
