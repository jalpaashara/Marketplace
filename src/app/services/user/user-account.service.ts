import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserDetails} from '../../models/user-details';
import {environment} from '../../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {

  temp: UserDetails;
  private user = new BehaviorSubject<UserDetails>(this.temp);
  currUser = this.user.asObservable();


  constructor(public http: HttpClient) { }

  setUserDetails(user) {
    const url = environment.api + '/user';
    return this.http.post(url, user);
  }

  getUserWithEmail(emailId: string) {
    const u = {
      email: emailId
    };
    const url = environment.api + '/user';
    return this.http.post(url, u);
  }

  getUserById(id: number): Observable<any> {
    const url = environment.api + '/user/' + id;
    return this.http.get(url);
  }

  setCurrUserDetails(user: UserDetails) {
    this.user.next(user);
    let usr;
    this.currUser.subscribe(res =>  usr = res);
    localStorage.setItem('currUser', JSON.stringify(usr));
  }

  getCurrUserDetails() {
    return JSON.parse(localStorage.getItem('currUser'));
  }

  updateUserInfo(id, data) {
    const url = environment.api + '/user/' + id;
    return this.http.put(url, data);
  }

  deleteUserAccount(id) {
    const url = environment.api + '/user/' + id;
    return this.http.delete(url);
  }
}
