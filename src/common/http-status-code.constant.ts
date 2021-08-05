export const enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  INTERNAL_SERVER_ERROR = 500,
}

export abstract class HttpStatusReason {
  private static sentences: Readonly<Record<HttpStatusCode, string>> = {
    [HttpStatusCode.OK]: 'OK',
    [HttpStatusCode.BAD_REQUEST]: 'Bad Request',
    [HttpStatusCode.UNAUTHORIZED]: 'Unauthorized',
    [HttpStatusCode.PAYMENT_REQUIRED]: 'Payment Required',
    [HttpStatusCode.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
  };

  public static get(statusCode: HttpStatusCode): string {
    return HttpStatusReason.sentences[statusCode];
  }
}
