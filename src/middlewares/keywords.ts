import { ValidationChain, check, validationResult } from 'express-validator';
import type { NextFunction, Request, Response } from 'express';

import { BaseMiddleware } from './baseMiddleware';

export class KeywordMiddleware extends BaseMiddleware {
	create = async (req: Request, res: Response, next: NextFunction) => {
		await this.validatePayload(req, this.generateCreateValidator);
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			const errorMessages = errors.array().map((error) => error.msg);

			return res.status(400).json({
				errors: errorMessages
			});
		}
		next();
	};

	list = async (req: Request, res: Response, next: NextFunction) => {
		await this.validatePayload(req, this.generateListValidator);
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			const errorMessages = errors.array().map((error) => error.msg);

			return res.status(400).json({
				errors: errorMessages
			});
		}
		next();
	};

	listBySong = async (req: Request, res: Response, next: NextFunction) => {
		await this.validatePayload(req, this.generateListBySongValidator);
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			const errorMessages = errors.array().map((error) => error.msg);

			return res.status(400).json({
				errors: errorMessages
			});
		}
		next();
	};

	update = async (req: Request, res: Response, next: NextFunction) => {
		await this.validatePayload(req, this.generateUpdateValidator);
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			const errorMessages = errors.array().map((error) => error.msg);

			return res.status(400).json({
				errors: errorMessages
			});
		}
		next();
	};

	delete = async (req: Request, res: Response, next: NextFunction) => {
		await this.validatePayload(req, this.generateDeleteValidator);
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			const errorMessages = errors.array().map((error) => error.msg);

			return res.status(400).json({
				errors: errorMessages
			});
		}
		next();
	};

	private generateCreateValidator = (): ValidationChain[] => {
		const name_validator = this.validateExistingProperty({
			property: 'name',
			customMessage: 'Property `name` cannot be empty'
		});

		return [name_validator];
	};

	private generateUpdateValidator = (): ValidationChain[] => {
		const name_validator = this.validateExistingProperty({
			property: 'name',
			customMessage: 'Property `name` cannot be empty'
		});
		const id_validator = this.validateExistingProperty({
			property: 'id',
			customMessage: 'Property `id` cannot be empty'
		});

		return [name_validator, id_validator];
	};

	private generateDeleteValidator = (): ValidationChain[] => {
		const id_validator = this.validateExistingProperty({
			property: 'id',
			customMessage: 'Property `id` cannot be empty'
		});

		return [id_validator];
	};

	private generateListValidator = (): ValidationChain[] => {
		const name_validator = check('name').trim();

		return [name_validator];
	};

	private generateListBySongValidator = (): ValidationChain[] => {
		const song_id_validator = this.validateExistingProperty({
			property: 'song_id',
			customMessage: 'Property `song_id` cannot be empty'
		});

		return [song_id_validator];
	};
}
