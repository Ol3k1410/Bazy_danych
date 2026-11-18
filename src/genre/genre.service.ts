
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenreService {
    constructor(private readonly prisma: DatabaseService) {}

    async findAll(search?: string) {
        return this.prisma.genre.findMany({
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
        const genre = await this.prisma.genre.findUnique({
            where: { id },
            include: {
                releases: {
                    include: {
                        release: true,
                    },
                },
            },
        });

        if (!genre) {
            throw new NotFoundException(`Gatunek o ID ${id} nie został znaleziony`);
        }

        return genre;
    }

    async create(dto: CreateGenreDto) {
        return this.prisma.genre.create({
            data: dto,
        });
    }

    async update(id: number, dto: UpdateGenreDto) {
        await this.findOne(id);

        return this.prisma.genre.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: number) {
        await this.findOne(id);

        return this.prisma.genre.delete({
            where: { id },
        });
    }
}
