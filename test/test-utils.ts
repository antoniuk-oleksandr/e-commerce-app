import { CreateUserRequestDto } from "src/users/dto/create-user-request.dto"
import { CreateUserResponseDto } from "src/users/dto/create-user-response.dto"

export const mockCreateUserRequestDto = (
  overrides?: Partial<CreateUserRequestDto>
): CreateUserRequestDto => {
  const dto = {
    firstName: "test",
    surname: "test",
    email: "test@gmail.com",
    password: "Test1234"
  }

  return { ...dto, ...overrides }
}

export const mockCreateUserResponseDto = (
  overrides?: Partial<CreateUserResponseDto>
): CreateUserResponseDto => {
  const dto = {
    id: 1,
    firstName: "test",
    surname: "test",
    email: "test@gmail.com",
    createdAt: new Date(),
    updatedAt: new Date()
  }

  return { ...dto, ...overrides }
}

export const mockHashedPassword = "hashedPassword";
