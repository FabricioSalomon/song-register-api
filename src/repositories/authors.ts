import { Knex } from 'knex';
import { BaseRepository, Options, type IBaseRepository } from './base-repository';

import { Author } from '../models';
import { CreateAuthor, FindAllParams, UpdateAuthor } from '../services';

export interface IAuthorRepository extends IBaseRepository {
	deleteAuthor(id: string): Promise<Author>;
	listAll(filters?: FindAllParams): Promise<Author[]>;
	createAuthor(params?: CreateAuthor): Promise<Author>;
	updateAuthor(params?: UpdateAuthor): Promise<Author>;
}

export class AuthorRepository extends BaseRepository implements IAuthorRepository {
	public tableName = 'authors';
	constructor(public db: Knex) {
		super(db);
	}

	async listAll(filters?: FindAllParams): Promise<Author[]> {
		return await this.table
			// .innerJoin('songs', 'authors.id', '=', 'songs.author_id')
			.where((builder) => {
				builder.where('deleted_at', null);

				if (filters?.name) {
					builder.whereLike('name', `%${filters.name}%`);
				}
			})
			.select('*')
			.orderBy('created_at', 'desc');
	}

	async createAuthor(params: CreateAuthor): Promise<Author> {
		const created: Author = await this.create(params);
		return created;
	}

	async updateAuthor(params: UpdateAuthor): Promise<Author> {
		const udpated: Author = await this.update(params.id, params);
		return udpated;
	}

	async deleteAuthor(id: string): Promise<Author> {
		const deleted: Author = await this.destroy(id);
		return deleted;
	}

	async findOne<Result>(params: Options): Promise<Result> {
		const [author] = await this.table
			.where((builder) => {
				builder.where('deleted_at', null);

				if (params?.name) {
					builder.where('name', params.name);
				}
			})
			.select('*')
			.orderBy('created_at', 'desc');

		return author;
	}
}
