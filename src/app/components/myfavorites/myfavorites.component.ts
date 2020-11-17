import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-myfavorites',
  templateUrl: './myfavorites.component.html',
  styleUrls: ['./myfavorites.component.css']
})
export class MyfavoritesComponent implements OnInit {
  allCategory = 0;
  component = 'myfavorites';

  constructor() { }

  ngOnInit(): void {
  }

}
