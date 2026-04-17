# VocabFlow

VocabFlow is a Next.js vocabulary trainer with spaced repetition, Supabase sync, and Capacitor shells for native mobile apps.

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run test

# Capacitor/mobile
npm run build:mobile
npm run cap:sync
npm run mobile:android
npm run mobile:ios
```

## Web App

- `npm run dev` starts the web app on `http://localhost:3000`.
- `npm run build` verifies the standard Next.js production build.
- `npm run build:mobile` produces the static `out/` export used by Capacitor.

## Mobile Apps

The repo now contains two Capacitor platform targets:

- [android/](./android)
- [ios/](./ios)

Both native shells use the same exported web build from `out/`.

### Android

```bash
npm run mobile:android
```

This rebuilds the static app, syncs Capacitor, and opens Android Studio.

### iOS

```bash
npm run mobile:ios
```

This rebuilds the static app, syncs the iOS project, and opens Xcode.

Current iOS setup uses Swift Package Manager, so CocoaPods is not required for this repo.

#### iOS prerequisites

1. Install the full Xcode app from the App Store.
2. Point `xcode-select` at Xcode instead of Command Line Tools:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

3. Open Xcode once and allow it to install any required components.
4. If you want simulator/device builds from the command line, verify:

```bash
xcodebuild -version
```

#### iOS workflow

1. Run `npm run build:mobile`.
2. Run `npx cap sync ios` if you changed web code or plugin dependencies.
3. Run `npm run mobile:ios` or open `ios/App/App.xcodeproj` directly in Xcode.
4. Select a simulator or connected device and run the app from Xcode.

## Native-specific Notes

- OAuth deep linking uses `com.vocabflow.app://auth/callback`.
- iOS and Android both use Capacitor-native browser auth for Google sign-in.
- Settings export/import now uses native file handling on mobile:
  export writes a JSON backup and opens the share sheet;
  import uses a native file picker.

## Verification

The following checks are expected to pass before shipping:

```bash
npm run lint
npm run test
npm run build
npm run build:mobile
```
