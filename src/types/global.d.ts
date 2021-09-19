import { Error } from 'mongoose';

declare global {
  namespace Global {
    interface UnknownObj<T> {
      [key: string]: T;
    }
    const mongooseError = Error;
  }
}

export {};
