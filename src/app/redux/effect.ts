import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  withLatestFrom,
  mergeMap,
  map,
  catchError,
  switchMap,
} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { State, TodoData } from './reducer';
import * as TodoActions from './actions';
import { selectAllTodos } from './state';
import { ReduxTodoService } from './redux-todo.service';
import { of, Observable } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable()
export class TodoEffects {
  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private reduxTodoService: ReduxTodoService
  ) {}

  storeTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.ADDTODO),
      withLatestFrom(this.store.pipe(select(selectAllTodos))),
      mergeMap(([action, todos]) =>
        this.reduxTodoService
          .addTodo(action.todo)
          .pipe(
            map((addedTodo: TodoData) =>
              TodoActions.setTodo({ todo: [...todos, addedTodo] })
            )
          )
      )
    )
  );

  deleteTodo$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.DELETETODO),
      mergeMap((action) =>
        this.reduxTodoService
          .deleteTodo(action.id)
          .pipe(map(() => TodoActions.DELETETODO({ id: action.id })))
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
              TodoActions.UPDATETODO({ id: action.id, todo: action.todo })
            )
          )
      )
    )
  );

  markAsComplete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.MARKCOMPLETED),
      mergeMap((action) =>
        this.reduxTodoService
          .markAsComplete(action.id, true)
          .pipe(map(() => TodoActions.MARKCOMPLETED({ id: action.id })))
      )
    )
  );
}
