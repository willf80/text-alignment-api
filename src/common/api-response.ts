export class ApiResponse {
  public readonly error?: Error | null;
  public readonly data: unknown;

  private constructor(error?: Error | null, data?: unknown) {
    this.error = error;
    this.data = data;
  }

  public static withSuccess(data: unknown): ApiResponse {
    return new ApiResponse(null, data);
  }

  public static withError(error: Error, data?: unknown): ApiResponse {
    return new ApiResponse(error, data);
  }
}