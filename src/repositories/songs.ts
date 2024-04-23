import { Knex } from 'knex';
import moment from 'moment';

import { Song } from '../models';
import { BaseRepository, Options, type IBaseRepository } from './base-repository';
import { CreateSong, SongFindAllParams, SongResponse, UpdateSong } from '../services';

export interface ISongRepository extends IBaseRepository {
	deleteSong(id: string): Promise<Song>;
	createSong(params?: CreateSong): Promise<Song>;
	updateSong(params?: UpdateSong): Promise<Song>;
	listAll(filters?: SongFindAllParams): Promise<SongResponse[]>;
	findAllByNameAndAuthor(params?: Options): Promise<SongResponse[]>;
}

export class SongRepository extends BaseRepository implements ISongRepository {
	public tableName = 'songs';
	constructor(public db: Knex) {
		super(db);
	}

	async listAll(filters?: SongFindAllParams): Promise<SongResponse[]> {
		return await this.table
			.innerJoin('authors', 'authors.id', 'songs.author_id')
			.innerJoin('songs-keywords', 'songs.id', 'songs-keywords.song_id')
			.innerJoin('keywords', 'keywords.id', 'songs-keywords.keyword_id')
			.select('songs.*', 'authors.name as author')
			.where((builder) => {
				builder.where('songs.deleted_at', null);
				builder.where('authors.deleted_at', null);
				builder.where('keywords.deleted_at', null);

				if (filters?.name) {
					builder.whereLike('songs.name', `%${filters.name}%`);
				}

				if (filters?.author_id) {
					builder.where('songs.author_id', filters.author_id);
				}

				if (filters?.released_at_start && filters?.released_at_end) {
					builder.where(
						'songs.released_at',
						'>=',
						moment(new Date(filters.released_at_start)).utc().format()
					);
					builder.where('songs.released_at', '<=', moment(new Date(filters.released_at_end)).utc().format());
				}

				if (filters?.keyword) {
					builder.whereLike('keywords.name', `%${filters.keyword}%`);
				}
			})
			.groupBy('songs.id')
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

				if (params?.author_id) {
					builder.where('author_id', params.author_id);
				}
			})
			.select('*')
			.orderBy('created_at', 'desc');

		return song;
	}

	async findAllByNameAndAuthor<Result>(params: Options): Promise<Result[]> {
		return await this.table
			.where((builder) => {
				builder.where('deleted_at', null);

				if (params?.name) {
					builder.where('name', params.name);
				}

				if (params?.author_id) {
					builder.where('author_id', params.author_id);
				}
			})
			.select('*');
	}
}
