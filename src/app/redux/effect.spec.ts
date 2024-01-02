import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { TodoEffects } from './effect';
import * as TodoActions from './actions';
import * as TodoErrorActions from './error-action';
import { ReduxTodoService } from './redux-todo.service';
import { StoreModule } from '@ngrx/store';

describe('TodoEffects', () => {
  let effects: TodoEffects;
  let actions$: Observable<any>;
  let reduxTodoService: jasmine.SpyObj<ReduxTodoService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        TodoEffects,
        provideMockActions(() => actions$),
        {
          provide: ReduxTodoService,
          useValue: jasmine.createSpyObj('ReduxTodoService', [
            'getAllTodos',
            'addTodo',
            'deleteTodo',
            'updateTodo',
            'markAsComplete',
          ]),
        },
      ],
    });

    effects = TestBed.inject(TodoEffects);
    actions$ = TestBed.inject(Actions);
    reduxTodoService = TestBed.inject(
      ReduxTodoService
    ) as jasmine.SpyObj<ReduxTodoService>;
  });

  it('should dispatch loadTodoSuccess action on successful loadTodos', () => {
    const todos = [{ id: '1', name: 'Todo 1', completed: false }];
    const action = TodoActions.loadTodo();

    reduxTodoService.getAllTodos.and.returnValue(of(todos));

    actions$ = of(action);

    effects.loadTodos$.subscribe((resultAction) => {
      expect(resultAction).toEqual(
        TodoActions.loadTodoSuccess({ todo: todos })
      );
    });
  });

  it('should dispatch showNetworkError action on error in loadTodos', () => {
    const error = 'Failed to load todos. Please try again.';
    const action = TodoActions.loadTodo();

    reduxTodoService.getAllTodos.and.returnValue(throwError(error));

    actions$ = of(action);

    effects.loadTodos$.subscribe((resultAction) => {
      expect(resultAction).toEqual(
        jasmine.any(TodoErrorActions.showNetworkError)
      );
    });
  });

  it('should dispatch todoAdded action on successful addTodo', () => {
    const todo = { id: '1', name: 'New Todo', completed: false };
    const action = TodoActions.addTodo({ todo });

    reduxTodoService.addTodo.and.returnValue(of(todo));

    actions$ = of(action);

    effects.addTodo$.subscribe((resultAction) => {
      expect(resultAction).toEqual(TodoActions.addTodoSuccess({ todo }));
    });
  });

  it('should dispatch todoDeleted action on successful deleteTodo', () => {
    const action = TodoActions.deleteTodo({ id: '1' });

    reduxTodoService.deleteTodo.and.returnValue(of(null));

    actions$ = of(action);

    effects.deleteTodo$.subscribe((resultAction) => {
      expect(resultAction).toEqual(TodoActions.deleteTodoSuccess({ id: '1' }));
    });
  });

  it('should dispatch todoToBeUpdated action on successful updateTodo', () => {
    const todo = { id: '1', name: 'Updated Todo', completed: false };
    const action = TodoActions.updateTodo({
      id: '1',
      todo: { id: '1', name: 'Updated Todo', completed: false },
    });

    reduxTodoService.updateTodo.and.returnValue(of(todo));

    actions$ = of(action);

    effects.updateTodo$.subscribe((resultAction) => {
      expect(resultAction).toEqual(
        TodoActions.updatedTodoSuccess({ id: '1', todo })
      );
    });
  });

  it('should dispatch markAsCompleted action on successful markAsComplete', () => {
    const todo = { id: '1', name: 'Todo 1', completed: false };
    const action = TodoActions.markCompleted({ id: '1', todo });

    reduxTodoService.markAsComplete.and.returnValue(of(todo));

    actions$ = of(action);

    effects.markAsComplete$.subscribe((resultAction) => {
      expect(resultAction).toEqual(
        TodoActions.markCompletedSuccess({ id: '1', todo })
      );
    });
  });

  it('should dispatch clearCompletedSuccess action on successful clearCompleted', () => {
    const action = TodoActions.CLEARCOMPLETED();

    reduxTodoService.getAllTodos.and.returnValue(of([]));

    actions$ = of(action);

    effects.clearCompleted$.subscribe((resultAction) => {
      expect(resultAction).toEqual(TodoActions.clearCompletedSuccess());
    });
  });
});
