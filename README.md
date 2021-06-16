# esm2cjs

Command line utility to compile a JS project from ES modules to CommonJS. This is handy when building hybrid ESM/CommonJS npm packages.

Built on top of the blazing fast [esbuild](https://github.com/evanw/esbuild) and supports all modern JS features.

## Install (globally)

```bash
# using npm
npm i -g @alcalzone/esm2cjs
# using yarn
yarn add --global @alcalzone/esm2cjs
```

## Usage

```bash
esm2cjs --in path/to/input --out path/to/output [options]
```

Detailed help is shown on the command line using

```bash
esm2cjs --help
```

## Changelog

### 1.0.0 (2021-06-16)

Initial release
