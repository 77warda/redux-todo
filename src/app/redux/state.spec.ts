import {
  selectSharedTodosState,
  selectAllTodos,
  incompleteTodosLength,
  selectCurrentTab,
  selectFilteredTodos,
} from './state'; // Replace with the correct path

describe('Todo Selectors', () => {
  const initialState = {
    todos: {
      todos: [
        { id: '1', name: 'Task 1', completed: false },
        { id: '2', name: 'Task 2', completed: true },
      ],
      filter: 'all' as const,
    },
  };

  it('should select all todos', () => {
    const result = selectAllTodos.projector(initialState.todos);
    expect(result).toEqual(initialState.todos.todos);
  });

  it('should select the number of incomplete todos', () => {
    const result = incompleteTodosLength.projector(initialState.todos.todos);
    expect(result).toEqual(1); // One incomplete todo in the initial state
  });

  it('should select the current tab', () => {
    const result = selectCurrentTab.projector(initialState.todos);
    expect(result).toEqual('all');
  });

  it('should select filtered todos based on the current tab', () => {
    const resultAll = selectFilteredTodos.projector(
      initialState.todos.todos,
      'all'
    );
    const resultActive = selectFilteredTodos.projector(
      initialState.todos.todos,
      'active'
    );
    const resultCompleted = selectFilteredTodos.projector(
      initialState.todos.todos,
      'completed'
    );

    expect(resultAll).toEqual(initialState.todos.todos);
    expect(resultActive).toEqual([
      { id: '1', name: 'Task 1', completed: false },
    ]);
    expect(resultCompleted).toEqual([
      { id: '2', name: 'Task 2', completed: true },
    ]);
  });
});
