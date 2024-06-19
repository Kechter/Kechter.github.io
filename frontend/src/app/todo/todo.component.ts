import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';
import { SupabaseService, Todo } from '../supabase.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  newTodo: string = '';
  constructor(private headerService: HeaderService, private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.headerService.changeTitle('Todo');
    this.fetchTodos();
  }
  
  async fetchTodos() {
    try {
      this.todos = await this.supabaseService.getTodos();
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }

  async addTodo() {
    if (this.newTodo.trim()) {
      try {
        await this.supabaseService.addTodo({ title: this.newTodo, is_complete: false });
        this.newTodo = '';
        this.fetchTodos();
      } catch (error) {
        console.error('Error adding todo:', error);
      }
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
}
