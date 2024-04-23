import { knex as setupKnex } from 'knex';

interface IDatabase {
	setup(): any;
}

export abstract class Database implements IDatabase {
	abstract setup(): any;
}

export class KnexDatabase extends Database {
	setup(): any {
		const db = setupKnex({
			client: 'sqlite',
			connection: {
				filename: './tmp/app.db'
			},
			useNullAsDefault: true
		});
		return db;
	}
}

export const db = new KnexDatabase().setup();
