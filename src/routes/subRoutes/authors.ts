import { Router } from 'express';

import { AuthorFactory } from '../../factories';

const router = Router();
const { middleware, controller } = AuthorFactory.createInstance();

router.get('/list', middleware.teste, controller.teste);

export { router as authorsRouter };
