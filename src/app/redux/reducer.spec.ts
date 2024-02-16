import { reducerTodo, initialState, TodoData, adapter, State } from './reducer';
import * as TodoActions from './actions';
import { v4 as uuidv4 } from 'uuid';

const todos: TodoData[] = [
  {
    id: '1',
    name: 'Todo 1',
    completed: false,
  },
  {
    id: '2',
    name: 'Todo 2',
    completed: true,
  },
];

describe('reducer Todo', () => {
  let initialStateWithData: State;

  beforeEach(() => {
    initialStateWithData = {
      ...initialState,
      entities: adapter.setAll(todos, initialState).entities,
    };
  });

  it('should handle "Add todo" action', () => {
    // Arrange
    const todoToAdd: TodoData = {
      id: '3',
      name: 'Todo 3',
      completed: false,
    };
    const action = TodoActions.addTodoSuccess({ todo: todoToAdd });
    // Act
    const newState = reducerTodo(initialState, action);
    // Assert
    const entities = adapter.getSelectors().selectAll(newState);
    expect(entities.length).toBe(1);
    expect(entities[0].name).toEqual(todoToAdd.name);
  });
  it('should handle "set Todo" action', () => {
    // Arrange
    const todoToUpdate: TodoData = {
      id: '4',
      name: 'Updated Todo',
      completed: false,
    };
    const action = TodoActions.setTodo({ todo: todoToUpdate });

    // Act
    const newState = reducerTodo(initialState, action);
    // Assert
    const entities = adapter.getSelectors().selectAll(newState);
    expect(entities.length).toBe(1);
    expect(entities.find((todo) => todo.id === '3')).toBeUndefined();
    expect(entities.find((todo) => todo.id === '4')).toBeDefined();
    expect(entities.find((todo) => todo.id === '4')?.completed).toBe(false);
  });

  it('should handle "todoDeleted" action', () => {
    // Arrange
    const initialStateWithData: State = {
      ...initialState,
      entities: adapter.setAll(todos, initialState).entities,
    };
    const action = TodoActions.deleteTodoSuccess({ id: '1' });

    // Act
    const newState = reducerTodo(initialStateWithData, action);

    // Assert
    const entities = adapter.getSelectors().selectAll(newState);
    expect(entities.length).toBe(0);
    expect(entities.find((todo) => todo.id === '1')).toBeUndefined();
  });

  it('should handle "markCompletedSuccess" action', () => {
    // Arrange
    const todoIdToMarkCompleted = '2';
    const initialStateWithData: State = {
      ...initialState,
      entities: adapter.setAll(todos, initialState).entities,
    };
    const originalCompletedStatus =
      initialStateWithData.entities[todoIdToMarkCompleted]?.completed;
    const action = TodoActions.markCompletedSuccess({
      id: todoIdToMarkCompleted,
      todo: { id: '', name: '', completed: false },
    });

    // Act
    const newState = reducerTodo(initialStateWithData, action);

    // Assert
    const updatedTodo = newState.entities[todoIdToMarkCompleted];
    expect(updatedTodo).toBeDefined();
    expect(updatedTodo!.completed).toEqual(!originalCompletedStatus);
  });
  it('should handle "UpdateTodo" action', () => {
    // Arrange
    const initialStateWithData: State = {
      ...initialState,
      entities: adapter.setAll(todos, initialState).entities,
    };
    const updatedTodo: TodoData = {
      id: '1',
      name: 'Updated Todo 1',
      completed: false,
    };
    const action = TodoActions.updateTodo({
      id: '1',
      todo: { ...updatedTodo, name: 'Updated Todo 1' },
    });

    // Act
    const newState = reducerTodo(initialStateWithData, action);

    // Assert
    const updatedTodoState = newState.entities['1'];
    expect(updatedTodoState).toBeDefined();
    expect(updatedTodoState?.name).toBe(updatedTodo.name);
  });

  it('should handle "FilterData" action', () => {
    // Arrange
    const action = TodoActions.FILTERDATA({ filter: 'completed' });
    // Act
    const newState = reducerTodo(initialState, action);
    // Assert
    expect(newState.filter).toBe('completed');
  });

  it('should handle "loadTodoSuccess" action', () => {
    // Arrange
    const todos: TodoData[] = [
      {
        id: '1',
        name: 'Todo 1',
        completed: false,
      },
      {
        id: '2',
        name: 'Todo 2',
        completed: true,
      },
    ];
    const action = TodoActions.loadTodoSuccess({ todo: todos });

    // Act
    const newState = reducerTodo(initialStateWithData, action);

    // Assert
    const entities = adapter.getSelectors().selectAll(newState);
    expect(entities.length).toBe(2);
    expect(entities.find((todo) => todo.id === '1')).toEqual(todos[0]);
    expect(entities.find((todo) => todo.id === '2')).toEqual(todos[1]);
  });

  it('should handle "clearCompletedSuccess" action', () => {
    // Arrange
    const todos = [
      { id: '1', name: 'Todo 1', completed: true },
      { id: '2', name: 'Todo 2', completed: true },
      { id: '3', name: 'Todo 3', completed: true },
    ];
    const initialStateWithData: State = {
      ...initialState,
      entities: adapter.setAll(todos, initialState).entities,
    };
    const action = TodoActions.clearCompletedSuccess();

    // Act
    const newState = reducerTodo(initialStateWithData, action);

    // Assert
    const entities = adapter.getSelectors().selectAll(newState);
    const incompleteTodos = entities.filter((todo) => !todo.completed);
    expect(incompleteTodos.length).toBe(0);
  });
});
