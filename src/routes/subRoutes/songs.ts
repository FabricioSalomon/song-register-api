import { Router } from 'express';

import { db } from '../../../database';
import { SongFactory } from '../../factories';

const router = Router();
const { middleware, controller } = SongFactory.createInstance(db);

router.get('/list', middleware.list, controller.list);

router.post('/', middleware.create, controller.create);

router.put('/', middleware.update, controller.update);

router.delete('/', middleware.delete, controller.delete);

export { router as songsRouter };
