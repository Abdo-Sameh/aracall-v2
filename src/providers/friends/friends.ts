import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

/*
  Generated class for the FriendsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let userId;
@Injectable()
export class FriendsProvider {
  serverURL = 'http://192.168.1.252/arabface/api/'
  KEY = '89129812'
  constructor(public http: Http) {
    console.log('Hello FriendsProvider Provider');
    userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
  }

  unblockUser(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    urlSearchParams.append('userid', userId);
    let body = urlSearchParams.toString()
    return this.http.post(this.serverURL + this.KEY + '/unblock/user', body, { headers: headers })
      .map((res: any) => res.json());
  }

  getAllBlocked() {
    return this.http.get(this.serverURL + this.KEY + '/all/blocked?userid=' + userId)
      .map((res: any) => res.json());
  }

}
