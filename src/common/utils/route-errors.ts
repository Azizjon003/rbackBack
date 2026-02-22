import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { ErrorMessage } from '@src/common/constants/errors';

export interface ParseError {
  prop: string;
  message: string;
}

export class RouteError extends Error {
  public status: HttpStatusCodes;
  public errorMessage: ErrorMessage;

  public constructor(status: HttpStatusCodes, errorMessage: ErrorMessage) {
    super(errorMessage.eng);
    this.status = status;
    this.errorMessage = errorMessage;
  }
}

export class ValidationError extends RouteError {
  public static MESSAGE: ErrorMessage = {
    uz: 'Kiritilgan ma\'lumotlarda xatolik topildi',
    eng: 'The parseObj() function discovered one or more errors.',
  };

  public constructor(errors: ParseError[]) {
    const msg: ErrorMessage = {
      uz: ValidationError.MESSAGE.uz,
      eng: JSON.stringify({
        message: ValidationError.MESSAGE.eng,
        errors,
      }),
    };
    super(HttpStatusCodes.BAD_REQUEST, msg);
  }
}
