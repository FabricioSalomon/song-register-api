import { Author } from '../models';
import { IAuthorRepository } from '../repositories';

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
	delete(id: string): Promise<Author>;
	create(name: string): Promise<Author>;
	list(filters: FindAllParams): Promise<Author[]>;
	update(name: string, id: string): Promise<Author>;
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

	async update(name: string, id: string): Promise<Author> {
		const updated = await this.repositories.author.updateAuthor({
			id,
			name
		});

		return updated;
	}

	async delete(id: string): Promise<Author> {
		const deleted = await this.repositories.author.destroy<Author>(id);
		return deleted;
	}
}
