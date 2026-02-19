import {
  ParseError,
  ValidationError,
} from '@src/common/utils/route-errors';

/******************************************************************************
                                Types
******************************************************************************/

type ValidatorFn = (val: unknown) => boolean;

type Schema<T = Record<string, unknown>> = {
  [K in keyof T]: ValidatorFn | ((val: unknown) => T[K]);
};

/******************************************************************************
                              Functions
******************************************************************************/

/**
 * Parse request body/params against a schema. Throws ValidationError on failure.
 */
function parseReq<U extends Schema>(schema: U) {
  return (obj: Record<string, unknown>): { [K in keyof U]: unknown } => {
    const errors: ParseError[] = [];
    const result = {} as Record<string, unknown>;

    for (const key of Object.keys(schema)) {
      const validator = schema[key];
      const val = obj[key];
      try {
        const check = validator(val);
        if (typeof check === 'boolean') {
          if (!check) {
            errors.push({ prop: key, message: `Validation failed for "${key}"` });
          } else {
            result[key] = val;
          }
        } else {
          result[key] = check;
        }
      } catch {
        errors.push({ prop: key, message: `Validation failed for "${key}"` });
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    return result as { [K in keyof U]: unknown };
  };
}

export type { Schema };
export default parseReq;
