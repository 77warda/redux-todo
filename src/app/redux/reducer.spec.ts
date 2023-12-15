import { reducerTodo, initialState, State } from './reducer';
import * as Actions from './actions';
import { Action } from 'rxjs/internal/scheduler/Action';

describe('reducerTodo', () => {
  it('should handle "ADDTODO" action', () => {
    // Arrange
    const todo = { id: 1, name: 'Test Todo', completed: false };
    const action = Actions.ADDTODO({ todo });

    // Act
    const newState = reducerTodo(initialState, action);

    // Assert
    expect(newState.todos.length).toBe(1);
    expect(newState.todos[0]).toEqual(todo);
  });
  it('should handle DELETETODO action', () => {
    // Arrange
    const initialTodo = {
      ...initialState,
      todos: [{ id: 1, name: 'Test Todo', completed: false }],
    };
    const action = Actions.DELETETODO({ id: 1 });

    // Act
    const newState = reducerTodo(initialTodo, action);

    // Assert
    expect(newState.todos.length).toBe(0);
  });

  it('should handle MARKCOMPLETED action', () => {
    // Arrange
    const initialState: State = {
      todos: [
        { id: 1, name: 'Todo 1', completed: false },
        { id: 2, name: 'Todo 2', completed: false },
        { id: 3, name: 'Todo 3', completed: false },
      ],
      filter: 'all',
    };

    const action = Actions.MARKCOMPLETED({ id: 1 });
    const actionWithInvalidId = Actions.MARKCOMPLETED({ id: 4 });

    // Act
    const newState = reducerTodo(initialState, action);
    const newStateWithInvalidId = reducerTodo(
      initialState,
      actionWithInvalidId
    );

    // Assert
    expect(newState.todos.length).toBe(3);

    // Check when action dispatched on targeted todo and other not change
    expect(newState.todos[0].id).toBe(1);
    expect(newState.todos[0].completed).toBe(true);

    // Check if other(second index) todos remain unchanged
    expect(newState.todos[2].id).toBe(3);
    expect(newState.todos[2].completed).toBe(false);

    //should return the same state when MARKCOMPLETED action is dispatched with an invalid ID
    expect(newStateWithInvalidId).toEqual(initialState);
  });
  it('should handle UPDATETODO action ', () => {
    // Arrange
    const initialState: State = {
      todos: [
        { id: 1, name: 'Todo 1', completed: false },
        { id: 2, name: 'Todo 2', completed: false },
        { id: 3, name: 'Todo 3', completed: false },
      ],
      filter: 'all',
    };

    const updatedTodo = { id: 1, name: 'Updated Todo 1', completed: false };
    const action = Actions.UPDATETODO({ id: 1, todo: updatedTodo });

    // Act
    const newState = reducerTodo(initialState, action);

    // Assert
    expect(newState.todos.length).toBe(3);

    // Check when action dispatched on targeted todo and name changed
    expect(newState.todos[0].id).toBe(1);
    expect(newState.todos[0].name).toBe('Updated Todo 1');

    // Check if other todos remain unchanged
    expect(newState.todos[0].completed).toBe(false);
  });
  it('should handle CLEARCOMPLETED action', () => {
    //Arrange
    const initialState: State = {
      todos: [
        { id: 1, name: 'Todo 1', completed: false },
        { id: 2, name: 'Todo 2', completed: true },
        { id: 3, name: 'Todo 3', completed: false },
      ],
      filter: 'all',
    };

    const Action = Actions.CLEARCOMPLETED();
    //Act
    const newState = reducerTodo(initialState, Action);

    //Assert
    expect(newState.todos.length).toBe(2);

    expect(newState.todos[1].id).toBe(3);
    expect(newState.todos[1].name).toBe('Todo 3');
    expect(newState.todos[1].completed).toBe(false);
  });
  it('should update the filter when handle FILTERDATA action', () => {
    // Arrange
    const initialState: State = {
      todos: [
        { id: 1, name: 'Todo 1', completed: true },
        { id: 2, name: 'Todo 2', completed: true },
        { id: 3, name: 'Todo 3', completed: true },
      ],
      filter: 'all',
    };

    const actionCompleted = Actions.FILTERDATA({ filter: 'completed' });
    const actionActive = Actions.FILTERDATA({ filter: 'active' });

    // Act
    const StateCompleted = reducerTodo(initialState, actionCompleted);
    const StateActive = reducerTodo(initialState, actionActive);

    // Assert
    // expect(StateCompleted.todos.length).toBe(0);
    expect(StateActive.todos.length).toBe(3);

    // // Check if the filter property is updated
    // expect(StateCompleted.filter).toBe('completed');
    // expect(StateActive.filter).toBe('active');
  });

  it('should set todos when setTodo action is dispatched', () => {
    // Arrange
    const initialState: State = {
      todos: [],
      filter: 'all',
    };

    const todosToAdd = [
      { id: 1, name: 'Todo 1', completed: false },
      { id: 2, name: 'Todo 2', completed: true },
    ];

    const action = Actions.setTodo({ todo: todosToAdd });

    // Act
    const newState = reducerTodo(initialState, action);

    // Assert
    expect(newState.todos.length).toBe(2);

    // Check if the todos are added
    expect(newState.todos[0].id).toBe(1);
    expect(newState.todos[1].id).toBe(2);
    expect(newState.todos[1].completed).toBe(true);

    // Check if the filter property remains unchanged
    expect(newState.filter).toBe('all');
  });
});
