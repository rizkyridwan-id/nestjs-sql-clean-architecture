export type MongoEntityProps<MongoEntity> = Omit<MongoEntity, '_id'>;

export abstract class DbMapper<Entity, MongoEntity> {
  constructor(private mongoEntityModel: new (...args: any[]) => MongoEntity) {}

  protected abstract toMongoProps(
    entity: Entity,
  ): MongoEntityProps<MongoEntity>;

  toMongoEntity(entity: Entity): MongoEntity {
    const props = this.toMongoProps(entity);
    return new this.mongoEntityModel(props);
  }
}
