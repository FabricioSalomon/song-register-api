import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';

import { Author } from '../../../src/models';
import { mockedAuthor, mockedSong } from './../fixtures';
import { AuthorRepository, IAuthorRepository } from './../../../src/repositories/authors';
import { AuthorListAllParams, CreateAuthor, Options, UpdateAuthor } from '../../../src/repositories/types';

const { string, date } = faker;

describe('[Author]', () => {
	let authorRepository: IAuthorRepository;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('[listAll]', () => {
		const req: AuthorListAllParams = {} as AuthorListAllParams;
		it('should return all authors', async () => {
			const querybuilder = {
				where: jest.fn().mockReturnThis(),
				whereIn: jest.fn().mockReturnThis(),
				orderBy: jest.fn().mockReturnThis(),
				select: jest.fn().mockReturnValueOnce([mockedAuthor]).mockReturnValueOnce([mockedSong])
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			authorRepository = new AuthorRepository(db);
			const response = await authorRepository.listAll(req);

			const result = expect.arrayContaining([
				{
					id: expect.any(String),
					name: expect.any(String),
					songs_registered: expect.any(Number),
					created_at: expect.any(Date),
					updated_at: expect.any(Date),
					deleted_at: null
				}
			]);

			expect(response).toStrictEqual(result);
		});

		it('should return all authors filtered by name', async () => {
			req.name = string.alpha(8);
			const querybuilder = {
				where: jest.fn().mockReturnThis(),
				whereLike: jest.fn().mockReturnThis(),
				whereIn: jest.fn().mockReturnThis(),
				orderBy: jest.fn().mockReturnThis(),
				select: jest.fn().mockReturnValueOnce([mockedAuthor]).mockReturnValueOnce([mockedSong])
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			authorRepository = new AuthorRepository(db);
			const response = await authorRepository.listAll();

			const result = expect.arrayContaining([
				{
					id: expect.any(String),
					name: expect.any(String),
					created_at: expect.any(Date),
					songs_registered: expect.any(Number),
					updated_at: expect.any(Date),
					deleted_at: null
				}
			]);

			expect(response).toStrictEqual(result);
		});
	});

	describe('[createAuthor]', () => {
		const request: CreateAuthor = {
			name: string.alpha(8)
		};

		it('should create author', async () => {
			const querybuilder = {
				insert: jest.fn().mockReturnThis(),
				returning: jest.fn().mockReturnValueOnce([mockedAuthor])
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			authorRepository = new AuthorRepository(db);

			const response: Author = await authorRepository.createAuthor(request);

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

	describe('[updateAuthor]', () => {
		const request: UpdateAuthor = {
			id: string.uuid(),
			name: string.alpha(8)
		};

		it('should update author', async () => {
			const querybuilder = {
				where: jest.fn().mockReturnThis(),
				update: jest.fn().mockReturnThis(),
				returning: jest.fn().mockReturnValueOnce([mockedAuthor])
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			authorRepository = new AuthorRepository(db);

			const response: Author = await authorRepository.updateAuthor(request);

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

	describe('[deleteAuthor]', () => {
		const request: string = string.uuid();

		it('should delete author', async () => {
			const querybuilder = {
				where: jest.fn().mockReturnThis(),
				update: jest.fn().mockReturnThis(),
				returning: jest.fn().mockReturnValueOnce([
					{
						...mockedAuthor,
						deleted_at: date.anytime()
					}
				])
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			authorRepository = new AuthorRepository(db);

			const response: Author = await authorRepository.deleteAuthor(request);

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

		it('should find one author', async () => {
			const querybuilder = {
				where: jest.fn().mockReturnThis(),
				orderBy: jest.fn().mockReturnValueOnce([mockedAuthor]),
				select: jest.fn().mockReturnThis()
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			authorRepository = new AuthorRepository(db);

			const response: Author = await authorRepository.findOne(request);

			const result = {
				id: expect.any(String),
				name: expect.any(String),
				created_at: expect.any(Date),
				updated_at: expect.any(Date),
				deleted_at: null
			};

			expect(response).toStrictEqual(result);
		});

		it('should find one author filtered by name', async () => {
			request.name = string.alpha(8);
			const querybuilder = {
				where: jest.fn().mockReturnThis(),
				orderBy: jest.fn().mockReturnValueOnce([mockedAuthor]),
				select: jest.fn().mockReturnThis()
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			authorRepository = new AuthorRepository(db);

			const response: Author = await authorRepository.findOne(request);

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
