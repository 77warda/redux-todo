import { Component, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, first } from 'rxjs';
import { ErrorState } from '../redux/error-reducer';
import * as ErrorActions from '../redux/error-action';
import * as todoPageActions from '../redux/actions';
import { TodoData } from '../redux/reducer';
import { Actions } from '@ngrx/effects';
import { getDeleteMsg, selectDeletedTodo } from '../redux/state';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent {
  errorMessage$: Observable<string | null>;
  deleteMessage$: Observable<string>;
  deletedTodo$: Observable<TodoData | null>;
  // showSnackbar;
  deletedTodo: TodoData | null;
  private timeoutId: ReturnType<typeof setTimeout>;
  constructor(private store: Store<{ error: ErrorState }>) {}

  ngOnInit(): void {
    this.errorMessage$ = this.store.pipe(select('error', 'errorMessage'));
    this.deleteMessage$ = this.store.pipe(select(getDeleteMsg));
    this.deletedTodo$ = this.store.pipe(select(selectDeletedTodo));
    this.deletedTodo$.subscribe((deletedTodo) => {
      this.deletedTodo = deletedTodo;
      console.log('Deleted Object:', deletedTodo);
    });
  }

  close(): void {
    this.store.dispatch(ErrorActions.removeErrorModal());
  }

  undoDelete(): void {
    if (this.deletedTodo) {
      this.store.dispatch(todoPageActions.undoDeletedTodo());
      this.store.dispatch(todoPageActions.resetDeleteMsg());
    } else {
      console.log('No deleted todo to undo');
    }
  }
}
