import path from "path";
import { BuildOptions, build } from "esbuild";
import fs from "fs-extra";
import glob from "tiny-glob";

export interface ESM2CJSOptions {
	inDir: string;
	outDir: string;
	cleanOutDir?: boolean;
	globs?: string | string[];
	sourcemap?: boolean;
	logLevel?: BuildOptions["logLevel"];
	platform?: BuildOptions["platform"];
	target?: BuildOptions["target"];
	writePackageJson?: boolean;
}

export async function esm2cjs({
	inDir,
	outDir,
	globs = ["**/*.js"],
	sourcemap = true,
	logLevel = "warning",
	platform = "node",
	target = "node10",
	cleanOutDir = false,
	writePackageJson = true,
}: ESM2CJSOptions) {
	// Clean the output dir if necessary
	if (cleanOutDir) await fs.emptyDir(outDir);

	// Figure out what to compile
	if (typeof globs === "string") globs = [globs];
	const entryPoints = (
		await Promise.all(globs.map((g) => glob(g, { cwd: inDir })))
	).reduce((prev, cur) => [...prev, ...cur], []);

	// Compile ESM to CJS using esbuild
	await build({
		absWorkingDir: inDir,
		entryPoints,
		outdir: outDir,
		bundle: false,
		minify: false,
		sourcemap,
		logLevel,
		platform,
		format: "cjs",
		target,
	});

	// If desired, define the module type of each build directory separately
	if (writePackageJson) {
		await fs.writeJSON(
			path.join(inDir, "package.json"),
			{ type: "module" },
			{
				spaces: 4,
			},
		);
		await fs.writeJSON(
			path.join(outDir, "package.json"),
			{ type: "commonjs" },
			{
				spaces: 4,
			},
		);
	}
}
