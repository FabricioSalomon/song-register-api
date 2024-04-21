import { Request, Response } from 'express';

import { IAuthorService } from '../services';

export interface IAuthorController {
	list(req: Request, res: Response): Promise<void>;
	create(req: Request, res: Response): Promise<void>;
}

export class AuthorController implements IAuthorController {
	constructor(private service: IAuthorService) {}

	list = async (req: Request, res: Response) => {
		const author = await this.service.list();

		res.status(200).json(author);
	};

	create = async (req: Request, res: Response) => {
		const author = await this.service.create();

		res.status(200).json(author);
	};
}
