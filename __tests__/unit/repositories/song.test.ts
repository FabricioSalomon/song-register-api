import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';

import { mockedSong } from '../fixtures';
import { Song } from '../../../src/models';
import { SongRepository, ISongRepository } from '../../../src/repositories/songs';
import { SongListAllParams, CreateSong, Options, UpdateSong } from '../../../src/repositories/types';

const { string, date } = faker;

describe('[Song]', () => {
	let songRepository: ISongRepository;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('[listAll]', () => {
		const req: SongListAllParams = {} as SongListAllParams;
		it('should return all songs', async () => {
			const querybuilder = {
				innerJoin: jest.fn().mockReturnThis(),
				where: jest.fn().mockReturnThis(),
				select: jest.fn().mockReturnThis(),
				groupBy: jest.fn().mockReturnThis(),
				orderBy: jest.fn().mockReturnValueOnce([
					{
						...mockedSong,
						author: string.alpha(8)
					}
				])
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			songRepository = new SongRepository(db);
			const response = await songRepository.listAll(req);

			const result = expect.arrayContaining([
				{
					id: expect.any(String),
					name: expect.any(String),
					author_id: expect.any(String),
					author: expect.any(String),
					released_at: expect.any(Date),
					created_at: expect.any(Date),
					updated_at: expect.any(Date),
					deleted_at: null
				}
			]);

			expect(response).toStrictEqual(result);
		});
	});

	describe('[createSong]', () => {
		const request: CreateSong = {
			name: string.alpha(8),
			author_id: string.uuid(),
			keywords_ids: [string.uuid()],
			released_at: date.anytime().toDateString()
		};

		it('should create song', async () => {
			const querybuilder = {
				insert: jest.fn().mockReturnThis(),
				returning: jest.fn().mockReturnValueOnce([mockedSong])
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			songRepository = new SongRepository(db);

			const response: Song = await songRepository.createSong(request);

			const result = {
				id: expect.any(String),
				name: expect.any(String),
				author_id: expect.any(String),
				released_at: expect.any(Date),
				created_at: expect.any(Date),
				updated_at: expect.any(Date),
				deleted_at: null
			};

			expect(response).toStrictEqual(result);
		});
	});

	describe('[updateSong]', () => {
		const request: UpdateSong = {
			id: string.uuid(),
			name: string.alpha(8),
			author_id: string.uuid(),
			keywords_ids: [string.uuid()],
			released_at: date.anytime().toDateString()
		};

		it('should update song', async () => {
			const querybuilder = {
				where: jest.fn().mockReturnThis(),
				update: jest.fn().mockReturnThis(),
				returning: jest.fn().mockReturnValueOnce([mockedSong])
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			songRepository = new SongRepository(db);

			const response: Song = await songRepository.updateSong(request);

			const result = {
				id: expect.any(String),
				name: expect.any(String),
				author_id: expect.any(String),
				released_at: expect.any(Date),
				created_at: expect.any(Date),
				updated_at: expect.any(Date),
				deleted_at: null
			};

			expect(response).toStrictEqual(result);
		});
	});

	describe('[deleteSong]', () => {
		const request: string = string.uuid();

		it('should delete song', async () => {
			const querybuilder = {
				where: jest.fn().mockReturnThis(),
				update: jest.fn().mockReturnThis(),
				returning: jest.fn().mockReturnValueOnce([
					{
						...mockedSong,
						deleted_at: date.anytime()
					}
				])
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			songRepository = new SongRepository(db);

			const response: Song = await songRepository.deleteSong(request);

			const result = {
				id: expect.any(String),
				name: expect.any(String),
				author_id: expect.any(String),
				released_at: expect.any(Date),
				created_at: expect.any(Date),
				updated_at: expect.any(Date),
				deleted_at: expect.any(Date)
			};

			expect(response).toStrictEqual(result);
		});
	});

	describe('[findOne]', () => {
		const request: Options = {};

		it('should find one song', async () => {
			const querybuilder = {
				where: jest.fn().mockReturnThis(),
				orderBy: jest.fn().mockReturnValueOnce([mockedSong]),
				select: jest.fn().mockReturnThis()
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			songRepository = new SongRepository(db);

			const response: Song = await songRepository.findOne(request);

			const result = {
				id: expect.any(String),
				name: expect.any(String),
				author_id: expect.any(String),
				released_at: expect.any(Date),
				created_at: expect.any(Date),
				updated_at: expect.any(Date),
				deleted_at: null
			};

			expect(response).toStrictEqual(result);
		});

		it('should find one song filtered by name and author id', async () => {
			request.name = string.alpha(8);
			request.author_id = string.uuid();
			const querybuilder = {
				where: jest.fn().mockReturnThis(),
				orderBy: jest.fn().mockReturnValueOnce([mockedSong]),
				select: jest.fn().mockReturnThis()
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			songRepository = new SongRepository(db);

			const response: Song = await songRepository.findOne(request);

			const result = {
				id: expect.any(String),
				name: expect.any(String),
				author_id: expect.any(String),
				released_at: expect.any(Date),
				created_at: expect.any(Date),
				updated_at: expect.any(Date),
				deleted_at: null
			};

			expect(response).toStrictEqual(result);
		});
	});

	describe('[findAllByNameAndAuthor]', () => {
		const request: Options = {};

		it('should find all songs', async () => {
			const querybuilder = {
				where: jest.fn().mockReturnThis(),
				select: jest.fn().mockReturnValueOnce([mockedSong])
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			songRepository = new SongRepository(db);

			const response: Song[] = await songRepository.findAllByNameAndAuthor(request);

			const result = expect.arrayContaining([
				{
					id: expect.any(String),
					name: expect.any(String),
					author_id: expect.any(String),
					released_at: expect.any(Date),
					created_at: expect.any(Date),
					updated_at: expect.any(Date),
					deleted_at: null
				}
			]);

			expect(response).toStrictEqual(result);
		});

		it('should find all songs filtered by name and author id', async () => {
			request.name = string.alpha(8);
			request.author_id = string.uuid();
			const querybuilder = {
				where: jest.fn().mockReturnThis(),
				select: jest.fn().mockReturnValueOnce([mockedSong])
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			songRepository = new SongRepository(db);

			const response: Song[] = await songRepository.findAllByNameAndAuthor(request);

			const result = expect.arrayContaining([
				{
					id: expect.any(String),
					name: expect.any(String),
					author_id: expect.any(String),
					released_at: expect.any(Date),
					created_at: expect.any(Date),
					updated_at: expect.any(Date),
					deleted_at: null
				}
			]);

			expect(response).toStrictEqual(result);
		});
	});
});
