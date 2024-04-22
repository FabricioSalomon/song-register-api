import { Knex } from 'knex';

import { AuthorRepository } from '../repositories';
import { AuthorController } from '../controllers';
import { AuthorMiddleware } from '../middlewares';
import { AuthorService } from '../services';

export class AuthorFactory {
	static createInstance(db: Knex) {
		const middleware = new AuthorMiddleware();
		const repository = new AuthorRepository(db);
		const service = new AuthorService({ author: repository });
		const controller = new AuthorController(service);
		return { middleware, controller };
	}
}
