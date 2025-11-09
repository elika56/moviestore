import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus, NotFoundException, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { MoviesService } from './services/moviesService.js';
import { Movie } from './entities/movie.entity.js';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
    constructor(@Inject(MoviesService) private readonly moviesService: MoviesService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new movie' })
    @ApiBody({ type: () => Movie })
    @ApiResponse({ status: 201, description: 'Movie created successfully', type: () => Movie })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async create(@Body() movie: Movie): Promise<Movie> {
        return this.moviesService.create(movie);
    }

    @Put(':imdbId')
    @ApiOperation({ summary: 'Update a movie by IMDb ID' })
    @ApiParam({ name: 'imdbId', example: 'tt3896198', description: 'IMDb ID of the movie' })
    @ApiBody({ type: () => Movie, required: false, description: 'Partial movie data to update' })
    @ApiResponse({ status: 200, description: 'Movie updated successfully', type: () => Movie })
    @ApiResponse({ status: 404, description: 'Movie not found' })
    async update(
        @Param('imdbId') imdbId: string,
        @Body() updates: Partial<Movie>
    ): Promise<Movie> {
        try {
            return this.moviesService.update(imdbId, updates);
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }

    @Post('search')
    @ApiOperation({ summary: 'Search for movies' })
    @ApiQuery({ name: 'imdbId', required: false, example: 'tt3896198', description: 'IMDb ID of the movie' })
    @ApiQuery({ name: 'query', required: false, example: 'Guardians of the Galaxy', description: 'Search query (title)' })
    @ApiQuery({ name: 'type', required: false, enum: ['movie', 'series', 'episode'], example: 'movie', description: 'Type of content' })
    @ApiQuery({ name: 'year', required: false, example: '2017', description: 'Release year' })
    @ApiQuery({ name: 'page', required: false, example: '1', description: 'Page number for pagination' })
    @ApiResponse({ status: 200, description: 'Movie found', type: () => Movie })
    @ApiResponse({ status: 404, description: 'No movies found' })
    async search(
        @Query('imdbId') imdbId?: string,
        @Query('query') query?: string,
        @Query('type') type?: 'movie' | 'series' | 'episode',
        @Query('year') year?: string,
        @Query('page') page?: string
    ): Promise<Movie> {
        if (!this.moviesService) {
            throw new Error('MoviesService is not injected. Check module configuration.');
        }
        const pageNumber = page ? parseInt(page, 10) : undefined;
        return await this.moviesService.search({
            imdbId,
            query,
            type,
            year,
            page: pageNumber
        });
    }

    @Get(':imdbId')
    @ApiOperation({ summary: 'Get a movie by IMDb ID' })
    @ApiParam({ name: 'imdbId', example: 'tt3896198', description: 'IMDb ID of the movie' })
    @ApiResponse({ status: 200, description: 'Movie found', type: () => Movie })
    @ApiResponse({ status: 404, description: 'Movie not found' })
    async getById(@Param('imdbId') imdbId: string): Promise<Movie> {
        const movie = await this.moviesService.getById(imdbId);
        if (!movie) {
            throw new NotFoundException(`Movie with imdbID ${imdbId} not found`);
        }
        return movie;
    }

    @Delete(':imdbId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a movie by IMDb ID' })
    @ApiParam({ name: 'imdbId', example: 'tt3896198', description: 'IMDb ID of the movie' })
    @ApiResponse({ status: 204, description: 'Movie deleted successfully' })
    @ApiResponse({ status: 404, description: 'Movie not found' })
    async delete(@Param('imdbId') imdbId: string): Promise<void> {
        const movie = await this.moviesService.delete(imdbId);
        if (!movie) {
            throw new NotFoundException(`Movie with imdbID ${imdbId} not found`);
        }
    }
}

