import { readFile } from "node:fs/promises";

export function loadText(path: string): Promise<string> {
	return readFile(path, "utf8");
}
