import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import {
  mockCreateUserRequestDto,
  mockCreateUserResponseDto,
  mockHashedPassword
} from '@test/test-utils';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}))

describe('UsersService', () => {
  let usersRepository: UsersRepository;
  let usersService: UsersService;

  const mockUsersRepository = {
    createUser: jest.fn()
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockUsersRepository },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully with a hashed password', async () => {
      const createUserRequestDto = mockCreateUserRequestDto();
      const expectedResponse = mockCreateUserResponseDto();

      mockUsersRepository.createUser.mockResolvedValue(expectedResponse);
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

      const result = await usersService.createUser(createUserRequestDto);

      expect(usersRepository.createUser).toHaveBeenCalledWith(
        createUserRequestDto,
        mockHashedPassword
      )
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserRequestDto.password, 10);
      expect(result).toEqual(expectedResponse);
    })

    it('should exclude the password from the response', async () => {
      const createUserRequestDto = mockCreateUserRequestDto();
      const expectedResponse = mockCreateUserResponseDto();

      mockUsersRepository.createUser.mockResolvedValue(expectedResponse);

      const result = await usersService.createUser(createUserRequestDto);

      expect(result).not.toHaveProperty('password');
      expect(result).toEqual(expectedResponse);
    })

    it('should throw an error if user creation fails', async () => {
      const createUserRequestDto = mockCreateUserRequestDto();
      const error = new Error('User creation failed');

      mockUsersRepository.createUser.mockRejectedValue(error);
      await expect(usersService.createUser(createUserRequestDto)).rejects.toThrow(error);
    })
  })
});
