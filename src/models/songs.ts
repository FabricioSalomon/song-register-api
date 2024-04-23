import { BaseModel } from './base-model';

export type Song = BaseModel & {
	name: string;
	author_id: string;
	released_at: Date;
};
