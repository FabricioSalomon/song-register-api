import { Knex } from 'knex';

import { KeywordRepository, SongKeywordRepository } from '../repositories';
import { KeywordController } from '../controllers';
import { KeywordMiddleware } from '../middlewares';
import { KeywordService } from '../services';

export class KeywordFactory {
	static createInstance(db: Knex) {
		const middleware = new KeywordMiddleware();
		const repository = new KeywordRepository(db);
		const songs_keyword = new SongKeywordRepository(db);
		const service = new KeywordService({
			keyword: repository,
			songs_keyword
		});
		const controller = new KeywordController(service);
		return { middleware, controller };
	}
}
