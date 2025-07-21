import { Body, Controller, HttpStatus, Post, Res, UseFilters } from '@nestjs/common';
import { CreateUserRequestDto } from 'src/users/dto/create-user-request.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateUserResponseDto } from 'src/users/dto/create-user-response.dto';
import { UserExceptionFilter } from 'src/users/user-exception-filter';
import { ApiOperation, ApiBody, ApiResponse, ApiHeader } from '@nestjs/swagger';

/**
 * Controller responsible for handling authentication-related operations.
*/
@Controller('auth')
@UseFilters(UserExceptionFilter)
export class AuthController {
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  secure: boolean;

  onModuleInit() {
    this.accessTokenExpiresIn = parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN || '900', 10) * 1000;
    this.refreshTokenExpiresIn = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN || '2592000', 10) * 1000;
  }

  /**
   * Creates an instance of AuthController.
   * 
   * @param authService - The service used to manage auth-related operations.
   */
  constructor(private readonly authService: AuthService) {
    this.secure = process.env.NODE_ENV === 'production';
  }

  /**
   * Creates a new user and sets authentication cookies.
  *
   * @param createUserRequestDto - The data transfer object containing the details of the user to be created.
   * @returns A promise that resolves to the response DTO containing the details of the created user.
  *
  * @remarks
  * - This endpoint is accessible via a POST request to the path (`/auth/new`).
  * - The operation is documented with OpenAPI decorators for API documentation.
  *
  * @throws {ConflictException} If the email provided is already in use.
  * @throws {BadRequestException} If the input validation fails.
  * @throws {InternalServerErrorException} If an unexpected error occurs on the server.
  */
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserRequestDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: CreateUserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email already in use',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiHeader({
    name: 'Set-Cookie',
    description: 'Sets accessToken and refreshToken as HttpOnly cookies',
    required: false,
  })
  @Post('new')
  async registerUser(
    @Body() createUserRequestDto: CreateUserRequestDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<CreateUserResponseDto> {
    try {
      const { refreshToken, accessToken, user } = await this.authService.registerUser(createUserRequestDto);

      response.cookie('accessToken', accessToken, {
        maxAge: this.accessTokenExpiresIn,
        secure: this.secure,
        httpOnly: true,
      })

      response.cookie('refreshToken', refreshToken, {
        maxAge: this.refreshTokenExpiresIn,
        secure: this.secure,
        httpOnly: true,
      })

      response
        .status(HttpStatus.CREATED)
        .location(`/users/${user.id}`)

      return user;
    }
    catch (error) {
      response.clearCookie('accessToken');
      response.clearCookie('refreshToken');
      throw error;
    }
  }
}
