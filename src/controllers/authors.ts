import { Request, Response } from 'express';

import { IAuthorService } from '../services';

export interface IAuthorController {
	teste(req: Request, res: Response): void;
}

export class AuthorController implements IAuthorController {
	constructor(private service: IAuthorService) {}

	teste = (req: Request, res: Response) => {
		const author = this.service.teste();

		res.status(200).json({
			author,
			message: 'Server running!'
		});
	};
}
