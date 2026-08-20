export function collect(queue: Array<() => number>): void {
	let value = 0;
	for (let index = 0; index < 10; index++) {
		queue.push(function () {
			return value;
		});
		value += 1;
	}
}
