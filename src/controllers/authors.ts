import { Request, Response } from 'express';

import { IAuthorService } from '../services';

export interface IAuthorController {
	list(req: Request, res: Response): Promise<void>;
	create(req: Request, res: Response): Promise<void>;
}

export class AuthorController implements IAuthorController {
	constructor(private service: IAuthorService) {}

	list = async (req: Request, res: Response) => {
		const filters = {
			name: req.query?.name as string
		};
		const author = await this.service.list(filters);

		res.status(200).json(author);
	};

	create = async (req: Request, res: Response) => {
		const author = await this.service.create(req.body.name);

		res.status(200).json(author);
	};

	update = async (req: Request, res: Response) => {
		const { id, name } = req.body;
		const author = await this.service.update(name, id);

		res.status(200).json(author);
	};

	delete = async (req: Request, res: Response) => {
		const { id } = req.body;
		const author = await this.service.delete(id);

		res.status(200).json(author);
	};
}
