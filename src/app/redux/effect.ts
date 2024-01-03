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
      ofType(TodoActions.addTodo),
      concatMap((action) => {
        return this.reduxTodoService.addTodo(action.todo).pipe(
          map((todo) => TodoActions.addTodoSuccess({ todo })),
          catchError((error) => {
            console.error('Error adding todo:', error);
            this.store.dispatch(
              TodoErrorActions.showNetworkError({
                errorMessage: 'Todos added failed.',
              })
            );
            return EMPTY;
          })
        );
      })
    );
  });

  deleteTodo$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.deleteTodo),
      mergeMap((action) =>
        this.reduxTodoService.deleteTodo(action.id).pipe(
          map(() => {
            console.log('Todo deleted successfully');
            return TodoActions.deleteTodoSuccess({ id: action.id });
          }),
          catchError((error) => {
            console.error('Error deleting todo:', error);
            this.store.dispatch(
              TodoErrorActions.showNetworkError({
                errorMessage: 'Network error. Todo not deleted',
              })
            );
            return EMPTY;
          })
        )
      )
    )
  );
  updateTodo$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.updateTodo),
      mergeMap((action) =>
        this.reduxTodoService.updateTodo(action.id, action.todo).pipe(
          map(() =>
            TodoActions.updatedTodoSuccess({
              id: action.id,
              todo: action.todo,
            })
          ),
          catchError((error) => {
            console.error('Error deleting todo:', error);
            this.store.dispatch(
              TodoErrorActions.showNetworkError({
                errorMessage: 'Network error. Todo Update Failed',
              })
            );
            return EMPTY;
          })
        )
      )
    )
  );

  markAsComplete$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.markCompleted),
      mergeMap((action) =>
        this.reduxTodoService
          .markAsComplete(action.id, !action.todo.completed)
          .pipe(
            map(() =>
              TodoActions.markCompletedSuccess({
                id: action.id,
                todo: action.todo,
              })
            ),
            catchError((error) => {
              console.error('Error deleting todo:', error);
              this.store.dispatch(
                TodoErrorActions.showNetworkError({
                  errorMessage: 'Network error. Todo not marked as completed',
                })
              );
              return EMPTY;
            })
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
          }),
          catchError((error) => {
            console.error('Error deleting todo:', error);
            this.store.dispatch(
              TodoErrorActions.showNetworkError({
                errorMessage: 'Network error. Not all completed todos Deleted',
              })
            );
            return EMPTY;
          })
        )
      )
    )
  );
}
