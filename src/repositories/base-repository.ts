export interface IBaseRepository {
	findOne(): void;
}

export abstract class BaseRepository implements IBaseRepository {
	findOne(): void {
		throw new Error('Method not implemented.');
	}
}
