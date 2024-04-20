import { AuthorRepository } from '../repositories';
import { AuthorController } from '../controllers';
import { AuthorMiddleware } from '../middlewares';
import { AuthorService } from '../services';

export class AuthorFactory {
	static createInstance() {
		const middleware = new AuthorMiddleware();
		const repository = new AuthorRepository();
		const service = new AuthorService(repository);
		const controller = new AuthorController(service);
		return { middleware, controller };
	}
}
