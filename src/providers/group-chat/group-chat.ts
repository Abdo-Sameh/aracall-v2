import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

/*
  Generated class for the GroupChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let userId;

@Injectable()
export class GroupChatProvider {
  serverURL = 'http://192.168.1.252/arabface/api/'
  KEY = '89129812'
  constructor(public http: Http) {
    console.log('Hello GroupChatProvider Provider');
    userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
  }

  getConverstationsList() {
    return this.http.get(this.serverURL + this.KEY + '/chat/conversations?userid=' + userId).map((res: any) => res.json());
  }

  usersCoversation(cid) {
    return this.http.get(this.serverURL + this.KEY + '/chat/get/messages?cid=' + cid + "&userid=" + userId).map((res: any) => res.json());
  }

}
