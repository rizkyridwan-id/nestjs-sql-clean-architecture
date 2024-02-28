import { IGroupOption } from './group-option.interface';
import { IProjectOption } from './project-option.interface';
import { ISortOption } from './sort-option.interface';

export interface IFindOption {
  $group: IGroupOption;
  $project: IProjectOption;
  $limit: number;
  $skip: number;
  $sort: ISortOption<number>;
}
