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

## Building Dev Client

- iOS
  - `eas build --profile development-simulator --platform ios`
  - Download the .ipa
  - Drag-and-drop it onto the iOS Simulator

## E2E Tests

- Run the app
- In another terminal, run `yarn cypress`
