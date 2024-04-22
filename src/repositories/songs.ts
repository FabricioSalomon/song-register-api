import { Knex } from 'knex';
import { BaseRepository, Options, type IBaseRepository } from './base-repository';

import { Song } from '../models';
import { CreateSong, SongFindAllParams, UpdateSong } from '../services';

export interface ISongRepository extends IBaseRepository {
	deleteSong(id: string): Promise<Song>;
	listAll(filters?: SongFindAllParams): Promise<Song[]>;
	createSong(params?: CreateSong): Promise<Song>;
	updateSong(params?: UpdateSong): Promise<Song>;
}

export class SongRepository extends BaseRepository implements ISongRepository {
	public tableName = 'songs';
	constructor(public db: Knex) {
		super(db);
	}

	async listAll(filters?: SongFindAllParams): Promise<Song[]> {
		return await this.table
			.innerJoin('authors', 'authors.id', 'songs.author_id')
			.select('songs.*')
			.where((builder) => {
				builder.where('songs.deleted_at', null);
				builder.where('authors.deleted_at', null);

				if (filters?.name) {
					builder.whereLike('songs.name', `%${filters.name}%`);
				}

				if (filters?.author_id) {
					builder.where('songs.author_id', filters.author_id);
				}

				if (filters?.released_at_start && filters?.released_at_end) {
					builder.where('songs.created_at', '>=', filters.released_at_start);
					builder.where('songs.created_at', '<=', filters.released_at_end);
				}

				if (filters?.keyword) {
					builder
						.innerJoin('songs-keywords', 'songs.id', 'songs-keywords.song_id')
						.select(
							'songs.*',
							this.db('songs-keywords')
								.innerJoin('keywords', 'keywords.id', 'songs-keywords.keyword_id')
								.select('keywords.name')
								.whereLike('keywords.name', `%${filters.name}%`)
						);
				}
			})
			.orderBy('songs.created_at', 'desc');
	}

	async createSong(params: CreateSong): Promise<Song> {
		const created: Song = await this.create(params);
		return created;
	}

	async updateSong(params: UpdateSong): Promise<Song> {
		const udpated: Song = await this.update(params.id, params);
		return udpated;
	}

	async deleteSong(id: string): Promise<Song> {
		const deleted: Song = await this.destroy(id);
		return deleted;
	}

	async findOne<Result>(params: Options): Promise<Result> {
		const [song] = await this.table
			.where((builder) => {
				builder.where('deleted_at', null);

				if (params?.name) {
					builder.where('name', params.name);
				}
			})
			.select('*')
			.orderBy('created_at', 'desc');

		return song;
	}
}
