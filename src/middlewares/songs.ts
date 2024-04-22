import { ValidationChain, check, validationResult } from 'express-validator';
import type { NextFunction, Request, Response } from 'express';

import { BaseMiddleware } from './baseMiddleware';

export class SongMiddleware extends BaseMiddleware {
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
		const author_id_validator = this.validateExistingProperty({
			property: 'author_id',
			customMessage: 'Property `author_id` cannot be empty'
		});
		const keywords_ids_validator = this.validateExistingProperty({
			property: 'keywords_ids',
			customMessage: 'Property `keywords_ids` cannot be empty'
		});
		const released_at_validator = this.validateExistingProperty({
			property: 'released_at',
			customMessage: 'Property `released_at` cannot be empty'
		});

		return [name_validator, author_id_validator, keywords_ids_validator, released_at_validator];
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
		const keyword_validator = check('keyword').trim();
		const author_id_validator = check('author_id').trim();
		const released_at_end_validator = check('released_at_end').trim();
		const released_at_start_validator = check('released_at_start').trim();

		return [
			name_validator,
			keyword_validator,
			author_id_validator,
			released_at_end_validator,
			released_at_start_validator
		];
	};
}
