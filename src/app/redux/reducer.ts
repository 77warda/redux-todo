import { createReducer, on } from '@ngrx/store';
import * as Actions from './actions';
import { v4 as uuidv4 } from 'uuid';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface TodoData {
  id: string;
  name: string;
  completed: boolean;
}
export type BookRequiredProps = Pick<TodoData, 'name'>;

export interface State extends EntityState<TodoData> {
  todos: TodoData[];
  filter: 'all' | 'active' | 'completed';
}

export const adapter: EntityAdapter<TodoData> = createEntityAdapter<TodoData>();
export const initialState: State = adapter.getInitialState({
  todos: [],
  filter: 'all',
});

export const reducerTodo = createReducer(
  initialState,
  on(Actions.addTodoSuccess, (state, { todo }) => {
    return adapter.addOne(todo, state);
  }),

  on(Actions.setTodo, (state, { todo }) => {
    return adapter.setOne(todo, state);
  }),

  on(Actions.deleteTodo, (state, { id }) => {
    return adapter.removeOne(id, state);
  }),

  on(Actions.markCompletedSuccess, (state, { id }) => {
    return adapter.updateOne(
      { id, changes: { completed: !state.entities[id].completed } },
      state
    );
  }),

  on(Actions.updateTodo, (state, { id, todo }) => {
    return adapter.updateOne({ id: id, changes: { name: todo.name } }, state);
  }),

  on(Actions.clearCompletedSuccess, (state) => {
    const { ids, entities } = state;
    const completedIds = Object.keys(entities).filter(
      (id) => entities[id].completed
    );
    return adapter.removeMany(completedIds, state);
  }),

  on(Actions.FILTERDATA, (state, { filter }) => {
    return { ...state, filter };
  }),

  on(Actions.loadTodoSuccess, (state, { todo }) => {
    return adapter.setAll(todo, state);
  })
);
