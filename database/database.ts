import { Knex, knex as setupKnex } from 'knex';

export const config: Knex.Config = {
	client: 'sqlite',
	connection: {
		filename: './tmp/app.db'
	},
	useNullAsDefault: true,
	migrations: {
		extension: 'ts',
		directory: './database/migrations'
	}
};

interface IDatabase<T> {
	setup(): T;
}

export abstract class Database<T> implements IDatabase<T> {
	abstract setup(): T;
}

export class KnexDatabase extends Database<Knex> {
	setup(): Knex {
		const db = setupKnex(config);
		return db;
	}
}

export const db = new KnexDatabase().setup();
