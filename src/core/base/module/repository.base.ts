import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IRepositoryResponse } from '../../../port/interface/repository-response.interface';
import { BaseRepositoryPort } from '../../../port/repository/repository.base.port';
import { IPaginationMeta } from '../../../port/interface/pagination-meta.interface';
import { TypeValidator } from '../../logic/type-validator';
import { Model, Repository } from 'sequelize-typescript';
import { Order, Transaction, UpdateOptions, WhereOptions } from 'sequelize';
import { ISortOption } from 'src/port/interface/sort-option.interface';
import { MakeNullishOptional } from 'sequelize/types/utils';
import { IDbMapper } from 'src/port/interface/db-mapper.interface';

@Injectable()
export class BaseRepository<Entity, SqlModel extends Model>
  implements BaseRepositoryPort<Entity, SqlModel>
{
  constructor(
    private readonly genericModel: Repository<SqlModel>,
    private readonly mapper: IDbMapper<Entity, SqlModel>,
  ) {}

  async findAll(trx: Transaction | null = null): Promise<Array<SqlModel>> {
    const result = await this.genericModel.findAll({ transaction: trx });
    return result;
  }

  async findOne(
    identifier: WhereOptions<SqlModel>,
    trx: Transaction | null = null,
  ): Promise<SqlModel | null | undefined> {
    const result = await this.genericModel.findOne({
      where: identifier,
      transaction: trx,
    });
    return result;
  }

  async findOneOrThrow(
    identifier: WhereOptions<SqlModel>,
    trx?: Transaction,
  ): Promise<SqlModel>;
  async findOneOrThrow(
    identifier: WhereOptions<SqlModel>,
    errorMessage?: string,
    trx?: Transaction,
  ): Promise<SqlModel>;
  async findOneOrThrow(
    identifier: WhereOptions<SqlModel>,
    paramTwo: string | Transaction | null = null,
    paramThree: Transaction | null = null,
  ): Promise<SqlModel> {
    const foundData = await this.genericModel.findOne({
      where: identifier,
      transaction: typeof paramTwo !== 'string' ? paramTwo : paramThree,
    });

    if (!foundData) {
      throw new NotFoundException(
        typeof paramTwo === 'string'
          ? paramTwo
          : `E 404: DATA ${this.constructor.name
              .replace('Repository', '')
              .toUpperCase()} NOT FOUND`,
      );
    }
    return foundData;
  }

  async findOneAndThrow(
    identifier: WhereOptions<SqlModel>,
    trx?: Transaction,
  ): Promise<void>;
  async findOneAndThrow(
    identifier: WhereOptions<SqlModel>,
    errorMessage?: string,
    trx?: Transaction,
  ): Promise<void>;
  async findOneAndThrow(
    identifier: WhereOptions<SqlModel>,
    paramTwo: string | Transaction | null = null,
    paramThree: Transaction | null = null,
  ): Promise<void> {
    const foundData = await this.genericModel.findOne({
      where: identifier,
      transaction: typeof paramTwo !== 'string' ? paramTwo : paramThree,
    });

    if (foundData) {
      throw new ConflictException(
        typeof paramTwo === 'string'
          ? paramTwo
          : '' || `E 409: DATA ALREADY EXISTS`,
      );
    }
  }

  async findOneLatest(
    identifier: WhereOptions<SqlModel>,
    trx: Transaction | null = null,
  ): Promise<SqlModel | null> {
    const result = await this.genericModel.findOne({
      where: identifier,
      transaction: trx,
      order: ['id', 'DESC'],
    });

    return result;
  }

  async findById(
    id: string,
    trx: Transaction | null = null,
  ): Promise<SqlModel | null> {
    const result = await this.genericModel.findByPk(id, {
      transaction: trx,
    });
    return result;
  }

  async findBy(
    identifier: WhereOptions<SqlModel>,
    trx: Transaction | null = null,
  ): Promise<Array<SqlModel>> {
    const result = await this.genericModel.findAll({
      where: identifier,
      transaction: trx,
    });

    return result;
  }

  async findByPaginated(
    identifier: WhereOptions<SqlModel>,
    paginationMeta: IPaginationMeta,
  ) {
    const { limit = 100, skip = 0 } = paginationMeta;
    const result = await this.genericModel.findAll({
      where: identifier,
      offset: skip,
      limit,
    });

    return result;
  }

  async findByPaginateSorted(
    identifier: WhereOptions<SqlModel>,
    paginationMeta: IPaginationMeta,
    sort: ISortOption,
  ) {
    const { limit = 100, skip = 0 } = paginationMeta;
    const orderBy = Object.keys(sort).map((key) => [key, sort[key]]) as Order;
    const result = await this.genericModel.findAll({
      where: identifier,
      offset: skip,
      limit,
      order: orderBy,
    });

    return result;
  }

  async count(): Promise<number> {
    return await this.genericModel.count();
  }

  async countBy(identifier: WhereOptions<SqlModel>): Promise<number> {
    return await this.genericModel.count({ where: identifier });
  }

  async save(entity: Entity, trx?: Transaction): Promise<IRepositoryResponse> {
    const sqlModel = this.mapper.toSqlProps(entity) as MakeNullishOptional<
      SqlModel & Model
    >;

    const created = await this.genericModel.create(
      { ...sqlModel.dataValues },
      { transaction: trx },
    );
    return { id: created.id };
  }

  async saveMany(entities: Entity[], trx?: Transaction) {
    const sqlModels = entities.map((entity) => this.mapper.toSqlProps(entity));
    const saveResult = await this.genericModel.bulkCreate(
      sqlModels as MakeNullishOptional<SqlModel & Model>[],
      { transaction: trx },
    );
    return {
      n: saveResult.length,
    };
  }

  async update(
    identifier: WhereOptions<SqlModel>,
    data: UpdateOptions<SqlModel>,
    trx?: Transaction,
  ): Promise<IRepositoryResponse> {
    const [n] = await this.genericModel.update(data, {
      where: identifier,
      transaction: trx,
    });

    if (!n) {
      throw new NotFoundException(
        `E 404: ${this.constructor.name
          .replace('Repository', '')
          .toUpperCase()} NOT FOUND, UPDATE FAILED`,
      );
    }

    return { n };
  }

  async delete(
    identifier: WhereOptions<Partial<SqlModel>>,
    trx?: Transaction,
  ): Promise<IRepositoryResponse> {
    const result = await this.genericModel.destroy({
      where: identifier,
      transaction: trx,
    });
    if (!result)
      throw new NotFoundException(
        `E 404: ${this.constructor.name
          .replace('Repository', '')
          .toUpperCase()} NOT FOUND, DELETE FAILED`,
      );
    return { n: result };
  }

  async deleteWithoutThrow(
    identifier: WhereOptions<Partial<SqlModel>>,
    trx?: Transaction,
  ): Promise<IRepositoryResponse> {
    const result = await this.genericModel.destroy({
      where: identifier,
      transaction: trx,
    });

    return { n: result };
  }

  async deleteAll(trx?: Transaction): Promise<IRepositoryResponse> {
    if (process.env.MODE === 'PRODUCTION') {
      throw new ForbiddenException(
        'DeleteBulk Feature Disabled in PRODUCTION mode.',
      );
    }
    const result = await this.genericModel.destroy({
      transaction: trx,
    });
    return { n: result };
  }

  prepareQuery(query: WhereOptions<SqlModel>): WhereOptions<SqlModel> {
    const ref = { ...query };
    Object.keys(ref).forEach((key) => {
      const value = ref[key];
      if (
        TypeValidator.isObject(value) &&
        !TypeValidator.isDate(value) &&
        !TypeValidator.isArray(value)
      ) {
        Object.keys(value).map((key2: string) => {
          value[`$${key2}`] = value[key2];
          delete value[key2];
        });
        return;
      }
    });
    return ref;
  }

  async updateWithoutThrow(
    identifier: WhereOptions<SqlModel>,
    data: UpdateOptions<SqlModel>,
    trx?: Transaction,
  ): Promise<IRepositoryResponse> {
    const [n] = await this.genericModel.update(data, {
      where: identifier,
      transaction: trx,
    });

    return { n };
  }
}
