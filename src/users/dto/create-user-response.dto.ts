import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseDto {
  @ApiProperty({ example: 1, description: 'Unique user ID' })
  id: number;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the user' })
  email: string;

  @ApiProperty({ example: 'John', description: 'First name of the user' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Surname of the user' })
  surname: string;

  @ApiProperty({
    example: '2025-07-17T14:32:00.000Z',
    description: 'Date the user was created',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-07-17T14:32:00.000Z',
    description: 'Date the user was last updated',
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;
}
