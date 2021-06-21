import { Action, AnyAction, Store } from 'redux';

export * from './ConfigTypes';
export * from './ComponentSchemaTypes';
export * from './ConfigTypes';
export * from './StateTypes';

export interface BrickdStoreType<T, U extends Action = AnyAction>
  extends Store<T, U> {
  getPageState: any;
}
