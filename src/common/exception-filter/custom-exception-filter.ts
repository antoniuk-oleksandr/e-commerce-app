import { ExceptionFilter, HttpException, HttpStatus, ArgumentsHost, Catch, IntrinsicException, Logger } from "@nestjs/common";
import { Response } from 'express';

@Catch()
export abstract class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = exception instanceof HttpException
      ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    this.handle(exception, response, status);

    const res = host.switchToHttp().getResponse();

    if (!res.headersSent) {
      this.defaultFilter(exception, response, status);
    }
  }

  defaultFilter(exception: any, response: Response, status: number) {
    const defaultError = {
      message: 'An unexpected error occurred',
      error: 'Internal Server Error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }

    const result = exception && exception.response ? exception.response : defaultError
    response.status(status).json(result);
  }

  protected abstract handle(exception: any, response: Response, status: number)
}
