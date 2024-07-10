import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SupabaseService, Todo } from '../supabase.service';

@Component({
  selector: 'app-todo-popover',
  templateUrl: './todo-popover.component.html',
  styleUrls: ['./todo-popover.component.css']
})
export class TodoPopoverComponent {
  @Input() isModalVisible: boolean = false;
  @Input() selectedTodo: Todo | null = null;
  @Output() modalClose: EventEmitter<void> = new EventEmitter<void>();

  todoMinutes: number = 0;
  todoSeconds: number = 0;

  constructor(private supabaseService: SupabaseService) {}

  openModal(todo: Todo) {
    this.selectedTodo = { ...todo };
    this.todoMinutes = Math.floor((todo.work_duration || 0) / 60);
    this.todoSeconds = (todo.work_duration || 0) % 60;
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
    this.selectedTodo = null;
    this.modalClose.emit();
  }

  async saveTodo() {
    if (this.selectedTodo) {
      const durationInSeconds = this.todoMinutes * 60 + this.todoSeconds;
      try {
        await this.supabaseService.updateTodo(this.selectedTodo.id!, {
          ...this.selectedTodo,
          work_duration: durationInSeconds
        });
        this.closeModal();
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    }
  }
}
