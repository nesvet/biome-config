import { sibling } from "./sibling.ts";

import { readFile } from "node:fs";

export function load(path: string): Promise<string> {
	return readFile(path, "utf8").then(text => `${sibling}:${text}`);
}
