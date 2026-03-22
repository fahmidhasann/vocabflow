import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vocabflow.app',
  appName: 'VocabFlow',
  webDir: 'out',
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: '#f5f0e8',
      showSpinner: false,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#f5f0e8',
    },
  },
};

export default config;
