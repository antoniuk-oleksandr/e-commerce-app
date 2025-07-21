import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { PrismaClient } from '@prisma/client';

describe('PrismaService', () => {
  let prismaService: PrismaService;
  let prismaClient: PrismaClient;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
    prismaClient = prismaService;
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  it('should connect on module init', async () => {
    const connectSpy = jest.spyOn(prismaClient, '$connect');
    await prismaService.onModuleInit();
    expect(connectSpy).toHaveBeenCalled();
  });

  it('should disconnect on module destroy', async () => {
    const disconnectSpy = jest.spyOn(prismaClient, '$disconnect');
    await prismaService.onModuleDestroy();
    expect(disconnectSpy).toHaveBeenCalled();
  });
});
