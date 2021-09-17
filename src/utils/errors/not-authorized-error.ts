import CustomError from './custom-error';

export default class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Not Authorized');

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors = () => [{ message: 'Not authorized' }];
}
