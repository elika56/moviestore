import 'dotenv/config';
import { describe, it, expect, beforeAll } from 'vitest';
import { MoviesService } from './moviesService.js';
import { Movie } from '../entities/movie.entity.js';

describe('MoviesService', () => {
    let service: MoviesService;
    const testImdbId = 'tt3896198';

    beforeAll(() => {
        service = new MoviesService();
    });

    describe('search', () => {
        it('should return movie entity for IMDb ID tt3896198', async () => {
            const result = await service.search({ imdbId: testImdbId });

            expect(result).toBeInstanceOf(Movie);
            expect(result.imdbID).toBe(testImdbId);
            expect(result.Title).toBeDefined();
            expect(result.Year).toBeDefined();
            expect(result.Plot).toBeDefined();
            expect(result.Director).toBeDefined();
            expect(result.Actors).toBeDefined();
            
            // Verify Response and Error fields are not present (they should be excluded)
            expect((result as any).Response).toBeUndefined();
            expect((result as any).Error).toBeUndefined();
        });

        it('should return movie entity with all required fields', async () => {
            const result = await service.search({ imdbId: testImdbId });

            expect(result.Title).toBeDefined();
            expect(result.Year).toBeDefined();
            expect(result.Rated).toBeDefined();
            expect(result.Released).toBeDefined();
            expect(result.Runtime).toBeDefined();
            expect(result.Genre).toBeDefined();
            expect(result.Director).toBeDefined();
            expect(result.Writer).toBeDefined();
            expect(result.Actors).toBeDefined();
            expect(result.Plot).toBeDefined();
            expect(result.Language).toBeDefined();
            expect(result.Country).toBeDefined();
            expect(result.Poster).toBeDefined();
            expect(result.Ratings).toBeDefined();
            expect(result.imdbRating).toBeDefined();
            expect(result.imdbVotes).toBeDefined();
        });
    });
});

