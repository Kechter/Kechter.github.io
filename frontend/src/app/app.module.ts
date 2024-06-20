import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { CalendarComponent } from './calendar/calendar.component';
import { TodoComponent } from './todo/todo.component';
import { TimerComponent } from './timer/timer.component';
import { HeaderComponent } from './header/header.component';
import { LucideAngularModule ,File, Home, Menu, UserCheck, Settings, LogIn, LogOut } from 'lucide-angular';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    RegisterComponent,
    LoginComponent,
    HomepageComponent,
    CalendarComponent,
    TodoComponent,
    TimerComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    LucideAngularModule.pick({File,Home,Menu,UserCheck, Settings, LogIn, LogOut})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
