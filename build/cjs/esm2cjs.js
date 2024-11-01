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
  esm2cjs: () => esm2cjs
});
module.exports = __toCommonJS(esm2cjs_exports);
var import_path = __toESM(require("path"), 1);
var import_esbuild = require("esbuild");
var import_fs_extra = __toESM(require("fs-extra"), 1);
var import_tiny_glob = __toESM(require("tiny-glob"), 1);
async function esm2cjs({ inDir, outDir, globs = ["**/*.js"], sourcemap = true, logLevel = "warning", platform = "node", target = "node18", cleanOutDir = false, writePackageJson = true }) {
  if (cleanOutDir)
    await import_fs_extra.default.emptyDir(outDir);
  if (typeof globs === "string")
    globs = [globs];
  const entryPoints = (await Promise.all(globs.map((g) => (0, import_tiny_glob.default)(g, { cwd: inDir })))).reduce((prev, cur) => [...prev, ...cur], []);
  await (0, import_esbuild.build)({
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
      "import.meta.url": "__import_meta_url"
    },
    inject: [import_path.default.join(__dirname, "../shims/import.meta.url/shim.js")]
  });
  if (writePackageJson) {
    await import_fs_extra.default.writeJSON(import_path.default.join(inDir, "package.json"), { type: "module" }, {
      spaces: 4
    });
    await import_fs_extra.default.writeJSON(import_path.default.join(outDir, "package.json"), { type: "commonjs" }, {
      spaces: 4
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  esm2cjs
});
//# sourceMappingURL=esm2cjs.js.map
