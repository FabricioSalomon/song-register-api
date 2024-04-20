import { ValidationChain, validationResult } from 'express-validator';
import type { NextFunction, Request, Response } from 'express';

import { BaseMiddleware } from './baseMiddleware';

export class AuthorMiddleware extends BaseMiddleware {
	teste = async (req: Request, res: Response, next: NextFunction) => {
		await this.validatePayload(req, this.generateValidator);
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			const errorMessages = errors.array().map((error) => error.msg);

			return res.status(400).json({
				errors: errorMessages
			});
		}
		next();
	};

	private generateValidator = (): ValidationChain[] => {
		const name_validator = this.validateExistingProperty({
			property: 'name',
			customMessage: 'Test'
		});

		return [name_validator];
	};
}
