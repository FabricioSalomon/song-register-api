import { faker } from '@faker-js/faker';

import { Keyword } from '../../../src/models';

export const mockedKeyword: Keyword = {
	id: faker.string.uuid(),
	name: faker.string.alpha(),
	created_at: faker.date.anytime(),
	updated_at: faker.date.anytime(),
	deleted_at: null
};
