
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGenreDto {
    @ApiProperty({
        example: 'Rock',
        description: 'Nazwa gatunku muzycznego',
    })
    @IsString({ message: 'Nazwa gatunku musi być tekstem' })
    @IsNotEmpty({ message: 'Nazwa gatunku nie może być pusta' })
    name: string;
}
