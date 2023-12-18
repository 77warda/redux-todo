import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TodoData } from './reducer';
import { Observable, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import * as Actions from './actions';

@Injectable({
  providedIn: 'root',
})
export class ReduxTodoService {
  private apiUrl = 'http://localhost:3000/todos';

  constructor(private http: HttpClient, private store: Store) {}

  getAllTodos(): Observable<TodoData[]> {
    return this.http.get<TodoData[]>(this.apiUrl);
  }

  addTodo(todo: TodoData): Observable<TodoData> {
    return this.http.post<TodoData>(this.apiUrl, todo);
  }

  updateTodo(id: string, todo: TodoData): Observable<TodoData> {
    return this.http.put<TodoData>(`${this.apiUrl}/${id}`, todo);
  }

  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  markAsComplete(todoId: string, status: boolean): Observable<TodoData> {
    return this.http.patch<TodoData>(`${this.apiUrl}/${todoId}`, {
      completed: status,
    });
  }

  clearCompleted(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}?completed=true`);
  }

  // getIncompleteTodosLength(): Observable<number> {
  //   return this.http.get<number>(`${this.apiUrl}/incomplete/count`);
  // }
}
