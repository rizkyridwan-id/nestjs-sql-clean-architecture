import { Guard } from 'src/core/logic/guard';
import { DomainPrimitive } from '../types/domain-primitive.type';
import { TPrimitive } from '../types/primitive.type';

type ValueObjectProps<T extends TPrimitive | Date> = DomainPrimitive<T>;

export abstract class ValueObject<T extends TPrimitive | Date> {
  protected readonly props: ValueObjectProps<T>;
  protected readonly isAllowEmpty: boolean;

  constructor(props: ValueObjectProps<T>, isAllowEmpty = false) {
    this.isAllowEmpty = isAllowEmpty;

    this._checkIfEmpty(props);
    this.validate(props);
    this.props = props;
  }

  protected abstract validate(props: ValueObjectProps<T>): void;

  get value() {
    return this.props.value;
  }

  static isValueObject(obj: any): obj is ValueObject<any> {
    return obj instanceof ValueObject;
  }

  private _checkIfEmpty(props: ValueObjectProps<T>): void {
    if (!this.isAllowEmpty) {
      if (
        Guard.isEmpty(props) ||
        (this._isDomainPrimitive(props) && Guard.isEmpty(props.value))
      ) {
        throw new Error('Property cannot be empty');
      }
    }
  }

  private _isDomainPrimitive(
    obj: unknown,
  ): obj is DomainPrimitive<T & (TPrimitive | Date)> {
    if (Object.prototype.hasOwnProperty.call(obj, 'value')) {
      return true;
    }
    return false;
  }
}
