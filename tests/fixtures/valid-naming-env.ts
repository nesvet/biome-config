export type EnvSchema = {
	DATABASE_URL: string;
	NODE_ENV: string;
	_id: string;
};

export const sample: EnvSchema = {
	DATABASE_URL: "postgres://localhost/app",
	NODE_ENV: "development",
	_id: "row-1"
};

export const query = {
	$in: ["a"],
	$or: [{ _id: "row-1" }]
};
