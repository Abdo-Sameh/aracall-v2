import { HttpClient } from '@angular/common/http';
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
  serverURL = 'http://192.168.1.252/arabface/api/'
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

  set_user_chat_online_status(userid, newChatStatus) {
    return this.http.get(this.serverURL + this.KEY + '/chat/profile/update/chat/online_status?userid=' + userid + '&status=' + newChatStatus).map((res: any) => res.json());
  }

}
