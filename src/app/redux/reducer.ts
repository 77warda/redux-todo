import { Action } from './actions';

export interface TodoData {
  id: number;
  todo: string;
  completed: boolean;
}

export interface State {
  todos: TodoData[];
}

export const initialState: State = {
  todos: [
    { id: 1, todo: 'First', completed: true },
    { id: 2, todo: 'Second', completed: false },
    { id: 3, todo: 'Third', completed: false },
    { id: 4, todo: 'Fourth', completed: true },
  ],
};
// Redux Reducer Function
export const reducer = (state: State = initialState, action: Action): State => {
  if (action.type === 'ADDTODO') {
    const newTodo: TodoData = {
      id: state.todos.length + 1,
      todo: action.payload?.['todo'],
      completed: false,
    };
    return {
      ...state,
      todos: [...state.todos, newTodo],
    };
  }
  if (action.type == 'UPDATETODO') {
    // return { ...state, todo: state.todo - 1 };
  }
  if (action.type == 'DELETETODO') {
    // return { ...state, todo: 0 };
  }
  return state;
};
