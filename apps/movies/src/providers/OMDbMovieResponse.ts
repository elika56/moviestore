export class OMDbRating {
    Source: string;
    Value: string;

    constructor(data: { Source: string; Value: string }) {
        this.Source = data.Source;
        this.Value = data.Value;
    }
}

export class OMDbMovieResponse {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: OMDbRating[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    DVD: string;
    BoxOffice: string;
    Production: string;
    Website: string;
    Response: string;
    Error?: string;

    constructor(data: {
        Title: string;
        Year: string;
        Rated: string;
        Released: string;
        Runtime: string;
        Genre: string;
        Director: string;
        Writer: string;
        Actors: string;
        Plot: string;
        Language: string;
        Country: string;
        Awards: string;
        Poster: string;
        Ratings: Array<{ Source: string; Value: string }>;
        Metascore: string;
        imdbRating: string;
        imdbVotes: string;
        imdbID: string;
        Type: string;
        DVD: string;
        BoxOffice: string;
        Production: string;
        Website: string;
        Response: string;
        Error?: string;
    }) {
        this.Title = data.Title;
        this.Year = data.Year;
        this.Rated = data.Rated;
        this.Released = data.Released;
        this.Runtime = data.Runtime;
        this.Genre = data.Genre;
        this.Director = data.Director;
        this.Writer = data.Writer;
        this.Actors = data.Actors;
        this.Plot = data.Plot;
        this.Language = data.Language;
        this.Country = data.Country;
        this.Awards = data.Awards;
        this.Poster = data.Poster;
        this.Ratings = data.Ratings?.map(rating => new OMDbRating(rating)) || [];
        this.Metascore = data.Metascore;
        this.imdbRating = data.imdbRating;
        this.imdbVotes = data.imdbVotes;
        this.imdbID = data.imdbID;
        this.Type = data.Type;
        this.DVD = data.DVD;
        this.BoxOffice = data.BoxOffice;
        this.Production = data.Production;
        this.Website = data.Website;
        this.Response = data.Response;
        this.Error = data.Error;
    }
}

