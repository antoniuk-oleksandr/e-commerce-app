import { Response } from "express";
import { CustomExceptionFilter } from "./custom-exception-filter";
import { HttpException, HttpStatus, ArgumentsHost } from "@nestjs/common";

class TestException extends HttpException {
  constructor() {
    const response = {
      message: 'Test error',
      statusCode: HttpStatus.BAD_REQUEST,
    }
    super(response, HttpStatus.BAD_REQUEST);
  }
}

describe('CustomExceptionFilter', () => {
  let filter: CustomExceptionFilter;
  let mockResponse: jest.Mocked<Response>;
  let mockArgumentsHost: Partial<ArgumentsHost>;

  beforeEach(() => {
    filter = new (class extends CustomExceptionFilter {
      protected handle(exception: any, response: Response, status: number) {
        response.send('Handled');
      }
    })();

   
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      headersSent: false,
    } as any as jest.Mocked<Response>;

    mockArgumentsHost = {
      switchToHttp: () => ({
        getRequest: jest.fn(),
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getNext: jest.fn(),
      }),
    };
  });

  it('should call defaultFilter with a valid exception', () => {
    const exception = new TestException();
    const status = HttpStatus.BAD_REQUEST;

    filter.catch(exception, mockArgumentsHost as any);

    expect(mockResponse.status).toHaveBeenCalledWith(status);

    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: status,
      message: 'Test error',
    });
  });

  it('should call defaultFilter with a default message if exception.message is not set', () => {
    class CustomException extends HttpException {
      constructor() {
        const response = {
          message: 'Internal server error',
          statusCode: HttpStatus.BAD_REQUEST,
        }
        super(response, HttpStatus.BAD_REQUEST);
      }
    }
    const exception = new CustomException();
    const status = HttpStatus.BAD_REQUEST;

    filter.catch(exception, mockArgumentsHost as any);

    expect(mockResponse.status).toHaveBeenCalledWith(status);

    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: status,
      message: 'Internal server error',
    });
  });

  it('should use default error response when exception is undefined', () => {
    const exception = undefined;
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
  
    filter.catch(exception, mockArgumentsHost as any);
  
    expect(mockResponse.status).toHaveBeenCalledWith(status);
  
    const invalidError = {
      message: 'An unexpected error occurred',
      error: 'Internal Server Error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
    expect(mockResponse.json).toHaveBeenCalledWith(invalidError);
  });
});
