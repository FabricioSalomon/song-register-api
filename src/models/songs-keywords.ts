import { BaseModel } from './base-model';

export type SongKeyword = BaseModel & {
	song_id: string;
	keyword_id: string;
};
