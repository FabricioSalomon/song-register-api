import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';

import { Author } from '../../../src/models';
import { mockedAuthor } from './../fixtures/author';
import { CreateAuthor } from './../../../src/services/authors';
import { AuthorRepository, IAuthorRepository } from './../../../src/repositories/authors';

describe('[Author]', () => {
	let authorRepository: IAuthorRepository;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('[findAll]', () => {
		it('should return all authors', async () => {
			const querybuilder = {
				where: jest.fn().mockReturnThis(),
				select: jest.fn().mockReturnValueOnce([mockedAuthor])
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			authorRepository = new AuthorRepository(db);
			const response = await authorRepository.findAll<any, Author>();

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
		const request = {
			name: faker.string.alpha()
		};

		it('should create author', async () => {
			const querybuilder = {
				where: jest.fn().mockReturnThis(),
				insert: jest.fn().mockReturnThis(),
				select: jest.fn().mockReturnThis(),
				first: jest.fn().mockReturnValueOnce(null),
				returning: jest.fn().mockReturnValueOnce([mockedAuthor])
			};
			let db: any = jest.fn().mockReturnValue(querybuilder);
			authorRepository = new AuthorRepository(db);

			const response = await authorRepository.create<CreateAuthor, Author>(request);

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
