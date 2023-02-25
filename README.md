# List App Expo

An app for creating CRUD apps with interactivity with no programming.

## Requirements

- [Node 16.x](https://nodejs.org) (newer not yet supported by a react-native-web dependency)
- [Yarn 1.x](https://classic.yarnpkg.com/lang/en/)

Optional:

- To run on Android Emulator, [Android Studio](https://developer.android.com/studio)
- To run on iOS Simulator, [Xcode](https://developer.apple.com/xcode/)

## Installation

- Clone the repo
- Run `yarn install`

Dependencies are locked with `yarn.lock`; please use `yarn` rather than `npm` for installing.

## Running

- Run `yarn web` (starts both Metro and Webpack)

## Development

Expo Go is currently working for iOS Simulator and Android Emulator, due to using `runtimeVersion.policy = 'sdkVersion'` in `app.json`.

If you need a custom dev client:

<https://docs.expo.dev/development/create-development-builds/#on-emulatorsimulator>

- Android dev client: `eas build --profile development --platform android`
- iOS simulator dev client: `eas build --profile development-simulator --platform ios`

After this, run `yarn start` then press `a` or `i` to launch the app in the simulator/emulator.

## Preview Client

The preview client requires an Apple Developer Account on the device.

You can install past preview client builds from https://expo.dev

To build a new preview client: `eas build --profile preview --platform ios`

The preview client loads the latest published `preview` build. This can be published with `bin/deploy`

## Submitting to TestFlight

TestFlight builds can be used by any device added as internal testers.

- `eas build --profile production --platform ios`
- `eas submit --platform ios`

## E2E Tests

- Run the app
- In another terminal, run `yarn cypress`
