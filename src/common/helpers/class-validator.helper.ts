import { validate } from 'class-validator';
import { ValidationError } from '../errors';

export const validateAndGetFirstValidationError = async (objectToValidate: Record<string, any>) => {
  const validationErrors = await validate(objectToValidate);

  if (validationErrors.length > 0) {
    // Throwing always first error message from the top
    return new ValidationError(Object.values(validationErrors[0].constraints)[0]);
  }

  return null;
};
