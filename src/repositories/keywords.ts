import { Knex } from 'knex';

import { Keyword } from '../models';
import { BaseRepository, type IBaseRepository } from './base-repository';
import { CreateKeyword, KeywordListAllParams, Options, UpdateKeyword } from './types';

export interface IKeywordRepository extends IBaseRepository {
	deleteKeyword(id: string): Promise<Keyword>;
	createKeyword(params?: CreateKeyword): Promise<Keyword>;
	updateKeyword(params?: UpdateKeyword): Promise<Keyword>;
	listAllByIds(keywords_ids: string[]): Promise<Keyword[]>;
	listAll(filters?: KeywordListAllParams): Promise<Keyword[]>;
}

export class KeywordRepository extends BaseRepository implements IKeywordRepository {
	public tableName = 'keywords';
	constructor(public db: Knex) {
		super(db);
	}

	async listAll(filters?: KeywordListAllParams): Promise<Keyword[]> {
		return await this.table
			.where((builder) => {
				builder.where('deleted_at', null);

				if (filters?.name) {
					builder.whereLike('name', `%${filters.name}%`);
				}
			})
			.select('*')
			.orderBy('created_at', 'desc');
	}

	async listAllByIds(keywords_ids: string[]): Promise<Keyword[]> {
		return await this.table
			.where('deleted_at', null)
			.whereIn('id', keywords_ids)
			.select('*')
			.orderBy('created_at', 'desc');
	}

	async createKeyword(params: CreateKeyword): Promise<Keyword> {
		const created: Keyword = await this.create(params);
		return created;
	}

	async updateKeyword(params: UpdateKeyword): Promise<Keyword> {
		const udpated: Keyword = await this.update(params.id, params);
		return udpated;
	}

	async deleteKeyword(id: string): Promise<Keyword> {
		const deleted: Keyword = await this.destroy(id);
		return deleted;
	}

	async findOne<Result>(params: Options): Promise<Result> {
		const [keyword] = await this.table
			.where((builder) => {
				builder.where('deleted_at', null);

				if (params?.name) {
					builder.where('name', params.name);
				}
			})
			.select('*')
			.orderBy('created_at', 'desc');

		return keyword;
	}
}
