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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@ApiTags('Artists')
@Controller('artists')
export class ArtistController {
    constructor(private readonly artistService: ArtistService) {}

    @Get()
    @ApiOperation({ summary: 'Pobieranie listy wszystkich artystów' })
    @ApiQuery({
        name: 'search',
        required: false,
        description: 'Opcjonalne wyszukiwanie artysty po nazwie',
    })
    findAll(@Query('search') search?: string) {
        return this.artistService.findAll(search);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Pobieranie szczegółów artysty wraz z jego wydaniami' })
    @ApiResponse({ status: 404, description: 'Artysta nie istnieje' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.artistService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Dodawanie nowego artysty' })
    @ApiResponse({ status: 201, description: 'Artysta został utworzony' })
    create(@Body() dto: CreateArtistDto) {
        return this.artistService.create(dto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Aktualizacja danych artysty' })
    @ApiResponse({ status: 404, description: 'Artysta nie istnieje' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateArtistDto,
    ) {
        return this.artistService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Usuwanie artysty z bazy' })
    @ApiResponse({ status: 404, description: 'Artysta nie istnieje' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.artistService.remove(id);
    }
}