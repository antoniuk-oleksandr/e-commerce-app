import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import type { CreateUserResponseDto } from './dto/create-user-response.dto';
import type { CreateUserRequestDto } from './dto/create-user-request.dto';
import * as bcrypt from 'bcrypt';

/**
 * Service responsible for handling user-related operations.
 */
@Injectable()
export class UsersService {
  /**
   * Constructs a new instance of the UsersService.
   * 
   * @param userRepository - The repository used for user data operations.
   */
  constructor(private readonly userRepository: UsersRepository) { }

  /**
   * Creates a new user by hashing the provided password and delegating
   * the creation to the user repository.
   * 
   * @param createUserRequestDto - The data transfer object containing user creation details.
   * @returns A promise that resolves to the created user's response DTO.
   */
  async createUser(createUserRequestDto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    const passwordHash = await bcrypt.hash(createUserRequestDto.password, 10);
    return await this.userRepository.createUser(createUserRequestDto, passwordHash);
  }
}
