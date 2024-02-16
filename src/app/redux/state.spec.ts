import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { EntityState } from '@ngrx/entity';
import {
  SharedStateTodosModule,
  State,
  selectAllTodos,
  selectFilteredTodos,
  selectCurrentTab,
  incompleteTodosLength,
  selectSharedTodosState,
} from './state';
import { TodoData } from './reducer';
import * as fromBooks from './reducer';

describe('Selectors', () => {
  let store: MockStore<State>;
  let mockTodos: TodoData[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedStateTodosModule, StoreModule.forRoot({})],
      providers: [provideMockStore()],
    });

    store = TestBed.inject(Store) as MockStore<State>;

    // Sample todos for testing
    mockTodos = [
      { id: '1', name: 'Todo 1', completed: false },
      { id: '2', name: 'Todo 2', completed: true },
      { id: '3', name: 'Todo 3', completed: false },
    ];
  });
  it('should select all todos', () => {
    store.overrideSelector(selectAllTodos, mockTodos);
    let result: TodoData[];

    store.select(selectAllTodos).subscribe((todos) => {
      result = todos;
    });

    expect(result).toEqual(mockTodos);
  });

  it('should calculate incomplete todos length', () => {
    const incompleteLength = mockTodos.filter((todo) => !todo.completed).length;
    store.overrideSelector(selectAllTodos, mockTodos);
    let result: number;

    store.select(incompleteTodosLength).subscribe((length) => {
      result = length;
    });

    expect(result).toEqual(incompleteLength);
  });
  it('should select filtered todos based on current tab', () => {
    const activeTodos = mockTodos.filter((todo) => !todo.completed);
    store.overrideSelector(selectAllTodos, mockTodos);
    store.overrideSelector(selectCurrentTab, 'active');
    let result: TodoData[];

    store.select(selectFilteredTodos).subscribe((todos) => {
      result = todos;
    });

    expect(result).toEqual(activeTodos);
  });
  describe('Filter all todos according to diffeent tabs', () => {
    it('should select filtered todos based on current tab when tab is active', () => {
      const activeTodos = mockTodos.filter((todo) => !todo.completed);
      store.overrideSelector(selectAllTodos, mockTodos);
      store.overrideSelector(selectCurrentTab, 'active');
      let result: TodoData[];

      store.select(selectFilteredTodos).subscribe((todos) => {
        result = todos;
      });

      expect(result).toEqual(activeTodos);
    });

    it('should select filtered todos based on current tab when tab is completed', () => {
      const completedTodos = mockTodos.filter((todo) => todo.completed);
      store.overrideSelector(selectAllTodos, mockTodos);
      store.overrideSelector(selectCurrentTab, 'completed');
      let result: TodoData[];

      store.select(selectFilteredTodos).subscribe((todos) => {
        result = todos;
      });

      expect(result).toEqual(completedTodos);
    });

    it('should select all todos when tab is undefined', () => {
      store.overrideSelector(selectAllTodos, mockTodos);
      store.overrideSelector(selectCurrentTab, undefined);
      let result: TodoData[];

      store.select(selectFilteredTodos).subscribe((todos) => {
        result = todos;
      });

      expect(result).toEqual(mockTodos);
    });

    it('should select the current tab', () => {
      const currentTab = 'active';
      store.overrideSelector(selectCurrentTab, currentTab);
      let result: string;

      store.select(selectCurrentTab).subscribe((tab) => {
        result = tab;
      });

      expect(result).toEqual(currentTab);
    });
  });
});
