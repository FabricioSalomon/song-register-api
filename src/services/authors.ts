import { Author } from '../models';
import {
	APIError,
	AuthorListAllParams,
	AuthorResponse,
	AuthorsRepositories,
	CreateAuthor
} from '../repositories/types';

export interface IAuthorService {
	delete(id: string): Promise<Author | APIError>;
	create(name: string): Promise<Author | APIError>;
	list(filters: AuthorListAllParams): Promise<Author[]>;
	update(name: string, id: string): Promise<Author | APIError>;
}

export class AuthorService implements IAuthorService {
	constructor(private repositories: AuthorsRepositories) {}

	async list(filters: AuthorListAllParams): Promise<AuthorResponse[]> {
		const authors = await this.repositories.author.listAll(filters);

		return authors;
	}

	async create(name: string): Promise<Author | APIError> {
		const existing_author = await this.repositories.author.findOne({ name });
		if (existing_author) {
			return {
				code: 409,
				error: true,
				message: 'Already created author!'
			};
		}
		const created = await this.repositories.author.create<CreateAuthor, Author>({
			name
		});

		return created;
	}

	async update(name: string, id: string): Promise<Author | APIError> {
		const author = await this.repositories.author.findByPK(id);
		if (!author) {
			const error: APIError = {
				code: 409,
				error: true,
				message: 'Author not found'
			};
			return error;
		}
		const existing_author = await this.repositories.author.findOne({ name });
		if (existing_author) {
			return {
				code: 409,
				error: true,
				message: 'Already created author!'
			};
		}

		const updated = await this.repositories.author.updateAuthor({
			id,
			name
		});

		return updated;
	}

	async delete(id: string): Promise<Author | APIError> {
		const author = await this.repositories.author.findByPK(id);
		if (!author) {
			const error: APIError = {
				code: 409,
				error: true,
				message: 'Author not found'
			};
			return error;
		}
		const deleted = await this.repositories.author.deleteAuthor(id);
		return deleted;
	}
}
