import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nexcpp.compiler',
  appName: 'NexCPP',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    // Point to the live site for a "webview app"
    url: 'https://nexcpp-deploy-2.onrender.com',
    cleartext: false,
  },
  android: {
    buildOptions: {
      releaseType: 'APK',
    },
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
