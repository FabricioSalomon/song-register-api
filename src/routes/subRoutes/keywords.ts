import { Router } from 'express';

import { db } from '../../../database';
import { KeywordFactory } from '../../factories';

const router = Router();
const { middleware, controller } = KeywordFactory.createInstance(db);

router.get('/list', middleware.list, controller.list);
router.get('/list-by-song', middleware.listBySong, controller.listBySong);

router.post('/', middleware.create, controller.create);

router.put('/', middleware.update, controller.update);

router.delete('/', middleware.delete, controller.delete);

export { router as keywordsRouter };
