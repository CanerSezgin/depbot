declare global {
  namespace Global {
    interface UnknownObj<T> {
      [key: string]: T;
    }
  }
}

export {};
