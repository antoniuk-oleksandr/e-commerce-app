import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

/**
 * The `UsersModule` is a feature module in the e-commerce application
 * that encapsulates all functionality related to user management.
 *
 * @module UsersModule
 *
 * @description
 * This module imports the `PrismaModule` for database interactions,
 * defines the `UsersController` to handle HTTP requests, and provides
 * the `UsersService` and `UsersRepository` for business logic and data
 * access, respectively.
 *
 * @imports
 * - `PrismaModule`: Provides database access and ORM functionality.
 *
 * @controllers
 * - `UsersController`: Handles incoming requests and returns responses
 *   related to user operations.
 *
 * @providers
 * - `UsersService`: Contains business logic for user-related operations.
 * - `UsersRepository`: Handles data persistence and retrieval for users.
 *
 * @exports
 * - Currently, this module does not export any providers or components.
 */
@Module({
  imports: [PrismaModule],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
