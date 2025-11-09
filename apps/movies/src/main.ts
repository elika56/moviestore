import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MoviesModule } from './movies.module.js';
import { MovieDto } from './dto/movie.dto.js';

async function bootstrap() {
    const app = await NestFactory.create(MoviesModule);
    
    const config = new DocumentBuilder()
        .setTitle('Movie Store API')
        .setDescription('API for managing movies')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config, {
        extraModels: [MovieDto]
    });
    SwaggerModule.setup('api', app, document);
    
    await app.listen(3000);
    console.log('Application is running on: http://localhost:3000');
    console.log('Swagger documentation available at: http://localhost:3000/api');
}

bootstrap();

