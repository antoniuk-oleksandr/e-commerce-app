import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersRepository } from 'src/users/users.repository';
import { mockCreateUserRequestDto, mockCreateUserResponseDto } from '@test/test-utils';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    createUser: jest.fn(),
  }

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService,
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    usersService = moduleRef.get<UsersService>(UsersService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mockedToken');
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should register a user and return user data, access and refresh tokens', async () => {
      const createUserRequestDto = mockCreateUserRequestDto();
      const expectedUser = mockCreateUserResponseDto();

      mockUsersService.createUser.mockResolvedValue(expectedUser);

      const response = await authService.registerUser(createUserRequestDto);
      expect(usersService.createUser).toHaveBeenCalledWith(createUserRequestDto);
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: expectedUser.id, email: expectedUser.email },
        { expiresIn: authService.accessTokenExpiresIn }
      )
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: expectedUser.id, email: expectedUser.email },
        { expiresIn: authService.refreshTokenExpiresIn }
      );
      expect(mockUsersService.createUser).toHaveBeenCalledWith(createUserRequestDto);
      expect(response).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        user: expectedUser,
      });
    })

    it('should throw error if user registration fails', async () => {
      const createUserRequestDto = mockCreateUserRequestDto();
      const error = new Error('User registration failed');

      mockUsersService.createUser.mockRejectedValue(error);
      await expect(authService.registerUser(createUserRequestDto)).rejects.toThrow(error);
    })
  })
});
