import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Diane Uwamariya',
    description: 'The full name of the user',
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    example: 'diane@example.com',
    description: 'A valid email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'TestPass123!',
    description: 'Password with at least 8 characters',
  })
  @IsString()
  @MinLength(8)
  password: string;
}
