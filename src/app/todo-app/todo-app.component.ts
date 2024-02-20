import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import * as todoPageActions from '../redux/actions';
import * as TodoErrorActions from '../redux/error-action';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, catchError, of } from 'rxjs';
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
  activeFilter$: Observable<string>;
  errorMessage: string | null = null;
  networkErrorMessage$: Observable<string | null>;

  constructor(
    private fb: FormBuilder,
    private reduxTodoService: ReduxTodoService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store.dispatch(todoPageActions.loadTodo());
    this.allTodos$ = this.store.select(selectFilteredTodos);
    this.activeFilter$ = this.store.select(selectCurrentTab);
    this.incompleteTodosLength$ = this.store.select(incompleteTodosLength);
    this.todoForm = this.fb.group({
      name: ['', Validators.required],
    });

    // ============showing error============
    // this.reduxTodoService
    //   .getAllTodos()
    //   .pipe(
    //     catchError((error) => {
    //       console.error('Error loading todos:', error);
    //       this.errorMessage = 'Failed to load todos. Please try again.';
    //       return of([]);
    //     })
    //   )
    //   .subscribe(() => {
    //     console.log('Successfully loaded');
    //   });
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
      //   this.refreshData();
      //     this.updateTodo = null;
      //   });
      this.store.dispatch(
        todoPageActions.updateTodo({ id: this.updateTodo, todo: updatedTodo })
      );
      this.updateTodo = null;
    } else {
      const todo: TodoData = {
        id: uuidv4(),
        name: this.todoForm.value.name,
        completed: false,
      };

      // this.reduxTodoService.addTodo(todo).subscribe(() => this.refreshData());
      this.store.dispatch(todoPageActions.addTodo({ todo }));
    }
    this.todoForm.reset();
  }

  deleteTodo(id: string, todoToDelete: TodoData): void {
    // this.reduxTodoService.deleteTodo(id).subscribe(() => this.refreshData());
    this.store.dispatch(todoPageActions.deleteTodo({ id }));
  }

  markAsComplete(todo: TodoData) {
    if (todo.id !== undefined) {
      // this.reduxTodoService
      //   .markAsComplete(todo.id, !todo.completed)
      //   .subscribe(() => {
      //     todo.completed = !todo.completed;
      //   });
      this.store.dispatch(
        todoPageActions.markCompleted({ id: todo.id, todo: todo })
      );
    }
  }

  updateTodoText(todoId: string, todoText: string) {
    this.updateTodo = todoId;
    this.todoForm.setValue({ name: todoText });
  }

  clearCompleted(): void {
    // this.allTodos$.subscribe((todos) => {
    //   const completedTodos = todos.filter((todo) => todo.completed);
    //   completedTodos.forEach((completedTodo) => {
    //     if (completedTodo.id) {
    //       this.reduxTodoService.deleteTodo(completedTodo.id).subscribe(() => {
    //         console.log('delete', completedTodo.id);
    //       });
    //     }
    //   });
    //   // this.refreshData();
    // });
    this.store.dispatch(todoPageActions.CLEARCOMPLETED());
  }
  setFilter(filterTodo: 'all' | 'active' | 'completed'): void {
    this.store.dispatch(todoPageActions.FILTERDATA({ filterTodo }));
  }
}
