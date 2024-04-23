import { Request, Response } from 'express';

import { IKeywordService } from '../services';
import { APIError } from '../repositories/types';

export interface IKeywordController {
	list(req: Request, res: Response): Promise<void>;
	create(req: Request, res: Response): Promise<void>;
	update(req: Request, res: Response): Promise<void>;
	delete(req: Request, res: Response): Promise<void>;
	listBySong(req: Request, res: Response): Promise<void>;
}

export class KeywordController implements IKeywordController {
	constructor(private service: IKeywordService) {}

	list = async (req: Request, res: Response) => {
		try {
			const filters = {
				name: req.query?.name as string
			};
			const keyword = await this.service.list(filters);

			res.status(200).json(keyword);
		} catch (error) {
			console.error(error);
			res.status(500).json({
				message: 'Internal server error'
			});
		}
	};

	listBySong = async (req: Request, res: Response) => {
		try {
			const song_id = req.query?.song_id as string;
			const keyword = await this.service.listBySong(song_id);

			res.status(200).json(keyword);
		} catch (error) {
			console.error(error);
			res.status(500).json({
				message: 'Internal server error'
			});
		}
	};

	create = async (req: Request, res: Response) => {
		try {
			const keyword = await this.service.create(req.body.name);
			if (this.hasError(keyword)) {
				res.status(keyword.code).json({
					message: keyword.message
				});
				return;
			}
			res.status(200).json(keyword);
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
			const keyword = await this.service.update(name, id);

			if (this.hasError(keyword)) {
				res.status(keyword.code).json({
					message: keyword.message
				});
				return;
			}

			res.status(200).json(keyword);
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
			const keyword = await this.service.delete(String(id));

			if (this.hasError(keyword)) {
				res.status(keyword.code).json({
					message: keyword.message
				});
				return;
			}

			res.status(200).json(keyword);
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
