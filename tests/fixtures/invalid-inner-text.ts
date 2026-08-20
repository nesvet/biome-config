type TextNode = {
	innerText: string;
};

export function readText(node: TextNode): string {
	return node.innerText;
}
