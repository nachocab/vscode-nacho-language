export {};

declare global {
  // https://github.com/microsoft/TypeScript/issues/48829#issuecomment-1295493436
  interface Array<T> {
    findLastIndex(
      predicate: (value: T, index: number, obj: T[]) => unknown,
      thisArg?: any
    ): number;
  }
}
