import 'dotenv/config';
import { describe, it, expect, beforeAll } from 'vitest';
import { MoviesDataProvider } from './moviesDataProvider.js';
import { OMDbMovieResponse } from './OMDbMovieResponse.js';

describe('MoviesDataProvider', () => {
    let provider: MoviesDataProvider;
    const testImdbId = 'tt3896198';

    beforeAll(() => {
        const baseUrl = process.env.IMDB_URL || '';
        const apiKey = process.env.IMDB_API_KEY || '';
        
        if (!apiKey) {
            throw new Error('IMDB_API_KEY environment variable is required for tests. Make sure .env file exists and contains IMDB_API_KEY.');
        }

        provider = new MoviesDataProvider(baseUrl, apiKey);
    });

    describe('getMovieById', () => {
        it('should return movie details for IMDb ID tt3896198', async () => {
            const result = await provider.getMovieById(testImdbId);

            expect(result).toBeInstanceOf(OMDbMovieResponse);
            expect(result.imdbID).toBe(testImdbId);
            expect(result.Response).toBe('True');
            expect(result.Title).toBeDefined();
            expect(result.Year).toBeDefined();
            expect(result.Plot).toBeDefined();
            expect(result.Director).toBeDefined();
            expect(result.Actors).toBeDefined();
        });

        it('should return full plot when plot parameter is "full"', async () => {
            const result = await provider.getMovieById(testImdbId, 'full');

            expect(result).toBeInstanceOf(OMDbMovieResponse);
            expect(result.imdbID).toBe(testImdbId);
            expect(result.Response).toBe('True');
            expect(result.Plot).toBeDefined();
            expect(result.Plot.length).toBeGreaterThan(0);
        });

        it('should return short plot by default', async () => {
            const result = await provider.getMovieById(testImdbId);

            expect(result).toBeInstanceOf(OMDbMovieResponse);
            expect(result.imdbID).toBe(testImdbId);
            expect(result.Response).toBe('True');
            expect(result.Plot).toBeDefined();
        });
    });
});

