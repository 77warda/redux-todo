import { createAction, props } from '@ngrx/store';
import { BookRequiredProps, TodoData } from './reducer';

export const ADDTODO = createAction(
  '[Todo] ADDTODO',
  props<{ todo: TodoData }>()
);

export const todoAdded = createAction(
  '[Todo] added todo Success',
  props<{ todo: TodoData }>()
);

export const DELETETODO = createAction(
  '[Todo] DELETETODO',
  props<{ id: string }>()
);
export const todoDeleted = createAction(
  '[Todo] todo deleted',
  props<{ id: string }>()
);

export const MARKCOMPLETED = createAction(
  '[Todo] MARKCOMPLETED',
  props<{ id: string; todo: TodoData }>()
);

export const markAsCompleted = createAction(
  '[Todo] mark as completed',
  props<{ id: string; todo: TodoData }>()
);

export const UPDATETODO = createAction(
  '[Todo] UPDATETODO',
  props<{ id: string; todo: TodoData }>()
);
export const updateBook = createAction(
  '[Books page] Update book',
  props<{ bookId: string; changes: BookRequiredProps }>()
);

export const bookUpdated = createAction(
  '[Books Api] Books Updated',
  props<{ book: TodoData }>()
);

export const todoToBeUpdated = createAction(
  '[Todo] todo to be updated',
  props<{ id: string; todo: TodoData }>()
);

export const CLEARCOMPLETED = createAction('[Todo] CLEARCOMPLETED');
export const clearCompletedSuccess = createAction(
  '[Todo] clear completed success'
);

export const FILTERDATA = createAction(
  '[Todo] FILTER',
  props<{ filter: 'all' | 'active' | 'completed' }>()
);
export const enterTodosPage = createAction('[Todo] Enter ');
export const loadTodo = createAction('[Todo] Load todo ');
export const loadTodoSuccess = createAction(
  '[Todo] Load todo Success',
  props<{ todo: TodoData[] }>()
);
export const setTodo = createAction(
  '[Todo] setTodo',
  props<{ todo: TodoData[] }>()
);
