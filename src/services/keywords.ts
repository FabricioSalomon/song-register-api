import { Keyword } from '../models';
import { IKeywordRepository, ISongKeywordRepository } from '../repositories';
import { APIError } from '../repositories/base-repository';

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
export type KeywordFindAllParams = {
	name: string;
};

export interface IKeywordService {
	create(name: string): Promise<Keyword | APIError>;
	listBySong(song_id: string): Promise<Keyword[]>;
	delete(id: string): Promise<Keyword | APIError>;
	list(filters: KeywordFindAllParams): Promise<Keyword[]>;
	update(name: string, id: string): Promise<Keyword | APIError>;
}

export class KeywordService implements IKeywordService {
	constructor(private repositories: KeywordsRepositories) {}

	async list(filters: KeywordFindAllParams): Promise<KeywordResponse[]> {
		const keywords = await this.repositories.keyword.listAll(filters);

		return keywords;
	}

	async listBySong(song_id: string): Promise<Keyword[]> {
		const songs_keywords = await this.repositories.songs_keyword.listAllBySong(song_id);

		const keywords_ids = songs_keywords.map(({ keyword_id }) => keyword_id);
		const keywords = await this.repositories.keyword.listAllByIds(keywords_ids);

		return keywords;
	}

	async create(name: string): Promise<Keyword | APIError> {
		const existing_keyword = await this.repositories.keyword.findOne({ name });
		if (existing_keyword) {
			return {
				code: 409,
				error: true,
				message: 'Already created keyword!'
			};
		}
		const created = await this.repositories.keyword.create<CreateKeyword, Keyword>({
			name
		});

		return created;
	}

	async update(name: string, id: string): Promise<Keyword | APIError> {
		const keyword = await this.repositories.keyword.findByPK(id);
		if (!keyword) {
			const error: APIError = {
				code: 409,
				error: true,
				message: 'Keyword not found'
			};
			return error;
		}

		const updated = await this.repositories.keyword.updateKeyword({
			id,
			name
		});

		return updated;
	}

	async delete(id: string): Promise<Keyword | APIError> {
		const keyword = await this.repositories.keyword.findByPK(id);
		if (!keyword) {
			const error: APIError = {
				code: 409,
				error: true,
				message: 'Keyword not found'
			};
			return error;
		}
		const deleted = await this.repositories.keyword.deleteKeyword(id);
		return deleted;
	}
}
