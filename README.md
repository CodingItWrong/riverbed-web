# List App Expo

An app for creating CRUD apps with interactivity with no programming.

## Requirements

- [Node 16.x](https://nodejs.org) (newer not yet supported by a react-native-web dependency)
- [Yarn 1.x](https://classic.yarnpkg.com/lang/en/)

Optional:

- To run on Android Emulator, [Android Studio](https://developer.android.com/studio)
- To run on iOS Simulator, [Xcode](https://developer.apple.com/xcode/)
- For mobile testing, [Maestro](https://maestro.mobile.dev/getting-started/installing-maestro)

## Installation

- Clone the repo
- Run `yarn install`

Dependencies are locked with `yarn.lock`; please use `yarn` rather than `npm` for installing.

## Running

- Run `yarn web` (starts both Metro and Webpack)

## Development

### Expo Go

Expo Go is currently working for iOS Simulator and Android Emulator, due to using `runtimeVersion.policy = 'sdkVersion'` in `app.json`.

### Custom Dev Client

If you need a custom dev client:

<https://docs.expo.dev/development/create-development-builds/#on-emulatorsimulator>

- Android dev client: `eas build --profile development --platform android`
- iOS simulator dev client: `eas build --profile development-simulator --platform ios`

You can add the `--local` flag to either to build locally.

After this, run `yarn start` then press `a` or `i` to launch the app in the simulator/emulator.

### Xcode Project

You can also run `npx expo prebuild -p ios` to generate the Xcode project. This allows running it from Xcode to develop and test out the share extension in the simulator or attached physical device.

## Preview Client

The preview client uses published "preview" channel JS bundles, and can run on a physical device with an Apple Developer Account.

You can install past preview client builds from https://expo.dev

To build a new preview client: `eas build --profile preview --platform ios` (with optional `--local`). If you do not use `--local`, note that the free Expo plan is limited to 15 iOS builds per month, and then you will begin to be charged.

The preview client loads the latest published `preview` build. This can be published with `bin/deploy`

## Submitting to TestFlight

TestFlight builds can be used by any device added as internal testers.

- `eas build --profile production --platform ios`
- `eas submit --platform ios`

## E2E Tests

### Web: Cypress

- Start webpack by running `yarn start --web` (or, within Metro, press `w`)
- In another terminal, run `yarn cypress`
- Choose E2E Testing, then any browser, then click "Start E2E Testing"

### Native: Maestro

- Boot the app in Expo Go in a simulator or emulator
- Run `maestro test maestro/[some test name].yaml`
