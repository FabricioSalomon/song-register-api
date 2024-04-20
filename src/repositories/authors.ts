import { BaseRepository } from './base-repository';

export interface IAuthorRepository extends BaseRepository {}

export class AuthorRepository implements IAuthorRepository {
	findOne(): string {
		return 'Method not implemented.';
	}
}
