import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ArtistModule } from './artist/artist.module';
import { GenreModule } from './genre/genre.module';

@Module({
  imports: [DatabaseModule, ArtistModule, GenreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}