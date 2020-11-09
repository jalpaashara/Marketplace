import { Component, OnInit } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  faSearch = faSearch;
  searchForm: FormGroup;

  get formVal() { return this.searchForm.controls; }

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchStr: new FormControl('')
    });
  }

  onSubmitSearch() {
    // console.log(this.searchForm.controls.searchStr);
    if (this.searchForm.valid) {
      this.router.navigate(['/search'],
        { queryParams: { q: this.searchForm.value.searchStr } }).then(() => {
        window.location.reload();
      });
    }   else {
      return;
    }
  }
}
