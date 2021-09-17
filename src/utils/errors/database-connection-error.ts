import CustomError from './custom-error';

export default class DatabaseConnectionError extends CustomError {
  statusCode = 500;

  reason = 'Error connecting to database';

  constructor() {
    super('Error Connecting to DB');
  }

  serializeErrors = () => {
    return [{ message: this.reason }];
  };
}
