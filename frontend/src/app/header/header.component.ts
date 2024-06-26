import { Component, Input, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { SupabaseService } from '../supabase.service';
import { AuthSession, User } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title: string = 'Productivity App';
  user: User | null = null; 

  @Input() session!: AuthSession;

  constructor(
    private headerService: HeaderService, 
    private readonly supabase: SupabaseService, 
    private router: Router,
    private location: Location
  ) {}

  async ngOnInit() {
    this.headerService.currentTitle.subscribe(title => this.title = title);
    await this.loadUser();
  }

  async loadUser() {
    this.user = await this.supabase.loadUser(); 
  }
  
  async signOut() {
    await this.supabase.signOut();
    this.router.navigate(['/login']);
  }

  goBack() {
    this.location.back();
  }

  goHome() {
    this.router.navigate(['/homepage'])
  }
}
