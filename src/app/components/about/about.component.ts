import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  team = [];
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getTeamDetails();
  }

  getTeamDetails() {
    this.http.get('assets/image.json')
      .subscribe(
      res => {
        this.team = res['team'];
      }
    );
  }

}
