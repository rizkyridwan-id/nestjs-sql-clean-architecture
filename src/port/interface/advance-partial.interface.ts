export type AdvancePartial<T> = {
  [P in keyof T]?: { [key: string]: any };
};
