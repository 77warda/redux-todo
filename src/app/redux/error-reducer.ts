import { createReducer, on } from '@ngrx/store';
import * as ErrorActions from './error-action';

export interface ErrorState {
  errorMessage: string | null;
}

export const initialErrorState: ErrorState = {
  errorMessage: null,
};

export const errorReducer = createReducer(
  initialErrorState,
  on(ErrorActions.showNetworkError, (state, { errorMessage }) => ({
    ...state,
    errorMessage,
  })),
  on(ErrorActions.removeErrorModal, (state) => ({
    ...state,
    errorMessage: null,
  }))
);
