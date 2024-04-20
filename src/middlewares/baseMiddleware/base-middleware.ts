import { type Request } from 'express';
import { type ValidationChain, check } from 'express-validator';

import { ExistingProperty } from './types';

export interface IBaseMiddleware {
	validatePayload(req: Request, validator: () => ValidationChain[]): Promise<void>;
	validateExistingProperty(params: ExistingProperty): ValidationChain;
}

export class BaseMiddleware implements IBaseMiddleware {
	validatePayload = async (req: Request, validator: () => ValidationChain[]): Promise<void> => {
		const validations = validator();
		await Promise.all(validations.map((validation) => validation.run(req)));
	};

	validateExistingProperty = ({ property, customMessage }: ExistingProperty): ValidationChain => {
		const message = customMessage ?? `The ${property} is missing`;
		return check(property).exists().withMessage(message);
	};
}
