import type { CapacitorConfig } from '@capacitor/cli'

// iPhone app wrapper. The app's screens are the same web app in src/, bundled from dist/.
const config: CapacitorConfig = {
  appId: 'com.basementinventory.app',
  appName: 'Dazzle Warehouse',
  webDir: 'dist',
  backgroundColor: '#0B0B0C',
  ios: {
    backgroundColor: '#0B0B0C',
    contentInset: 'never',
  },
}

export default config
