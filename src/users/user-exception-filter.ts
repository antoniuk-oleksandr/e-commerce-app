import { HttpStatus } from "@nestjs/common";
import { CustomExceptionFilter } from "src/common/exception-filter/custom-exception-filter";
import { Response } from 'express';

export class UserExceptionFilter extends CustomExceptionFilter {
  protected handle(exception: any, response: Response, status: number) {
    if (exception.code === 'P2002') {
      response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: 'Email already in use',
      });
    }
  }
}
