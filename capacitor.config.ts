import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'viajesuc',
  webDir: 'www',
  "bundledWebRuntime": false,
  server: {
    androidScheme: 'https'
  }
};

export default config;
