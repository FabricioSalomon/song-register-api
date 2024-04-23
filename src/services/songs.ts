import { Song, SongKeyword } from '../models';
import { APIError } from '../repositories/base-repository';
import { CreateSongsKeyword, ISongKeywordRepository, ISongRepository } from '../repositories';

export type CreateSong = {
	name: string;
	author_id: string;
	released_at: string;
	keywords_ids?: string[];
};
export type UpdateSong = {
	id: string;
	name: string;
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
	create(params: CreateSong): Promise<Song>;
	delete(id: string): Promise<Song | APIError>;
	list(filters: SongFindAllParams): Promise<Song[]>;
	update(name: string, id: string): Promise<Song | APIError>;
}

export class SongService implements ISongService {
	constructor(private repositories: SongsRepositories) {}

	async list(filters: SongFindAllParams): Promise<SongResponse[]> {
		const songs = await this.repositories.song.listAll(filters);

		return songs;
	}

	async create({ author_id, name, released_at, keywords_ids }: CreateSong): Promise<Song> {
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

	async update(name: string, id: string): Promise<Song | APIError> {
		const song = await this.repositories.song.findByPK(id);
		if (!song) {
			const error: APIError = {
				code: 409,
				error: true,
				message: 'Song not found'
			};
			return error;
		}

		const updated = await this.repositories.song.updateSong({
			id,
			name
		});

		return updated;
	}

	async delete(id: string): Promise<Song | APIError> {
		const song = await this.repositories.song.findByPK(id);
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
