import { Component, OnInit } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthSession } from '@supabase/supabase-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'angular-user-management';

  session: AuthSession | null = null;

  constructor(private readonly supabase: SupabaseService, private readonly router: Router) {}

  ngOnInit() {
    this.supabase.authState$.subscribe((session: AuthSession | null) => {
      this.session = session;
    });
  }

  isAuthRoute(): boolean {
    return this.router.url.includes('register') || this.router.url.includes('login');
  }
}
