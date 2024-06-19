import { Component , Input, OnInit} from '@angular/core';
import { HeaderService } from '../header.service';
import { AuthSession } from '@supabase/supabase-js';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit{

  @Input()
  session!: AuthSession
  
  constructor(private headerService: HeaderService) {}

  ngOnInit() {
    this.headerService.changeTitle('Productivity App');
  }
}
