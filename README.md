# Riverbed Expo

A web app for creating CRUD apps with interactivity with no programming.

Note that only the web platform is supported, not native. We are migrating away from Expo to bare webpack.

## Requirements

- [Node 16.x](https://nodejs.org) (newer not yet supported by a react-native-web dependency)
- [Yarn 1.x](https://classic.yarnpkg.com/lang/en/)

## Installation

- Clone the repo
- Run `yarn install`
- Copy `.env.sample` to `.env.local` and `.env.production`, and fill in API key values from Google Cloud

Dependencies are locked with `yarn.lock`; please use `yarn` rather than `npm` for installing.

## Running

- Run `bin/serve`

## E2E Tests: Cypress

- Start webpack by running `bin/serve`
- In another terminal, run `yarn cypress`
- Choose E2E Testing, then any browser, then click "Start E2E Testing"

## License

MIT
