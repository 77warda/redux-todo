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
  if (action.type == 'DELETETODO') {
    const deleteTodo = action.payload?.['id'];
    if (deleteTodo) {
      const deleteTodos = state.todos.filter((todo) => todo.id !== deleteTodo);
      return {
        ...state,
        todos: deleteTodos,
      };
    }
  }
  if (action.type === 'MARKCOMPLETED') {
    const toggleTodoId = action.payload?.['id'];
    if (toggleTodoId) {
      const updatedTodos = state.todos.map((todo) =>
        todo.id === toggleTodoId
          ? { ...todo, completed: !todo.completed }
          : todo
      );
      return {
        ...state,
        todos: updatedTodos,
      };
    }
  }
  if (action.type === 'UPDATETODO') {
    const updateId = action.payload?.['id'];
    const updateText = action.payload?.['todo'];

    if (updateId && updateText) {
      const updatedTodos = state.todos.map((todo) =>
        todo.id === updateId ? { ...todo, todo: updateText } : todo
      );
      return {
        ...state,
        todos: updatedTodos,
      };
    }
  }
  if (action.type === 'CLEARCOMPLETED') {
    const clearCompletedTodos = state.todos.filter((todo) => !todo.completed);
    return {
      ...state,
      todos: clearCompletedTodos,
    };
  }
  return state;
};
