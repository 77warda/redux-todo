import { createAction, props } from '@ngrx/store';
import { TodoData } from './reducer';

export const ADDTODO = createAction(
  '[Todo] ADDTODO',
  props<{ todo: TodoData }>()
);

export const DELETETODO = createAction(
  '[Todo] DELETETODO',
  props<{ id: string }>()
);

export const MARKCOMPLETED = createAction(
  '[Todo] MARKCOMPLETED',
  props<{ id: string }>()
);

export const UPDATETODO = createAction(
  '[Todo] UPDATETODO',
  props<{ id: string; todo: TodoData }>()
);

export const CLEARCOMPLETED = createAction('[Todo] CLEARCOMPLETED');

export const FILTERDATA = createAction(
  '[Todo] FILTER',
  props<{ filter: 'all' | 'active' | 'completed' }>()
);
export const enterTodosPage = createAction('[Todo] Enter ');
export const setTodo = createAction(
  '[Todo] setTodo',
  props<{ todo: TodoData[] }>()
);
