import { MoviesDataProvider } from '../providers/moviesDataProvider.js';
import { Movie } from '../entities/movie.entity.js';
import { OMDbMovieResponse } from '../providers/OMDbMovieResponse.js';

export class MoviesService {
    private dataProvider: MoviesDataProvider;

    constructor() {
        this.dataProvider = new MoviesDataProvider();
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
}