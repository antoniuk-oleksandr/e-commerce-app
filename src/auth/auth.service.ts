import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/register-user-dto';
import { CreateUserRequestDto } from 'src/users/dto/create-user-request.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  onModuleInit() {
    this.accessTokenExpiresIn = parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN || '900', 10);
    this.refreshTokenExpiresIn = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN || '2592000', 10);
  }

  async registerUser(createUserRequestDto: CreateUserRequestDto): Promise<RegisterUserDto> {
    const user = await this.usersService.createUser(createUserRequestDto);

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.accessTokenExpiresIn,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.refreshTokenExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}
