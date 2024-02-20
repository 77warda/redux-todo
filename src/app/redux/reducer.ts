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
  filterTodo: 'all' | 'active' | 'completed';
  deleteMsg: string;
  deletedTodo: TodoData | null;
}

export const adapter: EntityAdapter<TodoData> = createEntityAdapter<TodoData>();
export const initialState: State = adapter.getInitialState({
  todos: [],
  filterTodo: 'all',
  deleteMsg: '',
  deletedTodo: null,
});

export const reducerTodo = createReducer(
  initialState,
  on(Actions.addTodoSuccess, (state, { todo }) => {
    return adapter.addOne(todo, state);
  }),

  on(Actions.setTodo, (state, { todo }) => {
    return adapter.setOne(todo, state);
  }),

  on(Actions.deleteTodoSuccess, (state, { id }) => {
    // return adapter.removeOne(id, state);
    const deletedTodo = state.entities[id];
    return {
      ...adapter.removeOne(id, state),
      deletedTodo: deletedTodo, // Store the deleted todo
    };
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

  on(Actions.FILTERDATA, (state, { filterTodo }) => {
    return { ...state, filterTodo };
  }),

  on(Actions.loadTodoSuccess, (state, { todo }) => {
    return adapter.setAll(todo, state);
  }),
  on(Actions.setDeleteMsg, (state, { message }) => ({
    ...state,
    deleteMsg: message,
  })),
  on(Actions.undoDeletedTodo, (state) => {
    if (state.deletedTodo) {
      return {
        ...adapter.addOne(state.deletedTodo, state),
      };
    } else {
      console.warn('No deleted todo to undo');
      return state;
    }
  }),
  on(Actions.restoreDeletedTodo, (state) => {
    return {
      ...state,
      deletedTodo: null,
    };
  }),
  on(Actions.resetDeleteMsg, (state) => ({
    ...state,
    deleteMsg: '', // Reset deleteMsg after a delay
  }))
);
