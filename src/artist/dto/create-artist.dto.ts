import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateArtistDto {
    @ApiProperty({
        example: 'Taco Hemingway',
        description: 'Nazwa wykonawcy lub zespołu muzycznego',
    })
    @IsString({ message: 'Nazwa artysty musi być tekstem' })
    @IsNotEmpty({ message: 'Nazwa artysty nie może być pusta' })
    @MaxLength(150, { message: 'Nazwa artysty może mieć maksymalnie 150 znaków' })
    name: string;

    @ApiPropertyOptional({
        example: 'Polski raper, autor tekstów, członek duetu TACONAFIDE.',
        description: 'Opcjonalna biografia lub opis twórcy',
    })
    @IsOptional()
    @IsString({ message: 'Biografia musi być tekstem' })
    bio?: string;
}