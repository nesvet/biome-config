export function wrap(run: () => void): void {
	try {
		run();
	} catch (error) {
		throw new Error(error.message);
	}
}
