import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { Http, Headers,Response, URLSearchParams } from '@angular/http';
import { Loading } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';

/*
  Generated class for the GroupChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let userId;
declare var firebase;
declare var cordova: any;


@Injectable()
export class GroupChatProvider {
  serverURL = 'http://192.168.1.252/arabface/api/'
  KEY = '89129812'
  userAvatar=localStorage.getItem('userAvatar')
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

  display_single_chat_messages(cid){
  return  new Observable(observer => {
  firebase.database().ref('one2one/'+cid+'/messages').orderByChild('time').on('value',function(snapshot) {
        observer.next(snapshot.val())
       })
  })
 }

 send_location(cid, theuserid, location)
 {
   let url=this.serverURL + this.KEY + '/chat/send/message?text='+location+'&cid='+cid+ '&theuserid='+theuserid+'&userid='+theuserid
   console.log(url)
   return this.http.get(url).do((res) => {
     firebase.database().ref('many2many/' + cid + '/messages').push({
       'sender_id': userId,'sender_avatar':this.userAvatar, 'id':'1', 'type': 'message', 'time': new Date().getTime(), 'message': '', 'is_read': false, 'is_received': false,
       'text': '', 'audio': '', 'video': '', 'call_duration': '','from_me':true, 'image': '', 'file': '', 'location': location, 'emoji': ''
     });
 }).map((res) => res.json());

 }
  send_message(cid, theuserid, text)
  {
      let url=this.serverURL + this.KEY + '/chat/send/message?text='+text+'&cid='+cid+ '&theuserid='+theuserid+'&userid='+theuserid
      console.log(url)
      return this.http.get(url).do((res) => {
                            firebase.database().ref('many2many/' + cid + '/messages').push({
          'sender_id': userId,'sender_avatar':this.userAvatar, 'id':'1', 'type': 'message', 'time': new Date().getTime(), 'message': '', 'is_read': false, 'is_received': false,
          'text': text, 'audio': '', 'video': '', 'call_duration': '','from_me':true, 'image': '', 'file': '', 'location': '', 'emoji': ''
        });
    }).map((res) => res.json());

  }


}
