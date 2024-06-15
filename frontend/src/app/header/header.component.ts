import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title: string;

  constructor(private headerService: HeaderService) {
    this.title = 'Productivity App';
  }

  ngOnInit() {
    this.headerService.currentTitle.subscribe(title => this.title = title);
  }
}
