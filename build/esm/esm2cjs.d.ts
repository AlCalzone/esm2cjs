import { BuildOptions } from "esbuild";
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
export declare function esm2cjs({ inDir, outDir, globs, sourcemap, logLevel, platform, target, cleanOutDir, writePackageJson, }: ESM2CJSOptions): Promise<void>;
