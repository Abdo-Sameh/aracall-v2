import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';


/*
  Generated class for the FriendsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FriendsProvider {
  serverURL = 'https://arabface.online/api/'
  KEY = '89129812'
  constructor(public http: Http) {
    console.log('Hello FriendsProvider Provider');
  }

  unblockUser(id, userId) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    urlSearchParams.append('userid', userId);
    let body = urlSearchParams.toString()
    return this.http.post(this.serverURL + this.KEY + '/unblock/user', body, { headers: headers })
      .map((res: any) => res.json());
  }

  getAllBlocked(userId) {
    return this.http.get(this.serverURL + this.KEY + '/all/blocked?userid=' + userId).map((res: any) => res.json());
  }

  blockUser(id, userId) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    urlSearchParams.append('userid', userId);
    let body = urlSearchParams.toString()
    return this.http.post(this.serverURL + this.KEY + '/block/user', body, { headers: headers })
      .map((res: any) => res.json());
  }

  getfriendprofile(userID) {
    return new Promise(resolve => {
      this.http.get(this.serverURL + this.KEY + '/profile/details?userid=' + userID).subscribe(data => {
        let data1 = data.text();
        data = JSON.parse(data1);
        resolve(data);
      })
    })
  }

  getFriends(userId) {
    return new Observable(observer => {
      let urlSearchParams = new URLSearchParams();
      urlSearchParams.append('userid', userId)
      let body = urlSearchParams.toString();
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      this.http.post(this.serverURL + this.KEY + '/profile/friends', body, { headers: headers }).subscribe(data => {
        let data1 = data.text();
        data = JSON.parse(data1);
        observer.next(data);
      })
    })
  }

  profileDetailsApiCall(theUserId, userId) {
    return this.http.get(this.serverURL + this.KEY + '/profile/details?userid=' + userId + '&the_userid=' + theUserId)
      .map((res: any) => res.json());

  }

  // search(term, userid) {
  //   return new Observable(observer => {
  //     this.http.get(this.serverURL + this.KEY + '/search?userid=' + userid + '&type=' + 'user' + '&term=' + term).subscribe(data => {
  //         let data1 = data.text();
  //         data = JSON.parse(data1);
  //         observer.next(data);
  //       })
  //   })
  // }
  search(term, type, userid) {
    return this.http.get(this.serverURL + this.KEY + '/search?userid=' + userid + '&type=' + type + '&term=' + term)
      .map((res: any) => res.json());
  }

}
