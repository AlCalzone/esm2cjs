import path from "path";
import { build } from "esbuild";
import fs from "fs-extra";
import glob from "tiny-glob";
export async function esm2cjs({ inDir, outDir, globs = ["**/*.js"], sourcemap = true, logLevel = "warning", platform = "node", target = "node18", cleanOutDir = false, writePackageJson = true, }) {
    // Clean the output dir if necessary
    if (cleanOutDir)
        await fs.emptyDir(outDir);
    // Figure out what to compile
    if (typeof globs === "string")
        globs = [globs];
    const entryPoints = (await Promise.all(globs.map((g) => glob(g, { cwd: inDir })))).reduce((prev, cur) => [...prev, ...cur], []);
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
        define: {
            "import.meta.url": "__import_meta_url",
        },
        inject: [path.join(__dirname, "shims/import.meta.url/shim.js")],
    });
    // If desired, define the module type of each build directory separately
    if (writePackageJson) {
        await fs.writeJSON(path.join(inDir, "package.json"), { type: "module" }, {
            spaces: 4,
        });
        await fs.writeJSON(path.join(outDir, "package.json"), { type: "commonjs" }, {
            spaces: 4,
        });
    }
}
//# sourceMappingURL=esm2cjs.js.map