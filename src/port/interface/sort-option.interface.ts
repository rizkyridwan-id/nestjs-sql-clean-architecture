export type SortValue = 'ASC' | 'DESC' | 'asc' | 'desc';

export interface ISortOption {
  [key: string]: SortValue;
}
