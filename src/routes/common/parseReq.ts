import { z } from 'zod';

import { ParseError, ValidationError } from '@src/common/utils/route-errors';

function parseReq<T extends z.ZodType>(schema: T) {
  return (obj: Record<string, unknown>): z.infer<T> => {
    const result = schema.safeParse(obj);
    if (!result.success) {
      const errors: ParseError[] = result.error.issues.map((issue) => ({
        prop: issue.path.join('.'),
        message: issue.message,
      }));
      throw new ValidationError(errors);
    }
    return result.data;
  };
}

export default parseReq;
