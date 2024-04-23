import { Knex } from 'knex';

import { Author, Song } from '../models';
import { BaseRepository, type IBaseRepository } from './base-repository';
import { AuthorListAllParams, AuthorResponse, CreateAuthor, Options, UpdateAuthor } from './types';

export interface IAuthorRepository extends IBaseRepository {
	deleteAuthor(id: string): Promise<Author>;
	createAuthor(params?: CreateAuthor): Promise<Author>;
	updateAuthor(params?: UpdateAuthor): Promise<Author>;
	listAll(filters?: AuthorListAllParams): Promise<AuthorResponse[]>;
}

export class AuthorRepository extends BaseRepository implements IAuthorRepository {
	public tableName = 'authors';
	constructor(public db: Knex) {
		super(db);
	}

	async listAll(filters?: AuthorListAllParams): Promise<AuthorResponse[]> {
		const authors: Author[] = await this.table
			.where((builder) => {
				builder.where('authors.deleted_at', null);

				if (filters?.name) {
					builder.whereLike('authors.name', `%${filters.name}%`);
				}
			})
			.orderBy('created_at', 'desc')
			.select('*');

		const authors_ids = authors?.map(({ id }) => id);
		const songs_registered: Song[] = await this.db('songs')
			.where('songs.deleted_at', null)
			.whereIn('author_id', authors_ids)
			.orderBy('created_at', 'desc')
			.select('*');

		const songs_by_author = songs_registered?.reduce((songs_by_author, current_song) => {
			const current = songs_by_author[current_song.author_id] ?? [];
			const copy = [...current];
			copy.push(current_song);
			return {
				...songs_by_author,
				[current_song.author_id]: copy
			};
		}, {} as { [key: string]: Song[] });

		const mapped_authors = authors.map((author) => {
			return {
				...author,
				songs_registered: songs_by_author[author.id]?.length ?? 0
			};
		});

		return mapped_authors;
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
