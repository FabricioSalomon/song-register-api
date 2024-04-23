import { faker } from '@faker-js/faker';

import { Song } from '../../../src/models';

export const mockedSong: Song = {
	id: faker.string.uuid(),
	name: faker.string.alpha(),
	released_at: faker.date.anytime(),
	author_id: faker.string.uuid(),
	created_at: faker.date.anytime(),
	updated_at: faker.date.anytime(),
	deleted_at: null
};
