import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cppcompilerhub.app',
  appName: 'C++ Compiler Hub',
  webDir: 'dist',
  server: {
    url: 'https://cpp-compiler-hub.onrender.com',
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
