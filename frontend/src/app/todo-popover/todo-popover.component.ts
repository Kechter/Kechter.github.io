import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-todo-popover',
  templateUrl: './todo-popover.component.html',
  styleUrls: ['./todo-popover.component.css']
})
export class TodoPopoverComponent {
  @Input() selectedTodoId: string | null = null;
  isModalVisible: boolean = false;

  openModal(todoId: string) {
    this.selectedTodoId = todoId;
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }
}

