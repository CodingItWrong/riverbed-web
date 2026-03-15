# Riverbed Web

Web client for Riverbed, an app for creating interactive CRUD apps with no programming.

## Requirements

- [Node 22.x](https://nodejs.org)
- [pnpm](https://pnpm.io)

## Installation

- Clone the repo
- Run `pnpm install`
- Copy `.env.sample` to `.env.local` and `.env.production`, and fill in API key values from Google Cloud

Dependencies are locked with `pnpm-lock.yaml`; please use `pnpm` rather than `npm` or `yarn` for installing.

## Running

- Run `pnpm serve`

## E2E Tests: Cypress

- Start webpack by running `pnpm serve`
- In another terminal, run `pnpm cypress`
- Choose E2E Testing, then any browser, then click "Start E2E Testing"

## Copyright and License

Copyright 2023 NeedBee, LLC.

Licensed under GNU Affero General Public License (GNU AGPL) version 3 or later. See LICENSE.md for details.
