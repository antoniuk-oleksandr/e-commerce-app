import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequestDto {
  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
    minLength: 3,
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  @MinLength(3, { message: 'First name must be at least 3 characters' })
  @MaxLength(255, { message: 'First name is too long. Max 255 characters' })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Surname of the user',
    minLength: 3,
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Surname is required' })
  @IsString({ message: 'Surname must be a string' })
  @MinLength(3, { message: 'Surname must be at least 3 characters' })
  @MaxLength(255, { message: 'Surname is too long. Max 255 characters' })
  surname: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    example: 'Passw0rd',
    description:
      'Password containing at least one letter and one number, min 6 characters',
    minLength: 6,
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(255, { message: 'Password must be less than 256 characters' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).+$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;
}
