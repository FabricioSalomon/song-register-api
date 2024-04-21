import { Author } from '../models';
import { IAuthorRepository } from '../repositories';

export interface IAuthorService {
	list(): Promise<Author[]>;
	create(): Promise<Author>;
}

export type CreateAuthor = Pick<Author, 'name'>;

export class AuthorService implements IAuthorService {
	constructor(private repository: IAuthorRepository) {}

	async list(): Promise<Author[]> {
		return await this.repository.findAll<any, Author>({});
	}

	async create(): Promise<Author> {
		return await this.repository.create<CreateAuthor, Author>({
			name: 'teste'
		});
	}
}
