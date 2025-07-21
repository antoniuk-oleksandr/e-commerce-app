import { PrismaService } from "src/prisma/prisma.service"
import { Test, TestingModule } from "@nestjs/testing";
import { UsersRepository } from './users.repository';
import { mockCreateUserRequestDto, mockCreateUserResponseDto, mockHashedPassword } from "@test/test-utils";
import { faker } from "@faker-js/faker/.";

describe('UsersRepository', () => {
  let prisma: PrismaService;
  let usersRepository: UsersRepository;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, UsersRepository],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
  })

  beforeEach(async () => {
    await prisma.user.deleteMany();
  })

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  })

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserRequestDto = mockCreateUserRequestDto();
      const expectedUserResponseDto = mockCreateUserResponseDto();
      const result = await usersRepository.createUser(createUserRequestDto, mockHashedPassword);

      expect(result).toEqual({
        ...expectedUserResponseDto,
        id: expect.any(Number),
        updatedAt: expect.any(Date),
        createdAt: expect.any(Date),
      });
      expect(result.id).toBeGreaterThan(0);
    })

    it('should throw an error if the user with a duplicate email already exists', async () => {
      const email = faker.internet.email();
      const createUserRequestDto = mockCreateUserRequestDto({ email });
      await usersRepository.createUser(createUserRequestDto, mockHashedPassword);
      const anotherUser = usersRepository.createUser(createUserRequestDto, mockHashedPassword);

      const expectedError = 'Unique constraint failed on the fields: (`email`)'
      await expect(anotherUser).rejects.toThrow(expectedError);
    })

    it('should throw if required fields are missing', async () => {
      const createUserRequestDto = mockCreateUserRequestDto({ email: undefined });

      await expect(usersRepository.createUser(createUserRequestDto, mockHashedPassword))
        .rejects.toThrow();
    });
  })

})
