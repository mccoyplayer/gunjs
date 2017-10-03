[![Build Status](https://travis-ci.org/firebase/firebase-js-sdk.svg?branch=master)](https://travis-ci.org/firebase/firebase-js-sdk)

# Firebase Javascript SDK

The Firebase JavaScript SDK implements the client-side libraries used by
applications using Firebase services. This SDK is distributed via:

- CDN (`<script src="https://www.gstatic.com/firebasejs/4.0.0/firebase.js"></script>`)
- [npm package](https://www.npmjs.com/package/firebase)
- [Bower package](https://github.com/firebase/firebase-bower)

To get started using Firebase, see
[Add Firebase to your JavaScript Project](https://firebase.google.com/docs/web/setup).

## SDK Dev Workflow

### Prerequisites

Before you can start working on the Firebase JS SDK, you need to have Node.js 6.0 or
greater installed on your machine. After doing this, you must also install the
dependencies for this package.

To download Node.js visit https://nodejs.org/en/download/.

Once you've verified that you are using version 6.0 or later (run `node -v` to see your
current running version of Node.js), you can install the dependencies by running:

```bash
$ npm install
```

_NOTE: This package also maintains a `yarn.lock` so you can get faster installs by installing
dependencies with `yarn` instead._

### Pipeline Instructions

The Firebase JS SDK is built and tested through a gulp pipeline. You will need to
have the `gulp` command available on your system to run the tasks yourself.

To install `gulp` simply run:

```bash
$ npm install -g gulp-cli
```

_NOTE: Installing `gulp-cli` is optional as you can simply leverage the npm commands
for most interactions._

## Gulp Pipeline

Most of the tasks for interacting with the SDK are defined through gulp. If you
installed gulp globally, you can run the following to see all of the available
gulp tasks:

```bash
gulp --tasks
```

## Testing the SDK

To run all tests for the SDK you must first supply a firebase project config for
your tests. This is done by creating a file called `project.json` and at the
following path:

```
tests/config/project.json
```

This file should contain a JSON object with your app information (i.e. the same
information you would pass to `firebase.initializeApp`).

### Project Config

The project supplied in your `project.json` needs to be properly configured to
succesfully run the tests.

#### Database Rules

_i.e._

```json
{
  "rules": {
    ".read": "true",
    ".write": "true"
  }
}
```

#### Authentiaction Support

Enable the `Anonymous` sign-in provider.

### Running the tests

After you have the `project.json` and have properly configured the project,
simply run: `npm test` at the root of this package.

You can also run the tests by calling `gulp test` if you have gulp installed.

You can decrease the testing scope by providing the optional `suite`/`env` arguments to `npm/gulp test`.

_e.g._

```bash
$ gulp test --suite=firestore --env=node
```

Any directory path in the tests directory serves as a valid value for the `--suite` flag.

Valid values for the `--env` flag are `node`/`browser`.

### Integration Tests

These tests are functionally different enough from the normal test suite that they have their own README.md. Please view it [here](./integration/README.md):

## Building the SDK

### Introduction

The Javascript SDK is built through a gulp pipeline.

To build the project run `npm run build` in your CLI.

This will generate all of the output assets in a `/dist` folder available at the
root of this project.

Each of the different types of source files are explained more in detail below.

### Source File Handling

Our source files are all located in the `/src` directory. This currently contains
a variety of different sources (typescript, prebuilt binaries, legacy). We handle
each of these cases in our gulp pipeline.

#### Typescript Source

This is the planned source language for this repo. As we are able, all components
will be migrated to typescript and processed in the following flow:

1. TS Files are compiled to ES6 using the Typescript compiler
1. ES6 Files are transpiled to CJS Modules using Babel
1. ES6 Files are processed with webpack to attach to the window global

#### Prebuilt Binaries

To allow firebase to build from Github we consume prebuilt binaries of our components
until the source is migrated to this repo.

These files are processed in the following flow:

1. Prebuilt browser binaries are ready to consume individually in the browser
however we need to wrap them in a CJS module wrapper for node/webpack/browserify
consumption.
1. The Firebase App binary is generated (from TS) and concatenated with the
browser binaries of each individual module to create `firebase.js`.

#### Legacy Files

These files are built in this repo but are being migrated to typescript as we are able.
Once these files are migrated, the associated build process, will be removed.


## Contributing

See [Contributing](./CONTRIBUTING.md) for more information on contributing to the Firebase
JavaScript SDK.
