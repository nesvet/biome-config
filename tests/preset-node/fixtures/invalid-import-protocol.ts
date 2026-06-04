import { readFile } from "fs";

export function load(path: string): Promise<string> {
	return readFile(path, "utf8");
}
