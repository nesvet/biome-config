import { type SpawnSyncReturns, spawnSync } from "node:child_process";
import { copyFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const testsRoot = join(packageRoot, "tests");
const biome = join(packageRoot, "node_modules", ".bin", "biome");

type InvalidFixture = {
	path: string;
	diagnostic: string;
};

function runCheck(cwd: string, paths: string[], extraArgs: string[] = []): SpawnSyncReturns<string> {
	return spawnSync(biome, ["check", ...extraArgs, ...paths], {
		cwd,
		encoding: "utf8"
	});
}

function combinedOutput(result: SpawnSyncReturns<string>): string {
	return `${result.stdout}\n${result.stderr}`;
}

function assertValid(cwd: string, paths: string[], label: string): void {
	const result = runCheck(cwd, paths, ["--diagnostic-level=info"]);

	if (result.status !== 0) {
		console.error(`Expected valid fixtures to pass (${label}):\n`, result.stdout, result.stderr);
		process.exit(1);
	}
}

function assertPassesErrorOnWarnings(cwd: string, paths: string[], label: string): void {
	const result = runCheck(cwd, paths, ["--error-on-warnings"]);

	if (result.status !== 0) {
		console.error(`Expected fixtures to pass with --error-on-warnings (${label}):\n`, result.stdout, result.stderr);
		process.exit(1);
	}
}

function assertNoDefaultExportOff(cwd: string, paths: string[], label: string): void {
	const result = runCheck(cwd, paths, ["--error-on-warnings"]);
	const output = combinedOutput(result);

	if (result.status !== 0 || output.includes("noDefaultExport")) {
		console.error(`Expected config fixtures to pass without noDefaultExport (${label}):\n`, result.stdout, result.stderr);
		process.exit(1);
	}
}

function assertInvalidCases(cwd: string, cases: InvalidFixture[], label: string): void {
	for (const { path, diagnostic } of cases) {
		const result = runCheck(cwd, [path]);

		if (!combinedOutput(result).includes(diagnostic)) {
			console.error(`Expected ${diagnostic} diagnostic (${label}): ${path}\n`, result.stdout, result.stderr);
			process.exit(1);
		}
	}
}

assertValid(testsRoot, ["fixtures/valid.ts", "fixtures/react.tsx", "fixtures/valid-unused-underscore.ts", "fixtures/valid-fs-import.ts", "fixtures/valid-type.ts", "fixtures/valid-imports.ts", "fixtures/sibling.ts", "fixtures/valid-naming-env.ts", "fixtures/valid-naming-const-component.tsx"], "base");

assertPassesErrorOnWarnings(testsRoot, ["fixtures/valid-naming-env.ts", "fixtures/valid-naming-const-component.tsx"], "naming");

assertNoDefaultExportOff(testsRoot, ["fixtures/valid.config.ts", "fixtures/valid.config.js"], "config default export");

assertInvalidCases(
	testsRoot,
	[
		{ path: "fixtures/invalid-naming.ts", diagnostic: "useNamingConvention" },
		{ path: "fixtures/invalid-naming-object-snake.ts", diagnostic: "useNamingConvention" },
		{ path: "fixtures/invalid-naming-object-pascal.ts", diagnostic: "useNamingConvention" },
		{ path: "fixtures/invalid-naming-let-pascal.ts", diagnostic: "useNamingConvention" },
		{ path: "fixtures/invalid-default-export.ts", diagnostic: "noDefaultExport" },
		{ path: "fixtures/invalid-eval.ts", diagnostic: "noGlobalEval" },
		{ path: "fixtures/invalid-implied-eval.ts", diagnostic: "noImpliedEval" },
		{ path: "fixtures/invalid-react-key.tsx", diagnostic: "useJsxKeyInIterable" },
		{ path: "fixtures/invalid-unused-import.ts", diagnostic: "noUnusedImports" },
		{ path: "fixtures/invalid-parameter-assign.ts", diagnostic: "noParameterAssign" },
		{ path: "fixtures/invalid-interface.ts", diagnostic: "useConsistentTypeDefinitions" },
		{ path: "fixtures/invalid-floating-promise.ts", diagnostic: "noFloatingPromises" },
		{ path: "fixtures/invalid-imports.ts", diagnostic: "organizeImports" },
		{ path: "fixtures/invalid-math-min-max.ts", diagnostic: "useMathMinMax" },
		{ path: "fixtures/invalid-loop-func.ts", diagnostic: "noLoopFunc" },
		{ path: "fixtures/invalid-evolving-types.ts", diagnostic: "noEvolvingTypes" },
		{ path: "fixtures/invalid-unassigned-variable.ts", diagnostic: "noUnassignedVariables" },
		{ path: "fixtures/invalid-throw-new-error.ts", diagnostic: "useThrowNewError" },
		{ path: "fixtures/invalid-error-cause.ts", diagnostic: "useErrorCause" },
		{ path: "fixtures/invalid-inner-text.ts", diagnostic: "useDomNodeTextContent" },
		{ path: "fixtures/invalid-property-init.css", diagnostic: "noInvalidPropertyInitValue" }
	],
	"base"
);

const nodePresetRoot = join(testsRoot, "preset-node");

assertValid(nodePresetRoot, ["fixtures/valid-node-protocol.ts"], "preset-node");

assertInvalidCases(nodePresetRoot, [{ path: "fixtures/invalid-import-protocol.ts", diagnostic: "useNodejsImportProtocol" }], "preset-node");

const sandbox = mkdtempSync(join(tmpdir(), "biome-config-"));

try {
	copyFileSync(join(packageRoot, "biome.json"), join(sandbox, "biome.json"));
	writeFileSync(join(sandbox, "ok.ts"), "export const value = 1;\n");
	assertValid(sandbox, ["ok.ts"], "folder without git");

	const notePath = join(sandbox, "note.md");

	writeFileSync(notePath, "---\ntitle: Hello\n---\n\n# Doc\n\nOne line\nstays two.\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n\n```js\nconst value = [1, 2, 3,];\n```\n");

	const noteWrite = runCheck(sandbox, ["note.md"], ["--write"]);

	if (noteWrite.status !== 0) {
		console.error("Expected note.md to format:\n", noteWrite.stdout, noteWrite.stderr);
		process.exit(1);
	}

	const note = readFileSync(notePath, "utf8");

	if (!note.startsWith("---\ntitle: Hello\n---\n") || !note.includes("One line\nstays two.") || note.includes("[1, 2, 3,]") || !note.includes("[1, 2, 3]")) {
		console.error("Expected note.md to keep frontmatter and the paragraph, and to drop the trailing comma:\n", note);
		process.exit(1);
	}

	const noteAgain = runCheck(sandbox, ["note.md"]);

	if (noteAgain.status !== 0) {
		console.error("Expected a second check of note.md to pass:\n", noteAgain.stdout, noteAgain.stderr);
		process.exit(1);
	}

	const yamlPath = join(sandbox, "sample.yaml");

	writeFileSync(yamlPath, "name: 'single'\n");

	const yamlWrite = runCheck(sandbox, ["sample.yaml"], ["--write"]);

	if (yamlWrite.status !== 0) {
		console.error("Expected sample.yaml to format:\n", yamlWrite.stdout, yamlWrite.stderr);
		process.exit(1);
	}

	const yaml = readFileSync(yamlPath, "utf8");

	if (!yaml.includes('name: "single"')) {
		console.error("Expected sample.yaml to use double quotes:\n", yaml);
		process.exit(1);
	}

	const yamlAgain = runCheck(sandbox, ["sample.yaml"]);

	if (yamlAgain.status !== 0) {
		console.error("Expected a second check of sample.yaml to pass:\n", yamlAgain.stdout, yamlAgain.stderr);
		process.exit(1);
	}

	writeFileSync(join(sandbox, "bad.md"), "# One\n\n### Skipped\n\n```\ncode\n```\n");

	const bad = runCheck(sandbox, ["bad.md"]);
	const badOutput = combinedOutput(bad);

	if (!badOutput.includes("useConsistentHeadingLevel") || !badOutput.includes("useFencedCodeLanguage")) {
		console.error("Expected Markdown nursery diagnostics:\n", bad.stdout, bad.stderr);
		process.exit(1);
	}
} finally {
	rmSync(sandbox, { recursive: true, force: true });
}

console.info("Fixture verification passed.");
