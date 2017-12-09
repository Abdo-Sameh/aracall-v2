import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

/*
  Generated class for the SettingsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let userId;

@Injectable()
export class SettingsProvider {
  serverURL = 'http://udsolutions.co.uk/Arabface/arabface/api/'
  KEY = '89129812'
  constructor(public http: Http) {
    userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
    console.log('Hello SettingsProvider Provider');
  }

  getLoggedInUSerProfile() {
    return this.http.get(this.serverURL + this.KEY + '/chat/profile?userid=' + userId).map((res: any) => res.json())
  }

  get_user_chat_status() {
    return this.http.get(this.serverURL + this.KEY + '/chat/profile/get/chat/status?userid=' + userId).map((res: any) => res.json());
  }

  set_user_chat_status(newChatStatus) {
    return this.http.get(this.serverURL + this.KEY + '/chat/profile/update/chat/status?userid=' + userId + '&status=' + newChatStatus).map((res: any) => res.json());
  }

  set_user_chat_online_status(newChatStatus) {
    return this.http.get(this.serverURL + this.KEY + '/chat/profile/update/chat/online_status?userid=' + userId + '&status=' + newChatStatus).map((res: any) => res.json());
  }

  set_user_chat_settings(last_seen_status, read_receipt_status) {
    return this.http.get(this.serverURL + this.KEY + '/settings/chat/change/chat_settings?userid=' + userId + '&last_seen_status=' + last_seen_status + '&read_receipt_status=' + read_receipt_status).map((res: any) => res.json());
  }

  get_user_chat_settings() {
    return this.http.get(this.serverURL + this.KEY + '/settings/chat/chat_settings?userid=' + userId).map((res: any) => res.json());
  }

  get_user_chat_online_status() {
    return this.http.get(this.serverURL + this.KEY + '/chat/profile/get/chat/online_status?userid=' + userId).map((res: any) => res.json());
  }

  editprofile(firstname, lastname, username, email) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('first_name', firstname);
    urlSearchParams.append('last_name', lastname);
    urlSearchParams.append('username', username);
    urlSearchParams.append('email_address', email);
    let body = urlSearchParams.toString()
    return this.http.post(this.serverURL + this.KEY + '/settings/general?userid=' + userId, body, { headers: headers })

      //do((res : Response ) => console.log(res.json()))
      .map((res: any) => res.json());
  }

  // set_active(value) {
  //   firebase.database().ref(userID + '/active').set(value)
  // }

}
