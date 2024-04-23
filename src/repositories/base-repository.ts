import { Knex } from 'knex';

import { Options } from './types';

export interface IBaseRepository {
	destroy<Result>(id: string): Promise<Result>;
	create<T, Result>(params: T): Promise<Result>;
	findAll<T, Result>(filters?: T): Promise<Result[]>;
	findOne<Result>(options?: Options): Promise<Result>;
	update<T, Result>(id: string, params: T): Promise<Result>;
	findByPK<Result>(id: string, options?: Options): Promise<Result>;
}

export abstract class BaseRepository implements IBaseRepository {
	public tableName?: string;

	constructor(public db: Knex) {}

	public get table() {
		if (!this.tableName) {
			throw new Error('The table name must be defined for the repository.');
		}
		return this.db(this.tableName);
	}

	async findByPK<Result>(id: string, options: Options): Promise<Result> {
		if (options?.soft_deleted) {
			return this.table.where('id', id).whereNotNull('deleted_at').select('*').first();
		}
		return this.table.where('id', id).where('deleted_at', null).select('*').first();
	}

	findOne<Result>(options?: Options | undefined): Promise<Result> {
		return this.table.where('name', options?.name).where('deleted_at', null).select('*').first();
	}

	async create<T, Result>(params: T): Promise<Result> {
		const [created]: Result[] = await this.table.insert(params).returning('*');
		return created;
	}

	async update<T, Result>(id: string, params: T): Promise<Result> {
		const [updated]: Result[] = await this.table.where('id', id).update(params).returning('*');
		return updated;
	}

	async destroy<Result>(id: string): Promise<Result> {
		const [updated]: Result[] = await this.table
			.where('id', id)
			.update({
				deleted_at: new Date()
			})
			.returning('*');
		return updated;
	}

	async findAll<T, Result>(filters?: T): Promise<Result[]> {
		return this.table.where('deleted_at', null).select('*');
	}
}
