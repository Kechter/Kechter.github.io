import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService, Todo } from '../supabase.service';
import { SharedService } from '../shared.service';
import { TodoPopoverComponent } from '../todo-popover/todo-popover.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit, OnDestroy {
  @ViewChild(TodoPopoverComponent) todoPopover!: TodoPopoverComponent;
  todos: Todo[] = [];
  newTodoTitle: string = '';
  newTodoHours: number = 0;
  newTodoMinutes: number = 0;
  newTodoSeconds: number = 0;
  newTodoDueDate: string = '';
  private subscription: Subscription;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.subscription = this.sharedService.todoUpdated$.subscribe(() => {
      this.fetchTodos();
    });
  }

  ngOnInit() {
    this.fetchTodos();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async fetchTodos() {
    try {
      this.todos = await this.supabaseService.getTodos();
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }

  async addTodo() {
    const dueDate = new Date(this.newTodoDueDate);
    const seconds = this.newTodoHours * 3600 + this.newTodoMinutes * 60 + this.newTodoSeconds;
    const newTodo: Todo = {
      title: this.newTodoTitle,
      due_date: dueDate.toISOString(),
      work_duration: seconds,
      is_complete: false
    };

    try {
      await this.supabaseService.addTodo(newTodo); 
      this.newTodoTitle = '';
      this.newTodoHours = 0;
      this.newTodoMinutes = 0;
      this.newTodoSeconds = 0;
      this.newTodoDueDate = '';
      this.fetchTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  }

  editTodoInModal(todo: Todo) {
    this.todoPopover.openModal(todo);
  }

  async toggleComplete(todo: Todo) {
    try {
      await this.supabaseService.updateTodo(todo.id!, { is_complete: !todo.is_complete });
      this.fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }

  async deleteTodo(id: string) {
    try {
      await this.supabaseService.deleteTodo(id);
      this.fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }

  startTimer(todo: Todo) {
    this.router.navigate(['/timer'], { state: { todoId: todo.id } });
  }

  calculateDuration(durationInSeconds: number): string {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes} min ${seconds} sec`;
  }
}
