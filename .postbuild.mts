// Dogfooding, yay!
import { esm2cjs } from "./src/esm/esm2cjs.js";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Compile TypeScript's ESM output to CommonJS
await esm2cjs({
	inDir: `${__dirname}/build/esm`,
	outDir: `${__dirname}/build/cjs`,
	cleanOutDir: true,
});
