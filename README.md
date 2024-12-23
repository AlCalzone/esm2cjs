# esm2cjs

Command line utility to compile a JS project from ES modules to CommonJS. This is handy when building hybrid ESM/CommonJS npm packages.

Built on top of the blazing fast [esbuild](https://github.com/evanw/esbuild) and supports all modern JS features.

## Install

Either globally:
```bash
# using npm
npm i -g @alcalzone/esm2cjs
# using yarn
yarn add --global @alcalzone/esm2cjs
```

Or locally as a `devDependency`:
```bash
# using npm
npm i -D @alcalzone/esm2cjs
# using yarn
yarn add --dev @alcalzone/esm2cjs
```

## Usage
Using the binary outside of `package.json` scripts requires global installation.
```bash
esm2cjs --in path/to/input --out path/to/output [options]
```

Detailed help is shown on the command line using

```bash
esm2cjs --help
```

## Example for a TypeScript project

1. Configure `tsconfig.json` to write ESM output into `build/esm`:

    ```jsonc
    // tsconfig.json
    {
    	// ...
    	"compilerOption": {
    		// ...
    		"outDir": "build/esm",
    		"module": "ES2020" // or some of the new options in TS 4.5 "node12", "nodenext"
    	}
    }
    ```

1. Add a `postbuild` script that transforms the ESM output to CommonJS:

    ```jsonc
    // package.json
    {
    	// ...
    	"scripts": {
    		// ...
    		"postbuild": "esm2cjs --in build/esm --out build/cjs -l error"
    	}
    }
    ```

1. Set up the `exports` field in `package.json`. Note that the syntax for `types` might need additional changes when [TypeScript 4.5](https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-beta/#packagejson-exports-imports-and-self-referencing) lands.
    ```jsonc
    // package.json
    {
    	"main": "build/cjs/index.js",
    	"module": "build/esm/index.js",
    	"exports": {
    		".": {
    			"import": "./build/esm/index.js",
    			"require": "./build/cjs/index.js"
    		},
    		// This is necessary to require/import `your-library/package.json`
    		"./package.json": "./package.json",
    		// additional subpath exports go here, e.g. your-library/tools
    		"./tools": {
    			"import": "./build/esm/tools.js",
    			"require": "./build/cjs/tools.js"
    		},
    		// or everything in the source root:
    		"./*": {
    			"import": "./build/esm/*.js",
    			"require": "./build/cjs/*.js"
    		}
    	},
    	// ...
    }
    ```

## Example for a JavaScript project without compilation

This assumes your ESM modules are located in `lib/` and the cjs output goes to `dist/cjs/`.

1. Add a `build` script that transforms the ESM output to CommonJS:

    ```jsonc
    // package.json
    {
    	// ...
    	"scripts": {
    		// ...
    		"build": "esm2cjs --in lib --out dist/cjs -l error"
    	}
    }
    ```

1. Set up the `exports` field in `package.json`.
    ```jsonc
    // package.json
    {
    	"main": "dist/cjs/index.js",
    	"module": "lib/index.js",
    	"exports": {
    		".": {
    			"import": "./lib/index.js",
    			"require": "./dist/cjs/index.js"
    		},
    		// This is necessary to require/import `your-library/package.json`
    		"./package.json": "./package.json",
    		// additional subpath exports go here, e.g. `your-library/tools`
    		"./tools": {
    			"import": "./lib/tools.js",
    			"require": "./dist/cjs/tools.js"
    		},
    		// or everything in the lib folder:
    		"./*": {
    			"import": "./lib/*.js",
    			"require": "./dist/cjs/*.js"
    		}
    	}
    	// ...
    }
    ```

## Performance

### Test case 1: [`zwave-js`](https://github.com/zwave-js/node-zwave-js)

| No. of input files | total size | time taken |
| ------------------ | ---------- | ---------- |
| 141                | 987 KB     | 390 ms     |

## Changelog

<!--
  Placeholder for the next version:
  ### **WORK IN PROGRESS**
-->
### 1.4.1 (2024-11-20)
* Set esbuild's `keepNames` option to `true` by default

### 1.4.0 (2024-11-11)
* Support inheriting and rewriting the `imports` field in `package.json`

### 1.3.0 (2024-11-06)
* Support specifying `sideEffects` in the generated `package.json` as a hint for bundlers

### 1.2.3 (2024-11-04)
* Update default target to node18
* Shim `import.meta.url` by default
* Update documentation for package.json setup

### 1.1.2 (2022-08-17)
Dependency updates

### 1.1.1 (2021-10-18)
Dependency updates

### 1.1.0 (2021-06-19)
Support specifying output target and platform

### 1.0.0 (2021-06-16)

Initial release
