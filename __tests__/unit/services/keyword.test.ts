import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';

import { SongKeyword } from '../../../src/models';
import { mockedKeyword, mockedSongKeyword } from '../fixtures';
import { IKeywordService, KeywordService } from '../../../src/services';
import {
	CreateKeyword,
	KeywordListAllParams,
	KeywordResponse,
	KeywordsRepositories,
	UpdateKeyword
} from '../../../src/repositories/types';

const { string, date } = faker;

describe('[Keyword]', () => {
	let keywordsRepositories: KeywordsRepositories = {
		keyword: {
			listAll: jest.fn<() => Promise<KeywordResponse[]>>(),
			createKeyword: jest.fn<() => Promise<KeywordResponse>>(),
			deleteKeyword: jest.fn<() => Promise<KeywordResponse>>(),
			destroy: jest.fn<() => Promise<any>>(),
			findAll: jest.fn<() => Promise<any[]>>(),
			findByPK: jest.fn<() => Promise<any>>(),
			findOne: jest.fn<() => Promise<any>>(),
			listAllByIds: jest.fn<() => Promise<KeywordResponse[]>>(),
			update: jest.fn<() => Promise<any>>(),
			updateKeyword: jest.fn<() => Promise<KeywordResponse>>(),
			create: jest.fn<() => Promise<any>>()
		},
		songs_keyword: {
			update: jest.fn<() => Promise<any>>(),
			create: jest.fn<() => Promise<any>>(),
			createSongKeyword: jest.fn<() => Promise<any>>(),
			deleteSongKeyword: jest.fn<() => Promise<SongKeyword>>(),
			deleteSongKeywordBySongId: jest.fn<() => Promise<SongKeyword[]>>(),
			destroy: jest.fn<() => Promise<any>>(),
			findAll: jest.fn<() => Promise<any>>(),
			findByPK: jest.fn<() => Promise<any>>(),
			findOne: jest.fn<() => Promise<any>>(),
			listAllBySong: jest.fn<() => Promise<SongKeyword[]>>(),
			updateSongKeyword: jest.fn<() => Promise<SongKeyword[]>>()
		}
	};
	let songService: IKeywordService;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	beforeAll(() => {
		songService = new KeywordService(keywordsRepositories);
	});

	describe('[list]', () => {
		const req: KeywordListAllParams = {} as KeywordListAllParams;
		it('should return all keywords', async () => {
			jest.spyOn(keywordsRepositories.keyword, 'listAll').mockResolvedValueOnce([
				{
					...mockedKeyword
				}
			]);

			const response = await songService.list(req);

			const result = expect.arrayContaining([
				{
					id: expect.any(String),
					name: expect.any(String),
					created_at: expect.any(Date),
					updated_at: expect.any(Date),
					deleted_at: null
				}
			]);
			expect(response).toStrictEqual(result);
		});
	});

	describe('[listBySong]', () => {
		const req: string = string.uuid();
		it('should return all keywords by song id', async () => {
			jest.spyOn(keywordsRepositories.songs_keyword, 'listAllBySong').mockResolvedValueOnce([mockedSongKeyword]);
			jest.spyOn(keywordsRepositories.keyword, 'listAllByIds').mockResolvedValueOnce([
				{
					...mockedKeyword
				}
			]);

			const response = await songService.listBySong(req);

			const result = expect.arrayContaining([
				{
					id: expect.any(String),
					name: expect.any(String),
					created_at: expect.any(Date),
					updated_at: expect.any(Date),
					deleted_at: null
				}
			]);
			expect(response).toStrictEqual(result);
		});
	});

	describe('[create]', () => {
		const req: CreateKeyword = {
			name: string.alpha(8)
		};

		it('should create keyword', async () => {
			jest.spyOn(keywordsRepositories.keyword, 'findOne').mockResolvedValueOnce(null);
			jest.spyOn(keywordsRepositories.keyword, 'create').mockResolvedValueOnce(mockedKeyword);
			jest.spyOn(keywordsRepositories.songs_keyword, 'createSongKeyword').mockResolvedValueOnce([
				mockedSongKeyword
			]);

			const response = await songService.create(req.name);

			const result = {
				id: expect.any(String),
				name: expect.any(String),
				created_at: expect.any(Date),
				updated_at: expect.any(Date),
				deleted_at: null
			};
			expect(response).toStrictEqual(result);
		});

		it('should return already created keyword error', async () => {
			jest.spyOn(keywordsRepositories.keyword, 'findOne').mockResolvedValueOnce(mockedKeyword);

			const response = await songService.create(req.name);

			const result = {
				code: 409,
				error: true,
				message: 'Already created keyword!'
			};
			expect(response).toStrictEqual(result);
		});
	});

	describe('[update]', () => {
		const req: UpdateKeyword = {
			id: string.uuid(),
			name: string.alpha(8)
		};

		it('should update keyword', async () => {
			jest.spyOn(keywordsRepositories.keyword, 'findByPK').mockResolvedValueOnce(mockedKeyword);
			jest.spyOn(keywordsRepositories.keyword, 'findOne').mockResolvedValueOnce(null);
			jest.spyOn(keywordsRepositories.keyword, 'updateKeyword').mockResolvedValueOnce(mockedKeyword);

			const response = await songService.update(req.name, req.id);

			const result = {
				id: expect.any(String),
				name: expect.any(String),
				created_at: expect.any(Date),
				updated_at: expect.any(Date),
				deleted_at: null
			};
			expect(response).toStrictEqual(result);
		});

		it('should return keyword not found error', async () => {
			jest.spyOn(keywordsRepositories.keyword, 'findByPK').mockResolvedValueOnce(null);

			const response = await songService.update(req.name, req.id);

			const result = {
				code: 409,
				error: true,
				message: 'Keyword not found'
			};
			expect(response).toStrictEqual(result);
		});

		it('should return keyword not found error', async () => {
			jest.spyOn(keywordsRepositories.keyword, 'findByPK').mockResolvedValueOnce(mockedKeyword);
			jest.spyOn(keywordsRepositories.keyword, 'findOne').mockResolvedValueOnce(mockedKeyword);

			const response = await songService.update(req.name, req.id);

			const result = {
				code: 409,
				error: true,
				message: 'Already created keyword!'
			};
			expect(response).toStrictEqual(result);
		});
	});

	describe('[update]', () => {
		const req: string = string.uuid();

		it('should delete keyword', async () => {
			jest.spyOn(keywordsRepositories.keyword, 'findByPK').mockResolvedValueOnce(mockedKeyword);
			jest.spyOn(keywordsRepositories.keyword, 'deleteKeyword').mockResolvedValueOnce({
				...mockedKeyword,
				deleted_at: date.anytime()
			});

			const response = await songService.delete(req);

			const result = {
				id: expect.any(String),
				name: expect.any(String),
				created_at: expect.any(Date),
				updated_at: expect.any(Date),
				deleted_at: expect.any(Date)
			};
			expect(response).toStrictEqual(result);
		});

		it('should return keyword not found error', async () => {
			jest.spyOn(keywordsRepositories.keyword, 'findByPK').mockResolvedValueOnce(null);

			const response = await songService.delete(req);

			const result = {
				code: 409,
				error: true,
				message: 'Keyword not found'
			};
			expect(response).toStrictEqual(result);
		});
	});
});
