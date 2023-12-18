import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import * as todoPageActions from '../redux/actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TodoData } from '../redux/reducer';
import { Store } from '@ngrx/store';
import {
  selectAllTodos,
  incompleteTodosLength,
  selectFilteredTodos,
  selectCurrentTab,
} from '../redux/state';
import { ReduxTodoService } from '../redux/redux-todo.service';

@Component({
  selector: 'app-todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.scss'],
})
export class TodoAppComponent {
  allTodos$: Observable<TodoData[]>;
  incompleteTodosLength$: Observable<number>;

  todoForm: FormGroup;
  updateTodo: string | null = null;

  constructor(
    private fb: FormBuilder,
    private reduxTodoService: ReduxTodoService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.allTodos$ = this.reduxTodoService.getAllTodos();
    // this.incompleteTodosLength$ =
    // this.reduxTodoService.getIncompleteTodosLength();

    this.todoForm = this.fb.group({
      name: ['', Validators.required],
    });
    this.store.dispatch(todoPageActions.enterTodosPage());
    this.refreshData();
  }

  onSubmit() {
    if (this.updateTodo !== null) {
      const updatedTodo: TodoData = {
        id: this.updateTodo,
        name: this.todoForm.value.name,
        completed: false,
      };

      // this.reduxTodoService
      //   .updateTodo(this.updateTodo, updatedTodo)
      //   .subscribe(() => {
      //     this.refreshData();
      //     this.updateTodo = null;
      //   });
      this.store.dispatch(
        todoPageActions.UPDATETODO({ id: this.updateTodo, todo: updatedTodo })
      );
      this.refreshData();
      this.updateTodo = null;
    } else {
      const todo: TodoData = {
        id: uuidv4(),
        name: this.todoForm.value.name,
        completed: false,
      };

      // this.reduxTodoService.addTodo(todo).subscribe(() => this.refreshData());
      this.store.dispatch(todoPageActions.ADDTODO({ todo }));
      this.refreshData();
    }

    this.todoForm.reset();
  }

  deleteTodo(id: string): void {
    // this.reduxTodoService.deleteTodo(id).subscribe(() => this.refreshData());
    this.store.dispatch(todoPageActions.DELETETODO({ id }));
    this.refreshData();
  }

  markAsComplete(todo: TodoData) {
    if (todo.id !== undefined) {
      // this.reduxTodoService
      //   .markAsComplete(todo.id, !todo.completed)
      //   .subscribe(() => {
      //     todo.completed = !todo.completed;
      //   });
      this.store.dispatch(todoPageActions.MARKCOMPLETED({ id: todo.id }));
    }
    this.refreshData();
  }

  updateTodoText(todoId: string, todoText: string) {
    this.updateTodo = todoId;
    this.todoForm.setValue({ name: todoText });
  }

  clearCompleted(): void {
    this.allTodos$.subscribe((todos) => {
      const completedTodos = todos.filter((todo) => todo.completed);
      completedTodos.forEach((completedTodo) => {
        if (completedTodo.id) {
          this.reduxTodoService.deleteTodo(completedTodo.id).subscribe(() => {
            console.log('delete', completedTodo.id);
          });
        }
      });
      this.refreshData();
    });
  }

  private refreshData() {
    this.allTodos$ = this.reduxTodoService.getAllTodos();
    // this.incompleteTodosLength$ =
    // this.reduxTodoService.getIncompleteTodosLength();
  }
}
