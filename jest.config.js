module.exports = {
	testEnvironment: "node",
	testRegex: "(\\.|/)test\\.tsx?$",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	coverageReporters: ["lcov", "html", "text-summary"],
	transform: {
		"^.+\\.tsx?$": "babel-jest",
	},
};
