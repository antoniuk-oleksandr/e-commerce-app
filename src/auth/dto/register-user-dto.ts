import type { CreateUserResponseDto } from "src/users/dto/create-user-response.dto";

export class RegisterUserDto {
  accessToken: string;
  refreshToken: string;
  user: CreateUserResponseDto;
}
