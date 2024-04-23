import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';

import { mockedAuthor } from '../fixtures';
import { IAuthorService, AuthorService } from '../../../src/services';
import {
	CreateAuthor,
	AuthorListAllParams,
	AuthorResponse,
	AuthorsRepositories,
	UpdateAuthor
} from '../../../src/repositories/types';

const { string, number, date } = faker;

describe('[Author]', () => {
	let authorsRepositories: AuthorsRepositories = {
		author: {
			listAll: jest.fn<() => Promise<AuthorResponse[]>>(),
			createAuthor: jest.fn<() => Promise<AuthorResponse>>(),
			deleteAuthor: jest.fn<() => Promise<AuthorResponse>>(),
			destroy: jest.fn<() => Promise<any>>(),
			findAll: jest.fn<() => Promise<any[]>>(),
			findByPK: jest.fn<() => Promise<any>>(),
			findOne: jest.fn<() => Promise<any>>(),
			update: jest.fn<() => Promise<any>>(),
			updateAuthor: jest.fn<() => Promise<AuthorResponse>>(),
			create: jest.fn<() => Promise<any>>()
		}
	};
	let songService: IAuthorService;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	beforeAll(() => {
		songService = new AuthorService(authorsRepositories);
	});

	describe('[list]', () => {
		const req: AuthorListAllParams = {} as AuthorListAllParams;
		it('should return all authors', async () => {
			jest.spyOn(authorsRepositories.author, 'listAll').mockResolvedValueOnce([
				{
					...mockedAuthor,
					songs_registered: number.int()
				}
			]);

			const response = await songService.list(req);

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
	});

	describe('[create]', () => {
		const req: CreateAuthor = {
			name: string.alpha(8)
		};

		it('should create author', async () => {
			jest.spyOn(authorsRepositories.author, 'findOne').mockResolvedValueOnce(null);
			jest.spyOn(authorsRepositories.author, 'create').mockResolvedValueOnce(mockedAuthor);

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

		it('should return already created author error', async () => {
			jest.spyOn(authorsRepositories.author, 'findOne').mockResolvedValueOnce(mockedAuthor);

			const response = await songService.create(req.name);

			const result = {
				code: 409,
				error: true,
				message: 'Already created author!'
			};
			expect(response).toStrictEqual(result);
		});
	});

	describe('[update]', () => {
		const req: UpdateAuthor = {
			id: string.uuid(),
			name: string.alpha(8)
		};

		it('should update author', async () => {
			jest.spyOn(authorsRepositories.author, 'findByPK').mockResolvedValueOnce(mockedAuthor);
			jest.spyOn(authorsRepositories.author, 'findOne').mockResolvedValueOnce(null);
			jest.spyOn(authorsRepositories.author, 'updateAuthor').mockResolvedValueOnce(mockedAuthor);

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

		it('should return author not found error', async () => {
			jest.spyOn(authorsRepositories.author, 'findByPK').mockResolvedValueOnce(null);

			const response = await songService.update(req.name, req.id);

			const result = {
				code: 409,
				error: true,
				message: 'Author not found'
			};
			expect(response).toStrictEqual(result);
		});

		it('should return author not found error', async () => {
			jest.spyOn(authorsRepositories.author, 'findByPK').mockResolvedValueOnce(mockedAuthor);
			jest.spyOn(authorsRepositories.author, 'findOne').mockResolvedValueOnce(mockedAuthor);

			const response = await songService.update(req.name, req.id);

			const result = {
				code: 409,
				error: true,
				message: 'Already created author!'
			};
			expect(response).toStrictEqual(result);
		});
	});

	describe('[update]', () => {
		const req: string = string.uuid();

		it('should delete author', async () => {
			jest.spyOn(authorsRepositories.author, 'findByPK').mockResolvedValueOnce(mockedAuthor);
			jest.spyOn(authorsRepositories.author, 'deleteAuthor').mockResolvedValueOnce({
				...mockedAuthor,
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

		it('should return author not found error', async () => {
			jest.spyOn(authorsRepositories.author, 'findByPK').mockResolvedValueOnce(null);

			const response = await songService.delete(req);

			const result = {
				code: 409,
				error: true,
				message: 'Author not found'
			};
			expect(response).toStrictEqual(result);
		});
	});
});
