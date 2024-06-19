import { Component, OnDestroy, OnInit } from '@angular/core';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnDestroy {
  timeLeft: number = 0;
  duration: number = 0;
  private intervalId: any = null;

  constructor(private supabase: SupabaseService) {}

  ngOnInit(): void {
    this.loadInitialTime();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  startTimer(): void {
    if (this.duration <= 0) return;
    this.clearTimer();
    this.timeLeft = this.duration;
    this.intervalId = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.clearTimer();
        this.timeLeft = 0;
      }
      this.saveTime();
    }, 1000);
  }

  clearTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async saveTime(): Promise<void> {
    const user = await this.supabase.loadUser();
    if (user) {
      await this.supabase.saveTimerData(user.id, this.timeLeft);
    }
  }

  async loadInitialTime(): Promise<void> {
    const user = await this.supabase.loadUser();
    if (user) {
      const savedTime = await this.supabase.loadTimerData(user.id);
      if (savedTime !== null) {
        this.timeLeft = savedTime;
      }
    }
  }

  formatTimeLeft(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}
