import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { SupabaseService, Todo } from '../supabase.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  todos: Todo[] = [];

  constructor(private headerService: HeaderService, private supabaseService: SupabaseService, private sharedService: SharedService) {}

  async ngOnInit() {
    this.headerService.changeTitle('Calendar');
    await this.fetchTodos();
    this.updateCalendarEvents();
  
    this.sharedService.todoUpdated$.subscribe(() => {
      this.fetchTodos();
      this.updateCalendarEvents();
    });
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
      eventClick: (arg) => this.handleTodoClick(arg)
    };

  async fetchTodos() {
    try{
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
      extendedProps: {
        work_duration: todo.work_duration,
        is_complete: todo.is_complete
      }
    }));
  }

  handleDateClick(arg: any) {
    alert('date click! ' + arg.dateStr)
  }

  handleTodoClick(arg: any) {
    console.log(arg.event.title)
    console.log(arg.event.extendedProps)
  }
  
  toggleWeekends() {
    this.calendarOptions = {
      ...this.calendarOptions,
      weekends: !this.calendarOptions.weekends  }
  }
}
