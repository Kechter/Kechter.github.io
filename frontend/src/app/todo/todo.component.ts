import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService, Todo } from '../supabase.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  newTodoTitle: string = '';
  newTodoHours: number = 0;
  newTodoMinutes: number = 0;
  newTodoSeconds: number = 0;
  newTodoDueDate: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchTodos();
  }

  async fetchTodos() {
    try {
      this.todos = await this.supabaseService.getTodos();
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }

  calculateDuration(): number {
    return (this.newTodoHours * 3600) + (this.newTodoMinutes * 60) + this.newTodoSeconds;
  }

  async addTodo() {
    const duration = this.calculateDuration();
    if (this.newTodoTitle.trim() && duration > 0 && this.newTodoDueDate) {
      try {
        await this.supabaseService.addTodo({ 
          title: this.newTodoTitle, 
          work_duration: duration, 
          due_date: this.newTodoDueDate,
          is_complete: false 
        });
        this.newTodoTitle = '';
        this.newTodoHours = 0;
        this.newTodoMinutes = 0;
        this.newTodoSeconds = 0;
        this.newTodoDueDate = '';
        this.fetchTodos();
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    } else {
      alert('Please enter a valid todo title, duration, and due date.');
    }
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
}
