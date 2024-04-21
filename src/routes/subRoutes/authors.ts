import { Router } from 'express';

import { db } from './../../../database';
import { AuthorFactory } from '../../factories';

const router = Router();
const { middleware, controller } = AuthorFactory.createInstance(db);

router.get('/list', controller.list);
router.get('/create', controller.create);

export { router as authorsRouter };
