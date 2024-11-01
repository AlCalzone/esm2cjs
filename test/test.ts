import { esm2cjs } from "../build/cjs/esm2cjs.js";
import fs from "fs-extra";
import path from "path";

describe("Compilation tests", () => {
	beforeAll(async () => {
		await esm2cjs({
			inDir: path.join(__dirname, "fixtures/esm"),
			outDir: path.join(__dirname, "fixtures/cjs"),
			cleanOutDir: true,
			writePackageJson: false,
		});
	});

	it("Test 1: .js", async () => {
		const content = await fs.readFile(
			path.join(__dirname, "fixtures/cjs/test1.js"),
			"utf8",
		);

		expect(content).toMatchSnapshot();

		expect(require("./fixtures/cjs/test1.js").test).toBe("test1");
	});

	it("Test 2: import.meta.url", async () => {
		const content = await fs.readFile(
			path.join(__dirname, "fixtures/cjs/test2.js"),
			"utf8",
		);

		expect(content).toMatchSnapshot();

		expect(require("./fixtures/cjs/test2.js")._dirname).toBe(
			path.join(__dirname, "fixtures/cjs"),
		);
	});
});
