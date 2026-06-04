import { readFile } from "node:fs/promises";

export function loadText(path: string): Promise<string> {
	return readFile(path, "utf8");
}

export class TextLoader {
	load(path: string): Promise<string> {
		return loadText(path);
	}
}
