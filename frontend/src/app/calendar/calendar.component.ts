import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '../header.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { SupabaseService, Todo } from '../supabase.service';
import { SharedService } from '../shared.service';
import { TodoPopoverComponent } from '../todo-popover/todo-popover.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @ViewChild(TodoPopoverComponent) todoPopover!: TodoPopoverComponent;

  todos: Todo[] = [];
  selectedTodoId: string = '';
  private subscription: Subscription;

  constructor(
    private headerService: HeaderService,
    private supabaseService: SupabaseService,
    private sharedService: SharedService
  ) {
    this.subscription = this.sharedService.todoUpdated$.subscribe(() => {
      this.fetchTodos();
    });
  }

  ngOnInit() {
    this.headerService.changeTitle('Calendar');
    this.fetchTodos();

    this.sharedService.todoUpdated$.subscribe(() => {
      this.fetchTodos();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    weekends: false,
    height: "90vh",
    plugins: [timeGridPlugin, interactionPlugin, dayGridPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridDay,timeGridWeek,dayGridMonth'
    },
    dateClick: (arg) => this.handleDateClick(arg),
    events: [],
    eventClick: (arg) => this.handleTodoClick(arg),
    eventColor: 'blue',
  };

  async fetchTodos() {
    try {
      this.todos = await this.supabaseService.getTodos();
      this.updateCalendarEvents(); 
    }
    catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  updateCalendarEvents() {
    this.calendarOptions.events = this.todos.map(todo => ({
      title: todo.title,
      date: todo.due_date,
      allDay: true,
      extendedProps: {
        work_duration: todo.work_duration,
        id: todo.id
      }
    }));
  }

  handleTodoClick(arg: any) {
    const todoId = arg.event.extendedProps.id;
    const selectedTodo = this.todos.find(todo => todo.id === todoId);

    if (selectedTodo) {
      this.todoPopover.openModal(selectedTodo);
    }
  }

  handleDateClick(arg: any) {
    const dateStr = arg.dateStr;
    const selectedTodo = this.todos.find(todo => todo.due_date === dateStr);

    if (selectedTodo) {
      this.selectedTodoId = selectedTodo.id || '';
    }
  }

  toggleWeekends() {
    this.calendarOptions = {
      ...this.calendarOptions,
      weekends: !this.calendarOptions.weekends
    };
  }
}
