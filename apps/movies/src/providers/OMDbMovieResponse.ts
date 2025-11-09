import { ApiProperty } from '@nestjs/swagger';

export class OMDbRating {
    @ApiProperty({ example: 'Internet Movie Database', description: 'Rating source' })
    Source!: string;
    
    @ApiProperty({ example: '7.6/10', description: 'Rating value' })
    Value!: string;
}

export class OMDbMovieResponse {
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
    Type!: string;
    DVD!: string;
    BoxOffice!: string;
    Production!: string;
    Website!: string;
    Response!: string;
    Error?: string;
}

