import { Song } from '../models';
import { APIError } from '../repositories/base-repository';
import { ISongKeywordRepository, ISongRepository } from '../repositories';

export type CreateSong = {
	name: string;
	author_id: string;
	released_at: string;
	keywords_ids?: string[];
};
export type UpdateSong = CreateSong & {
	id: string;
};
export type SongResponse = Song & {
	author: string;
};
export type SongsRepositories = {
	song: ISongRepository;
	songs_keywords: ISongKeywordRepository;
};
export type SongFindAllParams = {
	name?: string;
	keyword: string;
	author_id: string;
	released_at_end: string;
	released_at_start: string;
};

export interface ISongService {
	delete(id: string): Promise<Song | APIError>;
	list(filters: SongFindAllParams): Promise<Song[]>;
	create(params: CreateSong): Promise<Song | APIError>;
	update(params: UpdateSong, id: string): Promise<Song | APIError>;
}

export class SongService implements ISongService {
	constructor(private repositories: SongsRepositories) {}

	async list(filters: SongFindAllParams): Promise<SongResponse[]> {
		const songs = await this.repositories.song.listAll(filters);

		return songs;
	}

	async create({ author_id, name, released_at, keywords_ids }: CreateSong): Promise<Song | APIError> {
		const existing_song: Song = await this.repositories.song.findOne({
			name,
			author_id
		});
		if (existing_song) {
			return {
				code: 409,
				error: true,
				message: 'Already created song for this author!'
			};
		}

		const created = await this.repositories.song.create<CreateSong, Song>({
			name,
			author_id,
			released_at
		});

		await this.repositories.songs_keywords.createSongKeyword({
			song_id: created.id,
			keywords_ids: keywords_ids ?? []
		});

		return created;
	}

	async update(params: UpdateSong, id: string): Promise<Song | APIError> {
		const song: Song = await this.repositories.song.findByPK(id);
		if (!song) {
			const error: APIError = {
				code: 409,
				error: true,
				message: 'Song not found'
			};
			return error;
		}

		const existing_songs: Song[] = await this.repositories.song.findAllByNameAndAuthor({
			name: params.name,
			author_id: params.author_id
		});

		const existing_ids = existing_songs?.map((existing) => existing.id);

		if (existing_songs && existing_songs.length > 0 && !existing_ids.includes(id)) {
			return {
				code: 409,
				error: true,
				message: 'Already created this song for this author!'
			};
		}

		const { author_id, name, released_at, keywords_ids } = params;
		const updated = await this.repositories.song.updateSong({
			id,
			name,
			author_id,
			released_at
		});

		await this.repositories.songs_keywords.deleteSongKeywordBySongId(updated.id);
		await this.repositories.songs_keywords.createSongKeyword({
			song_id: updated.id,
			keywords_ids: keywords_ids ?? []
		});

		return updated;
	}

	async delete(id: string): Promise<Song | APIError> {
		const song: Song = await this.repositories.song.findByPK(id);
		if (!song) {
			const error: APIError = {
				code: 409,
				error: true,
				message: 'Song not found'
			};
			return error;
		}
		const deleted = await this.repositories.song.deleteSong(id);
		return deleted;
	}
}
