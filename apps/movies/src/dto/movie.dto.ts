import { createZodDto } from 'nestjs-zod';
import { MovieSchema } from '../entities/movie.entity.js';

export class MovieDto extends createZodDto(MovieSchema) {}

