import { Component, OnInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TodoData } from '../redux/reducer';
import { Store } from '@ngrx/store';
import * as TodoActions from '../redux/actions';
import {
  selectFilteredTodos,
  selectCurrentTab,
  incompleteTodosLength,
} from '../redux/state';
import { ReduxTodoService } from '../redux/redux-todo.service';

@Component({
  selector: 'app-todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.scss'],
})
export class TodoAppComponent implements OnInit {
  allTodos$: Observable<TodoData[]>;
  incompleteTodosLength$: Observable<number>;
  activeFilter$: Observable<string>;

  todoForm: FormGroup;
  updateTodo: string | null = null;

  constructor(
    private fb: FormBuilder,
    private reduxTodoService: ReduxTodoService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.allTodos$ = this.store.select(selectFilteredTodos);
    this.activeFilter$ = this.store.select(selectCurrentTab);
    this.incompleteTodosLength$ = this.store.select(incompleteTodosLength);
    this.todoForm = this.fb.group({
      name: ['', Validators.required],
    });
    this.reduxTodoService.fetchTodosFromJson();
  }

  onSubmit() {
    if (this.updateTodo !== null) {
      const updatedTodo: TodoData = {
        id: this.updateTodo,
        name: this.todoForm.value.name,
        completed: false,
      };
      this.store.dispatch(
        TodoActions.UPDATETODO({ id: this.updateTodo, todo: updatedTodo })
      );
      this.updateTodo = null;
    } else {
      const todo: TodoData = {
        id: uuidv4(),
        name: this.todoForm.value.name,
        completed: false,
      };
      this.store.dispatch(TodoActions.ADDTODO({ todo }));
    }

    this.todoForm.reset();
  }

  deleteTodo(id: string): void {
    this.store.dispatch(TodoActions.DELETETODO({ id }));
  }

  markAsComplete(todo: TodoData) {
    if (todo.id !== undefined) {
      this.store.dispatch(TodoActions.MARKCOMPLETED({ id: todo.id }));
    }
  }

  updateTodoText(todoId: string, todoText: string) {
    this.updateTodo = todoId;
    this.todoForm.setValue({ name: todoText });
  }

  clearCompleted(): void {
    this.store.dispatch(TodoActions.CLEARCOMPLETED());
  }
}
