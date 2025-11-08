import 'dotenv/config';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MoviesRepository } from './movies.repository.js';
import { Movie } from '../entities/movie.entity.js';
import { readFileSync, writeFileSync, existsSync, unlinkSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

// Use a test database file (relative path)
const TEST_DB_FILE = 'apps/movies/data/movies.test.json';

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

describe('MoviesRepository', () => {
    let repository: MoviesRepository;
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
        
        repository = new MoviesRepository();
    });

    afterEach(() => {
        // Clean up test database (comment out to keep file for inspection)
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

    describe('create', () => {
        it('should create a new movie', async () => {
            const movie = Object.assign(new Movie(), testMovieData);
            const result = await repository.create(movie);

            expect(result).toBeDefined();
            expect(result.imdbID).toBe('tt3896198');
            expect(result.Title).toBe('Guardians of the Galaxy Vol. 2');
            expect(result.Year).toBe('2017');
            expect(result.Director).toBe('James Gunn');
        });
    });

    describe('getById', () => {
        it('should get a movie by IMDb ID', async () => {
            // First create the movie
            const movie = Object.assign(new Movie(), testMovieData);
            await repository.create(movie);

            // Then retrieve it
            const result = await repository.getById('tt3896198');

            expect(result).toBeDefined();
            expect(result?.imdbID).toBe('tt3896198');
            expect(result?.Title).toBe('Guardians of the Galaxy Vol. 2');
            expect(result?.Director).toBe('James Gunn');
        });
    });

    describe('update', () => {
        it('should update an existing movie', async () => {
            // First create the movie
            const movie = Object.assign(new Movie(), testMovieData);
            await repository.create(movie);

            // Update the movie
            const updates = {
                Rated: 'PG',
                Runtime: '150 min'
            };
            const result = await repository.update('tt3896198', updates);

            expect(result).toBeDefined();
            expect(result.Rated).toBe('PG');
            expect(result.Runtime).toBe('150 min');
            expect(result.Title).toBe('Guardians of the Galaxy Vol. 2'); // Original field should remain
            expect(result.imdbID).toBe('tt3896198'); // imdbID should not change
        });
    });

    describe('delete', () => {
        it('should delete a movie and return the deleted movie', async () => {
            // First create the movie
            const movie = Object.assign(new Movie(), testMovieData);
            await repository.create(movie);

            // Delete the movie
            const deletedMovie = await repository.delete('tt3896198');

            expect(deletedMovie).toBeDefined();
            expect(deletedMovie?.imdbID).toBe('tt3896198');
            expect(deletedMovie?.Title).toBe('Guardians of the Galaxy Vol. 2');

            // Verify it's deleted
            const result = await repository.getById('tt3896198');
            expect(result).toBeUndefined();
        });
    });

    describe('query', () => {
        it('should query movies with filters', async () => {
            // First create the movie
            const movie = Object.assign(new Movie(), testMovieData);
            await repository.create(movie);

            // Query by title
            const resultsByTitle = await repository.query({ title: 'Guardians' });
            expect(resultsByTitle.length).toBeGreaterThan(0);
            expect(resultsByTitle[0]?.Title).toContain('Guardians');

            // Query by year
            const resultsByYear = await repository.query({ year: '2017' });
            expect(resultsByYear.length).toBeGreaterThan(0);
            expect(resultsByYear[0]?.Year).toBe('2017');

            // Query by genre
            const resultsByGenre = await repository.query({ genre: 'Action' });
            expect(resultsByGenre.length).toBeGreaterThan(0);
            expect(resultsByGenre[0]?.Genre).toContain('Action');

            // Query by director
            const resultsByDirector = await repository.query({ director: 'James Gunn' });
            expect(resultsByDirector.length).toBeGreaterThan(0);
            expect(resultsByDirector[0]?.Director).toContain('James Gunn');

            // Query by type
            const resultsByType = await repository.query({ type: 'movie' });
            expect(resultsByType.length).toBeGreaterThan(0);
            expect(resultsByType[0]?.Type).toBe('movie');

            // Query by actor
            const resultsByActor = await repository.query({ actor: 'Chris Pratt' });
            expect(resultsByActor.length).toBeGreaterThan(0);
            expect(resultsByActor[0]?.Actors).toContain('Chris Pratt');
        });
    });
});

