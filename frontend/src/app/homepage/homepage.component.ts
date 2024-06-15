import { Component , OnInit} from '@angular/core';
import { HeaderService } from '../header.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit{

  constructor(private headerService: HeaderService) {}

  ngOnInit() {
    this.headerService.changeTitle('Productivity App');
  }
}
