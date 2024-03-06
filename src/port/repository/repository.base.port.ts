import { Transaction, UpdateOptions, WhereOptions } from 'sequelize';
import { IPaginationMeta } from '../interface/pagination-meta.interface';
import { IRepositoryResponse } from '../interface/repository-response.interface';
import { ISortOption } from '../interface/sort-option.interface';

export interface BaseRepositoryPort<Entity, SqlModel> {
  findAll(trx?: Transaction): Promise<Array<SqlModel>>;
  findOne(
    identifier: WhereOptions<SqlModel>,
    trx?: Transaction,
  ): Promise<SqlModel | null | undefined>;

  findOneOrThrow(
    identifier: WhereOptions<SqlModel>,
    trx?: Transaction,
  ): Promise<SqlModel>;
  findOneOrThrow(
    identifier: WhereOptions<SqlModel>,
    errorMessage?: string,
    trx?: Transaction,
  ): Promise<SqlModel>;

  findOneAndThrow(
    identifier: WhereOptions<SqlModel>,
    trx?: Transaction,
  ): Promise<void>;
  findOneAndThrow(
    identifier: WhereOptions<SqlModel>,
    errorMessage?: string,
    trx?: Transaction,
  ): Promise<void>;

  findOneLatest(
    identifier: WhereOptions<SqlModel>,
    trx?: Transaction,
  ): Promise<SqlModel | null>;
  findById(id: string, trx?: Transaction): Promise<SqlModel | null>;
  findBy(
    identifier: WhereOptions<SqlModel>,
    trx?: Transaction,
  ): Promise<Array<SqlModel>>;
  findByPaginated(
    identifier: WhereOptions<SqlModel>,
    paginationMeta: IPaginationMeta,
  ): Promise<Array<SqlModel>>;
  findByPaginateSorted(
    identifier: WhereOptions<SqlModel>,
    paginationMeta: IPaginationMeta,
    sort: ISortOption,
  ): Promise<Array<SqlModel>>;
  count(): Promise<number>;
  countBy(identifier: WhereOptions<SqlModel>): Promise<number>;
  save(entity: Entity, trx?: Transaction): Promise<IRepositoryResponse>;
  saveMany(entities: Entity[], trx?: Transaction): Promise<IRepositoryResponse>;
  update(
    identifier: WhereOptions<SqlModel>,
    data: UpdateOptions<SqlModel>,
    trx?: Transaction,
  ): Promise<IRepositoryResponse>;
  updateWithoutThrow(
    identifier: WhereOptions<SqlModel>,
    data: UpdateOptions<SqlModel>,
    trx?: Transaction,
  ): Promise<IRepositoryResponse>;
  delete(
    identifier: WhereOptions<Partial<SqlModel>>,
    trx?: Transaction,
  ): Promise<IRepositoryResponse>;
  deleteWithoutThrow(
    identifier: WhereOptions<Partial<SqlModel>>,
    trx?: Transaction,
  ): Promise<IRepositoryResponse>;
  deleteAll(trx?: Transaction): Promise<IRepositoryResponse>;
}
