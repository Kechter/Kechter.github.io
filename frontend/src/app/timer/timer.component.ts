import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnDestroy {
  timeLeft: number = 0; 
  duration: number = 0;
  public intervalId: any = null;
  private lastSavedTime: number = 0;
  private saveInterval: number = 60; 
  private todoId: string = '';

  durationMinutes: number = 0;
  durationSeconds: number = 0;

  constructor(private supabase: SupabaseService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.loadInitialTime();
  }

  ngOnDestroy(): void {
    this.clearTimer();
    this.saveTime(true);
  }

  async loadInitialTime(): Promise<void> {
    this.todoId = history.state.todoId;
    if (this.todoId) {
      try {
        const todos = await this.supabase.getTodos();
        const todo = todos.find(t => t.id === this.todoId);
        if (todo) {
          this.timeLeft = todo.work_duration ?? 0;
          this.duration = this.timeLeft;
          this.startTimer();
        }
      } catch (error) {
        console.error('Error loading initial time:', error);
      }
    }
  }

  startTimer(resume: boolean = false): void {
    if (!resume && this.duration <= 0) return;
    this.clearTimer();
    if (!resume) this.timeLeft = this.duration;
    this.lastSavedTime = this.timeLeft;
    this.intervalId = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.clearTimer();
        this.timeLeft = 0;
        this.saveTime(true); 
      } else if (this.timeLeft % this.saveInterval === 0) {
        this.saveTime();
      }
    }, 1000);
  }

  clearTimer(save: boolean = false): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (save) {
      this.saveTime(true);
    }
  }

  async saveTime(force: boolean = false): Promise<void> {
    if (force || Math.abs(this.lastSavedTime - this.timeLeft) >= this.saveInterval) {
      try {
        await this.supabase.updateTodo(this.todoId, { 
          work_duration: this.timeLeft
        });
        this.lastSavedTime = this.timeLeft; 
      } catch (error) {
        console.error('Error saving time:', error);
      }
    }
  }

  formatTimeLeft(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  toggleTimer(): void {
    if (this.intervalId) {
      this.clearTimer(true);
    } else {
      this.startTimer(true);
    }
  }

  setDuration(): void {
    this.duration = this.durationMinutes * 60 + this.durationSeconds;
    this.timeLeft = this.duration;
  }
}
