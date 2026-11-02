import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'diane@example.com',
    description: 'The registered email address',
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
