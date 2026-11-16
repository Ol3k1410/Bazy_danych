import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
    constructor(private readonly prisma: DatabaseService) {}

    async findAll(search?: string) {
        return this.prisma.artist.findMany({
            where: search
                ? {
                    name: {
                        contains: search,
                        mode: 'insensitive',
                    },
                }
                : undefined,
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: number) {
        const artist = await this.prisma.artist.findUnique({
            where: { id },
            include: {
                releases: {
                    include: {
                        release: true,
                    },
                },
            },
        });

        if (!artist) {
            throw new NotFoundException(`Artysta o ID ${id} nie został znaleziony`);
        }

        return artist;
    }

    async create(dto: CreateArtistDto) {
        return this.prisma.artist.create({
            data: dto,
        });
    }

    async update(id: number, dto: UpdateArtistDto) {
        await this.findOne(id);

        return this.prisma.artist.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: number) {
        await this.findOne(id);

        return this.prisma.artist.delete({
            where: { id },
        });
    }
}