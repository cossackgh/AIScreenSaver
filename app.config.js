import 'dotenv/config';

export default {
  expo: {
    name: "aiscreensaver",
    slug: "aiscreensaver",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "aiscreensaver",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.anonymous.aiscreensaver"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      "expo-localization"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "2c96446a-f43d-4569-b8f7-41b4f7dc9dbd"
      },
      OPENWEATHERMAP_API_KEY: process.env.OPENWEATHERMAP_API_KEY,
      OPENWEATHERMAP_BASE_URL: process.env.OPENWEATHERMAP_BASE_URL
    }
  }
};
