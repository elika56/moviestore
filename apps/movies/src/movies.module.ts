import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller.js';
import { MoviesService } from './services/moviesService.js';
import { MoviesRepository } from './repositories/movies.repository.js';

@Module({
    controllers: [MoviesController],
    providers: [MoviesService, MoviesRepository],
})
export class MoviesModule {}

