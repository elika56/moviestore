import { Injectable, Inject } from '@nestjs/common';
import { MoviesDataProvider } from '../providers/moviesDataProvider.js';
import { MoviesRepository } from '../repositories/movies.repository.js';
import { Movie } from '../entities/movie.entity.js';
import { OMDbMovieResponse } from '../providers/OMDbMovieResponse.js';

@Injectable()
export class MoviesService {
    private dataProvider: MoviesDataProvider;
    private repository: MoviesRepository;

    constructor(@Inject(MoviesRepository) repository: MoviesRepository) {
        this.repository = repository;
        this.dataProvider = new MoviesDataProvider();
    }

    async search(params: {
        imdbId?: string|undefined;
        query?: string|undefined;
        type?: 'movie' | 'series' | 'episode'|undefined;
        year?: string|undefined;
        page?: number|undefined;
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

    async create(movie: Movie): Promise<Movie> {
        return await this.repository.create(movie);
    }

    async update(imdbId: string, updates: Partial<Movie>): Promise<Movie> {
        return await this.repository.update(imdbId, updates);
    }

    async getById(imdbId: string): Promise<Movie | undefined> {
        return await this.repository.getById(imdbId);
    }

    async delete(imdbId: string): Promise<Movie | undefined> {
        return await this.repository.delete(imdbId);
    }
}