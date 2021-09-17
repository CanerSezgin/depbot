import CustomError from './custom-error';

export default class ForbiddenError extends CustomError {
  statusCode = 403;

  constructor() {
    super('Forbidden');

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeErrors = () => [{ message: 'Forbidden' }];
}
