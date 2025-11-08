import 'dotenv/config';
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { OMDbSearchResponse } from './OMDbSearchResponse.js';
import { OMDbMovieResponse } from './OMDbMovieResponse.js';

export class MoviesDataProvider {

    private axiosInstance: AxiosInstance;

    constructor(private readonly baseUrl: string, private readonly apiKey: string) {
        this.baseUrl = process.env.IMDB_URL || '';
        this.apiKey = process.env.IMDB_API_KEY || '';

        this.axiosInstance = axios.create({
            baseURL: baseUrl,
            params: {
                apikey: apiKey,
                r: 'json'
            }
        });
    }

    /**
     * Search for movies by title
     * @param query - Movie title to search for
     * @param type - Type of result (movie, series, episode)
     * @param year - Year of release
     * @param page - Page number (1-100)
     */
    async searchMovies(
        query: string,
        type?: 'movie' | 'series' | 'episode',
        year?: string,
        page?: number
    ): Promise<OMDbSearchResponse> {
        const params: Record<string, string | number> = {
            s: query
        };

        if (type) params.type = type;
        if (year) params.y = year;
        if (page) params.page = page;

        const response = await this.axiosInstance.get('', { params });
        return response.data as OMDbSearchResponse;
    }

    /**
     * Get movie details by IMDb ID
     * @param imdbId - IMDb ID (e.g., tt1285016)
     * @param plot - Return short or full plot (default: short)
     */
    async getMovieById(imdbId: string, plot: 'short' | 'full' = 'short'): Promise<OMDbMovieResponse> {
        const response = await this.axiosInstance.get('', {
            params: {
                i: imdbId,
                plot
            }
        });
        return response.data as OMDbMovieResponse;
    }

    /**
     * Get movie details by title
     * @param title - Movie title
     * @param year - Year of release
     * @param plot - Return short or full plot (default: short)
     */
    async getMovieByTitle(
        title: string,
        year?: string,
        plot: 'short' | 'full' = 'short'
    ): Promise<OMDbMovieResponse> {
        const params: Record<string, string> = {
            t: title,
            plot
        };

        if (year) params.y = year;

        const response = await this.axiosInstance.get('', { params });
        return response.data as OMDbMovieResponse;
    }
}