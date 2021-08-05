import { HttpStatusCode } from './http-status-code.constant';

export class ApiResponse {
  public readonly error?: Error | null;
  public readonly data: unknown;
  public readonly httpCode: number;

  private constructor(error?: Error | null, data?: unknown, httpCode: number = HttpStatusCode.BAD_REQUEST) {
    this.error = error;
    this.data = data;
    this.httpCode = httpCode;
  }

  public static withSuccess(data: unknown): ApiResponse {
    return new ApiResponse(null, data, HttpStatusCode.OK);
  }

  public static withError(
    error: Error,
    data?: unknown,
    httpCode?: number,
  ): ApiResponse {
    return new ApiResponse(error, data, httpCode);
  }
}
