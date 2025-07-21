import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserRequestDto } from "./dto/create-user-request.dto";
import { CreateUserResponseDto } from "./dto/create-user-response.dto";


/**
 * UsersRepository is a service responsible for interacting with the database
 * to perform operations related to user data.
 */
@Injectable()
export class UsersRepository {
  /**
   * Initializes the UsersRepository with the provided PrismaService.
   * 
   * @param prismaService - The PrismaService instance used for database operations.
   */
  constructor(private readonly prismaService: PrismaService) { }

  /**
   * Creates a new user in the database.
   *
   * @param requestDto - The data required to create a new user, excluding the password.
   * @param passwordHash - The hashed password to be stored securely in the database.
   * @returns A promise that resolves to a CreateUserResponseDto containing the newly created user's details.
   */
  async createUser(
    requestDto: CreateUserRequestDto,
    passwordHash: string
  ): Promise<CreateUserResponseDto> {
    const {password, ... userData} = requestDto
    return await this.prismaService.user.create({
      data: {...userData, passwordHash},
      select: {
        id: true,
        email: true,
        firstName: true,
        surname: true,
        createdAt: true,
        updatedAt: true,
      }
    })
  }
}
