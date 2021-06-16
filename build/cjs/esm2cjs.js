var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
__export(exports, {
  esm2cjs: () => esm2cjs
});
var import_path = __toModule(require("path"));
var import_esbuild = __toModule(require("esbuild"));
var import_fs_extra = __toModule(require("fs-extra"));
var import_tiny_glob = __toModule(require("tiny-glob"));
async function esm2cjs({ inDir, outDir, globs = ["**/*.js"], sourcemap = true, logLevel = "warning", platform = "node", target = "node10", cleanOutDir = false, writePackageJson = true }) {
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
    target
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
