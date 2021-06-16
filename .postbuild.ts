// Dogfooding, yay!
import { esm2cjs } from "./src";

(async () => {
	// Compile TypeScript's ESM output to CommonJS
	await esm2cjs({
		inDir: `${__dirname}/build/esm`,
		outDir: `${__dirname}/build/cjs`,
		cleanOutDir: true,
	});
})();
