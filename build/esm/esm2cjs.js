import path from "node:path";
import { build } from "esbuild";
import fs from "node:fs/promises";
import glob from "tiny-glob";
import { fileURLToPath } from "node:url";
const _dirname = path.dirname(fileURLToPath(import.meta.url));
export const shimsDir = path.join(_dirname, "../../shims");
export async function esm2cjs({ inDir, outDir, globs = ["**/*.js"], sourcemap = true, logLevel = "warning", platform = "node", target = "node18", cleanOutDir = false, writePackageJson = true, packageJsonSideEffects = "inherit", packageJsonImports = "inherit", keepNames = true, }) {
    // Clean the output dir if necessary
    if (cleanOutDir) {
        await fs.rm(outDir, { recursive: true, force: true });
        await fs.mkdir(outDir, { recursive: true });
    }
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
        keepNames,
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
        // Some properties must or should be inherited from the parent package.json
        const parentPackageJson = await fs
            .readFile(path.join(process.cwd(), "package.json"), "utf-8")
            .then((data) => JSON.parse(data))
            .catch(() => undefined);
        // "sideEffects"
        let inheritedSideEffects;
        if (packageJsonSideEffects === "inherit" &&
            parentPackageJson?.sideEffects != undefined) {
            inheritedSideEffects = {
                sideEffects: parentPackageJson.sideEffects,
            };
        }
        const normalizedSideEffects = 
        // Assume the package has side effects, unless explicitly stated otherwise
        packageJsonSideEffects === true ||
            packageJsonSideEffects === undefined
            ? {}
            : packageJsonSideEffects === "inherit"
                ? inheritedSideEffects ?? {}
                : { sideEffects: packageJsonSideEffects };
        // "imports"
        let esmImports;
        if (packageJsonImports === "inherit" &&
            parentPackageJson?.imports != undefined) {
            // Inherited imports need to be rewritten to be relative to the input directory
            esmImports = rewriteImports(parentPackageJson.imports, process.cwd(), inDir);
        }
        else if (typeof packageJsonImports === "object") {
            esmImports = packageJsonImports;
        }
        const normalizedESMImports = esmImports ? { imports: esmImports } : {};
        // Rewrite paths that are relative to the input directory to be relative to the output directory
        const cjsImports = esmImports && rewriteImports(esmImports, inDir, outDir);
        const normalizedCJSImports = cjsImports ? { imports: cjsImports } : {};
        await fs.writeFile(path.join(inDir, "package.json"), JSON.stringify({
            type: "module",
            ...normalizedSideEffects,
            ...normalizedESMImports,
        }, null, 4) + "\n");
        await fs.writeFile(path.join(outDir, "package.json"), JSON.stringify({
            type: "commonjs",
            ...normalizedSideEffects,
            ...normalizedCJSImports,
        }, null, 4) + "\n");
    }
}
function rewriteImports(imports, sourceDir, targetDir) {
    const ret = {};
    for (const [importName, specs] of Object.entries(imports)) {
        const newSpecs = {};
        for (const [specifier, importPath] of Object.entries(specs)) {
            if (!importPath.startsWith(".")) {
                // Absolute path, no need to rewrite
                newSpecs[specifier] = importPath;
                continue;
            }
            const absolute = path.resolve(sourceDir, importPath);
            let relativeToTarget = path.relative(targetDir, absolute);
            if (!relativeToTarget.startsWith(".")) {
                relativeToTarget = "./" + relativeToTarget;
            }
            newSpecs[specifier] = relativeToTarget;
        }
        ret[importName] = newSpecs;
    }
    return ret;
}
//# sourceMappingURL=esm2cjs.js.map