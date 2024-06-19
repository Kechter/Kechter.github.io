import { Component, OnDestroy, OnInit } from '@angular/core';
import { SupabaseService } from '../supabase.service'; // Adjust the path according to your project structure

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnDestroy {
  timeLeft: number = 0; // Remaining time
  duration: number = 0; // User input duration
  private intervalId: any = null;

  constructor(private supabase: SupabaseService) {}

  ngOnInit(): void {
    this.loadInitialTime(); // Load initial timer state if needed
  }

  ngOnDestroy(): void {
    this.clearTimer(); // Clean up the interval on component destruction
  }

  startTimer(): void {
    if (this.duration <= 0) return; // Do nothing if duration is not set
    this.clearTimer(); // Ensure no existing timers are running

    this.timeLeft = this.duration;
    this.intervalId = setInterval(() => {
      this.timeLeft--;

      if (this.timeLeft <= 0) {
        this.clearTimer(); // Stop timer when time runs out
        this.timeLeft = 0;
      }
      this.saveTime(); // Save the updated time to Supabase
    }, 1000); // Update every second
  }

  clearTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async saveTime(): Promise<void> {
    // Save the remaining time to Supabase if required
    const user = await this.supabase.loadUser();
    if (user) {
      await this.supabase.saveTimerData(user.id, this.timeLeft); // Implement saveTimerData in Supabase service
    }
  }

  async loadInitialTime(): Promise<void> {
    // Load initial time from Supabase if required
    const user = await this.supabase.loadUser();
    if (user) {
      const savedTime = await this.supabase.loadTimerData(user.id); // Implement loadTimerData in Supabase service
      if (savedTime !== null) {
        this.timeLeft = savedTime;
      }
    }
  }
}
