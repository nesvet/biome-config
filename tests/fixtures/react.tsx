import { useState } from "react";

type CounterProps = {
	label: string;
};

export function Counter({ label }: CounterProps) {
	const [count, setCount] = useState(0);

	return (
		<button type="button" onClick={() => setCount(count + 1)}>
			{label}: {count}
		</button>
	);
}
