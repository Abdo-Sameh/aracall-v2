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

  createGroup(group_name, users, text) {
    let urlSearchParams = new URLSearchParams();
    for (let index = 0; index < users.length; index++) urlSearchParams.append('theuserid[' + index + ']', users[index])
    urlSearchParams.append('userid', userId)
    urlSearchParams.append('text', text)
    urlSearchParams.append('group_name', group_name)
    urlSearchParams.append('group_admin', userId)
    urlSearchParams.append('group_avatar', '')
    let body = urlSearchParams.toString();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.serverURL + this.KEY + '/chat/send/message', body, { headers: headers })
      .map((res: any) => res.json())
  }

  set_group_name(cid, group_name) {
    return this.http.get(this.serverURL + this.KEY + '/chat/messages/set/group_name?cid=' + cid + "&group_name=" + group_name)
      .map((res: any) => res.json())
  }

  set_group_admin(cid) {
    return this.http.get(this.serverURL + this.KEY + '/chat/messages/add/group/admin?cid=' + cid + '&group_admin=' + userId)
      .map((res: any) => { res.json() })
  }

  getGroupChatMembers(cid) {
    return this.http.get(this.serverURL + this.KEY + '/chat/messages/group/members?cid=' + cid).map((res: any) => res.json())
  }

  delete_group_member(cid, userid) {
    return this.http.get(this.serverURL + this.KEY + '/chat/messages/delete/group_member?cid=' + cid + '&userid=' + userid)
      .map((res: any) => res.json())
  }

  add_group_member(cid, addedUsers) {
    return this.http.get(this.serverURL + this.KEY + '/chat/messages/add/group/members?cid=' + cid + '&users=' + addedUsers)
      .map((res: any) => res.json())
  }

  get_group_name(cid) {
    return this.http.get(this.serverURL + this.KEY + '/chat/messages/group/get/group_name?cid=' + cid).map((res: any) => res.json())
  }

  edit_group_name(cid, groupName) {
    return this.http.get(this.serverURL + this.KEY + '/chat/messages/change/group_name?cid=' + cid + "&group_name=" + groupName)
    .map((res: any) => res.json());
  }

}
