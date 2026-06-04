const items = ["a", "b"];

export function ListWithoutKeys() {
	return (
		<ul>
			{items.map(item => (
				<li>{item}</li>
			))}
		</ul>
	);
}
