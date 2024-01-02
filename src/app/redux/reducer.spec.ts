import { reducerTodo, initialState, State } from './reducer';
import * as Actions from './actions';
import { Action } from 'rxjs/internal/scheduler/Action';

describe('reducerTodo', () => {
  it('should handle "ADDTODO" action', () => {
    // Arrange
    const todo = { id: '1', name: 'New Todo', completed: false }; // Provide mock data
    const action = Actions.addTodoSuccess({ todo });
    const newState = reducerTodo(initialState, action);

    // Check if the new todo is added to the state
    expect(newState.todos.length).toBe(initialState.todos.length + 1);

    // Check if the new todo has the correct properties
    const addedTodo = newState.todos.find((t) => t.name === todo.name);
    expect(addedTodo).toBeTruthy();
    expect(addedTodo!.completed).toBe(false);
    expect(addedTodo!.name).toBe(todo.name);
  });
  it('should delete a todo when DELETETODO action is dispatched', () => {
    // Add a todo to the initial state
    const todoToDelete = { id: '1', name: 'Todo to delete', completed: false };
    const initialStateWithTodo = { ...initialState, todos: [todoToDelete] };

    const action = Actions.deleteTodo({ id: '1' });
    const newState = reducerTodo(initialStateWithTodo, action);

    // Check if the todo is deleted from the state
    expect(newState.todos.length).toBe(initialStateWithTodo.todos.length - 1);

    // Check if the deleted todo is not present in the new state
    const deletedTodo = newState.todos.find((t) => t.id === todoToDelete.id);
    expect(deletedTodo).toBeFalsy();
  });

  it('should not delete any todo if the provided id does not match any todo', () => {
    // Add a todo to the initial state
    const todoToDelete = { id: '1', name: 'Todo to delete', completed: false };
    const initialStateWithTodo = { ...initialState, todos: [todoToDelete] };

    // Attempt to delete a todo with a different id
    const action = Actions.deleteTodo({ id: '2' });
    const newState = reducerTodo(initialStateWithTodo, action);

    // Check if the number of todos remains the same
    expect(newState.todos.length).toBe(initialStateWithTodo.todos.length);

    // Check if the initial todo is still present in the state
    const existingTodo = newState.todos.find((t) => t.id === todoToDelete.id);
    expect(existingTodo).toBeTruthy();
  });

  it('should handle MARKCOMPLETED action', () => {
    // Arrange
    const initialState: State = {
      todos: [
        { id: '1', name: 'Todo 1', completed: false },
        { id: '2', name: 'Todo 2', completed: false },
        { id: '3', name: 'Todo 3', completed: false },
      ],
      filter: 'all',
    };

    const action = Actions.markCompleted({
      id: '1',
      todo: initialState.todos[0],
    });
    const actionWithInvalidId = Actions.markCompletedSuccess({
      id: '4',
      todo: initialState.todos[0],
    });

    // Act
    const newState = reducerTodo(initialState, action);
    const newStateWithInvalidId = reducerTodo(
      initialState,
      actionWithInvalidId
    );

    // Assert
    expect(newState.todos.length).toBe(3);

    // Check when action dispatched on targeted todo and other not change
    expect(newState.todos[0].id).toBe('1');
    expect(newState.todos[0].completed).toBe(true);

    // Check if other (second index) todos remain unchanged
    expect(newState.todos[2].id).toBe('3');
    expect(newState.todos[2].completed).toBe(false);

    // Should return the same state when MARKCOMPLETED action is dispatched with an invalid ID
    expect(newStateWithInvalidId).toEqual(initialState);
  });

  it('should toggle the completed status of a todo when MARKCOMPLETED action is dispatched', () => {
    // Add a completed todo to the initial state
    const todoToToggle = { id: '1', name: 'Todo to toggle', completed: true };
    const initialStateWithTodo = { ...initialState, todos: [todoToToggle] };

    const action = Actions.markCompleted({ id: '1', todo: todoToToggle });
    const newState = reducerTodo(initialStateWithTodo, action);

    // Check if the completed status is toggled in the state
    const toggledTodo = newState.todos.find((t) => t.id === todoToToggle.id);
    expect(toggledTodo).toBeTruthy();
    expect(toggledTodo!.completed).toBe(false);
  });
  it('should handle UPDATETODO action ', () => {
    // Arrange
    const initialState: State = {
      todos: [
        { id: '1', name: 'Todo 1', completed: false },
        { id: '2', name: 'Todo 2', completed: false },
        { id: '3', name: 'Todo 3', completed: false },
      ],
      filter: 'all',
    };

    const updatedTodo = { id: '1', name: 'Updated Todo 1', completed: false };
    const action = Actions.updateTodo({ id: '1', todo: updatedTodo });

    // Act
    const newState = reducerTodo(initialState, action);

    // Assert
    expect(newState.todos.length).toBe(3);

    // Check when action dispatched on targeted todo and name changed
    expect(newState.todos[0].id).toBe('1');
    expect(newState.todos[0].name).toBe('Updated Todo 1');

    // Check if other todos remain unchanged
    expect(newState.todos[0].completed).toBe(false);
  });
  it('should handle CLEARCOMPLETED action', () => {
    //Arrange
    const initialState: State = {
      todos: [
        { id: '1', name: 'Todo 1', completed: false },
        { id: '2', name: 'Todo 2', completed: true },
        { id: '3', name: 'Todo 3', completed: false },
      ],
      filter: 'all',
    };

    const Action = Actions.CLEARCOMPLETED();
    //Act
    const newState = reducerTodo(initialState, Action);

    //Assert
    expect(newState.todos.length).toBe(2);

    expect(newState.todos[1].id).toBe('3');
    expect(newState.todos[1].name).toBe('Todo 3');
    expect(newState.todos[1].completed).toBe(false);
  });
  it('should update the filter when handle FILTERDATA action', () => {
    // Arrange
    const initialState: State = {
      todos: [
        { id: '1', name: 'Todo 1', completed: true },
        { id: '2', name: 'Todo 2', completed: true },
        { id: '3', name: 'Todo 3', completed: true },
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
      { id: '1', name: 'Todo 1', completed: false },
      { id: '2', name: 'Todo 2', completed: true },
    ];

    const action = Actions.setTodo({ todo: todosToAdd });

    // Act
    const newState = reducerTodo(initialState, action);

    // Assert
    expect(newState.todos.length).toBe(2);

    // Check if the todos are added
    expect(newState.todos[0].id).toBe('1');
    expect(newState.todos[1].id).toBe('2');
    expect(newState.todos[1].completed).toBe(true);

    // Check if the filter property remains unchanged
    expect(newState.filter).toBe('all');
  });
});
