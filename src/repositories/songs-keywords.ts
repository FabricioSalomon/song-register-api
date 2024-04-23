import { Knex } from 'knex';

import { SongKeyword } from '../models';
import { BaseRepository, type IBaseRepository } from './base-repository';
import { CreateSongKeyword, CreateSongsKeyword, Options, UpdateSongKeyword } from './types';

export interface ISongKeywordRepository extends IBaseRepository {
	deleteSongKeyword(id: string): Promise<SongKeyword>;
	listAllBySong(song_id: string): Promise<SongKeyword[]>;
	deleteSongKeywordBySongId(song_id: string): Promise<SongKeyword[]>;
	createSongKeyword(params?: CreateSongsKeyword): Promise<SongKeyword[]>;
	updateSongKeyword(params?: UpdateSongKeyword): Promise<SongKeyword[]>;
}

export class SongKeywordRepository extends BaseRepository implements ISongKeywordRepository {
	public tableName = 'songs-keywords';
	constructor(public db: Knex) {
		super(db);
	}

	async listAllBySong(song_id: string): Promise<SongKeyword[]> {
		return await this.table
			.where((builder) => {
				builder.where('deleted_at', null);
				builder.where('song_id', song_id);
			})
			.select('*')
			.orderBy('created_at', 'desc');
	}

	async createSongKeyword(params: CreateSongsKeyword): Promise<SongKeyword[]> {
		const promises = params.keywords_ids.map((keyword_id) =>
			this.create<CreateSongKeyword, SongKeyword>({
				song_id: params.song_id,
				keyword_id
			})
		);
		const created = await Promise.all(promises);
		return created;
	}

	async updateSongKeyword(params: UpdateSongKeyword): Promise<SongKeyword[]> {
		await this.table
			.where('song_id', params.song_id)
			.update({
				deleted_at: new Date()
			})
			.returning('*');

		const promises = params.keywords_ids.map((keyword_id) =>
			this.create<CreateSongKeyword, SongKeyword>({
				song_id: params.song_id,
				keyword_id
			})
		);
		const udpated = await Promise.all(promises);
		return udpated;
	}

	async deleteSongKeyword(id: string): Promise<SongKeyword> {
		const deleted: SongKeyword = await this.destroy(id);
		return deleted;
	}

	async deleteSongKeywordBySongId(song_id: string): Promise<SongKeyword[]> {
		const deleted: SongKeyword[] = await this.table
			.where('song_id', song_id)
			.update({
				deleted_at: new Date()
			})
			.returning('*');
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
