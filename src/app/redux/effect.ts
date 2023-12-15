import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, withLatestFrom, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { State, TodoData, initialState } from './reducer';
import * as TodoActions from './actions';
import { selectAllTodos } from './state';

@Injectable()
export class TodoEffects {
  constructor(private actions$: Actions, private store: Store<State>) {}

  storedTodo$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          TodoActions.ADDTODO,
          TodoActions.UPDATETODO,
          TodoActions.DELETETODO,
          TodoActions.MARKCOMPLETED,
          TodoActions.CLEARCOMPLETED
        ),
        withLatestFrom(this.store.pipe(select(selectAllTodos))),
        tap(([action, todos]) => {
          localStorage.setItem('todos', JSON.stringify(todos));
        })
      ),
    { dispatch: false }
  );
  retrieveTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.enterTodosPage),
      map(() => {
        const todos = localStorage.getItem('todos');
        return JSON.parse(todos) as TodoData[];
      }),
      map((todo) => TodoActions.setTodo({ todo }))
    )
  );
}
