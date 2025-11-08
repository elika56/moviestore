export class OMDbSearchItem {
    Title!: string;
    Year!: string;
    imdbID!: string;
    Type!: string;
    Poster!: string;
}

export class OMDbSearchResponse {
    Search?: OMDbSearchItem[];
    totalResults?: string;
    Response!: string;
    Error?: string;
}

