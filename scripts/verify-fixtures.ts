import { type SpawnSyncReturns, spawnSync } from "node:child_process";
import { copyFileSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
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

function assertInvalidCases(cwd: string, cases: InvalidFixture[], label: string): void {
	for (const { path, diagnostic } of cases) {
		const result = runCheck(cwd, [path]);

		if (!combinedOutput(result).includes(diagnostic)) {
			console.error(`Expected ${diagnostic} diagnostic (${label}): ${path}\n`, result.stdout, result.stderr);
			process.exit(1);
		}
	}
}

assertValid(testsRoot, ["fixtures/valid.ts", "fixtures/react.tsx", "fixtures/valid-unused-underscore.ts", "fixtures/valid-fs-import.ts", "fixtures/valid-type.ts", "fixtures/valid-imports.ts", "fixtures/sibling.ts"], "base");

assertInvalidCases(
	testsRoot,
	[
		{ path: "fixtures/invalid-naming.ts", diagnostic: "useNamingConvention" },
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
} finally {
	rmSync(sandbox, { recursive: true, force: true });
}

console.info("Fixture verification passed.");
