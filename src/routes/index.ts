import { Request, Response, Router } from 'express';

import * as routes from './subRoutes';

const router = Router();

router.get('/health-check', (req: Request, res: Response) => {
	res.status(200).json({
		message: 'Server running!'
	});
});

router.use('/songs', routes.songsRouter);
router.use('/authors', routes.authorsRouter);
router.use('/keywords', routes.keywordsRouter);

export { router };
