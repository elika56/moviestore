export class OMDbSearchItem {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;

    constructor(data: {
        Title: string;
        Year: string;
        imdbID: string;
        Type: string;
        Poster: string;
    }) {
        this.Title = data.Title;
        this.Year = data.Year;
        this.imdbID = data.imdbID;
        this.Type = data.Type;
        this.Poster = data.Poster;
    }
}

export class OMDbSearchResponse {
    Search?: OMDbSearchItem[];
    totalResults?: string;
    Response: string;
    Error?: string;

    constructor(data: {
        Search?: Array<{
            Title: string;
            Year: string;
            imdbID: string;
            Type: string;
            Poster: string;
        }>;
        totalResults?: string;
        Response: string;
        Error?: string;
    }) {
        this.Search = data.Search?.map(item => new OMDbSearchItem(item));
        this.totalResults = data.totalResults;
        this.Response = data.Response;
        this.Error = data.Error;
    }
}

