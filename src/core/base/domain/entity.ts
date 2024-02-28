import { DateVO } from 'src/core/value-object/date.value-object';
import { Guard } from '../../logic/guard';

export abstract class Entity<EntityProps> {
  protected _input_date: DateVO;
  protected props: EntityProps;

  constructor(props: EntityProps) {
    this.validateProps(props);
    const now = DateVO.now();
    this._input_date = now;
    this.props = props;
  }

  get input_date(): Date {
    return this._input_date.value;
  }

  public static isEntity(entity: unknown): entity is Entity<unknown> {
    return entity instanceof Entity;
  }

  public getPropsCopy(): EntityProps {
    const propsCopy = {
      ...this.props,
    };
    return Object.freeze(propsCopy);
  }

  private validateProps(props: EntityProps) {
    if (Guard.isEmpty(props)) {
      throw new Error('Entity props should not be empty!');
    }
    if (typeof props !== 'object') {
      throw new Error('Entity props should be an object');
    }
  }
}
