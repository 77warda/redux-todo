import { createReducer, on } from '@ngrx/store';
import * as Actions from './actions';
import { v4 as uuidv4 } from 'uuid';

export interface TodoData {
  id: string;
  name: string;
  completed: boolean;
}

export interface State {
  todos: TodoData[];
  filter: 'all' | 'active' | 'completed';
}

export const initialState: State = {
  todos: [],
  filter: 'all',
};

export const reducerTodo = createReducer(
  initialState,
  on(Actions.ADDTODO, (state, { todo }) => {
    const newTodo: TodoData = {
      id: uuidv4(),
      name: todo.name,
      completed: false,
    };
    return {
      ...state,
      todos: [...state.todos, newTodo],
    };
  }),

  on(Actions.DELETETODO, (state, { id }) => {
    const deleteTodo = state.todos.filter((todo) => todo.id !== id);
    return {
      ...state,
      todos: deleteTodo,
    };
  }),

  on(Actions.MARKCOMPLETED, (state, { id }) => {
    const markCompleted = state.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    return {
      ...state,
      todos: markCompleted,
    };
  }),
  on(Actions.UPDATETODO, (state, { id, todo }) => {
    const updatedTodos = state.todos.map((todoUpdate) =>
      todoUpdate.id === id ? { ...todoUpdate, name: todo.name } : todoUpdate
    );
    return { ...state, todos: updatedTodos };
  }),

  on(Actions.CLEARCOMPLETED, (state) => {
    const clearCompletedTodos = state.todos.filter((todo) => !todo.completed);
    return {
      ...state,
      todos: clearCompletedTodos,
    };
  }),
  on(Actions.FILTERDATA, (state, { filter }) => {
    return { ...state, filter };
  }),
  on(Actions.setTodo, (state, { todo }) => {
    return { ...state, todos: [...state.todos, ...todo] };
  })
);
