import 'dotenv/config';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MoviesService } from './moviesService.js';
import { MoviesRepository } from '../repositories/movies.repository.js';
import { Movie } from '../entities/movie.entity.js';
import { readFileSync, writeFileSync, existsSync, unlinkSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

// Use a test database file (relative path)
const TEST_DB_FILE = 'apps/movies/data/movies.service.test.json';

const testMovieData: Movie = {
    Title: 'Guardians of the Galaxy Vol. 2',
    Year: '2017',
    Rated: 'PG-13',
    Released: '05 May 2017',
    Runtime: '136 min',
    Genre: 'Action, Adventure, Comedy',
    Director: 'James Gunn',
    Writer: 'James Gunn, Dan Abnett, Andy Lanning',
    Actors: 'Chris Pratt, Zoe Saldaña, Dave Bautista',
    Plot: 'The Guardians struggle to keep together as a team while dealing with their personal family issues, notably Star-Lord\'s encounter with his father, the ambitious celestial being Ego.',
    Language: 'English',
    Country: 'United States',
    Awards: 'Nominated for 1 Oscar. 15 wins & 60 nominations total',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNWE5MGI3MDctMmU5Ni00YzI2LWEzMTQtZGIyZDA5MzQzNDBhXkEyXkFqcGc@._V1_SX300.jpg',
    Ratings: [
        {
            Source: 'Internet Movie Database',
            Value: '7.6/10'
        },
        {
            Source: 'Rotten Tomatoes',
            Value: '85%'
        },
        {
            Source: 'Metacritic',
            Value: '67/100'
        }
    ],
    Metascore: '67',
    imdbRating: '7.6',
    imdbVotes: '809,834',
    imdbID: 'tt3896198',
    Type: 'movie',
    DVD: 'N/A',
    BoxOffice: '$389,813,101',
    Production: 'N/A',
    Website: 'N/A'
};

describe('MoviesService', () => {
    let service: MoviesService;
    const testImdbId = 'tt3896198';
    const originalEnv = process.env.MOVIES_DB_PATH;

    beforeEach(() => {
        // Set test database path
        process.env.MOVIES_DB_PATH = TEST_DB_FILE;
        
        // Clean up test database if it exists
        const fullPath = join(process.cwd(), TEST_DB_FILE);
        if (existsSync(fullPath)) {
            unlinkSync(fullPath);
        }
        
        // Ensure directory exists
        const dbDir = dirname(fullPath);
        if (!existsSync(dbDir)) {
            mkdirSync(dbDir, { recursive: true });
        }
        
        // Initialize empty database
        writeFileSync(fullPath, JSON.stringify({ movies: [] }, null, 2), 'utf-8');
        
        // Create repository and service with proper dependency injection
        const repository = new MoviesRepository();
        service = new MoviesService(repository);
    });

    afterEach(() => {
        // Clean up test database
        const fullPath = join(process.cwd(), TEST_DB_FILE);
        if (existsSync(fullPath)) {
            unlinkSync(fullPath);
        }
        
        // Restore original env
        if (originalEnv) {
            process.env.MOVIES_DB_PATH = originalEnv;
        } else {
            delete process.env.MOVIES_DB_PATH;
        }
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

    describe('create', () => {
        it('should create a new movie in the repository', async () => {
            const movie = Object.assign(new Movie(), testMovieData);
            const result = await service.create(movie);

            expect(result).toBeDefined();
            expect(result.imdbID).toBe('tt3896198');
            expect(result.Title).toBe('Guardians of the Galaxy Vol. 2');
            expect(result.Director).toBe('James Gunn');
        });
    });

    describe('update', () => {
        it('should update an existing movie in the repository', async () => {
            // First create the movie
            const movie = Object.assign(new Movie(), testMovieData);
            await service.create(movie);

            // Update the movie
            const updates = {
                Rated: 'PG',
                Runtime: '150 min'
            };
            const result = await service.update('tt3896198', updates);

            expect(result).toBeDefined();
            expect(result.Rated).toBe('PG');
            expect(result.Runtime).toBe('150 min');
            expect(result.Title).toBe('Guardians of the Galaxy Vol. 2');
        });
    });

    describe('getById', () => {
        it('should get a movie by IMDb ID from the repository', async () => {
            // First create the movie
            const movie = Object.assign(new Movie(), testMovieData);
            await service.create(movie);

            // Then retrieve it
            const result = await service.getById('tt3896198');

            expect(result).toBeDefined();
            expect(result?.imdbID).toBe('tt3896198');
            expect(result?.Title).toBe('Guardians of the Galaxy Vol. 2');
            expect(result?.Director).toBe('James Gunn');
        });
    });

    describe('query', () => {
        it('should query movies from the repository with filters', async () => {
            // First create the movie
            const movie = Object.assign(new Movie(), testMovieData);
            await service.create(movie);

            // Query by title
            const results = await service.query({ title: 'Guardians' });

            expect(results.length).toBeGreaterThan(0);
            expect(results[0]?.Title).toContain('Guardians');
            expect(results[0]?.imdbID).toBe('tt3896198');
        });
    });

    describe('delete', () => {
        it('should delete a movie from the repository and return the deleted movie', async () => {
            // First create the movie
            const movie = Object.assign(new Movie(), testMovieData);
            await service.create(movie);

            // Delete the movie
            const deletedMovie = await service.delete('tt3896198');

            expect(deletedMovie).toBeDefined();
            expect(deletedMovie?.imdbID).toBe('tt3896198');
            expect(deletedMovie?.Title).toBe('Guardians of the Galaxy Vol. 2');

            // Verify it's deleted
            const result = await service.getById('tt3896198');
            expect(result).toBeUndefined();
        });
    });
});

