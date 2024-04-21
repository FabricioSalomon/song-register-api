import { faker } from '@faker-js/faker';

import { Author } from '../../../src/models';

export const mockedAuthor: Author = {
	id: faker.string.uuid(),
	name: faker.string.alpha(),
	created_at: faker.date.anytime(),
	updated_at: faker.date.anytime(),
	deleted_at: null
};
