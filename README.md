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

Expo Go is useful for quickly installing a running app on iOS Simulator and Android Emulator, when additional native functionality (the share extension) does not need to be tested.

To run Expo Go, run `yarn start` and then press `a` or `i`. If Expo Go is not installed on the device, it will be installed. If a custom dev client is installed, you will get to choose which to run.

Once you set up EAS Build, Expo Go no longer seems to work by default. But Expo Go is currently working for iOS Simulator and Android Emulator, due to using `runtimeVersion.policy = 'sdkVersion'` in `app.json`.

### Custom Dev Client

A custom dev client is useful for running on the iOS Simulator or Android Emulator to get additional native functionality (the share extension). It includes the dev menu like Expo Go does.

To build a custom dev client:

<https://docs.expo.dev/development/create-development-builds/#on-emulatorsimulator>

- Android dev client: `eas build --profile development --platform android --local`
- iOS simulator dev client: `eas build --profile development-simulator --platform ios --local`

(Or omit the `--local` flag to build on EAS servers, but note that the free Expo plan is limited to 15 iOS buidls per month, and then you will begin to be charged.)

When the build finishes, you will be prompted to install it on the Simulator/Emulator.

You can download a custom dev client previously built on EAS servers from expo.dev. If it is compressed, expand the archive. Then drag-and-drop the app file onto the window of the running Simulator or Emulator, and it should be transferred.

After this, run `yarn start` then press `a` or `i` to launch the app in the simulator/emulator. If Expo Go is also installed, you will get to choose which to run.

### Xcode Project

Prebuilding (generating the Xcode project) is useful for troubleshooting the share extension code or troubleshooting local build issues, either on Simulator or a physical iPhone.

To prebuild the Xcode project, run `npx expo prebuild -p ios`. Then, open the workspace file in Xcode, and run the app or the share extension.

## Preview Client

The preview client is useful to have a running app on a physical device with an Apple Developer account, without being connected to a Metro dev server. The JS bundle can be updated without rebuilding a preview client.

Before building a preview client, edit `assets/ios/shareExtension/Config.swift` to uncomment the production URL and add a production key. Do not commit these changes to CI.

To build a new preview client: `eas build --profile preview --platform ios --local`.

(Or omit the `--local` flag to build on EAS servers, but note that the free Expo plan is limited to 15 iOS buidls per month, and then you will begin to be charged.)

The preview client uses the latest published "preview" channel JS bundles. This can be published with `bin/deploy`

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

## Updating Xcode

Xcode updates can introduce build failures for React Native. To avoid not being able to build the app:

- Do not overwrite your existing working Xcode version
- Manually download the new Xcode version from the [Apple Developer > Downloads > Applications](https://developer.apple.com/download/applications/) page.
- Expand the download and rename it to add the Xcode version to the name.
- Prebuild the Xcode project (see command above)
- Build the app from within Xcode and see if it succeeds
- If it does, you can replace the old Xcode version

## License

MIT
