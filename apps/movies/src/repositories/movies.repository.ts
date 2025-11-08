import 'dotenv/config';
import { Movie } from '../entities/movie.entity.js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

interface MoviesDatabase {
    movies: Movie[];
}

export class MoviesRepository {
    private getDbFile(): string {
        const dbPath = process.env.MOVIES_DB_PATH || '';
        return join(process.cwd(), dbPath);
    }

    private ensureDbFile(): void {
        const dbFile = this.getDbFile();
        const dbDir = dirname(dbFile);
        if (!existsSync(dbDir)) {
            mkdirSync(dbDir, { recursive: true });
        }
        
        if (!existsSync(dbFile)) {
            const initialData: MoviesDatabase = { movies: [] };
            writeFileSync(dbFile, JSON.stringify(initialData, null, 2), 'utf-8');
        }
    }

    private readDatabase(): MoviesDatabase {
        this.ensureDbFile();
        const dbFile = this.getDbFile();
        try {
            const data = readFileSync(dbFile, 'utf-8');
            return JSON.parse(data) as MoviesDatabase;
        } catch (error) {
            // If file is corrupted or empty, return empty database
            return { movies: [] };
        }
    }

    private writeDatabase(data: MoviesDatabase): void {
        this.ensureDbFile();
        const dbFile = this.getDbFile();
        writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf-8');
    }

    /**
     * Create a new movie
     * @param movie - Movie entity to create
     * @returns Created movie with assigned ID
     */
    async create(movie: Movie): Promise<Movie> {
        const db = this.readDatabase();
        
        // Check if movie with same imdbID already exists
        if (movie.imdbID && db.movies.some(m => m.imdbID === movie.imdbID)) {
            throw new Error(`Movie with imdbID ${movie.imdbID} already exists`);
        }

        // If no imdbID, generate a temporary one (or you could throw an error)
        if (!movie.imdbID) {
            throw new Error('Movie must have an imdbID');
        }

        db.movies.push(movie);
        this.writeDatabase(db);
        
        return movie;
    }

    /**
     * Update an existing movie
     * @param imdbId - IMDb ID of the movie to update
     * @param updates - Partial movie data to update
     * @returns Updated movie
     */
    async update(imdbId: string, updates: Partial<Movie>): Promise<Movie> {
        const db = this.readDatabase();
        const index = db.movies.findIndex(m => m.imdbID === imdbId);
        
        if (index === -1) {
            throw new Error(`Movie with imdbID ${imdbId} not found`);
        }

        // Don't allow changing imdbID
        if (updates.imdbID && updates.imdbID !== imdbId) {
            throw new Error('Cannot change imdbID');
        }

        db.movies[index] = { ...db.movies[index], ...updates } as Movie;
        this.writeDatabase(db);
        
        return db.movies[index]!;
    }

    /**
     * Delete a movie
     * @param imdbId - IMDb ID of the movie to delete
     * @returns Deleted movie if found, undefined otherwise
     */
    async delete(imdbId: string): Promise<Movie | undefined> {
        const db = this.readDatabase();
        const index = db.movies.findIndex(m => m.imdbID === imdbId);
        
        if (index === -1) {
            return undefined;
        }

        const deletedMovie = db.movies[index];
        db.movies.splice(index, 1);
        this.writeDatabase(db);
        
        return deletedMovie;
    }

    /**
     * Get a movie by IMDb ID
     * @param imdbId - IMDb ID to search for
     * @returns Movie if found, undefined otherwise
     */
    async getById(imdbId: string): Promise<Movie | undefined> {
        const db = this.readDatabase();
        return db.movies.find(m => m.imdbID === imdbId);
    }

    /**
     * Query movies with optional filters
     * @param filters - Optional filters (title, year, genre, type, etc.)
     * @returns Array of matching movies
     */
    async query(filters?: {
        title?: string;
        year?: string;
        genre?: string;
        type?: string;
        director?: string;
        actor?: string;
    }): Promise<Movie[]> {
        const db = this.readDatabase();
        let results = [...db.movies];

        if (!filters) {
            return results;
        }

        // Filter by title (case-insensitive partial match)
        if (filters.title) {
            const titleLower = filters.title.toLowerCase();
            results = results.filter(m => 
                m.Title.toLowerCase().includes(titleLower)
            );
        }

        // Filter by year (exact match)
        if (filters.year) {
            results = results.filter(m => m.Year === filters.year);
        }

        // Filter by genre (case-insensitive partial match)
        if (filters.genre) {
            const genreLower = filters.genre.toLowerCase();
            results = results.filter(m => 
                m.Genre.toLowerCase().includes(genreLower)
            );
        }

        // Filter by type (exact match)
        if (filters.type) {
            results = results.filter(m => m.Type === filters.type);
        }

        // Filter by director (case-insensitive partial match)
        if (filters.director) {
            const directorLower = filters.director.toLowerCase();
            results = results.filter(m => 
                m.Director.toLowerCase().includes(directorLower)
            );
        }

        // Filter by actor (case-insensitive partial match)
        if (filters.actor) {
            const actorLower = filters.actor.toLowerCase();
            results = results.filter(m => 
                m.Actors.toLowerCase().includes(actorLower)
            );
        }

        return results;
    }
}

