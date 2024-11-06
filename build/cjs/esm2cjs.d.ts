import { BuildOptions } from "esbuild";
export declare const shimsDir: string;
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
    packageJsonSideEffects?: boolean | "inherit" | string[];
}
export declare function esm2cjs({ inDir, outDir, globs, sourcemap, logLevel, platform, target, cleanOutDir, writePackageJson, packageJsonSideEffects, }: ESM2CJSOptions): Promise<void>;
