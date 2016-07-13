# ReSpace

## Overview

ReSpace is a development environent (IDE) built upon Mobx and React based components.

Each ReSpace component is:

1. An NPM package.
2. Can be used standalone on its own by feeding Mobx observable.
3. Written in TypeScript and typechecked to a common interface.
4. Can be headless or have a React component that is injected with Mobx observable.

While each ReSpace component is useful on its own, the power of ReSpace is its ability t put together components into a workspace.

The package `respace` in `packages/respace` creates a workspace from ReSpace components.

## Using Respace

You can use your own webpack configuration to creae a space efficient Respace bundle.
Or you can use ours! Respace comes with a CLI that can help you generate your own bundle.

```
npm install respace-cli -g
respace bundle your-respace-project
```

This is recommended if your bundle is simple and uses similar language as ours.
This method of bundling supports TypeScript, ES6, and SCSS.

## Developing ReSpace

1. Cross package development with hot reloading:
```
$ node -v # We use > 5
$ npm -v  # We use > 3
$ npm install lerna typings -g
$ npm run bootstrap
$ npm install
$ npm link
$ respace serve packages/respace-preset-nus
```

2. Compiling all packages to ES6, then ES5, and generate source map and typing definitions.
```
$ respace build-all
$ respace build respace-core # For single component
```

3. TODO: Bundling each packages for browser use to `dist`
4. TODO: Running test cases.
5. Cleaning up
```
$ npm run clean
```


## License

MIT
