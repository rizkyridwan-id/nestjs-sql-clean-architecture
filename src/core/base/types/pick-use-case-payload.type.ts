import { IUseCasePayload } from '../module/use-case.base';

export type PickUseCasePayload<
  T,
  PropertyNames extends keyof IUseCasePayload<T>,
> = Pick<IUseCasePayload<T>, PropertyNames>;
