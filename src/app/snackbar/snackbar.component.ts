import { Component, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ErrorState } from '../redux/error-reducer';
import * as ErrorActions from '../redux/error-action';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent {
  errorMessage$: Observable<string | null>;
  showSnackbar;
  constructor(private store: Store<{ error: ErrorState }>) {}

  ngOnInit(): void {
    this.errorMessage$ = this.store.pipe(select('error', 'errorMessage'));
  }

  close(): void {
    this.store.dispatch(ErrorActions.removeErrorModal());
  }
}
