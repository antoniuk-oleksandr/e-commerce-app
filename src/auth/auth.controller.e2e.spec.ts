import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserExceptionFilter } from 'src/users/user-exception-filter';
import { mockCreateUserRequestDto, mockCreateUserResponseDto } from "@test/test-utils";
import { HttpStatus } from "@nestjs/common";
import * as request from 'supertest';


describe('AuthController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe())
    app.useGlobalFilters(new UserExceptionFilter());

    await app.init();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
  })

  beforeEach(async () => {
    await prismaService.user.deleteMany();
  })

  afterAll(async () => {
    await prismaService.user.deleteMany();
    await prismaService.$disconnect();
  })

  describe('register', () => {
    it('should create a user, return DTO, and set auth cookies', async () => {
      const createUserRequestDto = mockCreateUserRequestDto();

      const response = await request(app.getHttpServer())
        .post('/auth/new')
        .send(createUserRequestDto)
        .expect(HttpStatus.CREATED);

      const expectedUserResponseDto = mockCreateUserResponseDto();
      expect(response.body).toEqual({
        ...expectedUserResponseDto,
        id: expect.any(Number),
        updatedAt: expect.any(String),
        createdAt: expect.any(String),
      });

      const setCookies = response.headers['set-cookie'] as any as any[];
      expect(setCookies).toBeDefined();
      expect(setCookies.some((cookie: string) => cookie.startsWith('accessToken'))).toBeTruthy();
      expect(setCookies.some((cookie: string) => cookie.startsWith('refreshToken'))).toBeTruthy();
    })

    it('should return a 400 error if the request body is invalid.', async () => {
      const invalidCreateUserRequestDto = mockCreateUserRequestDto({ email: undefined });

      const response = await request(app.getHttpServer())
        .post('/auth/new')
        .send(invalidCreateUserRequestDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        message: expect.any(Array),
        error: 'Bad Request',
      });
    })

    it('should return a 409 error if the email already exists.', async () => {
      const createUserRequestDto = mockCreateUserRequestDto();

      await request(app.getHttpServer())
        .post('/auth/new')
        .send(createUserRequestDto)
        .expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .post('/auth/new')
        .send(createUserRequestDto)
        .expect(HttpStatus.CONFLICT);

      expect(response.body).toEqual({
        statusCode: HttpStatus.CONFLICT,
        message: 'Email already in use',
      });
    })
  })
});
