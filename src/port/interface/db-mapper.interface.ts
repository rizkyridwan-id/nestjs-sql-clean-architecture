export interface IDbMapper<Entity, SqlModel> {
  toSqlProps(entity: Entity): SqlModel;
}
