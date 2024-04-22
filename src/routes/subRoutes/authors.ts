import { Router } from 'express';

import { db } from './../../../database';
import { AuthorFactory } from '../../factories';

const router = Router();
const { middleware, controller } = AuthorFactory.createInstance(db);

router.get('/list', middleware.list, controller.list);

router.post('/', middleware.create, controller.create);

router.put('/', middleware.update, controller.update);

router.delete('/', middleware.delete, controller.delete);

export { router as authorsRouter };
