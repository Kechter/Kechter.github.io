import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  constructor(private headerService: HeaderService) {}

  ngOnInit() {
    this.headerService.changeTitle('Calendar');
  }

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    weekends: false,
    plugins: [timeGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: [
      { title: 'event 1', date: '2024-06-26' },
    ]
  };

  handleDateClick(arg: any) {
    alert('date click! ' + arg.dateStr)
  }
  
  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends
  }
}
