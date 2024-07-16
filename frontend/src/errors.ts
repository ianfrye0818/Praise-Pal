import { isAxiosError } from 'axios';

class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode || 500;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

const handleApiError = (error: unknown, customMessage?: string): never => {
  console.error('HandleApiError: ', error);

  if (isAxiosError(error)) {
    if (!error.response) {
      throw new CustomError('Cannot connect to server', 503);
    }
    const errorMessage =
      error.response?.data?.message || customMessage || 'Something went wrong with the request';
    throw new CustomError(errorMessage, error.response.status || 500);
  }

  if (isError(error)) {
    console.error('error message: ', error.message);
    throw new CustomError(error.message, 500);
  }

  throw new CustomError(customMessage || 'An unknown error occured', 500);
};

const isError = (error: any): error is Error => {
  return (error as Error).message !== undefined;
};
const isCustomError = (error: any): error is CustomError => {
  return (error as CustomError).message !== undefined;
};

export { CustomError, handleApiError, isError, isCustomError };
