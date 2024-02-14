import { createAction, props } from '@ngrx/store';
import { BookRequiredProps, TodoData } from './reducer';

export const addTodo = createAction(
  '[Todo] add todo',
  props<{ todo: TodoData }>()
);

export const addTodoSuccess = createAction(
  '[Todo] todo added Successfully',
  props<{ todo: TodoData }>()
);

export const deleteTodo = createAction(
  '[Todo] delete todo',
  props<{ id: string }>()
);
export const deleteTodoSuccess = createAction(
  '[Todo] todo deleted successfully',
  props<{ id: string }>()
);

export const markCompleted = createAction(
  '[Todo] mark as completed',
  props<{ id: string; todo: TodoData }>()
);

export const markCompletedSuccess = createAction(
  '[Todo] mark as completed successfully',
  props<{ id: string; todo: TodoData }>()
);

export const updateTodo = createAction(
  '[Todo] todo updated',
  props<{ id: string; todo: TodoData }>()
);

export const updatedTodoSuccess = createAction(
  '[Todo] todo updated successfully',
  props<{ id: string; todo: TodoData }>()
);

export const CLEARCOMPLETED = createAction('[Todo] clear completed todos');
export const clearCompletedSuccess = createAction(
  '[Todo] clear completed successfully'
);

export const FILTERDATA = createAction(
  '[Todo] FILTER',
  props<{ filter: 'all' | 'active' | 'completed' }>()
);
export const enterTodosPage = createAction('[Todo] get all todos ');
export const loadTodo = createAction('[Todo] Load todo ');
export const loadTodoSuccess = createAction(
  '[Todo] Load todo Success',
  props<{ todo: TodoData[] }>()
);
export const setTodo = createAction(
  '[Todo] setTodo',
  props<{ todo: TodoData[] }>()
);
