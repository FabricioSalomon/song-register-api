import { Author, Keyword, Song } from '../models';
import { IAuthorRepository, IKeywordRepository, ISongKeywordRepository, ISongRepository } from '.';

export type CreateKeyword = Pick<Keyword, 'name'>;
export type UpdateKeyword = {
	id: string;
	name: string;
};
export type KeywordResponse = Keyword;
export type KeywordsRepositories = {
	keyword: IKeywordRepository;
	songs_keyword: ISongKeywordRepository;
};
export type KeywordListAllParams = {
	name: string;
};

export type CreateAuthor = Pick<Author, 'name'>;
export type UpdateAuthor = {
	id: string;
	name: string;
};
export type AuthorResponse = Author & {
	songs_registered: number;
};
export type AuthorsRepositories = {
	author: IAuthorRepository;
};
export type AuthorListAllParams = {
	name: string;
};

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
export type SongListAllParams = {
	name?: string;
	keyword: string;
	author_id: string;
	released_at_end: string;
	released_at_start: string;
};

export type CreateSongKeyword = {
	song_id: string;
	keyword_id: string;
};
export type CreateSongsKeyword = {
	song_id: string;
	keywords_ids: string[];
};
export type UpdateSongKeyword = {
	song_id: string;
	keywords_ids: string[];
};

export type Options = {
	name?: string;
	author_id?: string;
	soft_deleted?: boolean;
};

export type APIError = {
	code: number;
	error: boolean;
	message: string;
};
