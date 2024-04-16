import { jest } from '@jest/globals';

describe('[Test]', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('[test repository]', () => {
		it('should', async () => {
			expect(1).toBe(1);
		});
	});
});
