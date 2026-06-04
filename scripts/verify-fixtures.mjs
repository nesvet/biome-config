import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const testsRoot = join(packageRoot, "tests");
const biome = join(packageRoot, "node_modules", ".bin", "biome");

function runCheck(cwd, paths) {
	return spawnSync(biome, ["check", ...paths], {
		cwd,
		encoding: "utf8",
	});
}

function outputIncludes(result, text) {
	return `${result.stdout}\n${result.stderr}`.includes(text);
}

function assertValid(cwd, paths, label) {
	const result = runCheck(cwd, paths);

	if (result.status !== 0) {
		console.error(`Expected valid fixtures to pass (${label}):\n`, result.stdout, result.stderr);
		process.exit(1);
	}
}

function assertInvalidCases(cwd, cases, label) {
	for (const { path, expectError, diagnostic } of cases) {
		const result = runCheck(cwd, [path]);

		if (expectError) {
			if (result.status === 0) {
				console.error(`Expected lint failure (${label}): ${path}`);
				process.exit(1);
			}
			continue;
		}

		if (!outputIncludes(result, diagnostic)) {
			console.error(`Expected ${diagnostic} diagnostic (${label}): ${path}`);
			process.exit(1);
		}
	}
}

function runPresetSuite(presetDir, { validPaths, invalidCases }) {
	const cwd = join(testsRoot, presetDir);

	if (validPaths.length > 0) {
		assertValid(cwd, validPaths, presetDir);
	}

	assertInvalidCases(cwd, invalidCases, presetDir);
}

assertValid(testsRoot, ["fixtures/valid.ts", "fixtures/react.tsx", "fixtures/valid-unused-underscore.ts", "fixtures/valid-fs-import.ts"], "base");

assertInvalidCases(
	testsRoot,
	[
		{ path: "fixtures/invalid-naming.ts", expectError: true },
		{ path: "fixtures/invalid-default-export.ts", diagnostic: "noDefaultExport" },
		{ path: "fixtures/invalid-eval.ts", expectError: true },
		{ path: "fixtures/invalid-react-key.tsx", expectError: true },
		{ path: "fixtures/invalid-unused-import.ts", expectError: true },
		{ path: "fixtures/invalid-parameter-assign.ts", expectError: true },
	],
	"base",
);

runPresetSuite("preset-node", {
	validPaths: [],
	invalidCases: [{ path: "fixtures/invalid-import-protocol.ts", expectError: true }],
});

console.info("Fixture verification passed.");
