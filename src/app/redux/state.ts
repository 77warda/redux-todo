import { NgModule } from '@angular/core';
import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  StoreModule,
} from '@ngrx/store';
import * as fromBooks from './reducer';
import { adapter } from './reducer';

export const FEATURE_KEY = 'todos';

export interface State {
  todos: fromBooks.State;
}

export const reducers: ActionReducerMap<State> = {
  todos: fromBooks.reducerTodo,
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

const { selectAll } = adapter.getSelectors();
export const selectAllTodos = createSelector(selectSharedTodosState, (state) =>
  selectAll(state)
);
export const incompleteTodosLength = createSelector(
  selectAllTodos,
  (todos) => todos.filter((todo) => !todo.completed).length
);
export const selectCurrentTab = createSelector(
  selectSharedTodosState,
  (state) => state.filterTodo
);

export const selectFilteredTodos = createSelector(
  selectAllTodos,
  selectCurrentTab,
  (todos, filter) => {
    console.log('All Todos:', todos);
    console.log('Filter:', filter);
    if (filter === 'active') {
      return todos.filter((todo) => !todo.completed);
    } else if (filter === 'completed') {
      return todos.filter((todo) => todo.completed);
    } else {
      return todos;
    }
  }
);

export const getDeleteMsg = createSelector(
  selectSharedTodosState,
  (state) => state.deleteMsg
);

export const selectDeletedTodo = createSelector(
  selectSharedTodosState,
  (state) => state.deletedTodo
);
