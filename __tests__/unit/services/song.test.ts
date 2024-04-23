import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';

import { Song, SongKeyword } from '../../../src/models';
import { mockedSong, mockedSongKeyword } from '../fixtures';
import { ISongService, SongService } from '../../../src/services';
import {
	CreateSong,
	SongListAllParams,
	SongResponse,
	SongsRepositories,
	UpdateSong
} from '../../../src/repositories/types';

const { string, date } = faker;

describe('[Song]', () => {
	let songsRepositories: SongsRepositories = {
		song: {
			listAll: jest.fn<() => Promise<SongResponse[]>>(),
			findOne: jest.fn<() => Promise<any>>(),
			create: jest.fn<() => Promise<any>>(),
			findByPK: jest.fn<() => Promise<any>>(),
			findAllByNameAndAuthor: jest.fn<() => Promise<SongResponse[]>>(),
			updateSong: jest.fn<() => Promise<Song>>(),
			deleteSong: jest.fn<() => Promise<Song>>(),
			createSong: jest.fn<() => Promise<Song>>(),
			destroy: jest.fn<() => Promise<any>>(),
			findAll: jest.fn<() => Promise<any>>(),
			update: jest.fn<() => Promise<any>>()
		},
		songs_keywords: {
			update: jest.fn<() => Promise<any>>(),
			create: jest.fn<() => Promise<any>>(),
			createSongKeyword: jest.fn<() => Promise<any>>(),
			deleteSongKeyword: jest.fn<() => Promise<SongKeyword>>(),
			deleteSongKeywordBySongId: jest.fn<() => Promise<SongKeyword[]>>(),
			destroy: jest.fn<() => Promise<any>>(),
			findAll: jest.fn<() => Promise<any>>(),
			findByPK: jest.fn<() => Promise<any>>(),
			findOne: jest.fn<() => Promise<any>>(),
			listAllBySong: jest.fn<() => Promise<SongKeyword[]>>(),
			updateSongKeyword: jest.fn<() => Promise<SongKeyword[]>>()
		}
	};
	let songService: ISongService;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	beforeAll(() => {
		songService = new SongService(songsRepositories);
	});

	describe('[list]', () => {
		const req: SongListAllParams = {} as SongListAllParams;
		it('should return all songs', async () => {
			jest.spyOn(songsRepositories.song, 'listAll').mockResolvedValueOnce([
				{
					...mockedSong,
					author: string.alpha(8)
				}
			]);

			const response = await songService.list(req);

			const result = expect.arrayContaining([
				{
					id: expect.any(String),
					name: expect.any(String),
					author_id: expect.any(String),
					author: expect.any(String),
					released_at: expect.any(Date),
					created_at: expect.any(Date),
					updated_at: expect.any(Date),
					deleted_at: null
				}
			]);
			expect(response).toStrictEqual(result);
		});
	});

	describe('[create]', () => {
		const req: CreateSong = {
			author_id: string.uuid(),
			name: string.alpha(8),
			released_at: date.anytime().toDateString(),
			keywords_ids: [string.uuid()]
		};

		it('should create song', async () => {
			jest.spyOn(songsRepositories.song, 'findOne').mockResolvedValueOnce(null);
			jest.spyOn(songsRepositories.song, 'create').mockResolvedValueOnce(mockedSong);
			jest.spyOn(songsRepositories.songs_keywords, 'createSongKeyword').mockResolvedValueOnce([
				mockedSongKeyword
			]);

			const response = await songService.create(req);

			const result = {
				id: expect.any(String),
				name: expect.any(String),
				author_id: expect.any(String),
				released_at: expect.any(Date),
				created_at: expect.any(Date),
				updated_at: expect.any(Date),
				deleted_at: null
			};
			expect(response).toStrictEqual(result);
		});

		it('should return already created song for author error', async () => {
			jest.spyOn(songsRepositories.song, 'findOne').mockResolvedValueOnce(mockedSong);

			const response = await songService.create(req);

			const result = {
				code: 409,
				error: true,
				message: 'Already created song for this author!'
			};
			expect(response).toStrictEqual(result);
		});
	});

	describe('[update]', () => {
		const req: UpdateSong = {
			id: string.uuid(),
			author_id: string.uuid(),
			name: string.alpha(8),
			released_at: date.anytime().toDateString(),
			keywords_ids: [string.uuid()]
		};

		it('should update song', async () => {
			jest.spyOn(songsRepositories.song, 'findByPK').mockResolvedValueOnce(mockedSong);
			jest.spyOn(songsRepositories.song, 'findAllByNameAndAuthor').mockResolvedValueOnce([]);
			jest.spyOn(songsRepositories.song, 'updateSong').mockResolvedValueOnce(mockedSong);
			jest.spyOn(songsRepositories.songs_keywords, 'deleteSongKeywordBySongId').mockResolvedValueOnce([
				mockedSongKeyword
			]);
			jest.spyOn(songsRepositories.songs_keywords, 'createSongKeyword').mockResolvedValueOnce([
				mockedSongKeyword
			]);

			const response = await songService.update(req, req.id);

			const result = {
				id: expect.any(String),
				name: expect.any(String),
				author_id: expect.any(String),
				released_at: expect.any(Date),
				created_at: expect.any(Date),
				updated_at: expect.any(Date),
				deleted_at: null
			};
			expect(response).toStrictEqual(result);
		});

		it('should return song not found error', async () => {
			jest.spyOn(songsRepositories.song, 'findByPK').mockResolvedValueOnce(null);

			const response = await songService.update(req, req.id);

			const result = {
				code: 409,
				error: true,
				message: 'Song not found'
			};
			expect(response).toStrictEqual(result);
		});

		it('should return already created song for author error', async () => {
			jest.spyOn(songsRepositories.song, 'findByPK').mockResolvedValueOnce(mockedSong);
			jest.spyOn(songsRepositories.song, 'findAllByNameAndAuthor').mockResolvedValueOnce([mockedSong]);

			const response = await songService.update(req, req.id);

			const result = {
				code: 409,
				error: true,
				message: 'Already created this song for this author!'
			};
			expect(response).toStrictEqual(result);
		});
	});

	describe('[update]', () => {
		const req: string = string.uuid();

		it('should delete song', async () => {
			jest.spyOn(songsRepositories.song, 'findByPK').mockResolvedValueOnce(mockedSong);
			jest.spyOn(songsRepositories.song, 'deleteSong').mockResolvedValueOnce({
				...mockedSong,
				deleted_at: date.anytime()
			});

			const response = await songService.delete(req);

			const result = {
				id: expect.any(String),
				name: expect.any(String),
				author_id: expect.any(String),
				released_at: expect.any(Date),
				created_at: expect.any(Date),
				updated_at: expect.any(Date),
				deleted_at: expect.any(Date)
			};
			expect(response).toStrictEqual(result);
		});

		it('should return song not found error', async () => {
			jest.spyOn(songsRepositories.song, 'findByPK').mockResolvedValueOnce(null);

			const response = await songService.delete(req);

			const result = {
				code: 409,
				error: true,
				message: 'Song not found'
			};
			expect(response).toStrictEqual(result);
		});
	});
});
