import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  withLatestFrom,
  mergeMap,
  map,
  catchError,
  switchMap,
  concatMap,
  exhaustMap,
} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { State, TodoData } from './reducer';
import * as TodoActions from './actions';
import * as TodoErrorActions from './error-action';
import { selectAllTodos } from './state';
import { ReduxTodoService } from './redux-todo.service';
import { of, Observable, EMPTY } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable()
export class TodoEffects {
  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private reduxTodoService: ReduxTodoService
  ) {}

  // loadTodos$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(TodoActions.loadTodo),
  //     exhaustMap(() => {
  //       return this.reduxTodoService
  //         .getAllTodos()
  //         .pipe(map((todo) => TodoActions.loadTodoSuccess({ todo })));
  //     })
  //   );
  // });
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodo),
      mergeMap(() =>
        this.reduxTodoService.getAllTodos().pipe(
          map((todo) => TodoActions.loadTodoSuccess({ todo })),
          catchError((error) => {
            console.error('Error in todos:', error);
            this.store.dispatch(
              TodoErrorActions.showNetworkError({
                errorMessage: 'Failed to load todos. Please try again.',
              })
            );
            return EMPTY;
          })
        )
      )
    )
  );
  addTodo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoActions.ADDTODO),
      concatMap((action) => {
        return this.reduxTodoService
          .addTodo(action.todo)
          .pipe(map((todo) => TodoActions.todoAdded({ todo })));
      })
    );
  });

  deleteTodo$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.DELETETODO),
      mergeMap((action) =>
        this.reduxTodoService
          .deleteTodo(action.id)
          .pipe(map(() => TodoActions.todoDeleted({ id: action.id })))
      )
    )
  );
  updateTodo$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.UPDATETODO),
      mergeMap((action) =>
        this.reduxTodoService
          .updateTodo(action.id, action.todo)
          .pipe(
            map(() =>
              TodoActions.todoToBeUpdated({ id: action.id, todo: action.todo })
            )
          )
      )
    )
  );

  markAsComplete$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.MARKCOMPLETED),
      mergeMap((action) =>
        this.reduxTodoService
          .markAsComplete(action.id, !action.todo.completed)
          .pipe(
            map(() =>
              TodoActions.markAsCompleted({ id: action.id, todo: action.todo })
            )
          )
      )
    )
  );
  clearCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.CLEARCOMPLETED),
      mergeMap(() =>
        this.reduxTodoService.getAllTodos().pipe(
          map((todos) => {
            const completedTodos = todos.filter((todo) => todo.completed);
            completedTodos.forEach((completedTodo) => {
              if (completedTodo.id) {
                this.reduxTodoService
                  .deleteTodo(completedTodo.id)
                  .subscribe(() => {
                    console.log('delete', completedTodo.id);
                  });
              }
            });
            return TodoActions.clearCompletedSuccess();
          })
        )
      )
    )
  );
}
