import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nexcpp.app',
  appName: 'NexCPP',
  webDir: 'dist',
  server: {
    // For a real native feel, we bundle assets, but we can also use a fallback URL
    url: 'https://nexcpp-deploy-2.onrender.com',
    cleartext: false,
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      releaseType: 'APK',
    },
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  }
};

export default config;
