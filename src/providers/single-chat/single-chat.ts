import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { Loading, LoadingController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import * as $ from 'jquery';

/*
  Generated class for the SingleChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let user;
declare var firebase;
declare var cordova: any;
let myname;
let alert1, downloadURL, avatar, name; let signupres; let signupresult;
let userID; let cids; let result = []; let friends; let result5 = []; let msgs; let chatid = []; let insideget;
let friends2; let addchat; let getremote; let remoteid; let result34; let apichat; let firebasemsgs; let apimsgs;
var config = {
  apiKey: "AIzaSyD301e1goVdXYuQb6jujSI3uPJabnpcFAI",
  authDomain: "arabcall-a9e54.firebaseapp.com",
  databaseURL: "https://arabcall-a9e54.firebaseio.com",
  projectId: "arabcall-a9e54",
  storageBucket: "arabcall-a9e54.appspot.com",
  messagingSenderId: "1094528086232"
};
@Injectable()
export class SingleChatProvider {
  serverURL = 'https://arabface.online/api/'
  KEY = '89129812'
  friends2

  constructor(public loadingCtrl: LoadingController, private transfer: FileTransfer, public httpClient: HttpClient, public http: Http) {
    console.log('Hello SingleChatProvider Provider');
    // this.userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
    // console.log(userId);
    firebase.initializeApp(config);
  }

  check_chat_history(other_userid, userId) {
    return this.http.get(this.serverURL + this.KEY + '/chat/messages/check/chat/history?userid=' + userId + '&other_userid=' + other_userid)
      .map((res: any) => res.json());
  }

  display_single_chat_messages(cid, userId) {
    return new Observable(observer => {
      firebase.database().ref('one2one/' + cid + '/messages').orderByChild('time').on('value', function(snapshot) {
        observer.next(snapshot.val())
      })
    })
  }

  deleteMessage(cid, id, userid, key) {
    return new Observable(observer => {
      firebase.database().ref('one2one/' + cid + '/messages/' + key).update({'cleared' : userid})
    })

  }

  broadcasting(test = 'haveChatHistory', user, text, userid) {
    if (test == '') {
      let body = new URLSearchParams();
      body.append('theuserid', user)
      body.append('userid', userid)
      body.append('text', text)
      let body1 = body.toString();
      console.log(body1)
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      return this.http.post(this.serverURL + this.KEY + '/chat/send/message', body1, { headers: headers }).do((res) => {
        console.log(res.json())
        firebase.database().ref('one2one/' + res.json().cid + '/messages').push({
          'sender_id': userid, 'id': res.json().id, 'type': 'text', 'time': new Date().getTime(), 'message': '', 'is_read': false, 'is_received': false,
          'text': text, 'audio': '', 'video': '', 'call_duration': '', 'from_me': true, 'image': '', 'file': '', 'location': '', 'emoji': '', 'cleared': ''
        });
      }).map((res) => res.json());
    } else {
      return this.http.get(this.serverURL + this.KEY + '/chat/send/message?text=' + text + "&cid=" + user + "&userid=" + userid).do((res) => {
        // console.log(res.json())
        firebase.database().ref('one2one/' + res.json().cid + '/messages').push({
          'sender_id': userid, 'id': res.json().id, 'type': 'text', 'time': new Date().getTime(), 'message': '', 'is_read': false, 'is_received': false,
          'text': text, 'audio': '', 'video': '', 'call_duration': '', 'from_me': true, 'image': '', 'file': '', 'location': '', 'emoji': '', 'cleared': ''
        });
      }).map((res) => res.json());
    }
  }

  getReceiver(cid) {
    return new Observable(Observable => {
      firebase.database().ref('one2one/' + cid + '/messages').on('value', function(snapshot) {
        console.log(snapshot);
      })
    })
  }

  send_location(cid = '', theuserid, location, userId, image) {
    let url = this.serverURL + this.KEY + '/chat/send/message?text=' + location + '&cid=' + cid + '&theuserid=' + theuserid + '&userid=' + userId
    console.log(url)
    return this.http.get(url).do((res) => {
      console.log(res.json().cid);
      firebase.database().ref('one2one/' + res.json().cid + '/messages').push({
        'sender_id': userId, 'id': res.json().id, 'type': 'location', 'time': new Date().getTime(), 'message': '', 'is_read': false, 'is_received': false,
        'text': '', 'audio': '', 'video': '', 'call_duration': '', 'from_me': true, 'image': image, 'file': '', 'location': location, 'emoji': '', 'cleared': ''
      });
    }).map((res) => res.json());
  }

  send_message(cid, theuserid, text, userId) {
    console.log(cid, theuserid, userId)
    let url = this.serverURL + this.KEY + '/chat/send/message?text=' + text + '&cid=' + cid + '&theuserid=' + theuserid + '&userid=' + userId
    console.log(url)
    return this.http.get(url).do((res) => {
      console.log(res.json())
      firebase.database().ref('one2one/' + res.json().cid + '/messages').push({
        'sender_id': userId, 'id': res.json().id, 'type': 'text', 'time': new Date().getTime(), 'message': '', 'is_read': false, 'is_received': false,
        'text': text, 'audio': '', 'video': '', 'call_duration': '', 'from_me': true, 'image': '', 'file': '', 'location': '', 'emoji': '', 'cleared': ''
      });
    }).map((res) => res.json());
  }

  sendMessage(cid, theuserid, text, image, type, userId) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Sending ...',
      showBackdrop: true
    });
    loading.present();
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
        loading.dismiss();
        alert('Error while uploading the file.');
      } else {
        let fileType = '', img = '';
        if (type == 'image')
          img = response['image']
        else if (type == 'file')
          fileType = response['file']

        firebase.database().ref('one2one/' + response['cid'] + '/messages').push({
          'sender_id': userId, 'id': response['id'], 'type': type, 'time': new Date().getTime(), 'message': '', 'is_read': false, 'is_received': false,
          'text': '', 'audio': '', 'video': '', 'call_duration': '', 'from_me': true, 'image': img, 'file': fileType, 'location': '', 'emoji': '', 'cleared': ''

        });
        loading.dismiss();
      }
    }).catch(err => {
      // alert('ay 7aga error');
      alert('Error while uploading file');
      //this.presentToast('Error while uploading file.');
    });
  }

  user = new Observable(observer => {
    firebase.auth().onAuthStateChanged(function(user) {

      if (user) {

        // User is signed in.
        var displayName = user.displayName;

        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;

        observer.next("logged")
        observer.next({ name: displayName })
      } else {

        observer.next("not here")
      }
    });

  });

  blockUser(id, userid) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    urlSearchParams.append('userid', userid);
    let body = urlSearchParams.toString()
    return this.http.post(this.serverURL + this.KEY + "/block/user", body, { headers: headers })
      .map((res: Response) => res.json());
  }

  unblockUser(id, userid) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    urlSearchParams.append('userid', userid);
    let body = urlSearchParams.toString()
    return this.http.post(this.serverURL + this.KEY + "/unblock/user", body, { headers: headers })
      .map((res: Response) => res.json());
  }

  isBlocked(id, userid) {
    return this.http.get(this.serverURL + this.KEY + "/blocked?id=" + id + "&userid=" + userid)
      .map((res: Response) => res.json());
  }

  getAllBlocked(userid) {
    return this.http.get(this.serverURL + this.KEY + "/all/blocked?userid=" + userid)
      .map((res: Response) => res.json());
  }

  sendnumber(id, number, type, userId) {
    remoteid = id;
    firebase.database().ref('one2one/' + id + '/incoming').set({ number, type: type });
    this.getprofile(userId).then(data => {
      result34 = data;
      console.log(result34)
      firebase.database().ref('one2one/' + id + '/call_status/caller_data').set({ avatar: result34.avatar, name: result34.name });
    })
  }

  deleteConversation(userid, cid) {
    return this.http.get(this.serverURL + this.KEY + '/chat/delete/messages?userid=' + userid + "&cid=" + cid)
      .map((res: Response) => res.json());
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

  getConversations(userId) {
    return new Observable(observer => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let urlSearchParams = new URLSearchParams();
      urlSearchParams.append('userid', userId);
      let body = urlSearchParams.toString();
      this.http.post(this.serverURL + this.KEY + '/chat/conversations', body, { headers: headers }).subscribe(data => {
        let data1 = data.text();
        data = JSON.parse(data1);
        console.log(data);
        observer.next(data)
        // this.addchats().subscribe(data => {
        // })
      })
    })
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

  placelistener(number) {
    return new Observable(observer => {
      firebase.database().ref('/' + number).on('child_added', function(data) {
        observer.next(data.val())
      })
    })
  }

  writetodb(number, data) {
    firebase.database().ref(number).push(data);
  }

  // mutesound()
  // {
  //   alert
  //   for (var i = 0, l = audioTracks.length; i < l; i++) {
  //     audioTracks[i].enabled = !audioTracks[i].enabled;
  //   }

  // }

  endcall() {
    firebase.database().ref('one2one/' + remoteid + '/incoming').set({ 0: "undefined" });

  }

  callee_accept_set(id, value, userId) {
    if (id == undefined) {
      firebase.database().ref('one2one/' + userId + '/call_status/callee_accept').set(value);
    }
    else { firebase.database().ref('one2one/' + id + '/call_status/callee_accept').set(value); }
  }
  callee_deny_set(id, value) {
    if (id == undefined) {
      firebase.database().ref('one2one/' + userID + '/call_status/callee_deny').set(value);
    } else {
      firebase.database().ref('one2one/' + id + '/call_status/callee_deny').set(value);
    }
  }
  calee_recieved_set(id, value, userId) {
    if (id == undefined) { firebase.database().ref('one2one/' + userId + '/call_status/callee_recieved').set(value); } else {
      firebase.database().ref('one2one/' + id + '/call_status/callee_recieved').set(value);
    }
  }

  callee_end_set(value, userId) {
    firebase.database().ref('one2one/' + userId + '/call_status/callee_end').set(value);
  }

  caller_end_set(id, value) {
    firebase.database().ref('one2one/' + id + '/call_status/caller_end').set(value);
  }

  callee_accept_listen(id) {
    return new Observable(observer => {
      firebase.database().ref('one2one/' + id + '/call_status/callee_accept').on('value', function(snapshot) {
        observer.next(snapshot.val())
      })
    })
  }

  callee_deny_listen(id) {
    return new Observable(observer => {
      firebase.database().ref('one2one/' + id + '/call_status/callee_deny').on('value', function(snapshot) {
        observer.next(snapshot.val())
      })
    })
  }

  callee_recieved_listen(id) {
    return new Observable(observer => {
      firebase.database().ref('one2one/' + id + '/call_status/callee_recieved').on('value', function(snapshot) {
        observer.next(snapshot.val())
      })
    })
  }

  callee_end_listen(id) {
    return new Observable(observer => {
      firebase.database().ref('one2one/' + id + '/call_status/callee_end').on('value', function(snapshot) {
        console.log('calee end listen is fired from database')
        observer.next(snapshot.val())
      })
    })
  }

  caller_end_listen(userId) {
    return new Observable(observer => {
      firebase.database().ref('one2one/' + userId + '/call_status/caller_end').on('value', function(snapshot) {
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
      firebase.database().ref('one2one/' + userId + '/incoming').set(value)
    } else {
      firebase.database().ref('one2one/' + id + '/incoming').set(value)
    }
  }

  set_active(value, userId) {
    firebase.database().ref('one2one/' + userId + '/active').set(value)
  }

  caller_data_listen(userId) {
    return new Observable(observer => {
      firebase.database().ref('one2one/' + userId + '/call_status/caller_data').on('value', function(snapshot) {
        observer.next(snapshot.val())
      })
    })
  }

  set_caller_data(id, userId) {
    if (id == undefined) {
      firebase.database().ref('one2one/' + userId + '/call_status/caller_data').set({ 0: "undefined" })
    } else {
      firebase.database().ref('one2one/' + id + '/call_status/caller_data').set({ 0: "undefined" })
    }
  }

  incominglistener(userId) {
    return new Observable(observer => {
      firebase.database().ref('one2one/' + userId + '/incoming').on('value', function(snapshot) {
        observer.next(snapshot.val())
      })
    })
  }

  getconvo2() {
    return new Observable(observer => {
      let body = new URLSearchParams();
      body.append('userid', userID)
      let body1 = body.toString();
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      this.http.post(this.serverURL + this.KEY + '/chat/conversations', body1, { headers: headers }).subscribe(data => {
        let data1 = data.text();

        data = JSON.parse(data1);
        observer.next(data)

      })
    })

  }
  getmsg(cID) {



    return new Observable(observer => {
      //             this.http.get("https://arabface.online/demo/api/147896325/chat/get/messages?cid="+cID+"&userid="+userID).subscribe(data => {
      // 		let data1 = data.text() ;
      // data = JSON.parse(data1) ;
      // resolve(data) ;
      //             });
      //comment
      //  firebase.database().ref(userID + '/mesages/' + cID.toString()).once('value').then(function(snapshot) {
      //    var array = $.map(snapshot.val(), function(value, index) {
      //     return [value];
      // });
      // observer.next(array)
      //   })
    });
  }

  getmessagesfromapi(cid) {
    return new Promise(resolve => {
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": this.serverURL + this.KEY + "/chat/get/messages?cid=" + cid,
        "method": "POST",
        "headers": {
          "content-type": "application/x-www-form-urlencoded",
          "cache-control": "no-cache",
          "postman-token": "0fc107e4-b5c8-93f3-0f88-b9e9da082f92"
        }
      }

      $.ajax(settings).done(function(response) {
        resolve(JSON.parse(response))

      });
      //    this.http.get("https://arabface.online/demo/api/147896325/chat/get/messages?cid="+cid+"&userid="+userID).subscribe(data => {
      // 		let data1 = data.text() ;
      // data = JSON.parse(data1) ;
      // resolve(data) ;
      // })
    })
  }


  addchats() {
    return new Observable(observer => {
      this.getconvo2().subscribe(data => {
        apichat = data;
        for (let i = 0; i < apichat.length; i++) {
          this.getmsg(apichat[i].cid).subscribe(data => {
            firebasemsgs = data;

            this.getmessagesfromapi(apichat[i].cid).then(data => {

              apimsgs = data;
              // alert("apimsgs"+JSON.stringify(apimsgs))
              // alert("firebasemsgs"+JSON.stringify(firebasemsgs))
              if (firebasemsgs == null) {
                for (let v = 0; v < apimsgs.length; v++) {
                  firebase.database().ref('one2one/' + userID + '/mesages/' + apichat[i].cid).push(apimsgs[v])
                }
              } else {

                if (apimsgs.length > firebasemsgs.length) {

                  firebase.database().ref('one2one/' + userID + '/mesages/' + apichat[i].cid).set("undefined")
                  for (let v = 0; v < apimsgs.length; v++) {
                    firebase.database().ref('one2one/' + userID + '/mesages/' + apichat[i].cid).push(apimsgs[v])
                  }
                }
              }
            })
          })
        }
      })
    })

  }

}
