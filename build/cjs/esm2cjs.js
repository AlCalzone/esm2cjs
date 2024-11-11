"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var esm2cjs_exports = {};
__export(esm2cjs_exports, {
  esm2cjs: () => esm2cjs,
  shimsDir: () => shimsDir
});
module.exports = __toCommonJS(esm2cjs_exports);
var __import_meta_url = typeof document === "undefined" ? new (require("url".replace("", ""))).URL("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("main.js", document.baseURI).href;
var import_node_path = __toESM(require("node:path"), 1);
var import_esbuild = require("esbuild");
var import_fs_extra = __toESM(require("fs-extra"), 1);
var import_tiny_glob = __toESM(require("tiny-glob"), 1);
var import_node_url = require("node:url");
const _dirname = import_node_path.default.dirname((0, import_node_url.fileURLToPath)(__import_meta_url));
const shimsDir = import_node_path.default.join(_dirname, "../../shims");
async function esm2cjs({ inDir, outDir, globs = ["**/*.js"], sourcemap = true, logLevel = "warning", platform = "node", target = "node18", cleanOutDir = false, writePackageJson = true, packageJsonSideEffects = "inherit", packageJsonImports = "inherit" }) {
  if (cleanOutDir)
    await import_fs_extra.default.emptyDir(outDir);
  if (typeof globs === "string")
    globs = [globs];
  const entryPoints = (await Promise.all(globs.map((g) => (0, import_tiny_glob.default)(g, { cwd: inDir })))).reduce((prev, cur) => [...prev, ...cur], []);
  const buildResult = await (0, import_esbuild.build)({
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
      "import.meta.url": "__import_meta_url"
    },
    inject: [import_node_path.default.join(shimsDir, "import.meta.url/shim.js")]
  });
  if (buildResult.metafile) {
    for (const inputFile of Object.keys(buildResult.metafile.inputs)) {
      if (inputFile.startsWith(".")) {
        continue;
      }
      const declarationFileName = inputFile.replace(/\.([cm]?)js$/, ".d.$1ts");
      await import_fs_extra.default.copyFile(import_node_path.default.join(inDir, declarationFileName), import_node_path.default.join(outDir, declarationFileName)).catch(() => {
      });
    }
  }
  if (writePackageJson) {
    const parentPackageJson = await import_fs_extra.default.readJSON(import_node_path.default.join(process.cwd(), "package.json")).catch(() => void 0);
    let inheritedSideEffects;
    if (packageJsonSideEffects === "inherit" && parentPackageJson?.sideEffects != void 0) {
      inheritedSideEffects = {
        sideEffects: parentPackageJson.sideEffects
      };
    }
    const normalizedSideEffects = (
      // Assume the package has side effects, unless explicitly stated otherwise
      packageJsonSideEffects === true || packageJsonSideEffects === void 0 ? {} : packageJsonSideEffects === "inherit" ? inheritedSideEffects ?? {} : { sideEffects: packageJsonSideEffects }
    );
    let esmImports;
    if (packageJsonImports === "inherit" && parentPackageJson?.imports != void 0) {
      esmImports = rewriteImports(parentPackageJson.imports, process.cwd(), inDir);
    } else if (typeof packageJsonImports === "object") {
      esmImports = packageJsonImports;
    }
    const normalizedESMImports = esmImports ? { imports: esmImports } : {};
    const cjsImports = esmImports && rewriteImports(esmImports, inDir, outDir);
    const normalizedCJSImports = cjsImports ? { imports: cjsImports } : {};
    await import_fs_extra.default.writeJSON(import_node_path.default.join(inDir, "package.json"), {
      type: "module",
      ...normalizedSideEffects,
      ...normalizedESMImports
    }, { spaces: 4 });
    await import_fs_extra.default.writeJSON(import_node_path.default.join(outDir, "package.json"), {
      type: "commonjs",
      ...normalizedSideEffects,
      ...normalizedCJSImports
    }, { spaces: 4 });
  }
}
function rewriteImports(imports, sourceDir, targetDir) {
  const ret = {};
  for (const [importName, specs] of Object.entries(imports)) {
    const newSpecs = {};
    for (const [specifier, importPath] of Object.entries(specs)) {
      if (!importPath.startsWith(".")) {
        newSpecs[specifier] = importPath;
        continue;
      }
      const absolute = import_node_path.default.resolve(sourceDir, importPath);
      let relativeToTarget = import_node_path.default.relative(targetDir, absolute);
      if (!relativeToTarget.startsWith(".")) {
        relativeToTarget = "./" + relativeToTarget;
      }
      newSpecs[specifier] = relativeToTarget;
    }
    ret[importName] = newSpecs;
  }
  return ret;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  esm2cjs,
  shimsDir
});
//# sourceMappingURL=esm2cjs.js.map
