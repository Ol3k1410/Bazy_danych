
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@ApiTags('Genres')
@Controller('genres')
export class GenreController {
    constructor(private readonly genreService: GenreService) {}

    @Get()
    @ApiOperation({ summary: 'Pobieranie listy wszystkich gatunków' })
    @ApiQuery({
        name: 'search',
        required: false,
        description: 'Opcjonalne wyszukiwanie gatunku po nazwie',
    })
    findAll(@Query('search') search?: string) {
        return this.genreService.findAll(search);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Pobieranie szczegółów gatunku wraz z wydaniami' })
    @ApiResponse({ status: 404, description: 'Gatunek nie istnieje' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.genreService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Dodawanie nowego gatunku' })
    @ApiResponse({ status: 201, description: 'Gatunek został utworzony' })
    create(@Body() dto: CreateGenreDto) {
        return this.genreService.create(dto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Aktualizacja danych gatunku' })
    @ApiResponse({ status: 404, description: 'Gatunek nie istnieje' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateGenreDto,
    ) {
        return this.genreService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Usuwanie gatunku z bazy' })
    @ApiResponse({ status: 404, description: 'Gatunek nie istnieje' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.genreService.remove(id);
    }
}
