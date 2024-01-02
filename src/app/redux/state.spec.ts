import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import {
  selectAllTodos,
  incompleteTodosLength,
  selectFilteredTodos,
  SharedStateTodosModule,
  selectCurrentTab,
} from './state';
import { initialState } from './reducer';
import * as TodoActions from './actions';

describe('Todo Selectors', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        // Import the necessary modules for testing
        StoreModule.forRoot({}),
        SharedStateTodosModule,
      ],
    });

    store = TestBed.inject(Store);
  });

  it('should select all todos', () => {
    let result: any;

    //Arrange
    store.dispatch(
      TodoActions.setTodo({
        todo: [
          { id: '1', name: 'Todo 1', completed: false },
          { id: '2', name: 'Todo 2', completed: true },
          { id: '3', name: 'Todo 3', completed: false },
        ],
      })
    );

    // Act
    store.select(selectAllTodos).subscribe((todos) => {
      result = todos;
    });

    // Assert
    expect(result).toEqual(initialState.todos);
  });

  it('should select current tab', () => {
    let result: 'all' | 'active' | 'completed' | undefined;

    store.select(selectCurrentTab).subscribe((tab) => {
      result = tab;
    });

    expect(result).toBe('all');
  });
});
