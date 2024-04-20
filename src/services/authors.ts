import { IAuthorRepository } from '../repositories';

export interface IAuthorService {
	teste(): void;
}

export class AuthorService implements IAuthorService {
	constructor(private repository: IAuthorRepository) {}

	public teste() {
		return this.repository.findOne();
	}
}
