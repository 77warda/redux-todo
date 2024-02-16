import { createAction, props } from '@ngrx/store';

export const showNetworkError = createAction(
  '[Todo] Show Network Error',
  props<{ errorMessage: string }>()
);
export const removeErrorModal = createAction('[Error] Clear Error');
