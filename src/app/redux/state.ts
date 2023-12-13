import { NgModule } from '@angular/core';
import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  StoreModule,
} from '@ngrx/store';
import * as fromBooks from './reducer';

export const FEATURE_KEY = 'todos';

export interface State {
  todos: fromBooks.State;
}

export const reducers: ActionReducerMap<State> = {
  todos: fromBooks.reducer,
};

export const metaReducers: MetaReducer<State>[] = [];

/**
 * Module
 **/
@NgModule({
  imports: [StoreModule.forFeature(FEATURE_KEY, reducers, { metaReducers })],
})
export class SharedStateTodosModule {}

export const selectSharedTodosState =
  createFeatureSelector<fromBooks.State>('todos');

export const selectAllTodos = createSelector(
  selectSharedTodosState,
  (state) => state && state.todos // Ensure state is defined before accessing todos
);
export const incompleteTodosLength = createSelector(
  selectAllTodos,
  (todos) => todos.filter((todo) => !todo.completed).length
);

export const selectFilteredTodos = createSelector(
  selectAllTodos,
  selectSharedTodosState,
  (todos, state) => {
    const filter = state.filter;
    if (filter === 'active') {
      return todos.filter((todo) => !todo.completed);
    } else if (filter === 'completed') {
      return todos.filter((todo) => todo.completed);
    } else {
      return todos;
    }
  }
);
