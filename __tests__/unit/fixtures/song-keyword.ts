import { faker } from '@faker-js/faker';

import { Keyword, SongKeyword } from '../../../src/models';

export const mockedSongKeyword: SongKeyword = {
	id: faker.string.uuid(),
	song_id: faker.string.uuid(),
	keyword_id: faker.string.uuid(),
	created_at: faker.date.anytime(),
	updated_at: faker.date.anytime(),
	deleted_at: null
};
