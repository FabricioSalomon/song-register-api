import { Knex } from 'knex';

import { SongKeywordRepository, SongRepository } from '../repositories';
import { SongController } from '../controllers';
import { SongMiddleware } from '../middlewares';
import { SongService } from '../services';

export class SongFactory {
	static createInstance(db: Knex) {
		const middleware = new SongMiddleware();
		const repository = new SongRepository(db);
		const songs_keywords = new SongKeywordRepository(db);
		const service = new SongService({
			song: repository,
			songs_keywords
		});
		const controller = new SongController(service);
		return { middleware, controller };
	}
}
