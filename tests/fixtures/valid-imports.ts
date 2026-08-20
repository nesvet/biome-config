import { test } from "bun:test";
import { readFile } from "node:fs";
import { sibling } from "./sibling.ts";
import "./styles.css";

export function run(): unknown[] {
	return [test, readFile, sibling];
}
