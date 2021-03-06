import { esm2cjs } from "../src/esm2cjs";
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
});
