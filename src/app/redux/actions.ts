// export const ADDTODO = (todo: string): Action => ({
//   type: 'ADDTODO',
//   payload: { todo },
// });

// export const DELETETODO = (id: number): Action => ({
//   type: 'DELETETODO',
//   payload: { id },
// });

// export const MARKCOMPLETED = (id: number): Action => ({
//   type: 'MARKCOMPLETED',
//   payload: { id },
// });
// export const UPDATETODO = (id: number, todo: string): Action => ({
//   type: 'UPDATETODO',
//   payload: { id, todo },
// });
// export const CLEARCOMPLETED = (): Action => ({
//   type: 'CLEARCOMPLETED',
//   // payload: { id },
// });

import { createAction, props } from '@ngrx/store';
import { TodoData } from './reducer';

export const ADDTODO = createAction(
  '[Todo] ADDTODO',
  props<{ todo: TodoData }>()
);

export const DELETETODO = createAction(
  '[Todo] DELETETODO',
  props<{ id: number }>()
);

export const MARKCOMPLETED = createAction(
  '[Todo] MARKCOMPLETED',
  props<{ id: number }>()
);

export const UPDATETODO = createAction(
  '[Todo] UPDATETODO',
  props<{ id: number; todo: TodoData }>()
);

export const CLEARCOMPLETED = createAction('[Todo] CLEARCOMPLETED');

export const FILTERDATA = createAction(
  '[Todo] FILTER',
  props<{ filter: 'all' | 'active' | 'completed' }>()
);
