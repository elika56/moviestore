import { z } from 'zod';
import type { OMDbRating } from '../providers/OMDbMovieResponse.js';

const OMDbRatingSchema = z.object({
    Source: z.string().describe('Rating source'),
    Value: z.string().describe('Rating value')
});

export const MovieSchema = z.object({
    Title: z.string().describe('Movie title'),
    Year: z.string().describe('Release year'),
    Rated: z.string().describe('Content rating'),
    Released: z.string().describe('Release date'),
    Runtime: z.string().describe('Runtime duration'),
    Genre: z.string().describe('Movie genres'),
    Director: z.string().describe('Director name'),
    Writer: z.string().describe('Writer names'),
    Actors: z.string().describe('Main actors'),
    Plot: z.string().describe('Movie plot summary'),
    Language: z.string().describe('Language'),
    Country: z.string().describe('Country of origin'),
    Awards: z.string().describe('Awards information'),
    Poster: z.string().url().describe('Poster image URL'),
    Ratings: z.array(OMDbRatingSchema).describe('Movie ratings from various sources'),
    Metascore: z.string().describe('Metascore rating'),
    imdbRating: z.string().describe('IMDb rating'),
    imdbVotes: z.string().describe('Number of IMDb votes'),
    imdbID: z.string().describe('IMDb ID'),
    Type: z.enum(['movie', 'series', 'episode']).describe('Content type'),
    DVD: z.string().describe('DVD release date'),
    BoxOffice: z.string().describe('Box office earnings'),
    Production: z.string().describe('Production company'),
    Website: z.string().describe('Official website URL')
});

export class Movie {
    Title!: string;
    Year!: string;
    Rated!: string;
    Released!: string;
    Runtime!: string;
    Genre!: string;
    Director!: string;
    Writer!: string;
    Actors!: string;
    Plot!: string;
    Language!: string;
    Country!: string;
    Awards!: string;
    Poster!: string;
    Ratings!: OMDbRating[];
    Metascore!: string;
    imdbRating!: string;
    imdbVotes!: string;
    imdbID!: string;
    Type!: 'movie' | 'series' | 'episode';
    DVD!: string;
    BoxOffice!: string;
    Production!: string;
    Website!: string;
}
