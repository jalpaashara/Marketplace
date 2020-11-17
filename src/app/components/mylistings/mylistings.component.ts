import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mylistings',
  templateUrl: './mylistings.component.html',
  styleUrls: ['./mylistings.component.css']
})
export class MylistingsComponent implements OnInit {
  component = 'mylistings';
  allCategory = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
