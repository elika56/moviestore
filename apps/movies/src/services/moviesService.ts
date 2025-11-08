import { MoviesDataProvider } from '../providers/moviesDataProvider.js';
import { Movie } from '../entities/movie.entity.js';
import { OMDbMovieResponse } from '../providers/OMDbMovieResponse.js';
import { MoviesRepository } from '../repositories/movies.repository.js';

export class MoviesService {
    private dataProvider: MoviesDataProvider;
    private repository: MoviesRepository;

    constructor() {
        this.dataProvider = new MoviesDataProvider();
        this.repository = new MoviesRepository();
    }

    async search(params: {
        imdbId?: string;
        query?: string;
        type?: 'movie' | 'series' | 'episode';
        year?: string;
        page?: number;
    }): Promise<Movie> {
        let response: OMDbMovieResponse;

        const { imdbId, query, type, year, page } = params;

        // If search parameters are provided, use searchMovies and get first result
        if (query) {
            const searchResponse = await this.dataProvider.searchMovies(query, type, year, page);
            
            if (!searchResponse.Search || searchResponse.Search.length === 0) {
                throw new Error('No movies found');
            }

            // Get the first result's imdbID and fetch full details
            const firstResult = searchResponse.Search![0]!;
            response = await this.dataProvider.getMovieById(firstResult.imdbID);
        } else if (imdbId) {
            // If imdbId is provided, use getMovieById directly
            response = await this.dataProvider.getMovieById(imdbId);
        } else {
            throw new Error('Either imdbId or query must be provided');
        }
        
        // Convert OMDbMovieResponse to Movie entity (exclude Response and Error)
        const { Response, Error: _Error, ...movieData } = response;
        const movie = Object.assign(new Movie(), movieData);

        return movie;
    }

    /**
     * Create a new movie in the repository
     * @param movie - Movie entity to create
     * @returns Created movie
     */
    async create(movie: Movie): Promise<Movie> {
        return this.repository.create(movie);
    }

    /**
     * Update an existing movie in the repository
     * @param imdbId - IMDb ID of the movie to update
     * @param updates - Partial movie data to update
     * @returns Updated movie
     */
    async update(imdbId: string, updates: Partial<Movie>): Promise<Movie> {
        return this.repository.update(imdbId, updates);
    }

    /**
     * Get a movie by IMDb ID from the repository
     * @param imdbId - IMDb ID to search for
     * @returns Movie if found, undefined otherwise
     */
    async getById(imdbId: string): Promise<Movie | undefined> {
        return this.repository.getById(imdbId);
    }

    /**
     * Query movies from the repository with optional filters
     * @param filters - Optional filters (title, year, genre, type, director, actor)
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
        return this.repository.query(filters);
    }

    /**
     * Delete a movie from the repository
     * @param imdbId - IMDb ID of the movie to delete
     * @returns Deleted movie if found, undefined otherwise
     */
    async delete(imdbId: string): Promise<Movie | undefined> {
        return this.repository.delete(imdbId);
    }
}