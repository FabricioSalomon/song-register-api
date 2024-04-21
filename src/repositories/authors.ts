import { Knex } from 'knex';
import { BaseRepository, type IBaseRepository } from './base-repository';

export interface IAuthorRepository extends IBaseRepository {}

export class AuthorRepository extends BaseRepository implements IAuthorRepository {
	public tableName = 'authors';
	constructor(public db: Knex) {
		super(db);
	}

	async create<T, Result>(params: T): Promise<Result> {
		const [created]: Result[] = await this.table.insert(params).returning('*');
		return created;
	}
}
