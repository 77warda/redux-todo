import { TestBed } from '@angular/core/testing';

import { ReduxTodoService } from './redux-todo.service';

describe('ReduxTodoService', () => {
  let service: ReduxTodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReduxTodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
