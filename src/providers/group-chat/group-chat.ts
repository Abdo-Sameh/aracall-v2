import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Loading } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

/*
  Generated class for the GroupChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
declare var firebase;
declare var cordova: any;
let myname;
let alert1, downloadURL, avatar, name; let signupres; let signupresult;
let userID; let cids; let result = []; let friends; let result5 = []; let msgs; let chatid = []; let insideget;
let friends2; let addchat; let getremote; let remoteid; let result34; let apichat; let apimsgs;

@Injectable()
export class GroupChatProvider {
  serverURL = 'http://udsolutions.co.uk/Arabface/arabface/api/'
  KEY = '89129812'
  userAvatar = localStorage.getItem('userAvatar')
  userName = localStorage.getItem('userName').replace(/['"]/g, '');

  constructor(private transfer: FileTransfer, public http: Http) {
    console.log('Hello GroupChatProvider Provider');
    console.log(this.userName);
    // userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
  }

  sendnumber(id, number, type, userId) {
    remoteid = id;
    firebase.database().ref('many2many/' + id + '/incoming').set({ number, type: type });
    this.getprofile(userId).then(data => {
      result34 = data;
      console.log(result34)
      firebase.database().ref('many2many/' + id + '/call_status/caller_data').set({ avatar: result34.avatar, name: result34.name });
    })
  }

  getprofile(userId) {
    return new Promise(resolve => {
      this.http.get(this.serverURL + this.KEY + "/profile/details?userid=" + userId).subscribe(data => {
        let data1 = data.text();
        data = JSON.parse(data1);
        resolve(data);
      })
    })
  }

  endcall() {
    firebase.database().ref('many2many/' + remoteid + '/incoming').set({ 0: "undefined" });
  }

  sendMessage(cid, theuserid, text, image, type, userId) {
    let message, targetPath;
    var filename = image;
    if (image === null) {
      return '';
    } else {
      targetPath = cordova.file.dataDirectory + image;
      // alert('targetPaht ' + targetPath)
    }
    var url, options;

    url = this.serverURL + this.KEY + '/chat/send/message';
    options = {
      fileKey: type,
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: { 'userid': userId, 'cid': cid, 'theuserid': theuserid, 'text': text }
    };
    if (type == 'image')
      options['params'].image = filename
    else if (type == 'file')
      options['params'].file = filename
    // alert(options['params'].cid)
    // alert(options['params'].theuserid)
    // alert(options['params'].userid)
    const fileTransfer: FileTransferObject = this.transfer.create();
    // alert('ay 7aga');
    let loading: Loading
    // alert(targetPath);
    // alert(url);
    // alert(fileTransfer);
    fileTransfer.upload(targetPath, url, options, true).then(data => {
      // alert('ay 7aga 2');
      // loading.dismissAll()
      let response = JSON.parse(data.response);
      // alert(response['id']);
      // alert(response['text']);
      // alert(response['status']);
      if (response['status'] == 0) {
        //this.presentToast('Error while uploading file.');
      } else {
        let fileType = '', img = '';
        if (type == 'image')
          img = response['image']
        else if (type == 'file')
          fileType = response['file']
        firebase.database().ref('many2many/' + cid + '/messages').push({
          'sender_id': userId, 'sender_name': this.userName, 'id': response['id'], 'type': type, 'time': new Date().getTime(), 'message': '', 'is_read': false, 'is_received': false,
          'text': '', 'audio': '', 'video': '', 'call_duration': '', 'from_me': true, 'image': img, 'file': fileType, 'location': '', 'emoji': ''
        });
      }
    }).catch(err => {
      // alert('ay 7aga error');
      alert('Error while uploading file');
      //this.presentToast('Error while uploading file.');
    });
  }

  remoteid(title, userId) {
    return new Promise(resolve => {
      let body = new URLSearchParams();
      body.append('userid', userId)
      let body1 = body.toString();
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      this.http.post(this.serverURL + this.KEY + '/profile/friends', body1, { headers: headers }).subscribe(data => {
        let data1 = data.text();
        data = JSON.parse(data1);
        friends2 = data;
        for (let i = 0; i < friends2.length; i++) {
          if (friends2[i].name == title) {
            resolve(friends2[i].userid)
          }
        }
      })
    })
  }

  callee_accept_set(id, value) {
    if (id == undefined) {
      firebase.database().ref('many2many/' + userID + '/call_status/callee_accept').set(value);
    }
    else { firebase.database().ref('many2many/' + id + '/call_status/callee_accept').set(value); }
  }

  callee_deny_set(id, value) {
    if (id == undefined) {
      firebase.database().ref('many2many/' + userID + '/call_status/callee_deny').set(value);
    } else {
      firebase.database().ref('many2many/' + id + '/call_status/callee_deny').set(value);
    }
  }

  calee_recieved_set(id, value, userId) {
    if (id == undefined) { firebase.database().ref('many2many/' + userId + '/call_status/callee_recieved').set(value); } else {
      firebase.database().ref('many2many/' + id + '/call_status/callee_recieved').set(value);
    }
  }

  callee_end_set(value, userId) {
    firebase.database().ref('many2many/' + userId + '/call_status/callee_end').set(value);
  }

  caller_end_set(id, value) {
    firebase.database().ref('many2many/' + id + '/call_status/caller_end').set(value);
  }

  callee_accept_listen(id) {
    return new Observable(observer => {
      firebase.database().ref('many2many/' + id + '/call_status/callee_accept').on('value', function(snapshot) {
        observer.next(snapshot.val())
      })
    })
  }

  callee_deny_listen(id) {
    return new Observable(observer => {
      firebase.database().ref('many2many/' + id + '/call_status/callee_deny').on('value', function(snapshot) {
        observer.next(snapshot.val())
      })
    })
  }

  callee_recieved_listen(id) {
    return new Observable(observer => {
      firebase.database().ref('many2many/' + id + '/call_status/callee_recieved').on('value', function(snapshot) {
        observer.next(snapshot.val())
      })
    })
  }

  callee_end_listen(id) {
    return new Observable(observer => {
      firebase.database().ref('many2many/' + id + '/call_status/callee_end').on('value', function(snapshot) {
        console.log('calee end listen is fired from database')
        observer.next(snapshot.val())
      })
    })
  }

  caller_end_listen(userId) {
    return new Observable(observer => {
      firebase.database().ref('many2many/' + userId + '/call_status/caller_end').on('value', function(snapshot) {
        console.log('caller end listen fired')
        observer.next(snapshot.val())
      })
    })
  }

  set_userid(id, userId) {
    userId = id.toString();
    console.log('userid is set to' + userId)
  }

  set_incoming(id, value, userId) {
    if (id == undefined) {
      firebase.database().ref('many2many/' + userId + '/incoming').set(value)
    } else {
      firebase.database().ref('many2many/' + id + '/incoming').set(value)
    }
  }

  set_active(value, userId) {
    firebase.database().ref('many2many/' + userId + '/active').set(value)
  }

  caller_data_listen(userId) {
    return new Observable(observer => {
      firebase.database().ref('many2many/' + userId + '/call_status/caller_data').on('value', function(snapshot) {
        observer.next(snapshot.val())
      })
    })
  }

  set_caller_data(id, userId) {
    if (id == undefined) {
      firebase.database().ref('many2many/' + userId + '/call_status/caller_data').set({ 0: "undefined" })
    } else {
      firebase.database().ref('many2many/' + id + '/call_status/caller_data').set({ 0: "undefined" })
    }
  }

  getConverstationsList(userId) {
    return this.http.get(this.serverURL + this.KEY + '/chat/conversations?userid=' + userId).map((res: any) => res.json());
  }

  usersCoversation(cid, userId) {
    return this.http.get(this.serverURL + this.KEY + '/chat/get/messages?cid=' + cid + "&userid=" + userId).map((res: any) => res.json());
  }

  createGroup(group_name, users, text, userId) {
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

  set_group_admin(cid, userId) {
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

  display_single_chat_messages(cid) {
    return new Observable(observer => {
      firebase.database().ref('many2many/' + cid + '/messages').orderByChild('time').on('value', function(snapshot) {
        observer.next(snapshot.val())
      })
    })
  }

  send_location(cid, theuserid, location, userId) {
    let url = this.serverURL + this.KEY + '/chat/send/message?text=' + location + '&cid=' + cid + '&theuserid=' + theuserid + '&userid=' + theuserid
    console.log(url)
    return this.http.get(url).do((res) => {
      firebase.database().ref('many2many/' + cid + '/messages').push({
        'sender_id': userId, 'sender_name': this.userName, 'sender_avatar': this.userAvatar, 'id': '1', 'type': 'message', 'time': new Date().getTime(), 'message': '', 'is_read': false, 'is_received': false,
        'text': '', 'audio': '', 'video': '', 'call_duration': '', 'from_me': true, 'image': '', 'file': '', 'location': location, 'emoji': ''
      });
    }).map((res) => res.json());
  }

  send_message(cid, theuserid, text, userId) {
    let url = this.serverURL + this.KEY + '/chat/send/message?text=' + text + '&cid=' + cid + '&theuserid=' + theuserid + '&userid=' + theuserid
    console.log(url)
    return this.http.get(url).do((res) => {
      firebase.database().ref('many2many/' + cid + '/messages').push({
        'sender_id': userId, 'sender_name': this.userName, 'sender_avatar': this.userAvatar, 'id': '1', 'type': 'message', 'time': new Date().getTime(), 'message': '', 'is_read': false, 'is_received': false,
        'text': text, 'audio': '', 'video': '', 'call_duration': '', 'from_me': true, 'image': '', 'file': '', 'location': '', 'emoji': ''
      });
    }).map((res) => res.json());
  }

  incominglistener(userId) {
    return new Observable(observer => {
      firebase.database().ref('many2many/' + userId + '/incoming').on('value', function(snapshot) {
        observer.next(snapshot.val())
      })
    })
  }

}
