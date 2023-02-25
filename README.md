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

- Run `yarn start`

## Building Clients

<https://docs.expo.dev/development/create-development-builds/#on-emulatorsimulator>

- Android dev client: `eas build --profile development --platform android`
- iOS simulator dev client: `eas build --profile development-simulator --platform ios`
- iOS preview app: `eas build --profile preview --platform ios`

## Publishing JS Updates

- Web and Mobile: `bin/deploy`

## E2E Tests

- Run the app
- In another terminal, run `yarn cypress`
