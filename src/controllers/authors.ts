import { Request, Response } from 'express';

import { IAuthorService } from '../services';
import { APIError } from '../repositories/base-repository';

export interface IAuthorController {
	list(req: Request, res: Response): Promise<void>;
	create(req: Request, res: Response): Promise<void>;
}

export class AuthorController implements IAuthorController {
	constructor(private service: IAuthorService) {}

	list = async (req: Request, res: Response) => {
		try {
			const filters = {
				name: req.query?.name as string
			};
			const author = await this.service.list(filters);

			res.status(200).json(author);
		} catch (error) {
			console.error(error);
			res.status(500).json({
				message: 'Internal server error'
			});
		}
	};

	create = async (req: Request, res: Response) => {
		try {
			const author = await this.service.create(req.body.name);

			if (this.hasError(author)) {
				res.status(author.code).json({
					message: author.message
				});
				return;
			}

			res.status(200).json(author);
		} catch (error) {
			console.error(error);
			res.status(500).json({
				message: 'Internal server error'
			});
		}
	};

	update = async (req: Request, res: Response) => {
		try {
			const { id, name } = req.body;
			const author = await this.service.update(name, id);

			if (this.hasError(author)) {
				return res.status(author.code).json({
					message: author.message
				});
			}

			res.status(200).json(author);
		} catch (error) {
			console.error(error);
			res.status(500).json({
				message: 'Internal server error'
			});
		}
	};

	delete = async (req: Request, res: Response) => {
		try {
			const { id } = req.query;
			const author = await this.service.delete(String(id));

			if (this.hasError(author)) {
				return res.status(author.code).json({
					message: author.message
				});
			}

			res.status(200).json(author);
		} catch (error) {
			console.error(error);
			res.status(500).json({
				message: 'Internal server error'
			});
		}
	};

	private hasError<T>(data: T | APIError): data is APIError {
		return !!(data as APIError)?.error;
	}
}
