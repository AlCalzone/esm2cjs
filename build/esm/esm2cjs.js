import path from "node:path";
import { build } from "esbuild";
import fs from "fs-extra";
import glob from "tiny-glob";
import { fileURLToPath } from "node:url";
const _dirname = path.dirname(fileURLToPath(import.meta.url));
export const shimsDir = path.join(_dirname, "../../shims");
export async function esm2cjs({ inDir, outDir, globs = ["**/*.js"], sourcemap = true, logLevel = "warning", platform = "node", target = "node18", cleanOutDir = false, writePackageJson = true, packageJsonSideEffects, }) {
    // Clean the output dir if necessary
    if (cleanOutDir)
        await fs.emptyDir(outDir);
    // Figure out what to compile
    if (typeof globs === "string")
        globs = [globs];
    const entryPoints = (await Promise.all(globs.map((g) => glob(g, { cwd: inDir })))).reduce((prev, cur) => [...prev, ...cur], []);
    // Compile ESM to CJS using esbuild
    const buildResult = await build({
        absWorkingDir: inDir,
        entryPoints,
        outdir: outDir,
        bundle: false,
        minify: false,
        metafile: true,
        sourcemap,
        logLevel,
        platform,
        format: "cjs",
        target,
        define: {
            "import.meta.url": "__import_meta_url",
        },
        inject: [path.join(shimsDir, "import.meta.url/shim.js")],
    });
    // Copy .d.ts files
    if (buildResult.metafile) {
        for (const inputFile of Object.keys(buildResult.metafile.inputs)) {
            if (inputFile.startsWith(".")) {
                // File outside of the build directory, skip
                continue;
            }
            const declarationFileName = inputFile.replace(/\.([cm]?)js$/, ".d.$1ts");
            // Try to copy the file, but don't fail if it doesn't exist
            await fs
                .copyFile(path.join(inDir, declarationFileName), path.join(outDir, declarationFileName))
                .catch(() => { });
        }
    }
    // If desired, define the module type of each build directory separately
    if (writePackageJson) {
        const sideEffects = 
        // Assume the package has side effects, unless explicitly stated otherwise
        packageJsonSideEffects === true ||
            packageJsonSideEffects === undefined
            ? {}
            : { sideEffects: packageJsonSideEffects };
        await fs.writeJSON(path.join(inDir, "package.json"), {
            type: "module",
            ...sideEffects,
        }, { spaces: 4 });
        await fs.writeJSON(path.join(outDir, "package.json"), {
            type: "commonjs",
            ...sideEffects,
        }, { spaces: 4 });
    }
}
//# sourceMappingURL=esm2cjs.js.map