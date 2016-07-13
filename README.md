# ReSpace

[![Build Status](https://travis-ci.org/respace-js/respace.svg?branch=master)](https://travis-ci.org/respace-js/respace)

## Overview

ReSpace is a development environent (IDE) built upon Mobx and React based components.

Each ReSpace component is:

1. An NPM package.
1. Can be used standalone on its own by feeding Mobx observable.
1. Written in TypeScript and typechecked to a common interface.
1. Can be headless or have a React component that is injected with Mobx observable.

While each ReSpace component is useful on its own, the power of ReSpace is its ability t put together components into a workspace.

The package `respace` in `packages/respace` creates a workspace from ReSpace components.

## Using Respace

You can use your own webpack configuration to creae a space efficient Respace bundle.
Or you can use ours! Respace comes with a CLI that can help you generate your own bundle.

```shell
$ npm install respace-cli -g
$ respace bundle your-respace-project
```

This is recommended if your bundle is simple and uses similar language as ours.
This method of bundling supports TypeScript, ES6, and SCSS.

## Developing ReSpace

### Preparation

```shell
$ node -v # We use > 5
$ npm -v  # We use > 3
$ npm install lerna typings -g
$ npm run bootstrap
$ npm install
$ npm link
```

### Cross package development with hot reloading

```shell
$ respace serve packages/respace-preset-nus
```

### Compiling all packages to ES6, then ES5, and generate source map and typing definitions

```shell
$ respace build-all
$ respace build respace-core # For single component
```

### TODO: Bundling each packages for browser use to `dist`

### TODO: Running test cases

Cleaning up
```
$ npm run clean
```


## License

MIT
