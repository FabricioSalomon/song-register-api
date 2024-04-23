import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';

import { mockedKeyword } from '../fixtures';
import { Keyword } from '../../../src/models';
import { KeywordRepository, IKeywordRepository } from '../../../src/repositories/keywords';
import { KeywordListAllParams, CreateKeyword, Options, UpdateKeyword } from '../../../src/repositories/types';

const { string, date } = faker;

describe('[Keyword]', () => {
	let keywordRepository: IKeywordRepository;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('[listAll]', () => {
		const req: KeywordListAllParams = {} as KeywordListAllParams;
		it('should return all keywords', async () => {
			const querybuilder = {
				where: jest.fn().mockReturnThis(),
				select: jest.fn().mockReturnThis(),
				orderBy: jest.fn().mockReturnValueOnce([mockedKeyword])
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			keywordRepository = new KeywordRepository(db);
			const response = await keywordRepository.listAll(req);

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

		it('should return all keywords filtered by name', async () => {
			req.name = string.alpha(8);
			const querybuilder = {
				where: jest.fn().mockReturnThis(),
				select: jest.fn().mockReturnThis(),
				whereLike: jest.fn().mockReturnThis(),
				orderBy: jest.fn().mockReturnValueOnce([mockedKeyword])
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			keywordRepository = new KeywordRepository(db);
			const response = await keywordRepository.listAll();

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

	describe('[listAllByIds]', () => {
		const req: string[] = [string.uuid()];
		it('should return all keywords in array of ids', async () => {
			const querybuilder = {
				where: jest.fn().mockReturnThis(),
				whereIn: jest.fn().mockReturnThis(),
				select: jest.fn().mockReturnThis(),
				orderBy: jest.fn().mockReturnValueOnce([mockedKeyword])
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			keywordRepository = new KeywordRepository(db);
			const response = await keywordRepository.listAllByIds(req);

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

	describe('[createKeyword]', () => {
		const request: CreateKeyword = {
			name: string.alpha(8)
		};

		it('should create keyword', async () => {
			const querybuilder = {
				insert: jest.fn().mockReturnThis(),
				returning: jest.fn().mockReturnValueOnce([mockedKeyword])
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			keywordRepository = new KeywordRepository(db);

			const response: Keyword = await keywordRepository.createKeyword(request);

			const result = {
				id: expect.any(String),
				name: expect.any(String),
				created_at: expect.any(Date),
				updated_at: expect.any(Date),
				deleted_at: null
			};

			expect(response).toStrictEqual(result);
		});
	});

	describe('[updateKeyword]', () => {
		const request: UpdateKeyword = {
			id: string.uuid(),
			name: string.alpha(8)
		};

		it('should update keyword', async () => {
			const querybuilder = {
				where: jest.fn().mockReturnThis(),
				update: jest.fn().mockReturnThis(),
				returning: jest.fn().mockReturnValueOnce([mockedKeyword])
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			keywordRepository = new KeywordRepository(db);

			const response: Keyword = await keywordRepository.updateKeyword(request);

			const result = {
				id: expect.any(String),
				name: expect.any(String),
				created_at: expect.any(Date),
				updated_at: expect.any(Date),
				deleted_at: null
			};

			expect(response).toStrictEqual(result);
		});
	});

	describe('[deleteKeyword]', () => {
		const request: string = string.uuid();

		it('should delete keyword', async () => {
			const querybuilder = {
				where: jest.fn().mockReturnThis(),
				update: jest.fn().mockReturnThis(),
				returning: jest.fn().mockReturnValueOnce([
					{
						...mockedKeyword,
						deleted_at: date.anytime()
					}
				])
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			keywordRepository = new KeywordRepository(db);

			const response: Keyword = await keywordRepository.deleteKeyword(request);

			const result = {
				id: expect.any(String),
				name: expect.any(String),
				created_at: expect.any(Date),
				updated_at: expect.any(Date),
				deleted_at: expect.any(Date)
			};

			expect(response).toStrictEqual(result);
		});
	});

	describe('[findOne]', () => {
		const request: Options = {};

		it('should find one keyword', async () => {
			const querybuilder = {
				where: jest.fn().mockReturnThis(),
				orderBy: jest.fn().mockReturnValueOnce([mockedKeyword]),
				select: jest.fn().mockReturnThis()
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			keywordRepository = new KeywordRepository(db);

			const response: Keyword = await keywordRepository.findOne(request);

			const result = {
				id: expect.any(String),
				name: expect.any(String),
				created_at: expect.any(Date),
				updated_at: expect.any(Date),
				deleted_at: null
			};

			expect(response).toStrictEqual(result);
		});

		it('should find one keyword filtered by name', async () => {
			request.name = string.alpha(8);
			const querybuilder = {
				where: jest.fn().mockReturnThis(),
				orderBy: jest.fn().mockReturnValueOnce([mockedKeyword]),
				select: jest.fn().mockReturnThis()
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			keywordRepository = new KeywordRepository(db);

			const response: Keyword = await keywordRepository.findOne(request);

			const result = {
				id: expect.any(String),
				name: expect.any(String),
				created_at: expect.any(Date),
				updated_at: expect.any(Date),
				deleted_at: null
			};

			expect(response).toStrictEqual(result);
		});
	});
});
