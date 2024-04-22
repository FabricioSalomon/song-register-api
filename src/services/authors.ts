import { Author } from '../models';
import { IAuthorRepository } from '../repositories';
import { APIError } from '../repositories/base-repository';

export type CreateAuthor = Pick<Author, 'name'>;
export type UpdateAuthor = {
	id: string;
	name: string;
};
export type AuthorResponse = Author & {
	songs_registered: number;
};
export type Repositories = {
	author: IAuthorRepository;
};
export type FindAllParams = {
	name: string;
};

export interface IAuthorService {
	create(name: string): Promise<Author>;
	delete(id: string): Promise<Author | APIError>;
	list(filters: FindAllParams): Promise<Author[]>;
	update(name: string, id: string): Promise<Author | APIError>;
}

export class AuthorService implements IAuthorService {
	constructor(private repositories: Repositories) {}

	async list(filters: FindAllParams): Promise<AuthorResponse[]> {
		const authors = await this.repositories.author.listAll(filters);

		const mapped_authors: AuthorResponse[] = authors.map((author) => ({ ...author, songs_registered: 0 }));

		return mapped_authors;
	}

	async create(name: string): Promise<Author> {
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
