#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const path = require("path");
const { esm2cjs } = require("../build/cjs");

const argv = yargs(hideBin(process.argv))
	.option("in", {
		type: "string",
		demandOption: true,
		description: "The input directory containing ESM sources",
	})
	.option("out", {
		type: "string",
		demandOption: true,
		description:
			"The output directory where CommonJS files should be placed",
	})
	.option("glob", {
		alias: "g",
		array: true,
		type: "string",
		default: "**/*.js",
		description: "Override the default input file glob(s)",
	})
	.option("platform", {
		alias: "p",
		type: "string",
		default: "node",
		choices: ["node", "browser", "neutral"],
		description:
			"Change the platform the code is meant to be run on. Details see https://esbuild.github.io/api/#platform",
	})
	.option("target", {
		alias: "t",
		type: "string",
		default: "node18",
		description:
			"Override the default compile target. Details see https://esbuild.github.io/api/#target",
	})
	.option("loglevel", {
		alias: "l",
		type: "string",
		choices: ["verbose", "debug", "info", "warning", "error", "silent"],
		default: "warning",
	})
	.option("sourcemap", {
		alias: "m",
		type: "boolean",
		default: true,
		description:
			"The output directory where CommonJS files should be placed",
	})
	.option("writePackageJson", {
		alias: "j",
		type: "boolean",
		default: true,
		description:
			"Create two package.json files containing the module type in the input and output directory",
	})
	.option("packageJsonSideEffects", {
		alias: "x",
		type: "boolean",
		default: true,
		description:
			"When writePackageJson is true, this can be used to specify whether the generated package.json files should contain sideEffects: false. Bundlers use this information to tree-shake the code. " +
			"To specify individual files with side effects instead, use the programmatic API.",
	})
	.option("cleanOutDir", {
		alias: "c",
		type: "boolean",
		default: false,
		description: "Empty the output directory before writing",
	})
	.example(
		"$0 --in test/esm --out test/cjs",
		"Compiles .js files in test/esm to CommonJS and places them in test/cjs",
	)
	.parseSync();

(async () => {
	const inDir = path.join(process.cwd(), argv.in);
	const outDir = path.join(process.cwd(), argv.out);

	await esm2cjs({
		inDir,
		outDir,
		cleanOutDir: argv.cleanOutDir,
		globs: argv.glob,
		target: argv.target,
		platform: /** @type {any} */ (argv.platform),
		writePackageJson: argv.writePackageJson,
		logLevel: /** @type {any} */ (argv.loglevel),
	});
})().catch((e) => {
	console.error(e);
	process.exit(1);
});
