import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private todoUpdated = new Subject<void>();

  get todoUpdated$() {
    return this.todoUpdated.asObservable();
  }

  notifyTodoUpdated() {
    this.todoUpdated.next();
  }
}