import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let apiURL = 'https://arabface.online/api/89129812/';

@Injectable()
export class AuthProvider {

  constructor(public httpClient: HttpClient, public http: Http) {
    console.log('Hello AuthProvider Provider');
  }

  ///////// Login function Start ////////
  /* Function for handling user login in by   */
  loginPostData(sentData, type) {

    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let urlSearchParams = new URLSearchParams();
      urlSearchParams.append('username', sentData.username);
      urlSearchParams.append('password', sentData.password);
      let body = urlSearchParams.toString()
      this.http.post(apiURL + 'login', body, { headers: headers }).
        subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });

    });
  }

  ///////// Login function End ////////

}
