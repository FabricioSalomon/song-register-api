import { Request, Response } from 'express';

import { ISongService } from '../services';
import { APIError } from '../repositories/types';

export interface ISongController {
	list(req: Request, res: Response): Promise<void>;
	create(req: Request, res: Response): Promise<void>;
	update(req: Request, res: Response): Promise<void>;
	delete(req: Request, res: Response): Promise<void>;
}

export class SongController implements ISongController {
	constructor(private service: ISongService) {}

	list = async (req: Request, res: Response) => {
		try {
			const filters = {
				name: req.query?.name as string,
				keyword: req.query?.keyword as string,
				author_id: req.query?.author_id as string,
				released_at_end: req.query?.released_at_end as string,
				released_at_start: req.query?.released_at_start as string
			};
			const song = await this.service.list(filters);

			res.status(200).json(song);
		} catch (error) {
			console.error(error);
			res.status(500).json({
				message: 'Internal server error'
			});
		}
	};

	create = async (req: Request, res: Response) => {
		try {
			const song = await this.service.create(req.body);

			if (this.hasError(song)) {
				res.status(song.code).json({
					message: song.message
				});
				return;
			}

			res.status(200).json(song);
		} catch (error) {
			console.error(error);
			res.status(500).json({
				message: 'Internal server error'
			});
		}
	};

	update = async (req: Request, res: Response) => {
		try {
			const song = await this.service.update(req.body, req.body.id);

			if (this.hasError(song)) {
				res.status(song.code).json({
					message: song.message
				});
				return;
			}

			res.status(200).json(song);
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
			const song = await this.service.delete(String(id));

			if (this.hasError(song)) {
				res.status(song.code).json({
					message: song.message
				});
				return;
			}

			res.status(200).json(song);
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
