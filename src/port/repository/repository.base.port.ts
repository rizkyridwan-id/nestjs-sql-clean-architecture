import {
  ClientSession,
  Document,
  FilterQuery,
  SortOrder,
  UpdateQuery,
} from 'mongoose';
import { IPaginationMeta } from '../interface/pagination-meta.interface';
import { IRepositoryResponse } from '../interface/repository-response.interface';

export interface BaseRepositoryPort<Entity, MongoEntity> {
  findAll(session?: ClientSession): Promise<Array<MongoEntity>>;
  findOne(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<MongoEntity | undefined>;

  findOneOrThrow(
    identifier: FilterQuery<MongoEntity>,
    errorMessage?: string,
    session?: ClientSession,
  ): Promise<MongoEntity>;

  findOneAndThrow(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<void>;

  findOneAndThrow(
    identifier: FilterQuery<MongoEntity>,
    errorMessage?: string,
    session?: ClientSession,
  ): Promise<void>;

  findOneLatest(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<MongoEntity | undefined>;
  findById(
    id: string,
    session?: ClientSession,
  ): Promise<MongoEntity | undefined>;
  findBy(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<Array<MongoEntity>>;
  findByPaginated(
    identifier: FilterQuery<MongoEntity>,
    paginationMeta: IPaginationMeta,
  ): Promise<Array<MongoEntity>>;
  findByPaginateSorted(
    identifier: FilterQuery<MongoEntity>,
    paginationMeta: IPaginationMeta,
    sort: { [key: string]: SortOrder | { $meta: any } },
  ): Promise<Array<MongoEntity>>;
  count(): Promise<number>;
  countBy(identifier: FilterQuery<MongoEntity>): Promise<number>;
  save(entity: Entity, session?: ClientSession): Promise<IRepositoryResponse>;
  saveReturnDocument(
    entity: Entity,
    session?: ClientSession,
  ): Promise<Document<any, any>>;
  saveMany(
    entity: Entity[],
    session?: ClientSession,
  ): Promise<IRepositoryResponse>;
  update(
    identifier: FilterQuery<MongoEntity>,
    data: UpdateQuery<Partial<MongoEntity>>,
    session?: ClientSession,
  ): Promise<IRepositoryResponse>;
  updateWithoutThrow(
    identifier: FilterQuery<MongoEntity>,
    data: UpdateQuery<Partial<MongoEntity>>,
    session?: ClientSession,
  ): Promise<IRepositoryResponse>;
  delete(
    identifier: FilterQuery<Partial<MongoEntity>>,
    session?: ClientSession,
  ): Promise<IRepositoryResponse>;
  deleteWithoutThrow(
    identifier: FilterQuery<Partial<MongoEntity>>,
    session?: ClientSession,
  ): Promise<IRepositoryResponse>;
  deleteAll(session?: ClientSession): Promise<IRepositoryResponse>;
}
